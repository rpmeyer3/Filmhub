from django.db import models
from django.contrib.auth.models import User


class Movie(models.Model):
    """Model for storing movie information from OMDB API"""
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    imdb_id = models.CharField(max_length=20, unique=True)
    plot = models.TextField(blank=True)
    poster_url = models.URLField(blank=True)
    genre = models.CharField(max_length=255, blank=True)
    director = models.CharField(max_length=255, blank=True)
    actors = models.TextField(blank=True)
    runtime = models.CharField(max_length=20, blank=True)
    imdb_rating = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.year})"

    class Meta:
        ordering = ['-created_at']


class UserFavorite(models.Model):
    """Model for storing user's favorite movies"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


class MovieReview(models.Model):
    """Model for storing user reviews of movies"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'movie')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.movie.title} ({self.rating}/5)"
