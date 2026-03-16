# Execution Service

Executes code in isolated Docker containers for CodeCollab platform.

## Responsibilities

- Execute code in sandboxed containers
- Support multiple programming languages
- Resource limits (CPU: 1 core, Memory: 128MB)
- Timeout enforcement (30 seconds)
- Network isolation for security

## Supported Languages

- Python 3.11
- JavaScript (Node.js 18)

## API Endpoints

### GET /health

Health check endpoint.

Response:
```json
{
  "status": "healthy",
  "service": "execution-service",
  "version": "1.0.0"
}
```

### POST /execute

Execute code in isolated container.

Request:
```json
{
  "session_id": "abc123",
  "language": "python",
  "code": "print('Hello World')"
}
```

Response:
```json
{
  "session_id": "abc123",
  "status": "completed",
  "output": "Hello World\n",
  "error": "",
  "exit_code": 0,
  "executed_at": "2026-03-16T15:00:00Z",
  "duration_ms": 1234
}
```

## Running Locally
```bash
# Build
go build -o execution-service cmd/server/main.go

# Run
./execution-service
```

Service runs on port 8002 by default.

## Docker Requirements

Requires Docker daemon access to spawn execution containers.

## Security Features

- No network access in execution containers
- Resource limits enforced
- 30-second execution timeout
- Containers automatically removed after execution
- Read-only filesystem in containers

## Technology

- Go 1.21
- Gin web framework
- Docker CLI integration
