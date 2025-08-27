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
- SQLite database

### External APIs
- [OMDB API](https://www.omdbapi.com) for movie data
- SendGrid for email notifications

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Setup
1. Clone the repository
2. Run setup script:
   - Windows: `setup.bat`
   - Linux/Mac: `./setup.sh`

### Manual Setup

#### Frontend
```bash
cd Frontend
npm install
npm start
```

#### Backend
```bash
cd Backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
copy .env.example .env  # Edit with your API keys
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

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
```
DEBUG=True
SECRET_KEY=your-secret-key
OMDB_API_KEY=your-omdb-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=your-email@example.com
```

## Project Structure
```
Software-Engineering/
├── Frontend/          # React application
├── Backend/           # Django API server
├── Database/          # Database documentation and seeds
├── setup.bat         # Windows setup script
└── setup.sh          # Linux/Mac setup script
```
