# CodeCollab - Docker Compose

Complete Docker Compose setup for CodeCollab platform.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Existing PostgreSQL container on `postgres_postgres-network`

## Database Setup

Before starting, create the codecollab database:
```bash
docker exec -it postgres psql -U postgres
```
```sql
CREATE DATABASE codecollab;
CREATE USER codecollab WITH PASSWORD '<your_password>';
GRANT ALL PRIVILEGES ON DATABASE codecollab TO codecollab;
\c codecollab
GRANT ALL ON SCHEMA public TO codecollab;
\q
```

## Quick Start
```bash
# Start all services
./start.sh

# Access application
open http://localhost:8080
```

## Services

- **Frontend**: http://localhost:8080
- **Session Service**: http://localhost:8001
- **Execution Service**: http://localhost:8002
- **Collaboration Service**: http://localhost:8003
- **PostgreSQL**: Existing container (shared)

## Networks

- `codecollab-network`: Internal network for services
- `postgres_postgres-network`: External network (shared with existing PostgreSQL)

## Architecture
```
Frontend (Nginx) :8080
    ↓
    ├─→ Session Service :8001 → PostgreSQL (existing)
    ├─→ Execution Service :8002 → Docker
    └─→ Collaboration Service :8003
```

## Manual Commands

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f session-service
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Services
```bash
docker-compose up --build -d
```

## Environment Variables

Edit `.env`:
```
POSTGRES_PASSWORD=<your_password>
```

## Development

For development with hot-reload, run services individually outside Docker.

## Troubleshooting

### PostgreSQL connection issues

Verify database exists:
```bash
docker exec -it postgres psql -U postgres -c "\l" | grep codecollab
```

### Port conflicts

Default ports:
- 8080 (frontend)
- 8001 (session service)
- 8002 (execution service)
- 8003 (collaboration service)

Change in `docker-compose.yml` if needed.
