from django.db import models # Base for defining models
from django.contrib.auth.models import AbstractUser # base for customUser
from django.contrib.postgres.fields import ArrayField # Used in list of movie categories
from django.contrib.auth.models import User
from django.conf import settings # used for AUTH_USER_PROFILE
import uuid


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
# Models for User favorites, reviews, 
class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    movie_id = models.IntegerField()  # ID from Supabase Movies table

    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie_id')

    def __str__(self):
        return f"{self.user.username} favorited movie {self.movie_id}"


# Model for storing user reviews of movies
class MovieReview(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'movie')
        ordering = ['-created_at']
        db_table = 'review_table'

    def __str__(self):
        return f"{self.user.username} - {self.movie.title} ({self.rating}/5)"

 # Models for showtimes, seats, booking, users  
"""
# Model for storing shows for specific movies

class MovieShow(models.Model):
    show_id = models.AutoField(primary_key=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    showtime = models.DateTimeField()
    is_available = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    auditorium = models.IntegerField()

    
    #theater = models.TextField() 

    class Meta:
        ordering = ['-created_at']
        db_table = 'showtime_table'
    
    def __str__(self):
        return f"Show ID: {self.show_id} {self.movie} ({self.showtime})"
# Model for Seats

class Seat(models.Model):
    show = models.ForeignKey(MovieShow, on_delete=models.CASCADE)
    index = models.IntegerField()
    is_available = models.BooleanField(default=True)
    seat_type = models.CharField(max_length=1, choices =[('A', 'Adult'), ('C', 'Child'), ('S', 'Senior')])
    row = models.CharField(max_length=2)
    number = models.IntegerField()

    class Meta: 
        unique_together = ('show', 'index')
        abstract = True

# Model for Booking

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default= uuid.uuid4, editable=False)
    show = models.ForeignKey(MovieShow, on_delete=models.SET_NULL, null = True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=6, decimal_places=2)
    seats = models.ManyToManyField(Seat)
    booking_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'id')
        db_table = 'booking_table'
    


# extension of Django's User class, added phone number and favorite movie fields 
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15)
    favorite_movie = models.CharField(max_length=200)

    
    def __str__(self):
        return f"{self.user.username}'s profile"
    
# Payment card Model  
class PaymentCard(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cardholder_name = models.CharField(max_length=100)
    card_number = models.CharField(max_length=16)
    expiration_date = models.DateField()
    last_four = models.CharField(max_length=4)
    brand = models.CharField(max_length=20)  # e.g., 'Visa', 'MasterCard'

    def __str__(self):
        return f"{self.brand} ending in {self.last_four}"


"""





