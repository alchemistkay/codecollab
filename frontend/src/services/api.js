import axios from 'axios';

const SESSION_API = import.meta.env.VITE_SESSION_API || 'http://localhost:8001';
const EXECUTION_API = import.meta.env.VITE_EXECUTION_API || 'http://localhost:8002';

export const sessionAPI = {
    create: async (title, language) => {
        const response = await axios.post(`${SESSION_API}/sessions`, {
            title,
            language,
            code: ''
        });
        return response.data;
    },

    get: async (sessionId) => {
        const response = await axios.get(`${SESSION_API}/sessions/${sessionId}`);
        return response.data;
    },

    list: async () => {
        const response = await axios.get(`${SESSION_API}/sessions`);
        return response.data;
    },

    update: async (sessionId, updates) => {
        const response = await axios.patch(`${SESSION_API}/sessions/${sessionId}`, updates);
        return response.data;
    }
};

export const executionAPI = {
    execute: async (sessionId, language, code) => {
        const response = await axios.post(`${EXECUTION_API}/execute`, {
            session_id: sessionId,
            language,
            code
        });
        return response.data;
    }
};
