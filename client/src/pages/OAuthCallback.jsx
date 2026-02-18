import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import authService from '../services/authService';

/**
 * OAuth Callback Page
 * Handles the redirect from backend OAuth flow.
 * Extracts the JWT token from URL params, stores it, fetches user data,
 * and redirects to the dashboard.
 */
export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setError('L\'authentification a échoué. Veuillez réessayer.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            if (!token) {
                setError('Token manquant. Veuillez réessayer.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                // Store the token
                localStorage.setItem('token', token);

                // Fetch user data with the new token
                const response = await authService.fetchCurrentUser();

                if (response?.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    navigate('/dashboard', { replace: true });
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (err) {
                console.error('OAuth callback error:', err);
                setError('Erreur de connexion. Veuillez réessayer.');
                localStorage.removeItem('token');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            {error ? (
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Icon icon="solar:danger-triangle-linear" width="32" className="text-red-400" />
                    </div>
                    <p className="text-red-400 mb-2">{error}</p>
                    <p className="text-zinc-500 text-sm">Redirection vers la page de connexion...</p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-400">Connexion en cours...</p>
                </div>
            )}
        </div>
    );
}
