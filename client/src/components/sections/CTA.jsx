import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FadeIn } from '../../hooks/useAnimations';

export default function CTA() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleStartFree = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/signup');
        }
    };

    const handleViewDemo = () => {
        const section = document.getElementById('parcours-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    className="relative bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 border border-violet-500/20 rounded-3xl p-12 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Animated glow behind */}
                    <motion.div
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <FadeIn direction="up" delay={0.1}>
                        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4 relative">Prêt à maîtriser l'IA ?</h2>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2}>
                        <p className="text-zinc-400 mb-8 max-w-lg mx-auto relative">Rejoignez des milliers d'apprenants et commencez votre parcours vers l'expertise en Prompt Engineering.</p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.3}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                            <motion.button
                                onClick={handleStartFree}
                                className="w-full sm:w-auto px-8 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-100 transition-colors"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)',
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Démarrer gratuitement
                            </motion.button>
                            <motion.button
                                onClick={handleViewDemo}
                                className="w-full sm:w-auto px-8 py-3 border border-zinc-600 text-white font-medium rounded-lg hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon icon="solar:play-circle-linear" width="20" />
                                Voir la démo
                            </motion.button>
                        </div>
                    </FadeIn>
                </motion.div>
            </div>
        </section>
    );
}
