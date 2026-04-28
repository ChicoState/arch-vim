import { createContext, useContext, useEffect, useState } from 'react';
import { loadProgress } from '../progress';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchProgress = () => {
        setLoading(true);
        loadProgress().then(data => {
            setProgress(data);
            setLoading(false);
        });
    };

    const clearProgress = () => {
        setProgress({});
        setLoading(false);
    };

    const levelPassed = (levelNum) => {
        setProgress({...progress,
		[`level_${levelNum}`]: { passed: true }
        })
    }

    // useEffect(() => {
    //     fetchProgress();
    // }, []);

    return (
        <ProgressContext.Provider value={{ progress, loading, clearProgress, fetchProgress, levelPassed }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
    return ctx;
}

export default function useCheckLevel(levelNum = 0) {
    const { progress } = useProgress();
    return progress[`level_${levelNum}`]?.passed ?? false;
}