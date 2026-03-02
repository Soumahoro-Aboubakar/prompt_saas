import { useState } from 'react';
import { Icon } from '@iconify/react';
import { countCopy } from '../../services/storeProService';

// ─── Type configuration ────────────────────────────────────────────────────
const TYPE_CONFIG = {
    image: {
        icon: 'solar:gallery-wide-linear',
        label: 'Image',
        color: 'text-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/20',
        btn: 'bg-amber-600 hover:bg-amber-500',
        glow: 'rgba(245,158,11,0.15)',
    },
    web_ui: {
        icon: 'solar:monitor-smartphone-linear',
        label: 'Web UI',
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/20',
        btn: 'bg-blue-600 hover:bg-blue-500',
        glow: 'rgba(59,130,246,0.15)',
    },
    ui_design: {
        icon: 'solar:palette-linear',
        label: 'UI Design',
        color: 'text-fuchsia-400',
        bg: 'bg-fuchsia-500/15',
        border: 'border-fuchsia-500/20',
        btn: 'bg-fuchsia-600 hover:bg-fuchsia-500',
        glow: 'rgba(192,38,211,0.15)',
    },
    text: {
        icon: 'solar:pen-new-square-linear',
        label: 'Texte',
        color: 'text-violet-400',
        bg: 'bg-violet-500/15',
        border: 'border-violet-500/20',
        btn: 'bg-violet-600 hover:bg-violet-500',
        glow: 'rgba(124,58,237,0.15)',
    },
};

const COMPLEXITY_LABELS = {
    simple: { label: 'Simple', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    'intermédiaire': { label: 'Intermédiaire', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    'avancé': { label: 'Avancé', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
};

// ─── Preview by type ──────────────────────────────────────────────────────

function ImagePreview({ prompt }) {
    if (prompt.thumbnailUrl) {
        return (
            <div className="relative h-44 overflow-hidden bg-zinc-900">
                <img
                    src={prompt.thumbnailUrl}
                    alt={prompt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
                {/* Model badge */}
                {prompt.aiModel && (
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md border border-white/10 font-mono">
                        {prompt.aiModel}
                    </span>
                )}
            </div>
        );
    }
    return (
        <div className="h-44 bg-gradient-to-br from-amber-950/40 to-amber-900/20 flex flex-col items-center justify-center gap-2 border-b border-amber-500/10">
            <Icon icon="solar:gallery-wide-linear" width="36" className="text-amber-400/60" />
            <span className="text-xs text-amber-400/50">Aucun aperçu</span>
        </div>
    );
}

function WebUIPreview({ prompt }) {
    // Show a code snippet as preview
    const snippetLines = (prompt.prompt || '').split('\n').slice(0, 6);
    return (
        <div className="relative h-44 bg-zinc-950/80 border-b border-blue-500/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3 py-2 bg-zinc-900/80 border-b border-zinc-800/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-xs text-zinc-500 font-mono">component.jsx</span>
            </div>
            <pre className="pt-9 px-4 pb-2 text-[10px] leading-relaxed text-blue-300/70 font-mono overflow-hidden opacity-80 select-none whitespace-pre-wrap">
                {snippetLines.join('\n')}
                {prompt.prompt && prompt.prompt.split('\n').length > 6 && (
                    <span className="text-zinc-600">{'\n...'}</span>
                )}
            </pre>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/90 top-9" />
            {/* Metadata badges */}
            {prompt.metadata?.webSubtype && (
                <span className="absolute bottom-2 right-3 bg-blue-900/60 backdrop-blur-sm text-blue-300 text-xs px-2 py-0.5 rounded-md border border-blue-500/20 font-medium capitalize">
                    {prompt.metadata.webSubtype}
                </span>
            )}
        </div>
    );
}

function UIDesignPreview({ prompt }) {
    if (prompt.thumbnailUrl) {
        return (
            <div className="relative h-44 overflow-hidden bg-zinc-900">
                <img
                    src={prompt.thumbnailUrl}
                    alt={prompt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
                {prompt.metadata?.designTool && (
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md border border-white/10">
                        {prompt.metadata.designTool}
                    </span>
                )}
            </div>
        );
    }
    return (
        <div className="h-44 bg-gradient-to-br from-fuchsia-950/40 to-fuchsia-900/20 flex flex-col items-center justify-center gap-2 border-b border-fuchsia-500/10">
            <Icon icon="solar:palette-linear" width="36" className="text-fuchsia-400/60" />
            <span className="text-xs text-fuchsia-400/50">Aucun aperçu design</span>
        </div>
    );
}

function TextPreview({ prompt }) {
    const preview = (prompt.prompt || '').slice(0, 180);
    return (
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-violet-950/30 via-zinc-900/50 to-zinc-950 border-b border-violet-500/10 p-4 flex flex-col justify-center">
            {/* Decorative quote */}
            <Icon icon="solar:quote-up-bold" width="24" className="text-violet-500/20 mb-2" />
            <p className="text-sm text-zinc-400/80 font-mono leading-relaxed line-clamp-4">
                {preview}
                {prompt.prompt?.length > 180 && '…'}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        </div>
    );
}

// ─── Main Card ────────────────────────────────────────────────────────────

export default function PromptCard({ prompt, onView }) {
    const [copied, setCopied] = useState(false);
    const cfg = TYPE_CONFIG[prompt.type] || {
        ...TYPE_CONFIG.text,
        label: prompt.typeLabel || prompt.type || TYPE_CONFIG.text.label,
        icon: prompt.typeIcon || 'solar:widget-linear'
    };
    const complexity = COMPLEXITY_LABELS[prompt.complexity];

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            countCopy(prompt._id || prompt.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback */ }
    };

    const renderPreview = () => {
        switch (prompt.type) {
            case 'image': return <ImagePreview prompt={prompt} />;
            case 'web_ui': return <WebUIPreview prompt={prompt} />;
            case 'ui_design': return <UIDesignPreview prompt={prompt} />;
            case 'text': return <TextPreview prompt={prompt} />;
            default: return <TextPreview prompt={prompt} />;
        }
    };

    return (
        <div
            className="group relative bg-zinc-900/60 border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-700/50 hover:-translate-y-1 hover:shadow-2xl flex flex-col cursor-pointer"
            style={{ '--glow-color': cfg.glow }}
            onClick={() => onView(prompt)}
        >
            {/* Glow effect on hover */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ boxShadow: `0 0 40px 0 var(--glow-color, transparent)` }}
            />

            {/* Type-specific preview */}
            {renderPreview()}

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                {/* Type + Complexity badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <Icon icon={cfg.icon} width="12" />
                        {cfg.label}
                    </span>
                    {complexity && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${complexity.color}`}>
                            {complexity.label}
                        </span>
                    )}
                    {prompt.category?.label && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                            {prompt.category.label}
                        </span>
                    )}
                </div>

                <h3 className="font-semibold text-white text-sm leading-snug mb-1.5 line-clamp-2">
                    {prompt.title}
                </h3>
                <p className="text-xs text-zinc-500 mb-3 line-clamp-2 flex-1 leading-relaxed">
                    {prompt.description}
                </p>

                {/* Metadata line (type-specific) */}
                {renderMetaLine(prompt)}

                {/* Tags */}
                {prompt.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {prompt.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-zinc-800/80 text-zinc-500 text-xs rounded">
                                #{tag}
                            </span>
                        ))}
                        {prompt.tags.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-zinc-800/80 text-zinc-600 text-xs rounded">
                                +{prompt.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Stats + Actions */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-zinc-800/50">
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-zinc-600 text-xs flex-1">
                        <span className="flex items-center gap-1">
                            <Icon icon="solar:eye-linear" width="12" />
                            {prompt.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon icon="solar:copy-linear" width="12" />
                            {prompt.copies || 0}
                        </span>
                    </div>

                    {/* Copy */}
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border flex-shrink-0 ${copied
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`}
                        title="Copier le prompt"
                    >
                        <Icon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-linear'} width="14" />
                        {copied ? 'Copié !' : 'Copier'}
                    </button>

                    {/* View */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onView(prompt); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white flex-shrink-0 transition-colors ${cfg.btn}`}
                    >
                        <Icon icon="solar:eye-linear" width="14" />
                        Voir
                    </button>
                </div>
            </div>
        </div>
    );
}

function renderMetaLine(prompt) {
    const items = [];

    if (prompt.type === 'image') {
        if (prompt.metadata?.imageType) items.push({ icon: 'solar:camera-linear', label: prompt.metadata.imageType });
        if (prompt.metadata?.artStyle) items.push({ icon: 'solar:palette-linear', label: prompt.metadata.artStyle });
        if (prompt.metadata?.ratio) items.push({ icon: 'solar:ruler-cross-pen-linear', label: prompt.metadata.ratio });
    } else if (prompt.type === 'web_ui') {
        if (prompt.metadata?.projectType) items.push({ icon: 'solar:buildings-linear', label: prompt.metadata.projectType });
        if (prompt.metadata?.webTheme) items.push({ icon: 'solar:sun-fog-linear', label: prompt.metadata.webTheme === 'dark' ? 'Sombre' : prompt.metadata.webTheme === 'light' ? 'Clair' : 'Clair & Sombre' });
    } else if (prompt.type === 'ui_design') {
        if (prompt.metadata?.designStyle) items.push({ icon: 'solar:stars-linear', label: prompt.metadata.designStyle });
        if (prompt.metadata?.designTool) items.push({ icon: 'solar:pen-new-square-linear', label: prompt.metadata.designTool });
    } else if (prompt.type === 'text') {
        if (prompt.aiModel) items.push({ icon: 'solar:cpu-linear', label: prompt.aiModel });
        if (prompt.metadata?.textCategory) items.push({ icon: 'solar:tag-linear', label: prompt.metadata.textCategory });
    }

    if (items.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-3">
            {items.slice(0, 2).map((item, i) => (
                <span key={i} className="flex items-center gap-1 text-xs text-zinc-500">
                    <Icon icon={item.icon} width="11" className="text-zinc-600 flex-shrink-0" />
                    <span className="truncate max-w-[100px]">{item.label}</span>
                </span>
            ))}
        </div>
    );
}
