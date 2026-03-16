class SessionStore {
    constructor() {
        this.sessions = new Map();
    }

    createSession(sessionId) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                id: sessionId,
                users: new Set(),
                code: '',
                language: 'python',
                createdAt: new Date()
            });
        }
        return this.sessions.get(sessionId);
    }

    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    addUserToSession(sessionId, userId, ws) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.users.add({ id: userId, ws });
        }
    }

    removeUserFromSession(sessionId, userId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.users = new Set(
                Array.from(session.users).filter(u => u.id !== userId)
            );
            
            if (session.users.size === 0) {
                this.sessions.delete(sessionId);
            }
        }
    }

    updateCode(sessionId, code) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.code = code;
        }
    }

    getSessionUsers(sessionId) {
        const session = this.sessions.get(sessionId);
        return session ? Array.from(session.users) : [];
    }

    getAllSessions() {
        return Array.from(this.sessions.values()).map(s => ({
            id: s.id,
            userCount: s.users.size,
            language: s.language,
            createdAt: s.createdAt
        }));
    }
}

export default new SessionStore();
