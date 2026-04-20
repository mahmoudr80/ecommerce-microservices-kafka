#!/bin/bash
# Quick setup and run script for Hotel Booking Microservices

echo "======================================"
echo "Hotel Booking Microservices - Quick Setup"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update if needed."
else
    echo "✅ .env file exists"
fi

echo ""
echo "🚀 Starting services with Docker Compose..."
echo ""

docker-compose up --build

echo ""
echo "======================================"
echo "All services are running!"
echo "======================================"
echo ""
echo "Available services:"
echo "  - API Gateway: http://localhost:3000"
echo "  - User Service: http://localhost:3001"
echo "  - Hotel Service: http://localhost:3002"
echo "  - Room Service: http://localhost:3003"
echo "  - Booking Service: http://localhost:3004"
echo "  - Payment Service: http://localhost:3005"
echo "  - Notification Service: http://localhost:3006"
echo "  - Review Service: http://localhost:3007"
echo ""
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Kafka: localhost:9092"
echo "  - Zookeeper: localhost:2181"
echo ""
echo "To stop services, press Ctrl+C or run: docker-compose down"
echo ""
