# CodeCollab Frontend

React-based frontend for CodeCollab platform with real-time collaboration.

## Features

- Monaco Editor (VS Code editor)
- Real-time code synchronization via WebSocket
- Multi-user collaboration
- Code execution with live output
- Support for Python and JavaScript
- Session sharing via URL
- Clean, modern UI

## Technology Stack

- React 18
- Vite (build tool)
- Monaco Editor
- WebSocket for real-time collaboration
- Axios for HTTP requests
- Lucide React (icons)

## Prerequisites

- Node.js 18+
- Backend services running:
  - Session Service (port 8001)
  - Execution Service (port 8002)
  - Collaboration Service (port 8003)

## Installation
```bash
npm install
```

## Development
```bash
npm run dev
```

Runs on http://localhost:5173

## Environment Variables

Create `.env` file:
```
VITE_SESSION_API=http://localhost:8001
VITE_EXECUTION_API=http://localhost:8002
VITE_COLLAB_WS=ws://localhost:8003
```

## Build for Production
```bash
npm run build
```

Output in `dist/` directory.

## Usage

### Create New Session
- Visit http://localhost:5173
- A new session is automatically created

### Join Existing Session
- Click "Share Link" button
- Share the URL with collaborators
- Everyone who opens the link joins the same session

### Collaborate
- Multiple users can edit code simultaneously
- Changes appear in real-time across all connected users
- User count shows active collaborators

### Execute Code
- Select language (Python or JavaScript)
- Write code in Monaco Editor
- Click "Run Code"
- See output in right panel

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── CodeEditor.jsx       # Monaco editor wrapper
│   │   └── OutputPanel.jsx      # Execution output display
│   ├── hooks/
│   │   └── useCollaboration.js  # WebSocket hook
│   ├── services/
│   │   └── api.js               # API client
│   ├── App.jsx                  # Main application
│   └── main.jsx                 # Entry point
├── package.json
└── vite.config.js
```

## Features Demonstrated

- Real-time WebSocket communication
- Monaco Editor integration
- Multi-user collaboration
- Session management
- Code execution
- Error handling
- Modern React patterns (hooks, refs)
- Clean UI/UX

## Future Enhancements

- User authentication
- Syntax highlighting for more languages
- Auto-save
- Code formatting
- Themes (light/dark mode)
- Chat feature
- File upload
- Export code
