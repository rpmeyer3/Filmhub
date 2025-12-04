from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User, UserType
import json





@csrf_exempt
def supabase_webhook(request):
    try:
        data = json.loads(request.body)
        event = data.get('type')
        user_record = data.get('record')

        if event == 'INSERT' and user_record:
            user_type_name = 'customer' 
            user_type_obj, created = UserType.objects.get_or_create(user_type=user_type_name)

            User.objects.create(
                supabase_id=user_record['id'],
                email=user_record.get('email', ''),
                username=user_record.get('email', ''),  # required field in AbstractUser
                user_type=user_type_obj
            )
        return JsonResponse({'status': 'ok'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

class SupabaseMoviesView(APIView):
    
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT DISTINCT
                        m.id,
                        m."Title" as title,
                        m."Year" as year,
                        m."Synopsis" as synopsis, 
                        m."Reviews" as rating,
                        m."Poster_img_URL" as poster_url,
                        m."TrailerURL" as trailer_url,
                        m."TrailerPicLink" as trailer_pic_url,
                        m."MPAA_US_Film_Rating" as mpaa_rating,
                        m."isRunning" as is_running,
                        m."isComingSoon" as is_coming_soon,
                        m."Director" as director,
                        m."Producer" as producer,
                        m."Cast" as cast,
                        m."Category" as category
                    FROM "Movies" m
                    ORDER BY m.id;
                ''')
                
                rows = cursor.fetchall()
                
                movies = []
                for row in rows:
                    movie = {
                        'id': row[0],
                        'title': row[1],
                        'year': row[2],
                        'synopsis': row[3],
                        'rating': row[4],
                        'poster_url': row[5],
                        'trailer_url': row[6],
                        'trailer_pic_url': row[7],
                        'mpaa_rating': row[8],
                        'is_running': row[9],
                        'is_coming_soon': row[10],
                        'director': row[11],
                        'producer': row[12],
                        'cast': row[13],
                        'category': row[14]
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
                cursor.execute('''
                    SELECT 
                        id,
                        "Title" as title,
                        "Year" as year,
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
                        "Category" as category
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
                    'year': row[2],
                    'synopsis': row[3],
                    'rating': row[4],
                    'poster_url': row[5],
                    'trailer_url': row[6],
                    'trailer_pic_url': row[7],
                    'mpaa_rating': row[8],
                    'is_running': row[9],
                    'is_coming_soon': row[10],
                    'director': row[11],
                    'producer': row[12],
                    'cast': row[13],
                    'category': row[14]
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
                
                cursor.execute('SELECT COUNT(*) FROM "Movies";')
                stats['total_movies'] = cursor.fetchone()[0]
                
                cursor.execute('SELECT COUNT(*) FROM "Movies" WHERE "isRunning" = true;')
                stats['running_movies'] = cursor.fetchone()[0]
                
                cursor.execute('SELECT COUNT(*) FROM "Movies" WHERE "isComingSoon" = true;')
                stats['coming_soon_movies'] = cursor.fetchone()[0]
                
                return Response({
                    'success': True,
                    'stats': stats
                })
                
        except Exception as e:
            return Response(
                {'success': False, 'error': f'Database query failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )