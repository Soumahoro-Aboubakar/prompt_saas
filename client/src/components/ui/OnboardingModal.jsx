import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import useOnboarding from '../../hooks/useOnboarding';
import onboardingContent from '../../config/onboardingContent';

/**
 * OnboardingModal — shows a contextual help modal for new users.
 *
 * @param {{ routeKey: string }} props
 *   routeKey — the route identifier, e.g. '/dashboard'
 */
export default function OnboardingModal({ routeKey }) {
    const { showModal, dismiss, dismissForever, viewCount } = useOnboarding(routeKey);
    const content = onboardingContent[routeKey];

    // Close on Escape key
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') dismiss();
        },
        [dismiss],
    );

    useEffect(() => {
        if (!showModal) return;
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal, handleKeyDown]);

    // If no content configured for this route, render nothing
    if (!content) return null;

    return (
        <AnimatePresence>
            {showModal && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                    onClick={dismiss}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="relative w-full max-w-md bg-zinc-900/95 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/10"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {/* Top accent glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-28 bg-violet-500/12 rounded-full blur-3xl pointer-events-none" />

                        {/* Step indicator */}
                        <div className="absolute top-4 right-4">
                            <span className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[11px] font-medium text-violet-400 tracking-wide">
                                {viewCount} / 3
                            </span>
                        </div>

                        <div className="relative p-6 sm:p-8">
                            {/* Header icon */}
                            <motion.div
                                className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border border-violet-500/25 flex items-center justify-center"
                                initial={{ scale: 0, rotate: -15 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                            >
                                <Icon icon={content.icon} width="28" className="text-violet-400" />
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 leading-tight">
                                {content.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-zinc-400 text-center mb-6 leading-relaxed max-w-sm mx-auto">
                                {content.description}
                            </p>

                            {/* Feature list */}
                            <div className="space-y-3 mb-7">
                                {content.features.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-start gap-3 px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-700/30"
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.08 }}
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mt-0.5">
                                            <Icon icon={feature.icon} width="16" className="text-violet-400" />
                                        </div>
                                        <span className="text-sm text-zinc-300 leading-snug">{feature.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.button
                                    onClick={dismiss}
                                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Icon icon="solar:check-circle-bold" width="18" />
                                    Compris
                                </motion.button>

                                <motion.button
                                    onClick={dismissForever}
                                    className="flex-1 px-5 py-2.5 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600/50 text-zinc-400 hover:text-zinc-300 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Icon icon="solar:close-circle-linear" width="18" />
                                    Ne plus afficher
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
