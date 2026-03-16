# Collaboration Service

Real-time code synchronization service for CodeCollab platform using WebSockets.

## Responsibilities

- Manage WebSocket connections for real-time collaboration
- Synchronize code changes between users in same session
- Track active users per session
- Broadcast cursor positions
- Manage session state

## Features

- Real-time code synchronization
- Multi-user session support
- User presence tracking
- Language switching
- In-memory session storage

## API Endpoints

### GET /health

Health check endpoint.

Response:
```json
{
  "status": "healthy",
  "service": "collaboration-service",
  "version": "1.0.0"
}
```

### GET /sessions

List all active sessions.

Response:
```json
{
  "sessions": [
    {
      "id": "abc123",
      "userCount": 2,
      "language": "python",
      "createdAt": "2026-03-16T15:00:00Z"
    }
  ]
}
```

### GET /sessions/:sessionId

Get session information.

Response:
```json
{
  "id": "abc123",
  "userCount": 2,
  "language": "python",
  "codeLength": 245,
  "createdAt": "2026-03-16T15:00:00Z"
}
```

## WebSocket Protocol

### Connection
```
ws://localhost:8003?session=SESSION_ID&user=USER_ID
```

### Messages

#### Client to Server

**Code Change**
```json
{
  "type": "code_change",
  "code": "print('hello')"
}
```

**Cursor Position**
```json
{
  "type": "cursor_position",
  "position": { "line": 5, "column": 10 }
}
```

**Language Change**
```json
{
  "type": "language_change",
  "language": "javascript"
}
```

#### Server to Client

**Initial State**
```json
{
  "type": "init",
  "sessionId": "abc123",
  "userId": "user_xyz",
  "code": "",
  "language": "python"
}
```

**Code Update**
```json
{
  "type": "code_update",
  "code": "print('hello')",
  "userId": "user_xyz"
}
```

**User List**
```json
{
  "type": "user_list",
  "users": [
    { "id": "user_xyz" },
    { "id": "user_abc" }
  ]
}
```

**Cursor Update**
```json
{
  "type": "cursor_update",
  "position": { "line": 5, "column": 10 },
  "userId": "user_xyz"
}
```

**Language Update**
```json
{
  "type": "language_update",
  "language": "javascript",
  "userId": "user_xyz"
}
```

## Running Locally
```bash
# Install dependencies
npm install

# Run
npm start

# Development mode (auto-reload)
npm run dev
```

Service runs on port 8003 by default.

## Technology

- Node.js 18+
- Express.js
- WebSocket (ws library)
- In-memory session storage

## Future Enhancements

- Persistent session storage (Redis)
- Operational Transform for conflict resolution
- Session expiration
- Authentication
