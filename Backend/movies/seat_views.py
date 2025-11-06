from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import MovieShow
from django.db import connection


class UserBookingsView(APIView):
    """Get all bookings for a specific user"""
    def get(self, request):
        try:
            user_id = request.query_params.get('user_id')
            
            if not user_id:
                return Response(
                    {'error': 'user_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with connection.cursor() as cursor:
                # Get all bookings for this user with simplified query
                cursor.execute('''
                    SELECT 
                        b.id,
                        b.booking_number,
                        b.booking_date,
                        b.total_amount,
                        b.num_adult_tickets,
                        b.num_child_tickets,
                        b.num_senior_tickets,
                        b.status,
                        sht.showtime,
                        sht.movie_id,
                        string_agg(DISTINCT s.seat_row || s.seat_number, ', ' ORDER BY s.seat_row || s.seat_number) as seats
                    FROM bookings b
                    JOIN booking_seats bs ON b.id = bs.booking_id
                    JOIN seats s ON bs.seat_id = s.id
                    JOIN showtimes sht ON b.showtime_id = sht.id
                    WHERE b.user_id = %s
                    GROUP BY b.id, b.booking_number, b.booking_date, b.total_amount,
                             b.num_adult_tickets, b.num_child_tickets, b.num_senior_tickets,
                             b.status, sht.showtime, sht.movie_id, sht.showroom_id
                    ORDER BY b.booking_date DESC
                ''', [user_id])
                
                bookings_raw = cursor.fetchall()
                
                # Now fetch movie and showroom details separately
                bookings = []
                for row in bookings_raw:
                    booking_id, booking_number, booking_date, total_amount, num_adult, num_child, num_senior, booking_status, showtime, movie_id, seats = row
                    
                    # Get movie details
                    cursor.execute('SELECT "Title", "Poster_img_URL" FROM "Movies" WHERE id = %s', [movie_id])
                    movie_data = cursor.fetchone()
                    movie_title = movie_data[0] if movie_data else 'Unknown Movie'
                    poster_url = movie_data[1] if movie_data else None
                    
                    # Get showroom details from showtime
                    cursor.execute('SELECT sr.name FROM showtimes sht JOIN showrooms sr ON sht.showroom_id = sr.id WHERE sht.id IN (SELECT showtime_id FROM bookings WHERE id = %s)', [booking_id])
                    showroom_data = cursor.fetchone()
                    showroom_name = showroom_data[0] if showroom_data else 'Unknown Theater'
                    
                    bookings.append({
                        'id': str(booking_id),
                        'booking_number': booking_number,
                        'booking_date': booking_date.isoformat() if booking_date else None,
                        'total_amount': float(total_amount),
                        'num_adult_tickets': num_adult,
                        'num_child_tickets': num_child,
                        'num_senior_tickets': num_senior,
                        'status': booking_status,
                        'movie_title': movie_title,
                        'poster_url': poster_url,
                        'showtime': showtime.isoformat() if showtime else None,
                        'showroom_name': showroom_name,
                        'seats': seats
                    })
                
                return Response({
                    'success': True,
                    'bookings': bookings,
                    'count': len(bookings)
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            import traceback
            print(f"Error fetching bookings: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Failed to fetch bookings: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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

                
                cursor.execute("""
                    WITH target AS (
                    SELECT st.movie_id, st.showroom_id, st.showtime
                     FROM showtime_table st
                    WHERE st.id = %s
                    )
                    SELECT bs.seat_id::text
                    FROM booking_seats bs
                    JOIN showtimes sht ON bs.showtime_id = sht.id
                    JOIN target t
                    ON t.movie_id = sht.movie_id
                    AND t.showroom_id = sht.showroom_id
                    AND t.showtime = sht.showtime
                    """, [showtime_id])

                booked_seat_ids = {row[0] for row in cursor.fetchall()}

                
                cursor.execute("""
                    WITH target AS (
                        SELECT st.movie_id, st.showroom_id, st.showtime
                        FROM showtime_table st
                        WHERE st.id = %s
                    )
                    SELECT bs.seat_id::text
                    FROM booking_seats bs
                    JOIN showtimes sht ON bs.showtime_id = sht.id
                    JOIN target t
                    ON t.movie_id = sht.movie_id
                    AND t.showroom_id = sht.showroom_id
                    AND t.showtime = sht.showtime
                """, [showtime_id])
                booked_seat_ids = {row[0] for row in cursor.fetchall()}

                current_user_id = request.query_params.get('user_id')
                try:
                    cursor.execute("""
                        SELECT sh.seat_id::text, sh.user_id::text
                        FROM seat_holds sh
                        WHERE sh.showtime_id IN (
                            SELECT id FROM showtimes
                            WHERE movie_id    = (SELECT movie_id    FROM showtime_table WHERE id=%s)
                              AND showroom_id = (SELECT showroom_id FROM showtime_table WHERE id=%s)
                              AND showtime    = (SELECT showtime    FROM showtime_table WHERE id=%s)
                        )
                          AND sh.expires_at > NOW()
                    """, [showtime_id, showtime_id, showtime_id])
                    active_holds = cursor.fetchall()

                    # exclude the requesting user's own holds
                    held_by_others = {
                        seat_id for (seat_id, holder) in active_holds
                        if not current_user_id or holder != str(current_user_id)
                    }
                except Exception:
                    # if seat_holds table doesn't exist yet
                    held_by_others = set()

                # --- Combine booked + held seats ---
                unavailable_ids = booked_seat_ids | held_by_others

                # --- Build final seat list ---
                seats = []
                for seat_id, seat_row, seat_number in all_seats:
                    is_available = str(seat_id) not in unavailable_ids
                    seats.append({
                        'id': str(seat_id),
                        'row_number': ord(seat_row) - 64 if len(seat_row) == 1 else 1,
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
            import uuid
            from datetime import datetime
            from django.core.mail import send_mail
            from django.conf import settings
            
            data = request.data
            print("Received booking data:", data)  # Debug
            
            user_id = data.get('user_id')
            user_email = data.get('user_email')
            showtime_id = data.get('showtime_id')
            seat_ids = data.get('seat_ids', [])
            num_adult = data.get('num_adult_tickets', 0)
            num_child = data.get('num_child_tickets', 0)
            num_senior = data.get('num_senior_tickets', 0)
            total_amount = data.get('total_amount')
            payment_card_id = data.get('payment_card_id')
            
            if not all([user_id, showtime_id, seat_ids, total_amount]):
                return Response(
                    {'error': 'Missing required fields'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with connection.cursor() as cursor:
                # Get showtime details from showtime_table
                cursor.execute('''
                    SELECT movie_id, showroom_id, showtime, price 
                    FROM showtime_table 
                    WHERE id = %s
                ''', [showtime_id])
                showtime_data = cursor.fetchone()
                if not showtime_data:
                    return Response(
                        {'error': 'Showtime not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                movie_id_int, showroom_uuid, showtime_dt, price = showtime_data
                
                # Check if a corresponding record exists in the UUID-based showtimes table
                cursor.execute('''
                    SELECT id FROM showtimes 
                    WHERE movie_id = %s AND showroom_id = %s AND showtime = %s
                ''', [movie_id_int, showroom_uuid, showtime_dt])
                
                existing_showtime = cursor.fetchone()
                if existing_showtime:
                    showtime_uuid = existing_showtime[0]
                else:
                    # Create a new record in showtimes table to satisfy foreign key
                    showtime_uuid = uuid.uuid4()
                    cursor.execute('''
                        INSERT INTO showtimes (
                            id, movie_id, showroom_id, showtime,
                            ticket_price_adult, ticket_price_child, ticket_price_senior,
                            available_seats, is_available
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ''', [
                        showtime_uuid, movie_id_int, showroom_uuid, showtime_dt,
                        12.00, 8.00, 10.00,  # Default pricing
                        100, True  # Default availability
                    ])
                
               # Check if seats are already booked
                placeholders = ','.join(['%s'] * len(seat_ids))
                cursor.execute(f'''
                    SELECT bs.seat_id::text
                    FROM booking_seats bs
                    WHERE bs.seat_id IN ({placeholders})
                ''', seat_ids)
                already_booked = {row[0] for row in cursor.fetchall()}

                # Also check if any of the selected seats are currently on hold (by another user)
                user_id_str = str(user_id)
                cursor.execute(f'''
                    SELECT sh.seat_id::text, sh.user_id::text
                    FROM seat_holds sh
                    WHERE sh.seat_id IN ({placeholders})
                    AND sh.expires_at > NOW()
                ''', seat_ids)
                active_holds = cursor.fetchall()

                # filter out holds belonging to this same user
                held_by_others = {
                    seat_id for seat_id, holder in active_holds
                    if holder != user_id_str
                }

                # Merge both sets of unavailable seats
                unavailable_ids = already_booked | held_by_others
                if unavailable_ids:
                    return Response(
                        {'error': 'Some of the selected seats are unavailable (booked or held by another user).'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Generate booking number with actual showtime ID embedded
                booking_number = f"BK{datetime.now().strftime('%Y%m%d')}{str(showtime_id).zfill(4)}{uuid.uuid4().hex[:4].upper()}"
                
                # Create booking
                booking_id = uuid.uuid4()
                
                # Payment card ID schema mismatch: payment_cards table uses integer IDs
                # but bookings table expects UUID. For now, we'll set to NULL.
                # In production, this would need schema alignment.
                payment_card_uuid = None
                
                cursor.execute('''
                    INSERT INTO bookings (
                        id, user_id, showtime_id, payment_card_id, booking_number,
                        total_amount, num_adult_tickets, num_child_tickets, 
                        num_senior_tickets, status, booking_date
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''', [
                    booking_id, user_id, showtime_uuid, payment_card_uuid, booking_number,
                    total_amount, num_adult, num_child, num_senior, 'confirmed', datetime.now()
                ])
                
                # Create booking_seats records
                for seat_id in seat_ids:
                    cursor.execute('''
                        INSERT INTO booking_seats (id, booking_id, seat_id, showtime_id)
                        VALUES (%s, %s, %s, %s)
                    ''', [uuid.uuid4(), booking_id, seat_id, showtime_uuid])
                
                # Email confirmation (optional - don't fail booking if this fails)
                try:
                    if user_email:
                        email_subject = f'Booking Confirmation - {booking_number}'
                        email_body = f'''
Dear Customer,

Your booking has been confirmed!

Booking Number: {booking_number}

Tickets:
- Adult: {num_adult}
- Child: {num_child}
- Senior: {num_senior}

Total Amount: ${total_amount}

Please arrive 15 minutes before the show time.

Thank you for choosing our cinema!
'''
                        
                        send_mail(
                            subject=email_subject,
                            message=email_body,
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[user_email],
                            fail_silently=True,
                        )
                        print(f"Confirmation email sent to {user_email}")
                except Exception as email_error:
                    print(f"Email send failed (non-critical): {str(email_error)}")
                    # Don't fail the booking if email fails
                
                return Response({
                    'success': True,
                    'booking_id': str(booking_id),
                    'booking_number': booking_number,
                    'message': 'Booking created successfully'
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            import traceback
            print(f"Error creating booking: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Failed to create booking: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CancelBookingView(APIView):
    """Cancel a booking and process refund"""
    def post(self, request, booking_id):
        try:
            from datetime import datetime, timedelta
            
            with connection.cursor() as cursor:
                # Get booking details
                cursor.execute('''
                    SELECT 
                        b.id,
                        b.booking_number,
                        b.status,
                        b.total_amount,
                        b.user_id,
                        sht.showtime
                    FROM bookings b
                    JOIN showtimes sht ON b.showtime_id = sht.id
                    WHERE b.id = %s
                ''', [booking_id])
                
                booking = cursor.fetchone()
                
                if not booking:
                    return Response(
                        {'error': 'Booking not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                booking_id, booking_number, booking_status, total_amount, user_id, showtime = booking
                
                # Check if booking is already cancelled
                if booking_status == 'cancelled':
                    return Response(
                        {'error': 'This booking has already been cancelled'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Check if cancellation is allowed (60 minutes before showtime)
                now = datetime.now()
                showtime_dt = showtime
                
                # If showtime is timezone-aware, make now timezone-aware too
                if showtime_dt.tzinfo is not None:
                    from django.utils import timezone
                    now = timezone.now()
                
                time_until_showtime = showtime_dt - now
                minutes_until_showtime = time_until_showtime.total_seconds() / 60
                
                if minutes_until_showtime <= 60:
                    return Response({
                        'error': f'Cannot cancel booking. Cancellations must be made at least 60 minutes before showtime. Only {int(minutes_until_showtime)} minutes remaining.',
                        'minutes_remaining': int(minutes_until_showtime)
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Release the seats by deleting from booking_seats table
                # This makes them available for other bookings
                cursor.execute('''
                    DELETE FROM booking_seats
                    WHERE booking_id = %s
                ''', [booking_id])
                
                # Update booking status to cancelled
                cursor.execute('''
                    UPDATE bookings
                    SET status = 'cancelled',
                        updated_at = NOW()
                    WHERE id = %s
                ''', [booking_id])
                
                # In a real system, you would process the refund here
                # For now, we'll just return success with the refund amount
                
                return Response({
                    'success': True,
                    'message': f'Booking #{booking_number} has been cancelled successfully',
                    'booking_number': booking_number,
                    'refund_amount': float(total_amount),
                    'minutes_until_showtime': int(minutes_until_showtime)
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            import traceback
            print(f"Error cancelling booking: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Failed to cancel booking: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
