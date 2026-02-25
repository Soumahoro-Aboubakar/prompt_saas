import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AppLogo from '../components/ui/AppLogo';

export default function SignUp() {
    const navigate = useNavigate();
    const { register, error: authError } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.fullName, formData.email, formData.password);
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err) {
            setError(err.message || 'Erreur lors de la création du compte');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = () => {
        const { password } = formData;
        if (password.length === 0) return { level: 0, text: '', color: '' };
        if (password.length < 6) return { level: 1, text: 'Faible', color: 'bg-red-500' };
        if (password.length < 10) return { level: 2, text: 'Moyen', color: 'bg-amber-500' };
        if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { level: 3, text: 'Fort', color: 'bg-emerald-500' };
        }
        return { level: 2, text: 'Moyen', color: 'bg-amber-500' };
    };

    const strength = passwordStrength();

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl"></div>

            <motion.div
                className="w-full max-w-md relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <AppLogo variant="dark" size="lg" />
                    </Link>
                    <p className="text-zinc-500 mt-2">Créez votre compte et maîtrisez l'IA</p>
                </div>

                {/* Sign Up Card */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-xl">
                    <h1 className="text-2xl font-semibold text-white mb-6">Créer un compte</h1>

                    {/* Error Message */}
                    {(error || authError) && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <Icon icon="solar:danger-triangle-linear" width="18" />
                            {error || authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-zinc-400 mb-2">
                                Nom complet
                            </label>
                            <div className="relative">
                                <Icon icon="solar:user-linear" width="20" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Jean Dupont"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

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
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full ${level <= strength.level ? strength.color : 'bg-zinc-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-xs ${strength.color.replace('bg-', 'text-')}`}>
                                        {strength.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-400 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Icon icon="solar:lock-linear" width="20" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                                    required
                                />
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <Icon icon="solar:check-circle-bold" width="20" className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                )}
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-violet-600 focus:ring-violet-500 focus:ring-offset-zinc-900"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-zinc-400">
                                J'accepte les{' '}
                                <Link to="/terms" className="text-violet-400 hover:text-violet-300">conditions d'utilisation</Link>
                                {' '}et la{' '}
                                <Link to="/privacy" className="text-violet-400 hover:text-violet-300">politique de confidentialité</Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || !acceptTerms}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                            whileHover={{ scale: acceptTerms ? 1.02 : 1 }}
                            whileTap={{ scale: acceptTerms ? 0.98 : 1 }}
                        >
                            {isLoading ? (
                                <>
                                    <Icon icon="solar:spinner-linear" width="20" className="animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                <>
                                    Créer mon compte
                                    <Icon icon="solar:arrow-right-linear" width="20" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider 
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-zinc-800"></div>
                        <span className="text-sm text-zinc-500">ou</span>
                        <div className="flex-1 h-px bg-zinc-800"></div>
                    </div>*/}

                    {/* Social Sign Up 
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3"
                        >
                            <Icon icon="logos:google-icon" width="20" />
                            S'inscrire avec Google
                        </button>
                        <button
                            onClick={() => window.location.href = 'http://localhost:5000/api/auth/github'}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3"
                        >
                            <Icon icon="logos:github-icon" width="20" />
                            S'inscrire avec GitHub
                        </button>
                    </div>*/}
                </div>

                {/* Login Link */}
                <p className="text-center mt-6 text-zinc-500">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Se connecter
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
