#!/bin/bash

# Bash script to start Cryptora with Docker

echo "🐳 Starting Cryptora with Docker"
echo "================================="
echo ""

# Check if Docker is running
echo "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi
echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
echo "Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not available!"
    exit 1
fi
COMPOSE_VERSION=$(docker-compose --version)
echo "✅ Docker Compose found: $COMPOSE_VERSION"
echo ""

# Menu
echo "What would you like to do?"
echo "1. Start all services (build if needed)"
echo "2. Start all services (force rebuild)"
echo "3. Stop all services"
echo "4. Stop and remove all data"
echo "5. View logs"
echo "6. Check status"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting services..."
        docker-compose up -d
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Services started successfully!"
            echo ""
            echo "Access your application:"
            echo "  🌐 Frontend:  http://localhost"
            echo "  🔌 Backend:   http://localhost:8000"
            echo "  📚 API Docs:  http://localhost:8000/docs"
            echo ""
            echo "View logs with: docker-compose logs -f"
        fi
        ;;
    2)
        echo ""
        echo "🔨 Rebuilding and starting services..."
        docker-compose up -d --build
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Services rebuilt and started!"
            echo ""
            echo "Access your application:"
            echo "  🌐 Frontend:  http://localhost"
            echo "  🔌 Backend:   http://localhost:8000"
            echo "  📚 API Docs:  http://localhost:8000/docs"
        fi
        ;;
    3)
        echo ""
        echo "🛑 Stopping services..."
        docker-compose down
        if [ $? -eq 0 ]; then
            echo "✅ Services stopped"
        fi
        ;;
    4)
        echo ""
        echo "⚠️  WARNING: This will delete all database data!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "🗑️  Stopping and removing all data..."
            docker-compose down -v
            if [ $? -eq 0 ]; then
                echo "✅ All services and data removed"
            fi
        else
            echo "Cancelled"
        fi
        ;;
    5)
        echo ""
        echo "📋 Showing logs (Ctrl+C to exit)..."
        echo ""
        docker-compose logs -f
        ;;
    6)
        echo ""
        echo "📊 Service Status:"
        echo ""
        docker-compose ps
        echo ""
        echo "Health Checks:"
        
        # Check backend
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            echo "  ✅ Backend: Healthy"
        else
            echo "  ❌ Backend: Not responding"
        fi
        
        # Check frontend
        if curl -s http://localhost/ > /dev/null 2>&1; then
            echo "  ✅ Frontend: Healthy"
        else
            echo "  ❌ Frontend: Not responding"
        fi
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo ""
