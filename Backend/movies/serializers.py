from rest_framework import serializers
from .models import Movie, UserFavorite, MovieReview


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'


class UserFavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    
    class Meta:
        model = UserFavorite
        fields = ['id', 'movie', 'created_at']


class MovieReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    
    class Meta:
        model = MovieReview
        fields = ['id', 'user_username', 'movie_title', 'rating', 'review_text', 'created_at', 'updated_at']
