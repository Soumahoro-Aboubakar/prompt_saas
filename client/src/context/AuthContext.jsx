import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import statsService from '../services/statsService';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateStats = useCallback((nextStats, options = {}) => {
        const { replace = false } = options;
        if (!nextStats) return null;

        setStats((prev) => {
            if (replace || !prev) return nextStats;
            return { ...prev, ...nextStats };
        });

        return nextStats;
    }, []);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authService.getCurrentUser();
            const token = authService.getToken();

            if (storedUser && token) {
                try {
                    // Verify token with API
                    const response = await authService.fetchCurrentUser();
                    setUser(response.user);
                    updateStats(response.stats, { replace: true });
                } catch (err) {
                    // Token invalid - clear everything
                    console.error('Auth init error:', err);
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [updateStats]);

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authService.login(email, password);
            setUser(response.user);

            // Fetch user stats after login
            try {
                const statsResponse = await statsService.getStats();
                updateStats(statsResponse.stats, { replace: true });
            } catch {
                // Stats fetch failure is not critical
            }

            return response;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        }
    };

    // Register function
    const register = async (fullName, email, password) => {
        try {
            setError(null);
            const response = await authService.register(fullName, email, password);
            setUser(response.user);
            updateStats({
                totalXP: 0,
                level: 1,
                streak: 0,
                badges: [],
                modulesCompleted: 0
            }, { replace: true });
            return response;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
        setStats(null);
    };

    // Refresh stats
    const refreshStats = async () => {
        try {
            const response = await statsService.getStats();
            updateStats(response.stats, { replace: true });
            return response.stats;
        } catch (err) {
            console.error('Failed to refresh stats:', err);
        }
    };

    // Refresh user (re-validate token)
    const refreshUser = async () => {
        try {
            const response = await authService.fetchCurrentUser();
            if (response?.user) {
                setUser(response.user);
                updateStats(response.stats, { replace: true });
            }
            return response?.user;
        } catch (err) {
            console.error('Failed to refresh user:', err);
        }
    };

    // Context value
    const value = {
        user,
        stats,
        loading,
        error,
        isAuthenticated: !!user,
        isVerified: !!user?.isVerified,
        login,
        register,
        logout,
        refreshStats,
        refreshUser,
        updateStats
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isVerified, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
        if (!loading && isAuthenticated && !isVerified) {
            navigate('/verify-email');
        }
    }, [isAuthenticated, isVerified, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isAuthenticated && isVerified ? children : null;
};

// Guest Route Component — redirects authenticated users away from login/signup
export const GuestRoute = ({ children }) => {
    const { isAuthenticated, isVerified, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated && isVerified) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, isVerified, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (!isAuthenticated || !isVerified) ? children : null;
};

export default AuthContext;
