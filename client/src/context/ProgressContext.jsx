import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import progressService from '../services/progressService';

// Create Progress Context
const ProgressContext = createContext(null);

// Progress Provider Component
export const ProgressProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [completedModules, setCompletedModules] = useState([]);
    const [moduleProgress, setModuleProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentLevel, setCurrentLevel] = useState(1);

    const applyProgressSnapshot = useCallback((progressData = []) => {
        const completed = progressData
            .filter(p => p.completed)
            .map(p => p.moduleId);

        const progressMap = {};
        progressData.forEach((p) => {
            progressMap[p.moduleId] = p;
        });

        setCompletedModules(completed);
        setModuleProgress(progressMap);
        setCurrentLevel(Math.max(1, completed.length + 1));
    }, []);

    // Fetch progress when authenticated
    useEffect(() => {
        const fetchProgress = async () => {
            if (!isAuthenticated) {
                setCompletedModules([]);
                setModuleProgress({});
                setLoading(false);
                return;
            }

            try {
                const response = await progressService.getAllProgress();
                applyProgressSnapshot(response.progress || []);
            } catch (error) {
                console.error('Failed to fetch progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [isAuthenticated, user, applyProgressSnapshot]);

    /**
     * Optimistically mark a module as completed
     * Returns a rollback function to revert if needed
     */
    const optimisticComplete = useCallback((moduleId, score) => {
        // Store previous state for rollback
        const prevCompleted = [...completedModules];
        const prevProgress = { ...moduleProgress };
        const prevLevel = currentLevel;

        // Optimistic update
        if (!completedModules.includes(moduleId)) {
            setCompletedModules(prev => [...prev, moduleId]);
            setCurrentLevel(prev => Math.max(prev, moduleId + 1));
        }

        setModuleProgress(prev => ({
            ...prev,
            [moduleId]: {
                moduleId,
                completed: true,
                score,
                completedAt: new Date().toISOString()
            }
        }));

        // Return rollback function
        return () => {
            setCompletedModules(prevCompleted);
            setModuleProgress(prevProgress);
            setCurrentLevel(prevLevel);
        };
    }, [completedModules, moduleProgress, currentLevel]);

    /**
     * Check if a module is completed
     */
    const isModuleCompleted = useCallback((moduleId) => {
        return completedModules.includes(moduleId);
    }, [completedModules]);

    /**
     * Check if a module is unlocked
     */
    const isModuleUnlocked = useCallback((moduleId) => {
        return moduleId <= currentLevel;
    }, [currentLevel]);

    /**
     * Get progress for a specific module
     */
    const getModuleProgress = useCallback((moduleId) => {
        return moduleProgress[moduleId] || null;
    }, [moduleProgress]);

    /**
     * Merge one progress record from backend into local state
     */
    const syncModuleProgress = useCallback((progress) => {
        if (!progress || !progress.moduleId) return;

        setModuleProgress((prev) => ({
            ...prev,
            [progress.moduleId]: {
                ...prev[progress.moduleId],
                ...progress
            }
        }));

        if (progress.completed) {
            setCompletedModules((prev) => {
                if (prev.includes(progress.moduleId)) return prev;
                return [...prev, progress.moduleId];
            });
            setCurrentLevel((prev) => Math.max(prev, progress.moduleId + 1));
        }
    }, []);

    // Context value
    const value = {
        completedModules,
        moduleProgress,
        currentLevel,
        loading,
        optimisticComplete,
        syncModuleProgress,
        isModuleCompleted,
        isModuleUnlocked,
        getModuleProgress
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};

// Custom hook to use progress context
export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};

export default ProgressContext;
