from django.urls import path
from . import views
from .health import HealthCheckView

urlpatterns = [

    # Health check
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # Movie endpoints
    path('movies/', views.MovieListView.as_view(), name='movie-list'),
    path('movies/<str:imdb_id>/', views.MovieDetailView.as_view(), name='movie-detail'),
    path('movies/search/<str:query>/', views.MovieSearchView.as_view(), name='movie-search'),
    
    # User favorites
    path('favorites/', views.UserFavoritesView.as_view(), name='user-favorites'),
    path('favorites/<str:imdb_id>/', views.ToggleFavoriteView.as_view(), name='toggle-favorite'),
    
    # Reviews
    path('reviews/', views.ReviewListView.as_view(), name='review-list'),
    path('reviews/<str:imdb_id>/', views.MovieReviewsView.as_view(), name='movie-reviews'),
]
