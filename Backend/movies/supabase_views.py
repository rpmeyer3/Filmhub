from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

class SupabaseMoviesView(APIView):
    
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                # Query movies with all related data using JOINs
                cursor.execute('''
                    SELECT DISTINCT
                        m.id,
                        m."Title" as title,
                        m."Synopsis" as synopsis, 
                        m."Reviews" as rating,
                        m."Poster_img_URL" as poster_url,
                        m."TrailerURL" as trailer_url,
                        m."TrailerPicLink" as trailer_pic_url,
                        m."MPAA_US_Film_Rating" as mpaa_rating,
                        m."isRunning" as is_running,
                        m."isComingSoon" as is_coming_soon
                    FROM "Movies" m
                    ORDER BY m.id;
                ''')
                
                rows = cursor.fetchall()
                
                # Convert to list of dictionaries and get related data
                movies = []
                for row in rows:
                    movie_id = row[0]
                    
                    # Get cast members for this movie
                    cursor.execute('''
                        SELECT c."Name"
                        FROM "Movie_Cast" mc
                        JOIN "Cast" c ON mc.cast_id = c.id
                        WHERE mc.movie_id = %s;
                    ''', [movie_id])
                    cast_rows = cursor.fetchall()
                    cast_members = [cast_row[0] for cast_row in cast_rows]
                    
                    # Get directors for this movie
                    cursor.execute('''
                        SELECT d."Name"
                        FROM "Movie_Director" md
                        JOIN "Director" d ON md.director_id = d.id
                        WHERE md.movie_id = %s;
                    ''', [movie_id])
                    director_rows = cursor.fetchall()
                    directors = [director_row[0] for director_row in director_rows]
                    
                    # Get producers for this movie
                    cursor.execute('''
                        SELECT p."Name"
                        FROM "Movie_Producer" mp
                        JOIN "Producer" p ON mp.producer_id = p.id
                        WHERE mp.movie_id = %s;
                    ''', [movie_id])
                    producer_rows = cursor.fetchall()
                    producers = [producer_row[0] for producer_row in producer_rows]
                    
                    # Get categories for this movie
                    cursor.execute('''
                        SELECT cat."Name"
                        FROM "Movie_Category" mcat
                        JOIN "Category" cat ON mcat.category_id = cat.id
                        WHERE mcat.movie_id = %s;
                    ''', [movie_id])
                    category_rows = cursor.fetchall()
                    categories = [category_row[0] for category_row in category_rows]
                    
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
                        'cast': cast_members,
                        'directors': directors,
                        'producers': producers,
                        'categories': categories
                    }
                    movies.append(movie)
                
                return Response({
                    'success': True,
                    'movies': movies,
                    'count': len(movies)
                })
                
        except Exception as e:
            return Response(
                {'success': False, 'error': f'Database query failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SupabaseMovieDetailView(APIView):
    
    def get(self, request, movie_id):
        try:
            with connection.cursor() as cursor:
                # Get the specific movie
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
                        "isComingSoon" as is_coming_soon
                    FROM "Movies"
                    WHERE id = %s;
                ''', [movie_id])
                
                row = cursor.fetchone()
                
                if not row:
                    return Response(
                        {'error': 'Movie not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                # Get all related data
                cursor.execute('''
                    SELECT c."Name"
                    FROM "Movie_Cast" mc
                    JOIN "Cast" c ON mc.cast_id = c.id
                    WHERE mc.movie_id = %s;
                ''', [movie_id])
                cast_members = [cast_row[0] for cast_row in cursor.fetchall()]
                
                cursor.execute('''
                    SELECT d."Name"
                    FROM "Movie_Director" md
                    JOIN "Director" d ON md.director_id = d.id
                    WHERE md.movie_id = %s;
                ''', [movie_id])
                directors = [director_row[0] for director_row in cursor.fetchall()]
                
                cursor.execute('''
                    SELECT p."Name"
                    FROM "Movie_Producer" mp
                    JOIN "Producer" p ON mp.producer_id = p.id
                    WHERE mp.movie_id = %s;
                ''', [movie_id])
                producers = [producer_row[0] for producer_row in cursor.fetchall()]
                
                cursor.execute('''
                    SELECT cat."Name"
                    FROM "Movie_Category" mcat
                    JOIN "Category" cat ON mcat.category_id = cat.id
                    WHERE mcat.movie_id = %s;
                ''', [movie_id])
                categories = [category_row[0] for category_row in cursor.fetchall()]
                
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
                    'cast': cast_members,
                    'directors': directors,
                    'producers': producers,
                    'categories': categories
                }
                
                return Response({'movie': movie})
                
        except Exception as e:
            return Response(
                {'error': f'Database query failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SupabaseStatsView(APIView):
    
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                stats = {}
                
                # Count movies
                cursor.execute('SELECT COUNT(*) FROM "Movies";')
                stats['total_movies'] = cursor.fetchone()[0]
                
                # Count cast members
                cursor.execute('SELECT COUNT(*) FROM "Cast";')
                stats['total_cast'] = cursor.fetchone()[0]
                
                # Count directors
                cursor.execute('SELECT COUNT(*) FROM "Director";')
                stats['total_directors'] = cursor.fetchone()[0]
                
                # Count producers
                cursor.execute('SELECT COUNT(*) FROM "Producer";')
                stats['total_producers'] = cursor.fetchone()[0]
                
                # Count categories
                cursor.execute('SELECT COUNT(*) FROM "Category";')
                stats['total_categories'] = cursor.fetchone()[0]
                
                # Get running movies
                cursor.execute('SELECT COUNT(*) FROM "Movies" WHERE "isRunning" = true;')
                stats['running_movies'] = cursor.fetchone()[0]
                
                # Get coming soon movies
                cursor.execute('SELECT COUNT(*) FROM "Movies" WHERE "isComingSoon" = true;')
                stats['coming_soon_movies'] = cursor.fetchone()[0]
                
                # Get all categories
                cursor.execute('SELECT "Name" FROM "Category" ORDER BY "Name";')
                stats['available_categories'] = [row[0] for row in cursor.fetchall()]
                
                return Response({
                    'success': True,
                    'stats': stats
                })
                
        except Exception as e:
            return Response(
                {'success': False, 'error': f'Database query failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )