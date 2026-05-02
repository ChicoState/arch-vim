// In loadProgress.js or a new levels.js
export async function fetchLevels() {
    const res = await fetch('/api/levels/');
    return res.json();
}

export async function fetchLevel(pk) {
    const res = await fetch(`/api/levels/${pk}/`);
    if (!res.ok) return null;
    return res.json();
}