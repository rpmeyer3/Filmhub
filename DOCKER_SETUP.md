# Docker Database Setup Guide

## 🐳 Database Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Backend environment configured

### Quick Setup Steps

1. **Start Database with Docker:**
   ```bash
   docker-compose up -d db
   ```

2. **Verify Database is Running:**
   ```bash
   docker ps
   # Should show movie_booking_db container running on port 5432
   ```

3. **Run Django Migrations:**
   ```bash
   cd Backend
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Populate Database with Sample Data:**
   ```bash
   python manage.py populate_movies
   ```

5. **Start Django Backend:**
   ```bash
   python manage.py runserver
   ```

6. **Start Frontend:**
   ```bash
   cd ../Frontend
   npm run dev
   ```

### Docker Configuration

The `docker-compose.yml` is configured with:
- **Database**: PostgreSQL 15 on port 5432
- **Database Name**: movie_booking
- **Username**: will
- **Password**: your_secure_password
- **Backend**: Django on port 8000
- **Frontend**: Next.js on port 3000

### Database Connection Verification

To verify the database connection:

```bash
# Test Django database connection
cd Backend
python manage.py dbshell
```

Or check Django admin:
```bash
python manage.py createsuperuser
# Then visit http://localhost:8000/admin
```

### Sample Data

The `populate_movies` command adds 8 popular movies including:
- The Matrix (1999)
- Inception (2010)
- The Dark Knight (2008)
- Interstellar (2014)
- Avengers: Endgame (2019)
- Spider-Man: No Way Home (2021)
- Dune: Part Two (2024)
- Oppenheimer (2023)

Each movie includes:
- Title, Year, IMDB ID
- Plot description
- Poster URL
- Genre, Director, Actors
- Runtime, IMDB Rating

### Troubleshooting

**If database connection fails:**
1. Ensure Docker container is running: `docker ps`
2. Check container logs: `docker logs movie_booking_db`
3. Verify environment variables in `Backend/.env`

**If frontend can't connect to backend:**
1. Verify Django is running on port 8000
2. Check CORS settings in Django settings
3. Ensure `NEXT_PUBLIC_API_URL=http://localhost:8000/api` in Frontend/.env.local

### API Endpoints for Frontend

The frontend connects to these Django endpoints:
- `GET /api/movies/` - List all movies
- `GET /api/movies/{imdb_id}/` - Get movie details  
- `GET /api/movies/search/{query}/` - Search movies by title

### Database Schema

Movies table includes:
- title (CharField)
- year (CharField) 
- imdb_id (CharField, unique)
- plot (TextField)
- poster_url (URLField)
- genre (CharField)
- director (CharField)
- actors (TextField)
- runtime (CharField)
- imdb_rating (CharField)
- created_at/updated_at timestamps