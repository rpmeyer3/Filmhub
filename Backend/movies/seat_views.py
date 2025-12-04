from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import MovieShow
from django.db import connection
from datetime import timedelta
from django.utils import timezone
from .models import SeatHold
import uuid

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
                
                bookings = []
                for row in bookings_raw:
                    booking_id, booking_number, booking_date, total_amount, num_adult, num_child, num_senior, booking_status, showtime, movie_id, seats = row
                    
                    cursor.execute('SELECT "Title", "Poster_img_URL" FROM "Movies" WHERE id = %s', [movie_id])
                    movie_data = cursor.fetchone()
                    movie_title = movie_data[0] if movie_data else 'Unknown Movie'
                    poster_url = movie_data[1] if movie_data else None
                    
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


def get_or_create_showtime_uuid(showtime_int_id):
    """
    Given a showtime_table.id (integer), return the corresponding UUID
    from showtimes.id, creating it if needed (same logic as CreateBookingView).
    """
    with connection.cursor() as cursor:
        cursor.execute(
            '''
            SELECT movie_id, showroom_id, showtime, price
            FROM showtime_table
            WHERE id = %s
            ''',
            [showtime_int_id],
        )
        row = cursor.fetchone()
        if not row:
            raise ValueError(f"showtime_table row {showtime_int_id} not found")

        movie_id_int, showroom_uuid, showtime_dt, price = row

        cursor.execute(
            '''
            SELECT id FROM showtimes
            WHERE movie_id = %s AND showroom_id = %s AND showtime = %s
            ''',
            [movie_id_int, showroom_uuid, showtime_dt],
        )
        existing = cursor.fetchone()
        if existing:
            return existing[0]

        showtime_uuid = uuid.uuid4()
        cursor.execute(
            '''
            INSERT INTO showtimes (
                id, movie_id, showroom_id, showtime,
                ticket_price_adult, ticket_price_child, ticket_price_senior,
                available_seats, is_available
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''',
            [
                showtime_uuid,
                movie_id_int,
                showroom_uuid,
                showtime_dt,
                12.00,
                8.00,
                10.00,
                100,
                True,
            ],
        )
        return showtime_uuid

class ShowtimeSeatsView(APIView):
    """Get all seats for a specific showtime with availability status"""
    def get(self, request, showtime_id):
        try:
            with connection.cursor() as cursor:
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

                    held_by_others = {
                        seat_id for (seat_id, holder) in active_holds
                        if not current_user_id or holder != str(current_user_id)
                    }
                except Exception:
                    held_by_others = set()

                unavailable_ids = booked_seat_ids | held_by_others

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
            
            cursor.execute("DELETE FROM seat_holds WHERE expires_at <= NOW()")
            cursor.execute("""
                SELECT sh.seat_id::text, sh.user_id::text
                FROM seat_holds sh
                JOIN showtimes sht ON sh.showtime_id = sht.id
                WHERE sht.movie_id = %s AND sht.showroom_id = %s AND sht.showtime = %s
            """, [movie_id_int, showroom_uuid, showtime_dt])
            active_holds = cursor.fetchall()

            request_user = request.query_params.get('user_id')
            held_by_others = {sid for (sid, holder) in active_holds if holder != str(request_user)}
            unavailable_ids = booked_seat_ids | held_by_others
                
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
                
                cursor.execute('''
                    SELECT id FROM showtimes 
                    WHERE movie_id = %s AND showroom_id = %s AND showtime = %s
                ''', [movie_id_int, showroom_uuid, showtime_dt])
                
                existing_showtime = cursor.fetchone()
                if existing_showtime:
                    showtime_uuid = existing_showtime[0]
                else:
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
                
                    placeholders = ','.join(['%s'] * len(seat_ids))
                    cursor.execute(f'''
                        SELECT bs.seat_id::text
                        FROM booking_seats bs
                        WHERE bs.seat_id IN ({placeholders})
                    ''', seat_ids)
                    already_booked = {row[0] for row in cursor.fetchall()}

                    cursor.execute("DELETE FROM seat_holds WHERE expires_at <= NOW()")

                    user_id_str = str(user_id)
                    cursor.execute(f'''
                        SELECT sh.seat_id::text, sh.user_id::text
                        FROM seat_holds sh
                        WHERE sh.seat_id IN ({placeholders})
                        AND sh.expires_at > NOW()
                    ''', seat_ids)
                    active_holds = cursor.fetchall()

                    held_by_others = {
                        seat_id for seat_id, holder in active_holds
                        if holder != user_id_str
                    }

                    unavailable_ids = already_booked | held_by_others
                    if unavailable_ids:
                        return Response(
                            {'error': 'Some of the selected seats are unavailable (booked or held by another user).'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                
                booking_number = f"BK{datetime.now().strftime('%Y%m%d')}{str(showtime_id).zfill(4)}{uuid.uuid4().hex[:4].upper()}"
                
                booking_id = uuid.uuid4()
                
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
                
                for seat_id in seat_ids:
                    cursor.execute('''
                        INSERT INTO booking_seats (id, booking_id, seat_id, showtime_id)
                        VALUES (%s, %s, %s, %s)
                    ''', [uuid.uuid4(), booking_id, seat_id, showtime_uuid])
                
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
                
                if booking_status == 'cancelled':
                    return Response(
                        {'error': 'This booking has already been cancelled'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                now = datetime.now()
                showtime_dt = showtime
                
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
                
                cursor.execute('''
                    DELETE FROM booking_seats
                    WHERE booking_id = %s
                ''', [booking_id])
                
                cursor.execute('''
                    UPDATE bookings
                    SET status = 'cancelled',
                        updated_at = NOW()
                    WHERE id = %s
                ''', [booking_id])
                
                
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


class HoldSeatsView(APIView):
    """
    POST /api/seats/hold/
    Body: { user_id: UUID, showtime_id: <int from showtime_table>, seat_ids: [uuid,...], minutes: 5? }
    """
    def post(self, request):
        try:
            data = request.data
            user_id = str(data.get('user_id'))
            showtime_int_id = data.get('showtime_id')
            seat_ids = data.get('seat_ids', [])
            minutes = int(data.get('minutes', 5))

            if not user_id or not showtime_int_id or not seat_ids:
                return Response({'error': 'user_id, showtime_id, seat_ids are required'}, status=400)

            showtime_int_id = int(showtime_int_id)

            showtime_uuid = get_or_create_showtime_uuid(showtime_int_id)

            expires_at = timezone.now() + timedelta(minutes=minutes)

            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM seat_holds WHERE expires_at <= NOW()")

                cursor.execute("""
                    DO $$
                    BEGIN
                        IF NOT EXISTS (
                            SELECT 1 FROM pg_indexes
                            WHERE schemaname='public' AND indexname='uq_seat_holds_showtime_seat'
                        ) THEN
                            CREATE UNIQUE INDEX uq_seat_holds_showtime_seat
                            ON seat_holds (showtime_id, seat_id);
                        END IF;
                    END$$;
                """)

                for sid in seat_ids:
                    cursor.execute("""
                        INSERT INTO seat_holds (id, seat_id, user_id, showtime_id, expires_at, created_at)
                        VALUES (gen_random_uuid(), %s, %s, %s, %s, NOW())
                        ON CONFLICT (showtime_id, seat_id)
                        DO UPDATE SET
                            user_id = CASE
                                WHEN seat_holds.user_id = EXCLUDED.user_id OR seat_holds.expires_at <= NOW()
                                THEN EXCLUDED.user_id
                                ELSE seat_holds.user_id
                            END,
                            expires_at = CASE
                                WHEN seat_holds.user_id = EXCLUDED.user_id OR seat_holds.expires_at <= NOW()
                                THEN EXCLUDED.expires_at
                                ELSE seat_holds.expires_at
                            END;
                    """, [str(sid), user_id, str(showtime_uuid), expires_at])

            return Response({'success': True, 'expires_at': expires_at.isoformat()}, status=200)

        except Exception as e:
            import traceback; print(traceback.format_exc())
            return Response({'error': str(e)}, status=500)        
    
class ReleaseSeatHoldsView(APIView):
    """
    POST /api/seats/release/
    Body: { user_id: UUID, showtime_id: <int from showtime_table>, seat_ids?: [uuid,...] }
    """
    def post(self, request):
        try:
            data = request.data
            user_id = str(data.get('user_id'))
            showtime_int_id = data.get('showtime_id')
            seat_ids = data.get('seat_ids', None)

            if not user_id or not showtime_int_id:
                return Response({'error': 'user_id and showtime_id are required'}, status=400)

            showtime_int_id = int(showtime_int_id)
            showtime_uuid = get_or_create_showtime_uuid(showtime_int_id)

            with connection.cursor() as cursor:
                if seat_ids:
                    placeholders = ','.join(['%s'] * len(seat_ids))
                    cursor.execute(f"""
                        DELETE FROM seat_holds
                        WHERE user_id = %s AND showtime_id = %s AND seat_id IN ({placeholders})
                    """, [user_id, str(showtime_uuid), *seat_ids])
                else:
                    cursor.execute("""
                        DELETE FROM seat_holds
                        WHERE user_id = %s AND showtime_id = %s
                    """, [user_id, str(showtime_uuid)])

            return Response({'success': True}, status=200)

        except Exception as e:
            import traceback; print(traceback.format_exc())
            return Response({'error': str(e)}, status=500)
