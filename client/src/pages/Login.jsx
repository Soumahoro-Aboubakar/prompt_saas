import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log('Login:', { email, password });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl"></div>

            <motion.div
                className="w-full max-w-md relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block text-2xl font-semibold tracking-tight">
                        <span className="text-violet-500">✦</span> prompt<span className="text-violet-500">academy</span>
                    </Link>
                    <p className="text-zinc-500 mt-2">Connectez-vous pour continuer votre apprentissage</p>
                </div>

                {/* Login Card */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-xl">
                    <h1 className="text-2xl font-semibold text-white mb-6">Connexion</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
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

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Icon icon="solar:lock-linear" width="20" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 pl-12 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    <Icon icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} width="20" />
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* Submit Button */}
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
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <Icon icon="solar:arrow-right-linear" width="20" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-zinc-800"></div>
                        <span className="text-sm text-zinc-500">ou</span>
                        <div className="flex-1 h-px bg-zinc-800"></div>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3">
                            <Icon icon="logos:google-icon" width="20" />
                            Continuer avec Google
                        </button>
                        <button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3">
                            <Icon icon="logos:github-icon" width="20" />
                            Continuer avec GitHub
                        </button>
                    </div>
                </div>

                {/* Sign Up Link */}
                <p className="text-center mt-6 text-zinc-500">
                    Pas encore de compte ?{' '}
                    <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Créer un compte
                    </Link>
                </p>

                {/* Back to Home */}
                <div className="text-center mt-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                        <Icon icon="solar:arrow-left-linear" width="16" />
                        Retour à l'accueil
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
