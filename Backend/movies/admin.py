"""
TODO: implement admin features 

from django.contrib import admin
from .models import Movie, UserFavorite, MovieReview


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'created_at']
    list_filter = ['year', 'genre', 'created_at']
    search_fields = ['title', 'director', 'actors']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'movie__title']


@admin.register(MovieReview)
class MovieReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'movie__title', 'review_text']
    readonly_fields = ['created_at', 'updated_at']
"""