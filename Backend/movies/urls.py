from django.urls import path
from . import views
from .health import HealthCheckView
from .supabase_views import SupabaseMoviesView, SupabaseMovieDetailView, SupabaseStatsView

urlpatterns = [

    # Health check
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # Main movie endpoints - now using only Supabase Movies table
    path('movies/', views.MovieListView.as_view(), name='movie-list'),  # All movies from Supabase only
    path('movies/<int:movie_id>/', views.MovieDetailView.as_view(), name='movie-detail'),  # Single movie detail
    path('movies/search/<str:query>/', views.MovieSearchView.as_view(), name='movie-search'),  # Search in Supabase only
    
    # Alternative endpoints with full relationships (legacy)
    path('movies/detailed/', SupabaseMoviesView.as_view(), name='supabase-movies-detailed'),  # Movies with relationships
    path('movies/detailed/<int:movie_id>/', SupabaseMovieDetailView.as_view(), name='supabase-movie-detail-full'),  # Single movie with relationships
    path('stats/', SupabaseStatsView.as_view(), name='supabase-stats'),  # Database statistics
    
    # User favorites (currently disabled)
    path('favorites/', views.UserFavoritesView.as_view(), name='user-favorites'),
    path('favorites/<int:movie_id>/', views.ToggleFavoriteView.as_view(), name='toggle-favorite'),
    
    # Reviews (currently disabled)
    path('reviews/', views.ReviewListView.as_view(), name='review-list'),
    path('reviews/<int:movie_id>/', views.MovieReviewsView.as_view(), name='movie-reviews'),
]
