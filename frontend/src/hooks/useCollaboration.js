import { useEffect, useRef, useState } from 'react';

const COLLAB_WS = import.meta.env.VITE_COLLAB_WS || 'ws://localhost:8003';

export function useCollaboration(sessionId, userId, onCodeUpdate) {
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!sessionId || !userId) return;

        const ws = new WebSocket(`${COLLAB_WS}?session=${sessionId}&user=${userId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            setConnected(true);
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
                
                default:
                    console.log('Unknown message type:', message.type);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, [sessionId, userId, onCodeUpdate]);

    const sendCodeChange = (code) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'code_change',
                code
            }));
        }
    };

    return { connected, users, sendCodeChange };
}
