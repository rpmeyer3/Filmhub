@echo off
REM Setup script for Windows

echo Setting up Movie App development environment...

REM Frontend setup
echo Setting up Frontend (React + Tailwind)...
cd Frontend
where npm >nul 2>nul
if %ERRORLEVEL% == 0 (
    npm install
    echo Frontend dependencies installed successfully!
) else (
    echo npm not found. Please install Node.js and npm first.
)

REM Backend setup
echo Setting up Backend (Python + Django)...
cd ..\Backend

REM Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% == 0 (
    REM Create virtual environment
    python -m venv venv
    
    REM Activate virtual environment (Windows)
    call venv\Scripts\activate.bat
    
    REM Install dependencies
    pip install -r requirements.txt
    
    REM Copy environment file
    copy .env.example .env
    
    echo Backend virtual environment created and dependencies installed!
    echo Don't forget to:
    echo 1. Edit .env file with your API keys
    echo 2. Run 'python manage.py migrate' to set up the database
    echo 3. Run 'python manage.py createsuperuser' to create an admin user
    
) else (
    echo Python not found. Please install Python 3.8+ first.
)

echo Setup complete! Check individual README files for detailed instructions.
pause
