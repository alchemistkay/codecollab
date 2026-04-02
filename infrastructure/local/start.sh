#!/bin/bash

echo "Starting CodeCollab..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    exit 1
fi

# Check if PostgreSQL network exists
if ! docker network inspect postgres_postgres-network > /dev/null 2>&1; then
    echo "Error: postgres_postgres-network not found"
    echo "Please ensure PostgreSQL is running"
    exit 1
fi

# Check if PostgreSQL is running
if ! docker ps | grep -q postgres; then
    echo "Error: PostgreSQL container is not running"
    exit 1
fi

# Build and start services
echo "Building and starting services..."
docker-compose up --build -d

echo ""
echo "Waiting for services to be healthy..."
sleep 15

# Check health
echo ""
echo "Service Status:"
docker-compose ps

echo ""
echo "Health Checks:"
curl -s http://localhost:8001/health | grep -q healthy && echo "✓ Session Service: Healthy" || echo "✗ Session Service: Unhealthy"
curl -s http://localhost:8002/health | grep -q healthy && echo "✓ Execution Service: Healthy" || echo "✗ Execution Service: Unhealthy"
curl -s http://localhost:8003/health | grep -q healthy && echo "✓ Collaboration Service: Healthy" || echo "✗ Collaboration Service: Unhealthy"

echo ""
echo "CodeCollab is running!"
echo ""
echo "Access the application:"
echo "  Frontend:            http://localhost:8080"
echo "  Session API:         http://localhost:8001"
echo "  Execution API:       http://localhost:8002"
echo "  Collaboration WS:    ws://localhost:8003"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
