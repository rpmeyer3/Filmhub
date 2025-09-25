# Cinema E-Booking System - Development Setup

## Quick Start (Automated)

### Option 1: One Command Startup (Recommended)
```bash
cd Frontend
npm run dev:full
```
This will automatically start both:
- Django Backend on `http://127.0.0.1:8000`
- Next.js Frontend on `http://localhost:3000`

### Option 2: Windows Startup Scripts
```bash
# Double-click or run from command line:
start-dev.bat        # Batch file (opens separate windows)
.\start-dev.ps1      # PowerShell script (opens separate windows)
```

## Manual Startup (Traditional)

If you prefer to run servers separately:

### Terminal 1 - Backend
```bash
cd Backend
python manage.py runserver
```

### Terminal 2 - Frontend  
```bash
cd Frontend
npm run dev
```

## Your Applications

After starting the development environment, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000/api/
- **Django Admin**: http://127.0.0.1:8000/admin/
- **Health Check**: http://127.0.0.1:8000/api/health/

## Available Scripts

### Frontend (in Frontend/ directory)
- `npm run dev` - Start Next.js frontend only
- `npm run dev:full` - **Start both backend and frontend** (RECOMMENDED)
- `npm run backend` - Start Django backend only
- `npm run build` - Build for production
- `npm run start` - Start production build

### Backend (in Backend/ directory)
- `python manage.py runserver` - Start Django development server
- `python manage.py migrate` - Apply database migrations
- `python manage.py createsuperuser` - Create admin user
- `python check_db.py` - Test database connection
- `python show_data.py` - Show all database content

## Tips

- Use `npm run dev:full` for the best development experience
- Both servers support hot reload
- Press `Ctrl+C` to stop the servers
- Backend runs on port 8000, Frontend on port 3000
- Database (Supabase) is always available in the cloud

## Troubleshooting

If you see connection errors:
1. Make sure both servers are running
2. Check that ports 3000 and 8000 are available
3. Verify your `.env` file in the Backend directory
4. Run `python check_db.py` to test database connection