import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                className="text-center max-w-md relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Icon */}
                <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center"
                    initial={{ scale: 0, rotate: 10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <Icon icon="solar:compass-big-bold-duotone" width="48" className="text-violet-400" />
                </motion.div>

                {/* Error code */}
                <motion.div
                    className="text-8xl font-bold mb-2 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                >
                    404
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-xl font-semibold text-white mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                >
                    Page introuvable
                </motion.h1>

                {/* Description */}
                <motion.p
                    className="text-zinc-400 text-sm leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                >
                    La page que vous recherchez n'existe pas ou n'est plus disponible.
                    <br />
                    Vérifiez l'URL ou retournez à une page accessible.
                </motion.p>

                {/* Action buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    <Link to={isAuthenticated ? '/dashboard' : '/'}>
                        <motion.button
                            className="px-6 py-2.5 bg-white text-zinc-900 font-medium text-sm rounded-xl hover:bg-zinc-100 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(139, 92, 246, 0.2)' }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Icon icon="solar:home-2-linear" width="18" />
                            {isAuthenticated ? 'Retour au Dashboard' : 'Retour à l\'accueil'}
                        </motion.button>
                    </Link>

                    {!isAuthenticated && (
                        <Link to="/login">
                            <motion.button
                                className="px-6 py-2.5 border border-zinc-700 text-white font-medium text-sm rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center gap-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Icon icon="solar:login-2-linear" width="18" />
                                Se connecter
                            </motion.button>
                        </Link>
                    )}
                </motion.div>

                {/* Decorative dots */}
                <div
                    className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-20 opacity-15 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.4) 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                    }}
                />
            </motion.div>
        </div>
    );
}
