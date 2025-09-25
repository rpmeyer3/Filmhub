from django.urls import path
from . import views
from .health import HealthCheckView
from .supabase_views import SupabaseMoviesView, SupabaseMovieDetailView, SupabaseStatsView

urlpatterns = [

    # Health check
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # Supabase Movie endpoints with full relationships
    path('movies/', SupabaseMoviesView.as_view(), name='supabase-movies'),  # All movies with relationships
    path('movies/<int:movie_id>/', SupabaseMovieDetailView.as_view(), name='supabase-movie-detail'),  # Single movie detail
    path('stats/', SupabaseStatsView.as_view(), name='supabase-stats'),  # Database statistics
    
    # Original Django model endpoints
    path('movies/django/', views.MovieListView.as_view(), name='movie-list'),  # Original Django models
    path('movies/django/<str:imdb_id>/', views.MovieDetailView.as_view(), name='movie-detail'),
    path('movies/search/<str:query>/', views.MovieSearchView.as_view(), name='movie-search'),
    
    # User favorites
    path('favorites/', views.UserFavoritesView.as_view(), name='user-favorites'),
    path('favorites/<str:imdb_id>/', views.ToggleFavoriteView.as_view(), name='toggle-favorite'),
    
    # Reviews
    path('reviews/', views.ReviewListView.as_view(), name='review-list'),
    path('reviews/<str:imdb_id>/', views.MovieReviewsView.as_view(), name='movie-reviews'),
]
