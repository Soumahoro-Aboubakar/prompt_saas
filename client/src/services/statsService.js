import api from './api';

/**
 * User Stats Service
 * Handles XP, levels, streaks, and leaderboard
 */

// Get user statistics
export const getStats = async () => {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch stats' };
    }
};

// Add XP to user
export const addXP = async (amount, reason = '') => {
    try {
        const response = await api.put('/stats/xp', { amount, reason });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to add XP' };
    }
};

// Add badge to user
export const addBadge = async (badgeId, badgeName, badgeIcon) => {
    try {
        const response = await api.post('/stats/badges', {
            badgeId,
            badgeName,
            badgeIcon
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to add badge' };
    }
};

// Get leaderboard
export const getLeaderboard = async (limit = 10) => {
    try {
        const response = await api.get(`/stats/leaderboard?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch leaderboard' };
    }
};

export default {
    getStats,
    addXP,
    addBadge,
    getLeaderboard
};
