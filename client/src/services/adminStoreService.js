import api from './api';

export const getAdminTemplates = async (params = {}) => {
    const res = await api.get('/admin/store/templates', { params });
    return res.data;
};

export const createTemplate = async (data) => {
    const res = await api.post('/admin/store/templates', data);
    return res.data;
};

export const updateTemplate = async (id, data) => {
    const res = await api.put(`/admin/store/templates/${id}`, data);
    return res.data;
};

export const deleteTemplate = async (id) => {
    const res = await api.delete(`/admin/store/templates/${id}`);
    return res.data;
};

export const getAdminCategories = async () => {
    const res = await api.get('/admin/store/categories');
    return res.data;
};

export const createCategory = async (data) => {
    const res = await api.post('/admin/store/categories', data);
    return res.data;
};

export const updateCategory = async (id, data) => {
    const res = await api.put(`/admin/store/categories/${id}`, data);
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await api.delete(`/admin/store/categories/${id}`);
    return res.data;
};

export const uploadTemplateImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/admin/store/upload', formData);
    return res.data;
};

export const getAdminTemplateTypes = async () => {
    const res = await api.get('/admin/store/types');
    return res.data;
};

export const createTemplateType = async (data) => {
    const res = await api.post('/admin/store/types', data);
    return res.data;
};

export const updateTemplateType = async (id, data) => {
    const res = await api.put(`/admin/store/types/${id}`, data);
    return res.data;
};

export const deleteTemplateType = async (id) => {
    const res = await api.delete(`/admin/store/types/${id}`);
    return res.data;
};
