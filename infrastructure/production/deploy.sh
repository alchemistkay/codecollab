#!/bin/bash

set -e

echo "Deploying CodeCollab to production..."
echo ""

# Check prerequisites
if ! docker network inspect traefik-network > /dev/null 2>&1; then
    echo "Error: traefik-network not found"
    exit 1
fi

if ! docker network inspect postgres_postgres-network > /dev/null 2>&1; then
    echo "Error: postgres_postgres-network not found"
    exit 1
fi

# Build and deploy
echo "Building images..."
docker-compose build

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to start..."
sleep 15

# Check status
echo ""
echo "Service Status:"
docker-compose ps

echo ""
echo "CodeCollab deployed!"
echo ""
echo "Access at: https://codecollab.k4scloud.com"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop: docker-compose down"
