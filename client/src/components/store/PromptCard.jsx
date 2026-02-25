import { useState } from 'react';
import { Icon } from '@iconify/react';

const ACCENT_CLASSES = {
    violet: { tag: 'bg-violet-500/15 text-violet-400', copy: 'hover:bg-violet-500/10 hover:text-violet-400', view: 'bg-violet-600 hover:bg-violet-500' },
    blue: { tag: 'bg-blue-500/15 text-blue-400', copy: 'hover:bg-blue-500/10 hover:text-blue-400', view: 'bg-blue-600 hover:bg-blue-500' },
    fuchsia: { tag: 'bg-fuchsia-500/15 text-fuchsia-400', copy: 'hover:bg-fuchsia-500/10 hover:text-fuchsia-400', view: 'bg-fuchsia-600 hover:bg-fuchsia-500' },
    amber: { tag: 'bg-amber-500/15 text-amber-400', copy: 'hover:bg-amber-500/10 hover:text-amber-400', view: 'bg-amber-600 hover:bg-amber-500' },
    emerald: { tag: 'bg-emerald-500/15 text-emerald-400', copy: 'hover:bg-emerald-500/10 hover:text-emerald-400', view: 'bg-emerald-600 hover:bg-emerald-500' },
    rose: { tag: 'bg-rose-500/15 text-rose-400', copy: 'hover:bg-rose-500/10 hover:text-rose-400', view: 'bg-rose-600 hover:bg-rose-500' },
};

export default function PromptCard({ prompt, onView }) {
    const [copied, setCopied] = useState(false);
    const accent = ACCENT_CLASSES[prompt.accentColor] || ACCENT_CLASSES.violet;

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    return (
        <div className={`group relative bg-zinc-900/60 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700/70 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 flex flex-col`}>
            {/* Preview area */}
            <div className={`relative h-36 bg-gradient-to-br ${prompt.gradient} flex items-center justify-center overflow-hidden`}>
                <span className="text-5xl select-none">{prompt.previewEmoji}</span>
                {/* Subtle glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* Category badge */}
                <span className={`inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${accent.tag}`}>
                    {prompt.category}
                </span>

                <h3 className="font-semibold text-white text-base mb-1.5 leading-snug group-hover:text-white transition-colors">
                    {prompt.title}
                </h3>
                <p className="text-sm text-zinc-500 mb-4 line-clamp-2 flex-1">
                    {prompt.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {prompt.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-zinc-800/80 text-zinc-400 text-xs rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 ${accent.copy} transition-all duration-200 flex-shrink-0`}
                        title="Copier le prompt"
                    >
                        <Icon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-linear'} width="16" className={copied ? 'text-emerald-400' : ''} />
                        <span className={copied ? 'text-emerald-400' : ''}>{copied ? 'Copié !' : 'Copier'}</span>
                    </button>
                    <button
                        onClick={() => onView(prompt)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white font-medium ${accent.view} transition-colors`}
                    >
                        <Icon icon="solar:eye-linear" width="16" />
                        Voir le prompt
                    </button>
                </div>
            </div>
        </div>
    );
}
