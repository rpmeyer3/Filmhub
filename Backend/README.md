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
- **SQLite** - Database (development)

## External APIs
- **OMDB API** - Movie data
- **SendGrid** - Email service

## Getting Started

1. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy environment variables:
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and add your API keys.

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`
