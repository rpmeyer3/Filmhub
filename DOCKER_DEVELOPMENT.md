# Docker Development Setup

This guide will help you set up the Movie Booking application using Docker with Supabase as your database.

## Prerequisites

1. **Docker & Docker Compose** installed on your system
2. **Supabase project** set up with your database
3. **Environment variables** configured

## Quick Start

1. **Configure your environment:**
   ```bash
   cp Backend/.env.example Backend/.env
   ```
   
   Edit `Backend/.env` with your Supabase credentials:
   ```env
   DATABASE_HOST=your-project.supabase.co
   DATABASE_PASSWORD=your-supabase-db-password
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   ```

2. **Run the setup script:**
   ```bash
   ./docker-setup.sh
   ```

   Or manually:
   ```bash
   docker-compose up --build
   ```

## Services

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (Django)**: http://localhost:8000

## Development Workflow

### View Logs
```bash
docker-compose logs -f
```

### Restart Services
```bash
docker-compose restart
```

### Stop Services
```bash
docker-compose down
```

### Rebuild After Changes
```bash
docker-compose up --build
```

### Access Container Shell
```bash
# Backend
docker exec -it movie_booking_backend bash

# Frontend  
docker exec -it movie_booking_frontend bash
```

## Database Management

Since you're using Supabase:
- **Migrations**: Run from within the backend container or locally
- **Admin Panel**: Access via Supabase dashboard
- **Database Shell**: Use Supabase SQL editor

### Run Django Commands
```bash
# Run migrations
docker exec -it movie_booking_backend python manage.py migrate

# Create superuser
docker exec -it movie_booking_backend python manage.py createsuperuser

# Collect static files
docker exec -it movie_booking_backend python manage.py collectstatic
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 8000 aren't in use
2. **Environment variables**: Double-check your Supabase credentials
3. **Database connection**: Verify your Supabase database is accessible

### Useful Commands

```bash
# Check container status
docker-compose ps

# View detailed logs for a specific service
docker-compose logs backend
docker-compose logs frontend

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Remove all containers and volumes
docker-compose down -v
```

## Production Notes

For production deployment:
1. Set `DEBUG=False` in environment variables
2. Configure proper `ALLOWED_HOSTS`
3. Use production-grade web server (nginx + gunicorn)
4. Set up proper SSL certificates
5. Configure Supabase for production access