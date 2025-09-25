@echo off
REM Cinema E-Booking System Development Startup Script
REM This batch file starts both Django backend and Next.js frontend

echo Starting Cinema E-Booking System Development Environment...
echo ==========================================================

REM Get current directory
set PROJECT_ROOT=%~dp0
set BACKEND_PATH=%PROJECT_ROOT%Backend
set FRONTEND_PATH=%PROJECT_ROOT%Frontend

REM Check if directories exist
if not exist "%BACKEND_PATH%" (
    echo ERROR: Backend directory not found at: %BACKEND_PATH%
    pause
    exit /b 1
)

if not exist "%FRONTEND_PATH%" (
    echo ERROR: Frontend directory not found at: %FRONTEND_PATH%
    pause
    exit /b 1
)

echo Launching Django Backend Server...
REM Start Django backend in new command window
start "Django Backend - Cinema E-Booking" cmd /k "cd /d %BACKEND_PATH% && echo Django Backend Starting... && echo Backend URL: http://127.0.0.1:8000/ && echo Admin URL: http://127.0.0.1:8000/admin/ && echo API URL: http://127.0.0.1:8000/api/ && echo ================================ && python manage.py runserver"

REM Wait for backend to start
timeout /t 3 /nobreak > nul

echo Launching Next.js Frontend...
REM Start Next.js frontend in new command window  
start "Next.js Frontend - Cinema E-Booking" cmd /k "cd /d %FRONTEND_PATH% && echo Next.js Frontend Starting... && echo Frontend URL: http://localhost:3000/ && echo ================================ && npm run dev"

echo.
echo Development environment started!
echo.
echo Your applications are now running:
echo    Frontend: http://localhost:3000
echo    Backend:  http://127.0.0.1:8000  
echo    Admin:    http://127.0.0.1:8000/admin
echo.
echo TIP: Close the terminal windows to stop the servers
echo TIP: Press any key to exit this launcher...

pause > nul