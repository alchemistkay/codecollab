import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleWebSocket } from './handlers/websocketHandler.js';
import { healthCheck, getSessionInfo, getAllSessions } from './handlers/httpHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

app.get('/health', healthCheck);
app.get('/sessions', getAllSessions);
app.get('/sessions/:sessionId', getSessionInfo);

wss.on('connection', handleWebSocket);

const PORT = process.env.PORT || 8003;

server.listen(PORT, () => {
    console.log(`Collaboration Service running on port ${PORT}`);
    console.log(`WebSocket: ws://localhost:${PORT}`);
    console.log(`HTTP API: http://localhost:${PORT}`);
    console.log(`Execution API: ${process.env.EXECUTION_API || 'http://execution-service:8002'}`);
});
