# CodeCollab

Real-Time Collaborative Code Execution Platform

![CodeCollab](https://img.shields.io/badge/status-production-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

CodeCollab is a microservices-based platform that enables multiple developers to write, collaborate, and execute code in real-time. Built with modern cloud-native technologies and deployed with Docker and Kubernetes.

**Live Demo:** https://codecollab.k4scloud.com

## Features

- **Real-time Collaboration** - Multiple users can code together simultaneously
- **Code Execution** - Run Python and JavaScript code in isolated containers
- **Session Sharing** - Share coding sessions via URL
- **Monaco Editor** - VS Code editor in the browser
- **WebSocket** - Persistent connections with automatic reconnection
- **Microservices** - Independent, scalable services
- **Containerized** - Full Docker deployment
- **SSL/HTTPS** - Secure connections with automatic certificates

## Architecture

### Microservices

- **Session Service** (Python/FastAPI) - Manages coding sessions
- **Execution Service** (Go) - Executes code in sandboxed containers
- **Collaboration Service** (Node.js) - Real-time WebSocket synchronization
- **Frontend** (React) - Modern web interface with Monaco Editor

### Infrastructure

- Docker & Docker Compose
- PostgreSQL (database)
- Traefik (reverse proxy with SSL)
- WebSocket for real-time communication

## Technology Stack

**Backend:**
- Python 3.11 (FastAPI, SQLAlchemy)
- Go 1.21 (Gin framework)
- Node.js 20 (Express, WebSocket)

**Frontend:**
- React 18
- Vite
- Monaco Editor
- Axios

**Infrastructure:**
- Docker
- Docker Compose
- PostgreSQL 17
- Traefik
- Let's Encrypt SSL

**DevOps:**
- GitHub Actions (CI/CD)
- GitHub Container Registry
- Automated deployment

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Local Development
```bash
# Clone repository
git clone https://github.com/alchemistkay/codecollab.git
cd codecollab

# Start all services
cd infrastructure/docker-compose
./start.sh

# Access application
open http://localhost:8080
```

### Production Deployment
```bash
# Deploy to production
cd infrastructure/production
./deploy.sh

# Access at https://codecollab.k4scloud.com
```

## Usage

1. **Create Session** - Visit the URL, session created automatically
2. **Share Link** - Click "Share Link" to collaborate with others
3. **Write Code** - Use Monaco editor to write Python or JavaScript
4. **Execute** - Click "Run Code" to see output
5. **Collaborate** - Multiple users can edit simultaneously

## API Documentation

### Session Service (Port 8001)

- `POST /sessions` - Create session
- `GET /sessions/{id}` - Get session
- `GET /sessions` - List sessions
- `PATCH /sessions/{id}` - Update session

### Execution Service (Port 8002)

- `POST /execute` - Execute code
- `GET /health` - Health check

### Collaboration Service (Port 8003)

- WebSocket: `ws://host?session=ID&user=ID`
- Messages: code_change, cursor_position, language_change

## Development

### Project Structure
```
codecollab/
├── services/
│   ├── session-service/       # Python/FastAPI
│   ├── execution-service/     # Go
│   └── collaboration-service/ # Node.js
├── frontend/                   # React
└── infrastructure/
    ├── docker-compose/        # Local development
    └── production/            # Production deployment
```

### Running Services Individually
```bash
# Session Service
cd services/session-service
source venv/bin/activate
python main.py

# Execution Service
cd services/execution-service
./execution-service

# Collaboration Service
cd services/collaboration-service
npm start

# Frontend
cd frontend
npm run dev
```

## Security

- Code execution in isolated Docker containers
- No network access in execution containers
- Resource limits (128MB RAM, 1 CPU, 30s timeout)
- Read-only filesystem
- HTTPS with automatic SSL certificates
- CORS configuration
- Input validation

## Performance

- Sub-2 second code execution
- Real-time collaboration (WebSocket)
- Persistent connections with keepalive
- Automatic reconnection
- Container pooling

## Contributing

This is a portfolio/learning project. Feel free to fork and explore!

## License

MIT License - see LICENSE file

## Author

**Kay Alchemist**
- GitHub: [@alchemistkay](https://github.com/alchemistkay)
- LinkedIn: [Your LinkedIn]

## Acknowledgments

Built as a comprehensive learning project demonstrating:
- Microservices architecture
- Real-time WebSocket communication
- Container orchestration
- Cloud-native deployment
- DevOps best practices

---

**Live Demo:** https://codecollab.k4scloud.com
