import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PromptCard from '../components/store/PromptCard';
import PromptModal from '../components/store/PromptModal';
import { getPrompts, getCategories } from '../services/storeProService';

const CATEGORY_ICONS = {
    developpement: { icon: 'solar:code-square-linear', color: 'text-violet-400', bg: 'bg-violet-500/10' },
    'interface-web': { icon: 'solar:monitor-smartphone-linear', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    'design-ui': { icon: 'solar:palette-linear', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
    'generation-images': { icon: 'solar:gallery-wide-linear', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    marketing: { icon: 'solar:megaphone-linear', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    redaction: { icon: 'solar:pen-new-square-linear', color: 'text-rose-400', bg: 'bg-rose-500/10' },
};

// Skeleton card for loading state
function SkeletonCard() {
    return (
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-36 bg-zinc-800/50" />
            <div className="p-5 space-y-3">
                <div className="h-4 w-24 bg-zinc-800 rounded-full" />
                <div className="h-5 w-3/4 bg-zinc-800 rounded-lg" />
                <div className="h-4 w-full bg-zinc-800 rounded-lg" />
                <div className="h-4 w-2/3 bg-zinc-800 rounded-lg" />
                <div className="flex gap-2 pt-2">
                    <div className="h-9 w-24 bg-zinc-800 rounded-lg" />
                    <div className="h-9 flex-1 bg-zinc-800 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default function StorePro() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [prompts, setPrompts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    // Load categories once
    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => { }); // non-blocking
    }, []);

    // Load prompts when category changes
    useEffect(() => {
        setLoading(true);
        setError(null);
        getPrompts(activeCategory)
            .then((data) => {
                setPrompts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Impossible de charger les prompts. Vérifiez votre connexion.');
                setLoading(false);
            });
    }, [activeCategory]);

    // Client-side search filter
    const filteredPrompts = useMemo(() => {
        if (!search.trim()) return prompts;
        const q = search.toLowerCase();
        return prompts.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q))
        );
    }, [prompts, search]);

    return (
        <div className="bg-zinc-950 text-white min-h-screen antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                Store Pro
                            </h1>
                            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
                                ✦ Pro
                            </span>
                        </div>
                        <p className="text-zinc-400">
                            Des prompts prêts à l'emploi, organisés par catégorie. Copiez et utilisez-les instantanément.
                        </p>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-6">
                        <Icon
                            icon="solar:magnifer-linear"
                            width="18"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un prompt, une catégorie, un tag..."
                            className="w-full pl-11 pr-4 py-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all text-sm"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                <Icon icon="solar:close-circle-linear" width="18" />
                            </button>
                        )}
                    </div>

                    {/* Category tabs */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        {/* All tab */}
                        <button
                            onClick={() => { setActiveCategory('all'); setSearch(''); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === 'all'
                                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                                    : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50'
                                }`}
                        >
                            <Icon icon="solar:widget-linear" width="16" />
                            Tous
                        </button>

                        {categories.map((cat) => {
                            const style = CATEGORY_ICONS[cat.slug] || { icon: 'solar:folder-linear', color: 'text-zinc-400', bg: '' };
                            const isActive = activeCategory === cat.slug;
                            return (
                                <button
                                    key={cat.slug}
                                    onClick={() => { setActiveCategory(cat.slug); setSearch(''); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${isActive
                                            ? `${style.bg} ${style.color} border border-current/30`
                                            : 'text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50'
                                        }`}
                                >
                                    <Icon icon={style.icon} width="16" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Results count */}
                    {!loading && !error && (
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm text-zinc-500">
                                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} disponible{filteredPrompts.length !== 1 ? 's' : ''}
                                {search && <span className="text-zinc-600"> pour « {search} »</span>}
                            </p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <Icon icon="solar:danger-triangle-linear" width="32" className="text-red-400" />
                            </div>
                            <h3 className="font-medium text-white mb-1">Erreur de chargement</h3>
                            <p className="text-sm text-zinc-500 mb-4">{error}</p>
                            <button
                                onClick={() => setActiveCategory(activeCategory)}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && filteredPrompts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                <Icon icon="solar:magnifer-linear" width="28" className="text-zinc-600" />
                            </div>
                            <h3 className="font-medium text-white mb-1">Aucun résultat</h3>
                            <p className="text-sm text-zinc-500">
                                Aucun prompt ne correspond à votre recherche.
                            </p>
                            <button
                                onClick={() => setSearch('')}
                                className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
                            >
                                Effacer la recherche
                            </button>
                        </div>
                    )}

                    {/* Prompts grid */}
                    {!loading && !error && filteredPrompts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredPrompts.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    prompt={prompt}
                                    onView={setSelectedPrompt}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Prompt Modal */}
            {selectedPrompt && (
                <PromptModal
                    prompt={selectedPrompt}
                    onClose={() => setSelectedPrompt(null)}
                />
            )}
        </div>
    );
}
