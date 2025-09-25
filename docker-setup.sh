#!/bin/bash

echo "🚀 Setting up Docker containers for Movie Booking App with Supabase..."

# Check if .env file exists
if [ ! -f "./Backend/.env" ]; then
    echo "⚠️  No .env file found. Please copy .env.example to .env and configure your Supabase credentials:"
    echo "   cp Backend/.env.example Backend/.env"
    echo "   # Then edit Backend/.env with your Supabase database credentials"
    exit 1
fi

# Build and start containers
echo "🔨 Building Docker containers..."
docker-compose build

echo "🏃 Starting containers..."
docker-compose up -d

echo "✅ Containers started!"
echo ""
echo "📍 Your services are running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop containers:"
echo "   docker-compose down"