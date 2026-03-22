import { useEffect, useRef, useState, useCallback } from 'react';

const getWebSocketURL = () => {
    const wsUrl = import.meta.env.VITE_COLLAB_WS;
    
    if (wsUrl && wsUrl.startsWith('/')) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}${wsUrl}`;
    }
    
    return wsUrl || 'ws://localhost:8003';
};

const RECONNECT_INTERVAL = 3000;
const PING_INTERVAL = 25000;

export function useCollaboration(sessionId, userId, onCodeUpdate, onExecutionResult, onExecutionStarted) {
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState([]);
    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const pingTimerRef = useRef(null);

    const connect = useCallback(() => {
        if (!sessionId || !userId) return;

        const baseUrl = getWebSocketURL();
        const ws = new WebSocket(`${baseUrl}?session=${sessionId}&user=${userId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            setConnected(true);
            
            pingTimerRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, PING_INTERVAL);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
                case 'init':
                    if (message.code && onCodeUpdate) {
                        onCodeUpdate(message.code);
                    }
                    break;
                
                case 'code_update':
                    if (message.userId !== userId && onCodeUpdate) {
                        onCodeUpdate(message.code);
                    }
                    break;
                
                case 'user_list':
                    setUsers(message.users);
                    break;

                case 'execution_started':
                    if (onExecutionStarted) {
                        onExecutionStarted(message.userId);
                    }
                    break;

                case 'execution_result':
                    if (onExecutionResult) {
                        onExecutionResult(message.result, message.userId);
                    }
                    break;

                case 'pong':
                    break;
                
                default:
                    console.log('Unknown message type:', message.type);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setConnected(false);
            
            if (pingTimerRef.current) {
                clearInterval(pingTimerRef.current);
                pingTimerRef.current = null;
            }

            reconnectTimerRef.current = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect();
            }, RECONNECT_INTERVAL);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }, [sessionId, userId, onCodeUpdate, onExecutionResult, onExecutionStarted]);

    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }
            if (pingTimerRef.current) {
                clearInterval(pingTimerRef.current);
            }
        };
    }, [connect]);

    const sendCodeChange = (code) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'code_change',
                code
            }));
        }
    };

    const executeCode = (language, code) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'execute_code',
                language,
                code
            }));
        }
    };

    return { connected, users, sendCodeChange, executeCode };
}
