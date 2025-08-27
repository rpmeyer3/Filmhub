#!/bin/bash
# Setup script for the entire project

echo "Setting up Movie App development environment..."

# Frontend setup
echo "Setting up Frontend (React + Tailwind)..."
cd Frontend
if command -v npm &> /dev/null; then
    npm install
    echo "Frontend dependencies installed successfully!"
else
    echo "npm not found. Please install Node.js and npm first."
fi

# Backend setup
echo "Setting up Backend (Python + Django)..."
cd ../Backend

# Check if Python is available
if command -v python &> /dev/null; then
    # Create virtual environment
    python -m venv venv
    
    # Activate virtual environment (Linux/Mac)
    source venv/bin/activate
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Copy environment file
    cp .env.example .env
    
    echo "Backend virtual environment created and dependencies installed!"
    echo "Don't forget to:"
    echo "1. Edit .env file with your API keys"
    echo "2. Run 'python manage.py migrate' to set up the database"
    echo "3. Run 'python manage.py createsuperuser' to create an admin user"
    
else
    echo "Python not found. Please install Python 3.8+ first."
fi

echo "Setup complete! Check individual README files for detailed instructions."
