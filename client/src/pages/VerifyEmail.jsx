import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { refreshStats, refreshUser } = useAuth();
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [message, setMessage] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const email = location.state?.email;
    const handleVerify = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!/^\d{6}$/.test(code.trim())) {
            setStatus('error');
            setMessage('Entrez un code a 6 chiffres.');
            return;
        }

        setStatus('submitting');
        try {
            await authService.verifyEmailCode(code.trim());
            await refreshUser();
            await refreshStats();
            setStatus('success');
            setMessage('Email verifie. Redirection vers le dashboard...');
            setTimeout(() => navigate('/dashboard'), 1200);
        } catch (err) {
            setStatus('error');
            setMessage(err.message || 'Erreur lors de la verification');
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setMessage('');
        try {
            const response = await authService.resendVerificationCode();
            setStatus('idle');
            setMessage(response.message || 'Nouveau code envoye.');
        } catch (err) {
            setStatus('error');
            if (err.details?.remainingTime) {
                const { hours, minutes, seconds } = err.details.remainingTime;
                const retryAt = new Date(Date.now() + hours * 3600000 + minutes * 60000 + seconds * 1000);
                const h = String(retryAt.getHours()).padStart(2, '0');
                const m = String(retryAt.getMinutes()).padStart(2, '0');
                setMessage(`Limite d'envoi atteinte. Réessayez à ${h}h${m}.`);
            } else if (typeof err.retryAfterSeconds === 'number') {
                setMessage(`Veuillez patienter ${err.retryAfterSeconds}s avant de renvoyer un code.`);
            } else {
                setMessage(err.message || 'Impossible de renvoyer le code');
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl"></div>

            <motion.div
                className="w-full max-w-md relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block text-2xl font-semibold tracking-tight">
                        <span className="text-violet-500">✦</span> prompt<span className="text-violet-500">academy</span>
                    </Link>
                    <p className="text-zinc-500 mt-2">Vérification de votre email</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-xl">
                    <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm">
                        Un code OTP a ete envoye par email.
                        {email ? ` (${email})` : ''}
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-zinc-400 mb-2">
                                Code de verification (6 chiffres)
                            </label>
                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-center tracking-[0.35em] text-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                            whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
                            whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
                        >
                            {status === 'submitting' ? (
                                <>
                                    <Icon icon="solar:spinner-linear" width="20" className="animate-spin" />
                                    Verification en cours...
                                </>
                            ) : (
                                <>
                                    Verifier le code
                                    <Icon icon="solar:shield-check-linear" width="20" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="w-full mt-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {resendLoading ? (
                            <>
                                <Icon icon="solar:spinner-linear" width="18" className="animate-spin" />
                                Envoi...
                            </>
                        ) : (
                            <>
                                Renvoyer un code
                                <Icon icon="solar:refresh-linear" width="18" />
                            </>
                        )}
                    </button>

                    {status === 'success' && (
                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm">
                            {message}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {message}
                        </div>
                    )}

                    {status === 'idle' && message && (
                        <div className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-zinc-300 text-sm">
                            {message}
                        </div>
                    )}
                </div>

                <div className="text-center mt-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                        <Icon icon="solar:arrow-left-linear" width="16" />
                        Retour à la connexion
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
