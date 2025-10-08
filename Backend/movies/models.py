from django.db import models # Base for defining models
from django.contrib.auth.models import AbstractUser # base for customUser
from django.contrib.postgres.fields import ArrayField # Used in list of movie categories
from django.contrib.auth.models import User
from django.conf import settings # used for AUTH_USER_PROFILE
import uuid


class Movie(models.Model):
    id = models.AutoField(primary_key= True)
    title = models.TextField(db_column= 'Title')
    year = models.CharField(max_length=4, blank=True, null=True, db_column='Year')
    synopsis = models.TextField(blank=True, null=True, db_column= 'Synopsis')
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


class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie_id')

    def __str__(self):
        return f"{self.user.username} favorited movie {self.movie_id}"


# Model for storing user reviews of movies
class MovieReview(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
 


 # Models for cinemas, showrooms,showtimes, seats, booking, users
"""
# Model for Cinema

class Cinema(models.Model):
    name = models.CharField(max_length=50)
    location = models.IntegerField(max_length=5) # Zip Code 


    def get_show_rooms(self):
        return MovieShow.objects.filter(cinema=self)

    def get_now_showing(self):
        shows = MovieShow.objects.filter(cinema=self, is_now_showing = True)
        movies = [show.movie for show in shows]
        return movies
    
# Model for ShowRoom

class ShowRoom(models.Model):
    cinema = models.ForeignKey(Cinema, on_delete=models.CASCADE)
    capacity = models.IntegerField()
    room_number = models.IntegerField()


# Model for Seats

class Seat(models.Model):
    show = models.ForeignKey(MovieShow, on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)
    number = models.CharField(max_length=2) # row + number

    class Meta: 
        unique_together = ('show', 'index')
 
   
       
# Model for MovieShow

class MovieShow(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    cinema = models.ForeignKey(Cinema, on_delete=models.CASCADE)
    showtime = models.DateTimeField()
    is_now_showing = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    auditorium = models.IntegerField()


    class Meta:
        ordering = ['-created_at']
        db_table = 'showtime_table'

    # print method
    def __str__(self):
        return f"Show ID: {self.show_id} {self.movie} ({self.showtime})"

    # returns listt of seat objects that are available
    def get_available_seats(self):
        seats = Seat.objects.filter(show=self, is_available = True)
        return seats
    

        

# Model for Booking

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default= uuid.uuid4, editable=False)
    show = models.ForeignKey(MovieShow, on_delete=models.SET_NULL, null = True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=6, decimal_places=2)
    seats = models.ManyToManyField(Seat)
    booking_time = models.DateTimeField(auto_now_add=True)
    payment_card = models.ForeignKey(PaymentCard)

    class Meta:
        unique_together = ('user', 'id')
        db_table = 'booking'
    

    def reserve_seats(self, seat_list):

       # Reserve the given seats for this booking
     #  Updates availability and show is_full field
     
        # Update seat table
        for seat in seat_list:
            if not seat.is_available:
                raise ValueError(f"Seat {seat.number} is unavailable")
            seat.is_available = False
            seat.save()
        
        # Add seats to booking
        self.seats.add(*seat_list)

        # Check show is_full
        show = self.show
        if not show.seat_set.filter(is_available=True).exists():
            show.is_full = True
        else:
            show.is_full = False
        show.save()
    
    def return_seats(self, seat_list):
         # Update seat table
        for seat in seat_list:
            if not seat.is_available:
                raise ValueError(f"Seat {seat.number} is unavailable")
            seat.is_available = True
            seat.save()
    

# Customer Model builds off Django's User model to include payment cards and 

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    phone_number = models.CharField(max_length=15)
    address = models.

# Payment card Model  
class PaymentCard(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='cards')
    cardholder_name = models.CharField(max_length=100)
    card_number = models.CharField(max_length=16)
    expiration_date = models.DateField()
    last_four = models.CharField(max_length=4)
    brand = models.CharField(max_length=20)  # e.g., 'Visa', 'MasterCard'

    def __str__(self):
        return f"{self.brand} ending in {self.last_four}"


"""










