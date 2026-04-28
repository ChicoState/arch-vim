import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { useProgress } from './components/checkLevelPassed';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const { clearProgress } = useProgress();
    const { fetchProgress } = useProgress();

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            api.get('/api/auth/me/')
                .then(res => setUser(res.data))
                .catch(() => localStorage.clear())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        clearProgress();
        const { data } = await api.post('/api/auth/login/', { username, password });
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        const me = await api.get('/api/auth/me/');
        setUser(me.data);
        fetchProgress();
    };

    const logout = () => {
        clearProgress();
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);