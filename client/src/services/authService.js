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

// Request password reset
export const requestPasswordReset = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to request password reset' };
    }
};

// Reset password with token
export const resetPassword = async (token, password) => {
    try {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to reset password' };
    }
};

// Verify email with OTP code
export const verifyEmailCode = async (code) => {
    try {
        const response = await api.post('/auth/verify-code', { code });
        if (response.data.success && response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to verify code' };
    }
};

// Resend OTP code
export const resendVerificationCode = async () => {
    try {
        const response = await api.post('/auth/resend-verification-code');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to resend code' };
    }
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    getToken,
    isAuthenticated,
    fetchCurrentUser,
    requestPasswordReset,
    resetPassword,
    verifyEmailCode,
    resendVerificationCode
};
