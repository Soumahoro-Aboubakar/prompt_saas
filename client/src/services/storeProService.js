import api from './api';

/**
 * Fetch published prompts from the Store Pro API with full filtering.
 */
export const getPrompts = async (params = {}) => {
    const cleanParams = {};
    Object.entries(params).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '' && v !== 'all') {
            cleanParams[k] = v;
        }
    });
    const res = await api.get('/store-pro', { params: cleanParams });
    return res.data;
};

/**
 * Fetch the list of available categories.
 * @returns {Promise<Array>} array of { slug, label }
 */
export const getCategories = async () => {
    const res = await api.get('/store-pro/categories');
    return res.data.data;
};

/**
 * Fetch active template types exposed to end users.
 */
export const getTemplateTypes = async () => {
    const res = await api.get('/store-pro/types');
    return res.data.data;
};

/**
 * Increment copy counter for a template.
 */
export const countCopy = async (id) => {
    try {
        await api.post(`/store-pro/${id}/copy`);
    } catch { /* fire and forget */ }
};
