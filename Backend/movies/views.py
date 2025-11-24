from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import connection
from django.core.mail import send_mail
from django.conf import settings
from django.db import IntegrityError
from .models import Movie, UserFavorite, MovieReview, PaymentCard
from .serializers import MovieSerializer, UserFavoriteSerializer, MovieReviewSerializer, PaymentCardSerializer


class MovieListView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                # Query movies from Supabase Movies table
                cursor.execute('''
                    SELECT 
                        id,
                        "Title" as title,
                        "Synopsis" as synopsis, 
                        "Reviews" as rating,
                        "Poster_img_URL" as poster_url,
                        "TrailerURL" as trailer_url,
                        "TrailerPicLink" as trailer_pic_url,
                        "MPAA_US_Film_Rating" as mpaa_rating,
                        "isRunning" as is_running,
                        "isComingSoon" as is_coming_soon,
                        "Director" as director,
                        "Producer" as producer,
                        "Cast" as cast,
                        "Category" as category,
                        "Year" as year
                    FROM "Movies"
                    ORDER BY id;
                ''')
                
                # Fetch column names from the cursor description
                columns = [col[0] for col in cursor.description]
                movies = [
                    dict(zip(columns, row))
                    for row in cursor.fetchall()
                ]
                
                return Response({
                    'success': True,
                    'movies': movies,
                    'count': len(movies)
                })
                
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch movies: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MovieDetailView(APIView):
    def get(self, request, movie_id):
        try:
            with connection.cursor() as cursor:
                # Query single movie from Supabase Movies table
                cursor.execute('''
                    SELECT 
                        id,
                        "Title" as title,
                        "Synopsis" as synopsis, 
                        "Reviews" as rating,
                        "Poster_img_URL" as poster_url,
                        "TrailerURL" as trailer_url,
                        "TrailerPicLink" as trailer_pic_url,
                        "MPAA_US_Film_Rating" as mpaa_rating,
                        "isRunning" as is_running,
                        "isComingSoon" as is_coming_soon,
                        "Director" as director,
                        "Producer" as producer,
                        "Cast" as cast,
                        "Category" as category,
                        "Year" as year
                    FROM "Movies"
                    WHERE id = %s;
                ''', [movie_id])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Movie not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                movie = {
                    'id': row[0],
                    'title': row[1],
                    'synopsis': row[2],
                    'rating': row[3],
                    'poster_url': row[4],
                    'trailer_url': row[5],
                    'trailer_pic_url': row[6],
                    'mpaa_rating': row[7],
                    'is_running': row[8],
                    'is_coming_soon': row[9],
                    'director': row[10],
                    'producer': row[11],
                    'cast': row[12],
                    'category': row[13],
                    'year':row[14]
                }
                
                return Response(movie)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch movie: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MovieSearchView(APIView):
    def get(self, request, query):
        try:
            with connection.cursor() as cursor:
                # Search movies in Supabase Movies table by title
                search_query = f'%{query}%'
                cursor.execute('''
                    SELECT 
                        id,
                        "Title" as title,
                        "Synopsis" as synopsis, 
                        "Reviews" as rating,
                        "Poster_img_URL" as poster_url,
                        "TrailerURL" as trailer_url,
                        "TrailerPicLink" as trailer_pic_url,
                        "MPAA_US_Film_Rating" as mpaa_rating,
                        "isRunning" as is_running,
                        "isComingSoon" as is_coming_soon,
                        "Director" as director,
                        "Producer" as producer,
                        "Cast" as cast,
                        "Category" as category,
                        "Year" as year
                    FROM "Movies"
                    WHERE "Title" ILIKE %s
                    ORDER BY "Title";
                ''', [search_query])
                
                rows = cursor.fetchall()
                movies = []
                
                for row in rows:
                    movie = {
                        'id': row[0],
                        'title': row[1],
                        'synopsis': row[2],
                        'rating': row[3],
                        'poster_url': row[4],
                        'trailer_url': row[5],
                        'trailer_pic_url': row[6],
                        'mpaa_rating': row[7],
                        'is_running': row[8],
                        'is_coming_soon': row[9],
                        'director': row[10],
                        'producer': row[11],
                        'cast': row[12],
                        'category': row[13]
                    }
                    movies.append(movie)
                
                return Response({
                    'results': movies,
                    'total_results': len(movies)
                })
                
        except Exception as e:
            return Response(
                {'error': f'Failed to search movies: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserFavoritesView(generics.ListAPIView):
    serializer_class = UserFavoriteSerializer
    
    def get_queryset(self):
        # For now, return all favorites (add authentication later)
        return UserFavorite.objects.all()


class ToggleFavoriteView(APIView):
    def post(self, request, movie_id):
        return Response(
            {'error': 'Favorites functionality requires Django Movie model integration'}, 
            status=status.HTTP_501_NOT_IMPLEMENTED
        )


class ReviewListView(generics.ListCreateAPIView):
    queryset = MovieReview.objects.all()
    serializer_class = MovieReviewSerializer


class MovieReviewsView(APIView):
    def get(self, request, movie_id):
        return Response(
            {'error': 'Movie reviews functionality requires Django Movie model integration'}, 
            status=status.HTTP_501_NOT_IMPLEMENTED
        )


# Payment Card Views
class PaymentCardListCreateView(APIView):
    
    def get(self, request):
        try:
            # Get supabase_id from query params (in production, use authentication)
            supabase_id = request.query_params.get('supabase_id')
            
            if not supabase_id:
                return Response(
                    {'error': 'supabase_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get all cards for this user_id
            cards = PaymentCard.objects.filter(user_id=supabase_id)
            serializer = PaymentCardSerializer(cards, many=True)
            
            return Response({
                'success': True,
                'cards': serializer.data,
                'count': cards.count()
            })
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch payment cards: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        try:
            # Get supabase_id from request data
            supabase_id = request.data.get('supabase_id')
            
            if not supabase_id:
                return Response(
                    {'error': 'supabase_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add user_id to the data
            data = request.data.copy()
            data['user_id'] = supabase_id
            
            # Create serializer with data
            serializer = PaymentCardSerializer(data=data)
            
            if serializer.is_valid():
                # Save the card
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Payment card added successfully',
                    'card': serializer.data
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to create payment card: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentCardDetailView(APIView):
    
    def get(self, request, card_id):
        try:
            supabase_id = request.query_params.get('supabase_id')
            
            if not supabase_id:
                return Response(
                    {'error': 'supabase_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get card and verify ownership
            try:
                card = PaymentCard.objects.get(id=card_id, user_id=supabase_id)
            except PaymentCard.DoesNotExist:
                return Response(
                    {'error': 'Payment card not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = PaymentCardSerializer(card)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch payment card: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, card_id):
        try:
            print("[DEBUG] PaymentCard DELETE endpoint hit")  # keep for visibility
            supabase_id = request.query_params.get('supabase_id')
            if not supabase_id:
                return Response({'error': 'supabase_id is required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                card = PaymentCard.objects.get(id=card_id, user_id=supabase_id)
            except PaymentCard.DoesNotExist:
                return Response({'error': 'Payment card not found'}, status=status.HTTP_404_NOT_FOUND)

            # ✅ correct table + correct id param
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT 1
                    FROM public.bookings
                    WHERE payment_card_id = %s
                    LIMIT 1
                    """,
                    [card.id]
                )
                in_use = cursor.fetchone() is not None

            if in_use:
                return Response(
                    {'success': False, 'error': 'This card is linked to existing bookings and cannot be deleted.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            card.delete()
            return Response({'success': True, 'message': 'Payment card deleted successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"[ERROR] PaymentCard delete failed: {e}")
            return Response({'error': 'Failed to delete payment card'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminMovieView(APIView):
    def post(self, request):
        try:
            with connection.cursor() as cursor:
                data = request.data
                
                # Insert new movie into Supabase Movies table
                cursor.execute('''
                    INSERT INTO "Movies" (
                        "Title", "Year", "Synopsis", "TrailerURL", "TrailerPicLink",
                        "MPAA_US_Film_Rating", "isRunning", "isComingSoon", 
                        "Director", "Producer", "Cast", "Category", "Poster_img_URL"
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, "Title", "Year", "Synopsis", "Director", "Producer", 
                              "Cast", "Category", "Poster_img_URL", "TrailerURL", 
                              "TrailerPicLink", "MPAA_US_Film_Rating", "isRunning", "isComingSoon"
                ''', [
                    data.get('title'),
                    data.get('year'),
                    data.get('synopsis'),
                    data.get('trailer_url'),
                    data.get('trailer_pic_url'),
                    data.get('mpaa_rating'),
                    data.get('is_running', False),
                    data.get('is_coming_soon', False),
                    data.get('director'),
                    data.get('producer'),
                    data.get('cast'),
                    data.get('category', []),
                    data.get('poster_url')
                ])
                
                columns = [col[0] for col in cursor.description]
                row = cursor.fetchone()
                movie = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'message': 'Movie created successfully',
                    'movie': movie
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to create movie: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, movie_id):
        try:
            with connection.cursor() as cursor:
                data = request.data
                
                # Update movie in Supabase Movies table
                cursor.execute('''
                    UPDATE "Movies"
                    SET 
                        "Title" = %s,
                        "Year" = %s,
                        "Synopsis" = %s,
                        "TrailerURL" = %s,
                        "TrailerPicLink" = %s,
                        "MPAA_US_Film_Rating" = %s,
                        "isRunning" = %s,
                        "isComingSoon" = %s,
                        "Director" = %s,
                        "Producer" = %s,
                        "Cast" = %s,
                        "Category" = %s,
                        "Poster_img_URL" = %s
                    WHERE id = %s
                    RETURNING id, "Title", "Year", "Synopsis", "Director", "Producer", 
                              "Cast", "Category", "Poster_img_URL", "TrailerURL", 
                              "TrailerPicLink", "MPAA_US_Film_Rating", "isRunning", "isComingSoon"
                ''', [
                    data.get('title'),
                    data.get('year'),
                    data.get('synopsis'),
                    data.get('trailer_url'),
                    data.get('trailer_pic_url'),
                    data.get('mpaa_rating'),
                    data.get('is_running', False),
                    data.get('is_coming_soon', False),
                    data.get('director'),
                    data.get('producer'),
                    data.get('cast'),
                    data.get('category', []),
                    data.get('poster_url'),
                    movie_id
                ])
                
                if cursor.rowcount == 0:
                    return Response(
                        {'error': 'Movie not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                row = cursor.fetchone()
                movie = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'message': 'Movie updated successfully',
                    'movie': movie
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to update movie: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, movie_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('DELETE FROM "Movies" WHERE id = %s', [movie_id])
                
                if cursor.rowcount == 0:
                    return Response(
                        {'error': 'Movie not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                return Response({
                    'success': True,
                    'message': 'Movie deleted successfully'
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to delete movie: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminShowRoomListView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT id, name, capacity, rows, seats_per_row, created_at, updated_at
                    FROM showrooms
                    ORDER BY id
                ''')
                
                columns = [col[0] for col in cursor.description]
                showrooms = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                return Response({
                    'success': True,
                    'showrooms': showrooms,
                    'count': len(showrooms)
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch showrooms: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        try:
            data = request.data
            
            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO showrooms (name, capacity, rows, seats_per_row)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, name, capacity, rows, seats_per_row, created_at, updated_at
                ''', [
                    data.get('name'),
                    data.get('capacity'),
                    data.get('rows'),
                    data.get('seats_per_row')
                ])
                
                columns = [col[0] for col in cursor.description]
                showroom = dict(zip(columns, cursor.fetchone()))
                
                return Response({
                    'success': True,
                    'message': 'Showroom created successfully',
                    'showroom': showroom
                }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to create showroom: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminShowRoomDetailView(APIView):
    def get(self, request, showroom_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT id, name, capacity, rows, seats_per_row, created_at, updated_at
                    FROM showrooms
                    WHERE id = %s
                ''', [showroom_id])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Showroom not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                showroom = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'showroom': showroom
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch showroom: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, showroom_id):
        try:
            data = request.data
            
            with connection.cursor() as cursor:
                cursor.execute('''
                    UPDATE showrooms
                    SET name = %s, capacity = %s, rows = %s, seats_per_row = %s
                    WHERE id = %s
                    RETURNING id, name, capacity, rows, seats_per_row, created_at, updated_at
                ''', [
                    data.get('name'),
                    data.get('capacity'),
                    data.get('rows'),
                    data.get('seats_per_row'),
                    showroom_id
                ])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Showroom not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                showroom = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'message': 'Showroom updated successfully',
                    'showroom': showroom
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to update showroom: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, showroom_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('DELETE FROM showrooms WHERE id = %s', [showroom_id])
                
                if cursor.rowcount == 0:
                    return Response(
                        {'error': 'Showroom not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                return Response({
                    'success': True,
                    'message': 'Showroom deleted successfully'
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to delete showroom: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminMovieShowListView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT 
                        st.id,
                        st.movie_id,
                        m."Title" as movie_title,
                        st.showroom_id,
                        sr.name as showroom_name,
                        st.showtime,
                        st.price,
                        st.is_now_showing,
                        st.created_at,
                        st.updated_at
                    FROM showtime_table st
                    JOIN "Movies" m ON st.movie_id = m.id
                    JOIN showrooms sr ON st.showroom_id = sr.id
                    ORDER BY st.showtime DESC
                ''')
                
                columns = [col[0] for col in cursor.description]
                showtimes = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                return Response({
                    'success': True,
                    'showtimes': showtimes,
                    'count': len(showtimes)
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch showtimes: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        try:
            data = request.data
            
            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO showtime_table (movie_id, showroom_id, showtime, price, is_now_showing)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, movie_id, showroom_id, showtime, price, is_now_showing, created_at, updated_at
                ''', [
                    data.get('movie_id'),
                    data.get('showroom_id'),
                    data.get('showtime'),
                    data.get('price', 10.00),
                    data.get('is_now_showing', True)
                ])
                
                columns = [col[0] for col in cursor.description]
                showtime = dict(zip(columns, cursor.fetchone()))
                
                return Response({
                    'success': True,
                    'message': 'Showtime created successfully',
                    'showtime': showtime
                }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to create showtime: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminMovieShowDetailView(APIView):
    def get(self, request, showtime_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT 
                        st.id,
                        st.movie_id,
                        m."Title" as movie_title,
                        st.showroom_id,
                        sr.name as showroom_name,
                        st.showtime,
                        st.price,
                        st.is_now_showing,
                        st.created_at,
                        st.updated_at
                    FROM showtime_table st
                    JOIN "Movies" m ON st.movie_id = m.id
                    JOIN showrooms sr ON st.showroom_id = sr.id
                    WHERE st.id = %s
                ''', [showtime_id])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Showtime not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                showtime = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'showtime': showtime
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch showtime: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, showtime_id):
        try:
            data = request.data
            
            with connection.cursor() as cursor:
                cursor.execute('''
                    UPDATE showtime_table
                    SET movie_id = %s, showroom_id = %s, showtime = %s, price = %s, is_now_showing = %s
                    WHERE id = %s
                    RETURNING id, movie_id, showroom_id, showtime, price, is_now_showing, created_at, updated_at
                ''', [
                    data.get('movie_id'),
                    data.get('showroom_id'),
                    data.get('showtime'),
                    data.get('price'),
                    data.get('is_now_showing'),
                    showtime_id
                ])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Showtime not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                showtime = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'message': 'Showtime updated successfully',
                    'showtime': showtime
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to update showtime: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, showtime_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('DELETE FROM showtime_table WHERE id = %s', [showtime_id])
                
                if cursor.rowcount == 0:
                    return Response(
                        {'error': 'Showtime not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                return Response({
                    'success': True,
                    'message': 'Showtime deleted successfully'
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to delete showtime: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminPromotionListView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT id, code, discount_percentage, start_date, end_date, is_active, created_at, updated_at
                    FROM promotions
                    ORDER BY created_at DESC
                ''')
                
                columns = [col[0] for col in cursor.description]
                promotions = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                return Response({
                    'success': True,
                    'promotions': promotions,
                    'count': len(promotions)
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch promotions: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        try:
            data = request.data
            
            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO promotions (code, discount_percentage, start_date, end_date, is_active)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, code, discount_percentage, start_date, end_date, is_active, created_at, updated_at
                ''', [
                    data.get('code'),
                    data.get('discount_percentage'),
                    data.get('start_date'),
                    data.get('end_date'),
                    data.get('is_active', True)
                ])
                
                columns = [col[0] for col in cursor.description]
                promotion = dict(zip(columns, cursor.fetchone()))
                
                return Response({
                    'success': True,
                    'message': 'Promotion created successfully',
                    'promotion': promotion
                }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to create promotion: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminPromotionDetailView(APIView):
    def get(self, request, promotion_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT id, code, discount_percentage, start_date, end_date, is_active, created_at, updated_at
                    FROM promotions
                    WHERE id = %s
                ''', [promotion_id])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Promotion not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                promotion = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'promotion': promotion
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch promotion: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, promotion_id):
        try:
            data = request.data
            
            with connection.cursor() as cursor:
                cursor.execute('''
                    UPDATE promotions
                    SET code = %s, discount_percentage = %s, start_date = %s, end_date = %s, is_active = %s
                    WHERE id = %s
                    RETURNING id, code, discount_percentage, start_date, end_date, is_active, created_at, updated_at
                ''', [
                    data.get('code'),
                    data.get('discount_percentage'),
                    data.get('start_date'),
                    data.get('end_date'),
                    data.get('is_active'),
                    promotion_id
                ])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Promotion not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                promotion = dict(zip(columns, row))
                
                return Response({
                    'success': True,
                    'message': 'Promotion updated successfully',
                    'promotion': promotion
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to update promotion: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, promotion_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('DELETE FROM promotions WHERE id = %s', [promotion_id])
                
                if cursor.rowcount == 0:
                    return Response(
                        {'error': 'Promotion not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                return Response({
                    'success': True,
                    'message': 'Promotion deleted successfully'
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to delete promotion: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendPromotionEmailView(APIView):
    def post(self, request, promotion_id):
        try:
            # Get promotion details
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT id, code, discount_percentage, start_date, end_date, is_active
                    FROM promotions
                    WHERE id = %s
                ''', [promotion_id])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Promotion not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                promotion = dict(zip(columns, row))
                
                # Get all users who subscribed for promotions from Supabase
                from supabase import create_client
                import os
                
                supabase_url = os.getenv('SUPABASE_URL')
                supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')
                
                if not supabase_url or not supabase_key:
                    return Response(
                        {'error': f'Supabase configuration missing. URL: {bool(supabase_url)}, Key: {bool(supabase_key)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
                # Query PostgreSQL directly for users who subscribed to promotions
                # We need to join the profiles table with auth.users to get emails
                cursor.execute('''
                    SELECT 
                        p.id,
                        p.first_name,
                        p.last_name,
                        au.email
                    FROM profiles p
                    JOIN auth.users au ON p.id = au.id
                    WHERE p.receive_promotions = TRUE
                ''')
                
                columns = [col[0] for col in cursor.description]
                subscribed_users = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                if not subscribed_users:
                    return Response({
                        'success': True,
                        'message': 'No users subscribed to promotions',
                        'emails_sent': 0
                    }, status=status.HTTP_200_OK)
                
                # Send email to each subscribed user
                emails_sent = 0
                failed_emails = []
                
                # Use Django's built-in email system (configured for Gmail SMTP)
                from django.core.mail import EmailMultiAlternatives
                from django.conf import settings
                import os
                
                for user in subscribed_users:
                    try:
                        user_email = user.get('email')
                        first_name = user.get('first_name', 'Valued Customer')
                        
                        subject = f'Special Offer: {promotion["code"]} - {promotion["discount_percentage"]}% Off!'
                        
                        # HTML email template
                        html_message = f'''
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                                .header {{ background-color: #dc2626; color: white; padding: 20px; text-align: center; }}
                                .content {{ background-color: #f9fafb; padding: 30px; }}
                                .promo-code {{ background-color: #fee2e2; border: 2px dashed #dc2626; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #dc2626; }}
                                .discount {{ color: #059669; font-size: 28px; font-weight: bold; }}
                                .cta-button {{ display: inline-block; background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }}
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Film-Hub Special Offer!</h1>
                                </div>
                                <div class="content">
                                    <p>Hello {first_name},</p>
                                    <p>We have an exciting promotion just for you!</p>
                                    
                                    <div class="promo-code">
                                        {promotion["code"]}
                                    </div>
                                    
                                    <p class="discount">Get {promotion["discount_percentage"]}% OFF your next booking!</p>
                                    
                                    <p><strong>Valid from:</strong> {promotion["start_date"]} to {promotion["end_date"]}</p>
                                    
                                    <p>Don't miss out on this great deal. Book your tickets today!</p>
                                    
                                    <div style="text-align: center;">
                                        <a href="http://localhost:3000" class="cta-button">Book Now</a>
                                    </div>
                                    
                                    <p>Thank you for being a valued customer!</p>
                                    
                                    <p><strong>Best regards,</strong><br>The Film-Hub Team</p>
                                </div>
                                <div class="footer">
                                    <p>To unsubscribe from promotional emails, please visit your <a href="http://localhost:3000/profile">profile settings</a>.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        '''
                        
                        # Plain text version for email clients that don't support HTML
                        text_message = f'''
Hello {first_name},

We have an exciting promotion for you!

Use promo code: {promotion["code"]}
Get {promotion["discount_percentage"]}% off your next booking!

Valid from {promotion["start_date"]} to {promotion["end_date"]}

Don't miss out on this great deal. Book your tickets today!

Visit Film-Hub to book now: http://localhost:3000

Thank you for being a valued customer!

Best regards,
The Film-Hub Team

---
To unsubscribe from promotional emails, please visit your profile settings.
                        '''
                        
                        # Send email using Django's email system (Gmail SMTP)
                        try:
                            msg = EmailMultiAlternatives(
                                subject=subject,
                                body=text_message,
                                from_email=settings.DEFAULT_FROM_EMAIL,
                                to=[user_email]
                            )
                            msg.attach_alternative(html_message, "text/html")
                            msg.send(fail_silently=False)
                            print(f"✓ Sent email to {user_email} via Gmail SMTP")
                        except Exception as email_error:
                            # If email fails, log to console
                            print(f"⚠️ Failed to send email to {user_email}: {str(email_error)}")
                            print(f"\n{'='*60}")
                            print(f"PROMOTIONAL EMAIL (Console Fallback)")
                            print(f"{'='*60}")
                            print(f"To: {user_email}")
                            print(f"Subject: {subject}")
                            print(f"\n{text_message}")
                            print(f"{'='*60}\n")
                        
                        emails_sent += 1
                        
                    except Exception as email_error:
                        import traceback
                        error_details = f"{str(email_error)} - {traceback.format_exc()}"
                        print(f"Failed to send email to {user_email}: {error_details}")
                        failed_emails.append({
                            'email': user_email if 'user_email' in locals() else 'unknown',
                            'error': str(email_error)
                        })
                
                return Response({
                    'success': True,
                    'message': f'Promotion emails sent successfully',
                    'emails_sent': emails_sent,
                    'total_subscribed': len(subscribed_users),
                    'failed_emails': failed_emails
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            print(f"Error sending promotion emails: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Failed to send promotion emails: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ValidatePromotionView(APIView):
    def post(self, request):
        try:
            code = request.data.get('code')
            
            if not code:
                return Response(
                    {'error': 'Promotion code is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT id, code, discount_percentage, start_date, end_date, is_active
                    FROM promotions
                    WHERE UPPER(code) = UPPER(%s) AND is_active = TRUE
                ''', [code])
                
                row = cursor.fetchone()
                if not row:
                    return Response({
                        'valid': False,
                        'error': 'Invalid or inactive promotion code'
                    }, status=status.HTTP_200_OK)
                
                columns = [col[0] for col in cursor.description]
                promotion = dict(zip(columns, row))
                
                # Check date validity
                from datetime import date
                today = date.today()
                start_date = promotion['start_date']
                end_date = promotion['end_date']
                
                if today < start_date:
                    return Response({
                        'valid': False,
                        'error': f'Promotion starts on {start_date}'
                    }, status=status.HTTP_200_OK)
                
                if today > end_date:
                    return Response({
                        'valid': False,
                        'error': f'Promotion expired on {end_date}'
                    }, status=status.HTTP_200_OK)
                
                return Response({
                    'valid': True,
                    'promotion': promotion,
                    'discount_percentage': float(promotion['discount_percentage'])
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to validate promotion: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MovieShowtimesView(APIView):
    def get(self, request, movie_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT 
                        st.id,
                        st.movie_id,
                        st.showroom_id,
                        st.showtime,
                        st.price,
                        st.is_now_showing,
                        sr.name as showroom_name,
                        sr.capacity,
                        sr.rows,
                        sr.seats_per_row
                    FROM showtime_table st
                    JOIN showrooms sr ON st.showroom_id = sr.id
                    WHERE st.movie_id = %s AND st.showtime >= NOW()
                    ORDER BY st.showtime ASC
                ''', [movie_id])
                
                columns = [col[0] for col in cursor.description]
                showtimes = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                return Response({
                    'success': True,
                    'showtimes': showtimes,
                    'count': len(showtimes)
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch showtimes: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
