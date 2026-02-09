import api from './api';

/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

// Register new user
export const register = async (fullName, email, password) => {
    try {
        const response = await api.post('/auth/register', {
            fullName,
            email,
            password
        });

        if (response.data.success) {
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};

// Login user
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        if (response.data.success) {
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Get current token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Fetch current user from API (verify token)
export const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');

        if (response.data.success) {
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }

        return null;
    } catch (error) {
        // Token invalid - clear storage
        logout();
        throw error.response?.data || { message: 'Session expired' };
    }
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
    isAuthenticated,
    fetchCurrentUser
};
