# Session Service

Manages coding session lifecycle for CodeCollab platform.

## Responsibilities

- Create and manage coding sessions
- Store session metadata
- Track session state
- Provide session lookup

## API Endpoints

### POST /sessions
Create a new session

### GET /sessions/{id}
Get session details

### GET /sessions
List all sessions

### PATCH /sessions/{id}
Update session

### DELETE /sessions/{id}
Soft delete session

## Database Schema
```sql
CREATE TABLE sessions (
    id VARCHAR(12) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    code TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

## Running Locally
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://user:pass@localhost/codecollab

# Run service
python main.py
```

## Running Tests
```bash
pytest tests/ -v
```

## Docker
```bash
docker build -t session-service .
docker run -p 8001:8001 session-service
```
