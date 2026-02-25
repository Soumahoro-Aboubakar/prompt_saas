import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ACCENT_CLASSES = {
    violet: { badge: 'bg-violet-500/15 text-violet-400', btn: 'bg-violet-600 hover:bg-violet-500', tag: 'bg-violet-500/10 text-violet-400' },
    blue: { badge: 'bg-blue-500/15 text-blue-400', btn: 'bg-blue-600 hover:bg-blue-500', tag: 'bg-blue-500/10 text-blue-400' },
    fuchsia: { badge: 'bg-fuchsia-500/15 text-fuchsia-400', btn: 'bg-fuchsia-600 hover:bg-fuchsia-500', tag: 'bg-fuchsia-500/10 text-fuchsia-400' },
    amber: { badge: 'bg-amber-500/15 text-amber-400', btn: 'bg-amber-600 hover:bg-amber-500', tag: 'bg-amber-500/10 text-amber-400' },
    emerald: { badge: 'bg-emerald-500/15 text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-500', tag: 'bg-emerald-500/10 text-emerald-400' },
    rose: { badge: 'bg-rose-500/15 text-rose-400', btn: 'bg-rose-600 hover:bg-rose-500', tag: 'bg-rose-500/10 text-rose-400' },
};

export default function PromptModal({ prompt, onClose }) {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const accent = ACCENT_CLASSES[prompt?.accentColor] || ACCENT_CLASSES.violet;

    const handleClose = useCallback(() => onClose(), [onClose]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleClose]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
        }
    };

    return (
        <AnimatePresence>
            {prompt && (
                <div className="fixed inset-0 z-50 flex items-stretch justify-end" onClick={handleClose}>
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Side panel */}
                    <motion.div
                        className="relative w-full max-w-lg bg-zinc-900 border-l border-zinc-800/50 flex flex-col shadow-2xl shadow-black/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {/* Accent glow top */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${prompt.gradient?.replace('/20', '')}`} />

                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-zinc-800/50">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{prompt.previewEmoji}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${accent.badge}`}>
                                        {prompt.category}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-white leading-snug">{prompt.title}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{prompt.description}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0"
                            >
                                <Icon icon="solar:close-circle-linear" width="22" />
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-zinc-800/50">
                            {prompt.tags.map((tag) => (
                                <span key={tag} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${accent.tag}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Prompt content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Prompt complet</h3>
                                <span className="text-xs text-zinc-600">{prompt.prompt.length} caractères</span>
                            </div>
                            <div className="relative">
                                <pre className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-5 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
                                    {prompt.prompt}
                                </pre>
                            </div>

                            {/* Usage tip */}
                            <div className="mt-4 p-4 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Icon icon="solar:lightbulb-linear" width="18" className="text-amber-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        Remplacez les parties entre <span className="text-amber-400 font-mono">[CROCHETS]</span> par vos informations spécifiques avant d'utiliser ce prompt.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="p-6 border-t border-zinc-800/50 flex gap-3">
                            <button
                                onClick={handleCopy}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${copied
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                        : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                <Icon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-linear'} width="18" />
                                {copied ? 'Copié !' : 'Copier le prompt'}
                            </button>
                            <button
                                onClick={() => navigate('/formations')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white ${accent.btn} transition-colors`}
                            >
                                <Icon icon="solar:rocket-linear" width="18" />
                                Utiliser ce prompt
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
