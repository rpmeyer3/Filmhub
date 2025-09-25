#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Starts both Django backend and Next.js frontend for Cinema E-Booking System
.DESCRIPTION
    This PowerShell script launches the Django development server and Next.js frontend
    concurrently in separate terminal windows for full-stack development.
#>

Write-Host "Starting Cinema E-Booking System Development Environment..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Get the current directory (should be project root)
$ProjectRoot = Get-Location

# Backend path
$BackendPath = Join-Path $ProjectRoot "Backend"
$FrontendPath = Join-Path $ProjectRoot "Frontend"

# Check if directories exist
if (-not (Test-Path $BackendPath)) {
    Write-Host "ERROR: Backend directory not found at: $BackendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FrontendPath)) {
    Write-Host "ERROR: Frontend directory not found at: $FrontendPath" -ForegroundColor Red
    exit 1
}

Write-Host "Checking Python environment..." -ForegroundColor Yellow
Set-Location $BackendPath

# Check if manage.py exists
if (-not (Test-Path "manage.py")) {
    Write-Host "ERROR: Django manage.py not found in Backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "Checking Node.js environment..." -ForegroundColor Yellow
Set-Location $FrontendPath

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found in Frontend directory" -ForegroundColor Red
    exit 1
}

# Return to project root
Set-Location $ProjectRoot

Write-Host "Launching Django Backend Server..." -ForegroundColor Green
# Start Django backend in new PowerShell window
$BackendScript = @"
Set-Location '$BackendPath'
Write-Host 'Django Backend Starting...' -ForegroundColor Green
Write-Host 'Backend URL: http://127.0.0.1:8000/' -ForegroundColor Cyan
Write-Host 'Admin URL: http://127.0.0.1:8000/admin/' -ForegroundColor Cyan
Write-Host 'API URL: http://127.0.0.1:8000/api/' -ForegroundColor Cyan
Write-Host '================================' -ForegroundColor Yellow
python manage.py runserver
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendScript

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host "Launching Next.js Frontend..." -ForegroundColor Green
# Start Next.js frontend in new PowerShell window
$FrontendScript = @"
Set-Location '$FrontendPath'
Write-Host 'Next.js Frontend Starting...' -ForegroundColor Green
Write-Host 'Frontend URL: http://localhost:3000/' -ForegroundColor Cyan
Write-Host '================================' -ForegroundColor Yellow
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendScript

Write-Host "Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "Your applications are now running:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host "   Admin:    http://127.0.0.1:8000/admin" -ForegroundColor White
Write-Host ""
Write-Host "TIP: Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Yellow
Write-Host "TIP: This script will exit now, but the servers will continue running" -ForegroundColor Yellow

# Wait a moment then exit
Start-Sleep -Seconds 2