#!/bin/bash

echo "Stopping CodeCollab..."
docker-compose down

echo ""
echo "CodeCollab stopped."
echo ""
echo "To remove volumes: docker-compose down -v"
