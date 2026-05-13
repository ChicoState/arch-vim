import api from './api.js';

/**
 * Load all level progress for the current user.
 * Returns: { "1": { stars_earned: 3, completed: true }, ... }
 */
export async function loadProgress() {
    try {
        const res = await api.get('/api/progress/');
        return res.data;
    } catch {
        return {};
    }
}

/**
 * Save a level attempt and get back the stars awarded.
 *
 * @param {Object} data
 * @param {number}  data.level_id     - e.g. 1
 * @param {boolean} data.completed    - did the user finish?
 * @param {number}  data.accuracy     - 0–100 float
 * @param {number}  data.time_taken   - seconds (float)
 * @param {number}  data.stroke_count - keystroke count (int)
 * @returns {{ stars_earned, completed, accuracy, time_taken }}
 */
export async function saveProgress(data) {
    try {
        const res = await api.post(`/api/stars/${data.level_id}/`, data);
        return res.data;          // ← includes stars_earned so the UI can react
    } catch (err) {
        console.error('Failed to save progress', err);
        return null;
    }
}

/**
 * Fetch the best stars earned for a single level (for the level select screen).
 */
export async function getLevelStars(levelId) {
    try {
        const res = await api.get(`/api/stars/${levelId}/`);
        return res.data.stars_earned ?? 0;
    } catch {
        return 0;
    }
}