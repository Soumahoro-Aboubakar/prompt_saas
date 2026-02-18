import api from './api';

/**
 * Progress Service
 * Tracks module completion and user progress
 */

// Get all progress for current user
export const getAllProgress = async () => {
    try {
        const response = await api.get('/progress');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch progress' };
    }
};

// Get progress for specific module
export const getModuleProgress = async (moduleId) => {
    try {
        const response = await api.get(`/progress/${moduleId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch module progress' };
    }
};

// Update/complete module progress - sends data as body
export const updateProgress = async (moduleId, data, options = {}) => {
    try {
        const response = await api.post(`/progress/${moduleId}`, data, {
            signal: options.signal
        });
        return response.data;
    } catch (error) {
        if (error?.code === 'ERR_CANCELED') {
            throw error;
        }
        throw error.response?.data || { message: 'Failed to update progress' };
    }
};

// Complete a module with score and XP
// @param {number} moduleId - Module ID
// @param {number} score - Score achieved (0-100)
// @param {number} xpEarned - XP to award
export const completeModule = async (moduleId, score, xpEarned, options = {}) => {
    // Send as proper object with individual fields
    return updateProgress(moduleId, {
        completed: true,
        score: Number(score),
        xpEarned: Number(xpEarned)
    }, options);
};

export default {
    getAllProgress,
    getModuleProgress,
    updateProgress,
    completeModule
};
