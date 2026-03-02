import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { countCopy } from '../../services/storeProService';

const TYPE_CONFIG = {
    web_ui: { icon: 'solar:monitor-smartphone-linear', color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Web UI', btn: 'bg-blue-600 hover:bg-blue-500' },
    image: { icon: 'solar:gallery-wide-linear', color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Image', btn: 'bg-amber-600 hover:bg-amber-500' },
    ui_design: { icon: 'solar:palette-linear', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/15', label: 'UI Design', btn: 'bg-fuchsia-600 hover:bg-fuchsia-500' },
    text: { icon: 'solar:pen-new-square-linear', color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Texte', btn: 'bg-violet-600 hover:bg-violet-500' }
};

// ─── Type-specific metadata sections ────────────────────────────────────────

function ImageMeta({ prompt }) {
    const m = prompt.metadata || {};
    const fields = [
        { label: 'Modèle IA', value: prompt.aiModel, icon: 'solar:cpu-linear' },
        { label: "Type d'image", value: m.imageType, icon: 'solar:camera-linear' },
        { label: 'Style artistique', value: m.artStyle, icon: 'solar:palette-linear' },
        { label: 'Ratio', value: m.ratio, icon: 'solar:ruler-cross-pen-linear' },
        { label: 'Résolution', value: m.resolution, icon: 'solar:maximise-square-linear' },
    ].filter(f => f.value);
    if (!fields.length) return null;
    return <MetaGrid fields={fields} />;
}

function WebUIMeta({ prompt }) {
    const m = prompt.metadata || {};
    const libs = Array.isArray(m.libraries) ? m.libraries : (m.libraries ? [m.libraries] : []);
    const themeLabel = { light: 'Clair', dark: 'Sombre', both: 'Clair & Sombre' }[m.webTheme] || m.webTheme;
    const fields = [
        { label: 'Sous-type', value: m.webSubtype, icon: 'solar:window-paragraph-linear' },
        { label: 'Type de projet', value: m.projectType, icon: 'solar:buildings-linear' },
        { label: 'Thème', value: themeLabel, icon: 'solar:sun-fog-linear' },
        { label: 'Framework', value: m.framework || 'React + Tailwind CSS', icon: 'solar:code-square-linear' },
    ].filter(f => f.value);
    return (
        <>
            {fields.length > 0 && <MetaGrid fields={fields} />}
            {libs.length > 0 && (
                <div>
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Icon icon="solar:layers-minimalistic-linear" width="14" />
                        Librairies additionnelles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {libs.map(lib => (
                            <span key={lib} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-lg font-medium">
                                {lib}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

function UIDesignMeta({ prompt }) {
    const m = prompt.metadata || {};
    const fields = [
        { label: 'Outil cible', value: m.designTool, icon: 'solar:pen-new-square-linear' },
        { label: 'Style de design', value: m.designStyle, icon: 'solar:stars-linear' },
        { label: 'Type de produit', value: m.productType, icon: 'solar:widget-linear' },
    ].filter(f => f.value);
    if (!fields.length) return null;
    return <MetaGrid fields={fields} />;
}

function TextMeta({ prompt }) {
    const m = prompt.metadata || {};
    const fields = [
        { label: 'Modèle recommandé', value: prompt.aiModel, icon: 'solar:cpu-linear' },
        { label: 'Catégorie', value: m.textCategory, icon: 'solar:tag-linear' },
    ].filter(f => f.value);
    if (!fields.length) return null;
    return <MetaGrid fields={fields} />;
}

function MetaGrid({ fields }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fields.map(({ label, value, icon }) => (
                <div key={label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Icon icon={icon} width="13" className="text-zinc-500" />
                        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</h4>
                    </div>
                    <p className="text-sm text-zinc-200 font-medium capitalize">{value}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

export default function PromptModal({ prompt, onClose }) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('preview');
    const navigate = useNavigate();

    const config = TYPE_CONFIG[prompt?.type] || {
        ...TYPE_CONFIG.text,
        label: prompt?.typeLabel || prompt?.type || TYPE_CONFIG.text.label,
        icon: prompt?.typeIcon || 'solar:widget-linear'
    };

    const handleClose = useCallback(() => onClose(), [onClose]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            countCopy(prompt._id || prompt.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch { /* fallback */ }
    };

    const handleFullscreen = () => {
        // Open web_ui prompt in a new tab with a sandboxed iframe
        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aperçu — ${prompt.title}</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
<div id="root"></div>
<script type="module">
// Note: This is a prompt preview — import React manually if needed
</script>
</body>
</html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    };

    const panelWidth = prompt.type === 'web_ui' ? 'max-w-5xl' : 'max-w-2xl';

    const renderTypeMetadata = () => {
        switch (prompt.type) {
            case 'image': return <ImageMeta prompt={prompt} />;
            case 'web_ui': return <WebUIMeta prompt={prompt} />;
            case 'ui_design': return <UIDesignMeta prompt={prompt} />;
            case 'text': return <TextMeta prompt={prompt} />;
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            {prompt && (
                <div className="fixed inset-0 z-50 flex items-stretch justify-end" onClick={handleClose}>
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Side panel */}
                    <motion.div
                        className={`relative w-full ${panelWidth} bg-zinc-950 border-l border-zinc-800/50 flex flex-col shadow-2xl shadow-black/60 overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-zinc-800/50 bg-zinc-900/40 gap-4 flex-shrink-0">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${config.bg} ${config.color}`}>
                                        <Icon icon={config.icon} width="13" />
                                        {prompt.category?.label || config.label}
                                    </span>
                                    {prompt.complexity && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50 capitalize">
                                            {prompt.complexity}
                                        </span>
                                    )}
                                    {prompt.views > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-zinc-600">
                                            <Icon icon="solar:eye-linear" width="12" />
                                            {prompt.views}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-white leading-tight mb-1">{prompt.title}</h2>
                                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{prompt.description}</p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Tab toggle (web_ui only) */}
                                {prompt.type === 'web_ui' && (
                                    <div className="flex bg-zinc-900 border border-zinc-700/50 rounded-lg p-1">
                                        <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Rendu</button>
                                        <button onClick={() => setActiveTab('code')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Code</button>
                                    </div>
                                )}
                                {/* Fullscreen for web_ui */}
                                {prompt.type === 'web_ui' && (
                                    <button
                                        onClick={handleFullscreen}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                        title="Ouvrir en plein écran"
                                    >
                                        <Icon icon="solar:maximize-square-linear" width="20" />
                                    </button>
                                )}
                                {/* Close */}
                                <button onClick={handleClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                    <Icon icon="solar:close-circle-linear" width="22" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

                            {/* Web UI — Live Preview */}
                            {prompt.type === 'web_ui' && activeTab === 'preview' ? (
                                <div className="flex-1 bg-white relative overflow-auto min-h-[400px]">
                                    <LiveProvider code={prompt.prompt} noInline={false}>
                                        <LivePreview className="w-full min-h-full" />
                                        <div className="absolute bottom-0 left-0 right-0 font-mono">
                                            <LiveError className="bg-red-900/90 text-red-200 text-xs p-3 m-2 rounded-lg" />
                                        </div>
                                    </LiveProvider>
                                </div>
                            ) : (
                                <div className="p-6 space-y-7 flex-1">

                                    {/* Image / UI Design visual */}
                                    {(prompt.type === 'image' || prompt.type === 'ui_design') && prompt.thumbnailUrl && (
                                        <div className="w-full rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900 flex justify-center">
                                            <img src={prompt.thumbnailUrl} alt={prompt.title} className="max-h-[55vh] object-contain" />
                                        </div>
                                    )}

                                    {/* Type-specific metadata */}
                                    {renderTypeMetadata()}

                                    {/* Tags */}
                                    {prompt.tags?.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Icon icon="solar:tag-price-linear" width="14" />
                                                Tags
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {prompt.tags.map((tag) => (
                                                    <span key={tag} className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 text-xs border border-zinc-700/50">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* The prompt / code content */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                                                <Icon icon={prompt.type === 'web_ui' ? 'solar:code-square-linear' : 'solar:text-square-linear'} width="16" />
                                                {prompt.type === 'web_ui' ? 'Code React + Tailwind' : 'Prompt Complet'}
                                            </h3>
                                            <span className="text-xs text-zinc-600 font-mono">{prompt.prompt?.length || 0} caractères</span>
                                        </div>
                                        <div className="relative group/code">
                                            <pre className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 text-sm text-emerald-400 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto selection:bg-emerald-500/30 max-h-[55vh] overflow-y-auto">
                                                {prompt.prompt}
                                            </pre>
                                            <button
                                                onClick={handleCopy}
                                                className="absolute top-3 right-3 p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg backdrop-blur-sm opacity-0 group-hover/code:opacity-100 transition-all border border-zinc-600/50 flex items-center gap-2 text-xs"
                                            >
                                                <Icon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-linear'} width="15" className={copied ? 'text-emerald-400' : ''} />
                                                {copied ? 'Copié' : 'Copier'}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-zinc-800/50 flex flex-col sm:flex-row gap-3 bg-zinc-950 flex-shrink-0">
                            <button
                                onClick={handleCopy}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${copied
                                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                    : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                <Icon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-linear'} width="18" />
                                {copied ? 'Copié !' : (prompt.type === 'web_ui' ? 'Copier le code' : 'Copier le prompt')}
                            </button>

                            {prompt.type === 'web_ui' ? (
                                <button
                                    onClick={handleFullscreen}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white bg-blue-700 hover:bg-blue-600 transition-colors"
                                >
                                    <Icon icon="solar:maximize-square-linear" width="18" />
                                    Voir en plein écran
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/formations')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white ${config.btn} transition-colors`}
                                >
                                    <Icon icon="solar:rocket-linear" width="18" />
                                    Utiliser ce prompt
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
