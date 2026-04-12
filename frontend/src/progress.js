import api from './api.js';

export async function loadProgress() {
    try {
        const res = await api.get('/api/progress/');
        return res.data;
    } catch {
        return {};
    }
}

export async function saveProgress(data) {
    try {
        await api.post('/api/progress/save/', data);
    } catch (err) {
        console.error('Failed to save progress', err);
    }
}