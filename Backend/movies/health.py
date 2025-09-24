from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from movies.models import Movie


class HealthCheckView(APIView):
    """Health check endpoint to verify database connectivity"""
    
    def get(self, request):
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            
            # Count movies in database
            movie_count = Movie.objects.count()
            
            return Response({
                'status': 'healthy',
                'database': 'connected',
                'movies_count': movie_count,
                'message': 'Cinema E-Booking System API is running'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'database': 'disconnected',
                'error': str(e),
                'message': 'Database connection failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)