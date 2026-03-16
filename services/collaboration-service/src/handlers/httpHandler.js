import sessionStore from '../models/sessionStore.js';

export function healthCheck(req, res) {
    res.json({
        status: 'healthy',
        service: 'collaboration-service',
        version: '1.0.0'
    });
}

export function getSessionInfo(req, res) {
    const { sessionId } = req.params;
    const session = sessionStore.getSession(sessionId);

    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
        id: session.id,
        userCount: session.users.size,
        language: session.language,
        codeLength: session.code.length,
        createdAt: session.createdAt
    });
}

export function getAllSessions(req, res) {
    const sessions = sessionStore.getAllSessions();
    res.json({ sessions });
}
