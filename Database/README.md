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
- **SQLite** - Lightweight database for development
- **Django ORM** - Object-relational mapping

## Database Schema

The database schema is managed by Django migrations. Key models include:

- **Movie** - Stores movie information from OMDB API
- **UserFavorite** - User's favorite movies
- **MovieReview** - User reviews and ratings

## Setup Instructions

The database is automatically set up when you run Django migrations:

```bash
cd Backend
python manage.py migrate
```

To load sample data:
```bash
python manage.py shell
# Then manually create sample data or use fixtures
```

## Database File Location

The SQLite database file (`db.sqlite3`) will be created in the Backend directory when you run migrations.
