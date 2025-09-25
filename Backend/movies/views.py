from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Movie, UserFavorite, MovieReview
from .serializers import MovieSerializer, UserFavoriteSerializer, MovieReviewSerializer
from .services import OMDBService
from django.conf import settings


class MovieListView(generics.ListAPIView):
    """List all movies in the database"""
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class MovieDetailView(APIView):
    """Get movie details by IMDB ID"""
    def get(self, request, imdb_id):
        try:
            # Try to get movie from database first
            movie = Movie.objects.get(imdb_id=imdb_id)
            serializer = MovieSerializer(movie)
            return Response(serializer.data)
        except Movie.DoesNotExist:
            # If not in database, fetch from OMDB API
            omdb_service = OMDBService()
            movie_data = omdb_service.get_movie_by_id(imdb_id)
            if movie_data:
                # Save to database
                movie = Movie.objects.create(**movie_data)
                serializer = MovieSerializer(movie)
                return Response(serializer.data)
            else:
                return Response(
                    {'error': 'Movie not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )


class MovieSearchView(APIView):
    """Search for movies using OMDB API"""
    def get(self, request, query):
        omdb_service = OMDBService()
        results = omdb_service.search_movies(query)
        return Response(results)


class UserFavoritesView(generics.ListAPIView):
    """List user's favorite movies"""
    serializer_class = UserFavoriteSerializer
    
    def get_queryset(self):
        # For now, return all favorites (add authentication later)
        return UserFavorite.objects.all()


class ToggleFavoriteView(APIView):
    """Add/remove movie from favorites"""
    def post(self, request, imdb_id):
        # For now, use a default user (add authentication later)
        user = User.objects.first()
        if not user:
            return Response(
                {'error': 'No user found'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            movie = Movie.objects.get(imdb_id=imdb_id)
        except Movie.DoesNotExist:
            return Response(
                {'error': 'Movie not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        favorite, created = UserFavorite.objects.get_or_create(
            user=user, movie=movie
        )
        
        if not created:
            # If favorite already exists, remove it
            favorite.delete()
            return Response({'status': 'removed'})
        else:
            return Response({'status': 'added'})


class ReviewListView(generics.ListCreateAPIView):
    """List all reviews or create a new review"""
    queryset = MovieReview.objects.all()
    serializer_class = MovieReviewSerializer


class MovieReviewsView(generics.ListAPIView):
    """Get all reviews for a specific movie"""
    serializer_class = MovieReviewSerializer
    
    def get_queryset(self):
        imdb_id = self.kwargs['imdb_id']
        try:
            movie = Movie.objects.get(imdb_id=imdb_id)
            return MovieReview.objects.filter(movie=movie)
        except Movie.DoesNotExist:
            return MovieReview.objects.none()
