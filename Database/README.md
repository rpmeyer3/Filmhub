# Database

This directory contains database-related documentation and seed data for the SQLite database.

## Structure

```
Database/
├── seeds/
│   └── sample_data.sql
├── schema.sql (documentation)
└── README.md
```

## Database Technology
- PostgreSQL - Production-grade relational database
- Django ORM - Object-relational mapping

## Database Schema

The database schema is managed by Django migrations. Key models include:

- Movie - Stores movie information from OMDB API
- UserFavorite - User's favorite movies
- MovieReview - User reviews and ratings

## Setup Instructions

The database is set up when you run Django migrations with PostgreSQL:

```bash
cd Backend
python manage.py migrate
```

To load sample data:
```bash
python manage.py shell
# Then manually create sample data or use fixtures
```

## PostgreSQL Configuration

Make sure you have PostgreSQL installed and running:
1. Install PostgreSQL from https://postgresql.org/download/
2. Create a database for the project
3. Update your `.env` file with database credentials

## Database File Location

PostgreSQL data is stored in the PostgreSQL server installation directory. 
Database connection details are configured in the Django settings.
