# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

CodeCollab is a **microservices platform** with four independently deployable services and a React SPA frontend.

```
Frontend (React/Vite)
  ├── REST → Session Service   (FastAPI/Python, port 8001) — session CRUD + PostgreSQL
  ├── REST → Execution Service (Go/Gin, port 8002)         — runs code in Docker containers
  └── WS  ↔ Collab Service    (Node.js/Express, port 8003) — real-time multi-user sync
```

**Frontend view states**: `'landing'` → `'editor'`. A `?session=ID` query param causes the app to skip the landing page and join the session directly (view is initialized from URL, not defaulted then switched in an effect).

**WebSocket message types** (collab service): `init`, `code_update`, `user_list`, `execution_started`, `execution_result`. The collab service broadcasts execution results to all clients — the frontend does not call the execution service directly per-user.

**Environment variables** the frontend reads (via Vite):
- `VITE_SESSION_API` — base URL for session service
- `VITE_EXECUTION_API` — base URL for execution service
- `VITE_COLLAB_WS` — WebSocket URL (e.g. `/ws` in production, `ws://localhost:8003` locally)

## Commands

### Local development (Docker Compose)
```bash
cd infrastructure/docker-compose && ./start.sh   # builds and starts all 4 services + health checks
```

### Frontend
```bash
cd frontend
npm run dev       # Vite dev server with HMR
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

### Session Service (Python/FastAPI)
```bash
cd services/session-service
uvicorn main:app --reload
```

### Execution Service (Go)
```bash
cd services/execution-service
go run cmd/server/main.go
```

### Collaboration Service (Node.js)
```bash
cd services/collaboration-service
npm run dev       # node --watch
npm start         # production
```

### Kubernetes (K3s)
```bash
cd infrastructure/k8s
kubectl apply -k base/     # apply all manifests via Kustomize
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | All app state, view routing, share modal, header/status bar |
| `frontend/src/hooks/useCollaboration.js` | WebSocket lifecycle, reconnect logic, message dispatch |
| `frontend/src/services/api.js` | Session + execution REST clients, WS URL resolution |
| `frontend/src/components/CodeEditor.jsx` | Monaco Editor wrapper with custom dark theme |
| `frontend/src/index.css` | Global CSS vars, animations (`animate-blink`, `animate-ping`, `float`) |
| `services/execution-service/cmd/server/main.go` | Go entry point; spawns Docker containers per execution |
| `infrastructure/docker-compose/docker-compose.yml` | Local dev wiring |
| `infrastructure/production/docker-compose.yml` | Production (Traefik SSL, ghcr.io images) |
| `infrastructure/k8s/base/` | Kustomize manifests (HPA, PDB, NodePort services) |

## Design System

All UI changes must use the existing tokens — do not introduce new colors or fonts.

**CSS vars** (in `src/index.css`) and **`C` object** (in `App.jsx`) must stay in sync:

| Token | Value | Use |
|-------|-------|-----|
| `--background` / `C.bg` | `#0a0a09` | Page background |
| `--card` / `C.card` | `#0f0f0e` | Card / header surface |
| `--card-elevated` / `C.elevated` | `#131312` | Status bar, elevated cards |
| `--secondary` / `C.secondary` | `#171716` | Input backgrounds |
| `--border` / `C.border` | `#1f1f1d` | Dividers, panel separators |
| `--status-healthy` / `C.green` | `#4ade80` | Primary accent, CTAs |
| `--muted-foreground` / `C.muted` | `#9a9a98` | Secondary text |
| Font | Inter (Google Fonts) | `letter-spacing: -0.011em`, antialiased |

## Infrastructure Notes

- **Production domain**: `codecollab.k4scloud.com` (Let's Encrypt via Traefik)
- **K8s hybrid**: Docker Traefik handles ports 80/443 and proxies to K3s NodePorts (30001–30003, 30080)
- **PostgreSQL** runs as an external Docker container on network `postgres_postgres-network`; the K8s execution service mounts `/var/run/docker.sock` to spawn child containers
- **HPA thresholds**: CPU >70%, Memory >80%; min 2 / max 10–20 replicas per service
