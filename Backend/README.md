# Backend

This directory contains the Django backend API server.

## Structure

```
Backend/
├── movie_project/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── movies/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── services.py
├── manage.py
└── requirements.txt
```

## Technologies
- **Python 3.8+** - Programming language
- **Django 4.2** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Database

## External APIs
- **OMDB API** - Movie data
- **SendGrid** - Email service

## Getting Started (No Virtual Environment)

1. **Install PostgreSQL:**
   - Download from https://postgresql.org/download/
   - Install and remember your postgres user password
   - Create a database called `movie_app_db`

2. **Navigate to the Backend directory:**
   ```cmd
   cd Backend
   ```

3. **Install dependencies system-wide:**
   ```cmd
   pip install -r requirements.txt
   ```

4. **Configure database:**
   ```cmd
   copy .env.example .env
   ```
   Edit `.env` and add your database credentials:
   - DATABASE_PASSWORD=your-postgres-password
   - Add your API keys

5. **Run migrations:**
   ```cmd
   python manage.py migrate
   ```

6. **Create a superuser:**
   ```cmd
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```cmd
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## PostgreSQL Setup
1. Install PostgreSQL from https://postgresql.org/
2. Create database: `CREATE DATABASE movie_app_db;`
3. Update `.env` with your PostgreSQL credentials

## Note
Virtual environments have been removed. All packages will be installed system-wide for simplicity.
