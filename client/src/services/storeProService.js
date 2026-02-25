import api from './api';

/**
 * Fetch all prompts from the Store Pro API.
 * @param {string|null} category - categorySlug to filter, or null for all
 * @returns {Promise<Array>} array of prompt objects
 */
export const getPrompts = async (category = null) => {
    const params = category && category !== 'all' ? { category } : {};
    const res = await api.get('/store-pro', { params });
    return res.data.data;
};

/**
 * Fetch the list of available categories.
 * @returns {Promise<Array>} array of { slug, label }
 */
export const getCategories = async () => {
    const res = await api.get('/store-pro/categories');
    console.log(res.data , " voici la reponses de serveur");
    return res.data.data;
};
