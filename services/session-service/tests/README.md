# Tests

## Manual Testing Completed

All endpoints have been manually tested and verified working:

- Health check: PASS
- Create session: PASS  
- Get session: PASS
- List sessions: PASS
- Update session: PASS
- Database integration: PASS

## Future Work

Automated tests to be added once httpx/starlette compatibility is resolved.

## Manual Test Commands
```bash
# Health
curl http://localhost:8001/health

# Create
curl -X POST http://localhost:8001/sessions \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "language": "python", "code": "print(\"test\")"}'

# Get
curl http://localhost:8001/sessions/{id}

# List
curl http://localhost:8001/sessions

# Update
curl -X PATCH http://localhost:8001/sessions/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated"}'
```
