import sessionStore from '../models/sessionStore.js';
import axios from 'axios';

const PING_INTERVAL = 30000;
const EXECUTION_API = process.env.EXECUTION_API || 'http://execution-service:8002';
const SESSION_SERVICE_URL = process.env.SESSION_SERVICE_URL || 'http://session-service:8001';

const persistTimers = new Map();

function schedulePersist(sessionId) {
    if (persistTimers.has(sessionId)) {
        clearTimeout(persistTimers.get(sessionId));
    }
    persistTimers.set(sessionId, setTimeout(async () => {
        persistTimers.delete(sessionId);
        const session = sessionStore.getSession(sessionId);
        if (!session) return;
        try {
            await fetch(`${SESSION_SERVICE_URL}/sessions/${sessionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: session.code, language: session.language }),
            });
        } catch (e) {
            console.error('Failed to persist session:', sessionId, e.message);
        }
    }, 3000));
}

export function handleWebSocket(ws, req) {
    const url = new URL(req.url, 'ws://localhost');
    const sessionId = url.searchParams.get('session');
    const userId = url.searchParams.get('user') || generateUserId();

    if (!sessionId) {
        ws.close(1008, 'Session ID required');
        return;
    }

    console.log(`User ${userId} connected to session ${sessionId}`);

    const session = sessionStore.createSession(sessionId);
    sessionStore.addUserToSession(sessionId, userId, ws);

    ws.send(JSON.stringify({
        type: 'init',
        sessionId,
        userId,
        code: session.code,
        language: session.language
    }));

    broadcastUserList(sessionId);

    let isAlive = true;
    const pingInterval = setInterval(() => {
        if (!isAlive) {
            clearInterval(pingInterval);
            ws.terminate();
            return;
        }
        isAlive = false;
        ws.ping();
    }, PING_INTERVAL);

    ws.on('pong', () => {
        isAlive = true;
    });

    ws.on('message', (data) => {
        isAlive = true;
        try {
            const message = JSON.parse(data.toString());
            handleMessage(sessionId, userId, message, ws);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log(`User ${userId} disconnected from session ${sessionId}`);
        clearInterval(pingInterval);
        sessionStore.removeUserFromSession(sessionId, userId);
        broadcastUserList(sessionId);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clearInterval(pingInterval);
    });
}

async function handleMessage(sessionId, userId, message, ws) {
    switch (message.type) {
        case 'code_change':
            sessionStore.updateCode(sessionId, message.code);
            broadcast(sessionId, {
                type: 'code_update',
                code: message.code,
                userId
            }, userId);
            schedulePersist(sessionId);
            break;

        case 'execute_code':
            await handleExecuteCode(sessionId, userId, message);
            break;

        case 'cursor_position':
            broadcast(sessionId, {
                type: 'cursor_update',
                position: message.position,
                userId
            }, userId);
            break;

        case 'language_change': {
            const session = sessionStore.getSession(sessionId);
            if (session) {
                session.language = message.language;
                broadcast(sessionId, {
                    type: 'language_update',
                    language: message.language,
                    userId
                }, userId);
                schedulePersist(sessionId);
            }
            break;
        }

        case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;

        default:
            console.log('Unknown message type:', message.type);
    }
}

async function handleExecuteCode(sessionId, userId, message) {
    try {
        broadcast(sessionId, {
            type: 'execution_started',
            userId
        });

        const response = await axios.post(`${EXECUTION_API}/execute`, {
            session_id: sessionId,
            language: message.language,
            code: message.code
        });

        broadcast(sessionId, {
            type: 'execution_result',
            result: response.data,
            userId
        });

    } catch (error) {
        console.error('Execution error:', error);

        broadcast(sessionId, {
            type: 'execution_result',
            result: {
                status: 'failed',
                error: error.message,
                exit_code: 1
            },
            userId
        });
    }
}

function broadcast(sessionId, message, excludeUserId = null) {
    const users = sessionStore.getSessionUsers(sessionId);
    users.forEach(user => {
        if (user.id !== excludeUserId && user.ws.readyState === 1) {
            user.ws.send(JSON.stringify(message));
        }
    });
}

function broadcastUserList(sessionId) {
    const users = sessionStore.getSessionUsers(sessionId);
    const userList = users.map(u => ({ id: u.id }));

    users.forEach(user => {
        if (user.ws.readyState === 1) {
            user.ws.send(JSON.stringify({
                type: 'user_list',
                users: userList
            }));
        }
    });
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}
