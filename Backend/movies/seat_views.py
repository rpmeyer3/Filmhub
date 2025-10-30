from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import connection


class ShowtimeSeatsView(APIView):
    """Get all seats for a specific showtime with availability status"""
    def get(self, request, showtime_id):
        try:
            with connection.cursor() as cursor:
                # Get showtime and showroom info
                cursor.execute('''
                    SELECT 
                        st.showroom_id,
                        sr.rows, 
                        sr.seats_per_row,
                        sr.capacity
                    FROM showtime_table st
                    JOIN showrooms sr ON st.showroom_id = sr.id
                    WHERE st.id = %s
                ''', [showtime_id])
                
                showtime_info = cursor.fetchone()
                if not showtime_info:
                    return Response(
                        {'error': 'Showtime not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                showroom_id, rows, seats_per_row, capacity = showtime_info
                
                # Get all seats for this showroom
                cursor.execute('''
                    SELECT 
                        s.id,
                        s.seat_row,
                        s.seat_number
                    FROM seats s
                    WHERE s.showroom_id = %s
                    ORDER BY s.seat_row, s.seat_number
                ''', [showroom_id])
                
                all_seats = cursor.fetchall()
                
                # Get booked seats for this specific showtime
                # Note: Since showtime_table uses integer IDs and booking_seats expects UUIDs,
                # and there are no bookings yet, we'll return empty list for now
                # TODO: Fix this when implementing actual booking creation
                booked_seat_ids = []
                
                # Build seat list with availability
                seats = []
                for seat_id, seat_row, seat_number in all_seats:
                    is_available = str(seat_id) not in [str(sid) for sid in booked_seat_ids]
                    seats.append({
                        'id': str(seat_id),
                        'row_number': ord(seat_row) - 64 if len(seat_row) == 1 else 1,  # Convert A->1, B->2, etc.
                        'seat_number': seat_number,
                        'seat_label': f"{seat_row}{seat_number}",
                        'is_available': is_available
                    })
                
                return Response({
                    'success': True,
                    'seats': seats,
                    'layout': {
                        'rows': rows,
                        'seats_per_row': seats_per_row,
                        'capacity': capacity
                    }
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            import traceback
            print(f"Error in ShowtimeSeatsView: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Failed to fetch seats: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateBookingView(APIView):
    """Create a booking with selected seats"""
    def post(self, request):
        try:
            data = request.data
            user_id = data.get('user_id')
            showtime_id = data.get('showtime_id')
            movie_id = data.get('movie_id')
            seat_ids = data.get('seat_ids', [])
            ticket_types = data.get('ticket_types', {})  # {seat_id: ticket_type}
            promotion_code = data.get('promotion_code')
            discount_amount = data.get('discount_amount', 0)
            subtotal = data.get('subtotal')
            total_price = data.get('total_price')
            payment_card_id = data.get('payment_card_id')
            
            if not all([user_id, showtime_id, movie_id, seat_ids, subtotal, total_price]):
                return Response(
                    {'error': 'Missing required fields'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with connection.cursor() as cursor:
                # Check if all seats are available
                placeholders = ','.join(['%s'] * len(seat_ids))
                cursor.execute(f'''
                    SELECT id, seat_label, is_available
                    FROM seats
                    WHERE id IN ({placeholders}) AND showtime_id = %s
                ''', seat_ids + [showtime_id])
                
                seats = cursor.fetchall()
                unavailable_seats = [seat[1] for seat in seats if not seat[2]]
                
                if unavailable_seats:
                    return Response(
                        {
                            'error': f'Seats no longer available: {", ".join(unavailable_seats)}'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create booking
                cursor.execute('''
                    INSERT INTO bookings (
                        user_id, showtime_id, movie_id, promotion_code,
                        discount_amount, subtotal, total_price, payment_card_id
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', [
                    user_id, showtime_id, movie_id, promotion_code,
                    discount_amount, subtotal, total_price, payment_card_id
                ])
                
                booking_id = cursor.fetchone()[0]
                
                # Mark seats as unavailable
                cursor.execute(f'''
                    UPDATE seats
                    SET is_available = FALSE
                    WHERE id IN ({placeholders})
                ''', seat_ids)
                
                # Create booking_seats records
                booking_seats_data = []
                pricing = {'adult': 12.00, 'child': 8.00, 'senior': 10.00}
                
                for seat_id in seat_ids:
                    ticket_type = ticket_types.get(str(seat_id), 'adult')
                    price = pricing.get(ticket_type, 12.00)
                    booking_seats_data.append((booking_id, seat_id, ticket_type, price))
                
                cursor.executemany('''
                    INSERT INTO booking_seats (booking_id, seat_id, ticket_type, price)
                    VALUES (%s, %s, %s, %s)
                ''', booking_seats_data)
                
                return Response({
                    'success': True,
                    'booking_id': booking_id,
                    'message': 'Booking created successfully'
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to create booking: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
