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
                const progressData = response.progress || [];

                // Extract completed module IDs
                const completed = progressData
                    .filter(p => p.completed)
                    .map(p => p.moduleId);

                // Build progress map
                const progressMap = {};
                progressData.forEach(p => {
                    progressMap[p.moduleId] = p;
                });

                setCompletedModules(completed);
                setModuleProgress(progressMap);

                // Calculate current level based on completed modules
                setCurrentLevel(Math.max(1, completed.length + 1));
            } catch (error) {
                console.error('Failed to fetch progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [isAuthenticated, user]);

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

    // Context value
    const value = {
        completedModules,
        moduleProgress,
        currentLevel,
        loading,
        optimisticComplete,
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
