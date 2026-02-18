import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlowPulse } from '../../hooks/useAnimations';

export default function Hero() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    };

    const handleStartDiagnostic = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/signup');
        }
    };

    const handleViewParcours = () => {
        const section = document.getElementById('parcours-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="bg-gradient-to-b from-violet-600/10 via-transparent to-transparent absolute top-0 right-0 bottom-0 left-0"></div>

            {/* Animated glow orb */}
            <GlowPulse className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />

            <motion.div
                className="max-w-4xl mx-auto text-center relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Badge */}
                <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400 mb-6"
                    variants={itemVariants}
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Nouvelle session disponible
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6"
                    variants={itemVariants}
                >
                    Devenez un expert en{' '}
                    <motion.span
                        className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
                        initial={{ backgroundSize: '0% 100%' }}
                        animate={{ backgroundSize: '100% 100%' }}
                        transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                    >
                        Prompt Engineering
                    </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg text-zinc-400 max-w-2xl mr-auto mb-10 ml-auto"
                    variants={itemVariants}
                >
                    La première école numérique francophone spécialisée dans la maîtrise de l'IA. Formations pratiques, mentor IA personnel et parcours adaptatif.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    variants={itemVariants}
                >
                    <motion.button
                        onClick={handleStartDiagnostic}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
                        variants={buttonVariants}
                        whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Icon icon="solar:play-linear" width="20" style={{ strokeWidth: 1.5 }} />
                        Commencer le diagnostic
                    </motion.button>
                    <motion.button
                        onClick={handleViewParcours}
                        className="w-full sm:w-auto px-6 py-3 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800/50 transition-colors"
                        variants={buttonVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Voir les parcours
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
}
