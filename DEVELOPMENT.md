# Movie App - Software Engineering Project

## Project Overview
A movie application that allows users to search for movies, view details, save favorites, and write reviews using the OMDB API.

## Tech Stack

### Frontend
- React 18 + Tailwind CSS
- React Router for navigation
- Axios for API calls

### Backend  
- Python + Django 4.2
- Django REST Framework
- PostgreSQL database

### External APIs
- [OMDB API](https://www.omdbapi.com) for movie data
- SendGrid for email notifications

## Quick Start

## Prerequisites
- Node.js 16+ and npm - Download from [nodejs.org](https://nodejs.org/)
- Python 3.8+ - Download from [python.org](https://python.org/)
- PostgreSQL 12+ - Download from [postgresql.org](https://postgresql.org/)
- Git - Download from [git-scm.com](https://git-scm.com/)

## Setup

### Manual Setup (Step-by-step instructions)

#### Install Prerequisites First:
1. Install Node.js:
   - Go to https://nodejs.org/
   - Download LTS version for Windows
   - Run installer and restart command prompt
   - Verify: `node --version` and `npm --version`

2. Install Python:
   - Go to https://python.org/
   - Download Python 3.8+ for Windows
   - Important: Check "Add Python to PATH" during installation
   - Verify: `python --version`

#### Frontend Setup
cmd
cd Frontend
npm install
npm start


#### Backend Setup (System-wide Installation)
cmd
cd Backend
pip install -r requirements.txt
copy .env.example .env
rem Edit .env with your API keys
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

## Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

## Team Members
- Kristian Pitshugin - kp39596@uga.edu
- Joshua Grafmiller - jdg66796@uga.edu  
- Ryan Meyer - rpm04447@uga.edu
- Will Varner - wjv41345@uga.edu
- Jordan Delp - jad18215@uga.edu

## API Endpoints

### Movies
- `GET /api/movies/` - List all movies
- `GET /api/movies/{imdb_id}/` - Get movie details
- `GET /api/movies/search/{query}/` - Search movies

### Favorites
- `GET /api/favorites/` - List user favorites
- `POST /api/favorites/{imdb_id}/` - Toggle favorite

### Reviews
- `GET /api/reviews/` - List all reviews
- `GET /api/reviews/{imdb_id}/` - Get movie reviews
- `POST /api/reviews/` - Create review

## Environment Variables

Create `.env` file in Backend directory:

DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_NAME=movie_app_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-postgres-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
OMDB_API_KEY=your-omdb-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=your-email@example.com


## Project Structure

Software-Engineering/
├── Frontend/          # React application
├── Backend/           # Django API server
├── Database/          # Database documentation and seeds
├── DEVELOPMENT.md     # Development guide
└── INSTALL_GUIDE.md   # Installation guide