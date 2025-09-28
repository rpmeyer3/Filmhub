from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import connection
from .models import Movie, UserFavorite, MovieReview
from .serializers import MovieSerializer, UserFavoriteSerializer, MovieReviewSerializer
from django.conf import settings


class MovieListView(APIView):
    """List all movies from Supabase Movies table only"""
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
    """Get movie details by movie ID from Supabase Movies table only"""
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
    """Search for movies in Supabase Movies table only"""
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
    """List user's favorite movies"""
    serializer_class = UserFavoriteSerializer
    
    def get_queryset(self):
        # For now, return all favorites (add authentication later)
        return UserFavorite.objects.all()


class ToggleFavoriteView(APIView):
    """Add/remove movie from favorites - currently disabled as it requires Django Movie model"""
    def post(self, request, movie_id):
        return Response(
            {'error': 'Favorites functionality requires Django Movie model integration'}, 
            status=status.HTTP_501_NOT_IMPLEMENTED
        )


class ReviewListView(generics.ListCreateAPIView):
    """List all reviews or create a new review"""
    queryset = MovieReview.objects.all()
    serializer_class = MovieReviewSerializer


class MovieReviewsView(APIView):
    """Get all reviews for a specific movie - currently disabled as it requires Django Movie model"""
    def get(self, request, movie_id):
        return Response(
            {'error': 'Movie reviews functionality requires Django Movie model integration'}, 
            status=status.HTTP_501_NOT_IMPLEMENTED
        )
