from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField


class Movie(models.Model):
    """Model for storing movie information from OMDB API"""
    id = models.AutoField(primary_key= True)
    title = models.TextField(db_column= 'Title')
    synopsis = models.TextField(db_column= 'Synopsis')
    reviews = models.TextField(blank=True, null=True, db_column= 'Reviews')
    trailer_url = models.URLField(blank=True, null=True, db_column='TrailerURL')
    trailer_pic_url = models.URLField(blank=True, null=True, db_column='TrailerPicLink')
    mpaa_rating = models.CharField(blank=True, null=True, max_length=10, db_column='MPAA_US_FILM_RATING')
    is_running = models.BooleanField(default=False, db_column='isRunning')
    is_coming_soon = models.BooleanField(default=False, db_column='isComingSoon')
    director = models.TextField(blank=True, null=True, db_column='Director')
    producer = models.TextField(blank=True, null=True, db_column='Producer')
    cast = models.TextField(blank=True, null=True, db_column='Cast')
    category = ArrayField(models.TextField(), blank=True, null=True, db_column='Category')
    poster_url = models.URLField(blank=True, null=True, db_column='Poster_img_URL')


"""
Can implement ordering and __str__ later if needed

    def __str__(self):
        return f"{self.title} ({self.year})"

    class Meta:
        ordering = ['-created_at']
"""


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
