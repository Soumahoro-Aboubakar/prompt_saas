import api from './api';

/**
 * Get all suggestions with optional filtering/sorting/pagination.
 * @param {Object} params - { status, sort, page, limit }
 */
export const getSuggestions = async (params = {}) => {
    const res = await api.get('/suggestions', { params });
    return res.data;
};

/**
 * Get the current user's suggestions.
 */
export const getMySuggestions = async () => {
    const res = await api.get('/suggestions/mine');
    return res.data;
};

/**
 * Create a new suggestion.
 * @param {Object} data - { title, description, category }
 */
export const createSuggestion = async (data) => {
    const res = await api.post('/suggestions', data);
    return res.data;
};

/**
 * Toggle vote on a suggestion.
 * @param {string} id - Suggestion ID
 */
export const toggleVote = async (id) => {
    const res = await api.post(`/suggestions/${id}/vote`);
    return res.data;
};

/**
 * Admin: update suggestion status.
 * @param {string} id - Suggestion ID
 * @param {string} status - New status
 */
export const updateStatus = async (id, status) => {
    const res = await api.patch(`/suggestions/${id}/status`, { status });
    return res.data;
};

/**
 * Admin: respond to a suggestion.
 * @param {string} id - Suggestion ID
 * @param {string} response - Admin response text
 */
export const respondToSuggestion = async (id, response) => {
    const res = await api.patch(`/suggestions/${id}/respond`, { response });
    return res.data;
};

/**
 * Delete a suggestion.
 * @param {string} id - Suggestion ID
 */
export const deleteSuggestion = async (id) => {
    const res = await api.delete(`/suggestions/${id}`);
    return res.data;
};
