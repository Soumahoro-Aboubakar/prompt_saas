import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import authService from '../services/authService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.requestPasswordReset(email);
            setSuccess(true);
        } catch (err) {
            if (err.details?.remainingTime) {
                const { hours, minutes, seconds } = err.details.remainingTime;
                const retryAt = new Date(Date.now() + hours * 3600000 + minutes * 60000 + seconds * 1000);
                const h = String(retryAt.getHours()).padStart(2, '0');
                const m = String(retryAt.getMinutes()).padStart(2, '0');
                setError(`Limite d'envoi atteinte. Réessayez à ${h}h${m}.`);
            } else {
                setError(err.message || 'Erreur lors de la demande de réinitialisation');
            }
        } finally {
            setIsLoading(false);
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
                    <p className="text-zinc-500 mt-2">Réinitialisez votre mot de passe</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-xl">
                    <h1 className="text-2xl font-semibold text-white mb-6">Mot de passe oublié</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <Icon icon="solar:danger-triangle-linear" width="18" />
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm">
                            Si un compte existe, un email de réinitialisation a été envoyé.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <Icon icon="solar:letter-linear" width="20" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="vous@exemple.com"
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <Icon icon="solar:spinner-linear" width="20" className="animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        Envoyer le lien
                                        <Icon icon="solar:arrow-right-linear" width="20" />
                                    </>
                                )}
                            </motion.button>
                        </form>
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
