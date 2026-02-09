import { createContext, useContext, useState, useEffect } from 'react';
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
                    setStats(response.stats);
                    console.log("response", response);
                } catch (err) {
                    // Token invalid - clear everything
                    console.error('Auth init error:', err);
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authService.login(email, password);
            setUser(response.user);

            // Fetch user stats after login
            try {
                const statsResponse = await statsService.getStats();
                setStats(statsResponse.stats);
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
            setStats({
                totalXP: 0,
                level: 1,
                streak: 0,
                badges: [],
                modulesCompleted: 0
            });
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
            setStats(response.stats);
            return response.stats;
        } catch (err) {
            console.error('Failed to refresh stats:', err);
        }
    };

    // Context value
    const value = {
        user,
        stats,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshStats
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
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
};

export default AuthContext;
