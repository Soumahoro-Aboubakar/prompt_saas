import { useState, useEffect, useMemo, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PromptCard from '../components/store/PromptCard';
import PromptModal from '../components/store/PromptModal';
import { getPrompts, getCategories, getTemplateTypes } from '../services/storeProService';

const SORT_OPTIONS = [
    { value: 'recent', label: 'Récents', icon: 'solar:clock-circle-linear' },
    { value: 'popular', label: 'Populaires', icon: 'solar:fire-linear' },
    { value: 'trending', label: 'Tendances', icon: 'solar:graph-up-linear' },
];

const COMPLEXITY_OPTIONS = [
    { value: '', label: 'Toute complexité' },
    { value: 'simple', label: 'Simple' },
    { value: 'intermédiaire', label: 'Intermédiaire' },
    { value: 'avancé', label: 'Avancé' },
];

const PAGE_SIZE = 12;

function SkeletonCard() {
    return (
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-44 bg-zinc-800/50" />
            <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-zinc-800 rounded-lg" />
                <div className="h-4 w-full bg-zinc-800 rounded-lg" />
                <div className="h-4 w-2/3 bg-zinc-800 rounded-lg" />
            </div>
        </div>
    );
}

function ActiveFilterBadge({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-600/15 border border-violet-500/25 text-violet-400 text-xs rounded-full font-medium">
            {label}
            <button onClick={onRemove} className="hover:text-white transition-colors">
                <Icon icon="solar:close-circle-bold" width="13" />
            </button>
        </span>
    );
}

function FieldLabel({ icon, children }) {
    return (
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Icon icon={icon} width="14" />
            {children}
        </h3>
    );
}

function SelectField({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-violet-500/60"
        >
            {options.map((opt) => <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>)}
        </select>
    );
}

function FiltersPanel({ filters, onChange, categories, templateTypes }) {
    return (
        <div className="space-y-5">
            <div>
                <FieldLabel icon="solar:widget-linear">Type de template</FieldLabel>
                <SelectField
                    value={filters.type}
                    onChange={(value) => onChange('type', value)}
                    options={[{ value: '', label: 'Tous les types' }, ...templateTypes.map((type) => ({ value: type.key, label: type.label }))]}
                />
            </div>

            <div>
                <FieldLabel icon="solar:folder-linear">Catégorie</FieldLabel>
                <SelectField
                    value={filters.category}
                    onChange={(value) => onChange('category', value)}
                    options={[{ value: '', label: 'Toutes les catégories' }, ...categories.map((cat) => ({ value: cat.slug, label: cat.label }))]}
                />
            </div>

            <div>
                <FieldLabel icon="solar:chart-linear">Complexité</FieldLabel>
                <SelectField value={filters.complexity} onChange={(value) => onChange('complexity', value)} options={COMPLEXITY_OPTIONS} />
            </div>

            <div>
                <FieldLabel icon="solar:cpu-linear">Modèle IA</FieldLabel>
                <input
                    value={filters.model}
                    onChange={(e) => onChange('model', e.target.value)}
                    placeholder="GPT-4o, Midjourney v6, SDXL..."
                    className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-violet-500/60"
                />
            </div>

            <div>
                <FieldLabel icon="solar:tag-price-linear">Tags (virgules)</FieldLabel>
                <input
                    value={filters.tags}
                    onChange={(e) => onChange('tags', e.target.value)}
                    placeholder="landing page, ecommerce, dark mode"
                    className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-violet-500/60"
                />
            </div>

            {filters.type === 'web_ui' && (
                <div className="space-y-4 pt-1 border-t border-zinc-800/70">
                    <FieldLabel icon="solar:monitor-smartphone-linear">Filtres contextuels Web</FieldLabel>
                    <SelectField
                        value={filters.webCategory}
                        onChange={(value) => onChange('webCategory', value)}
                        options={[
                            { value: '', label: 'Page + Section + Composant' },
                            { value: 'page', label: 'Pages complètes' },
                            { value: 'section', label: 'Sections' },
                            { value: 'component', label: 'Composants' },
                        ]}
                    />
                    <SelectField
                        value={filters.subtype}
                        onChange={(value) => onChange('subtype', value)}
                        options={[
                            { value: '', label: 'Tout sous-type' },
                            { value: 'page-complète', label: 'Page complète' },
                            { value: 'section', label: 'Section' },
                            { value: 'composant', label: 'Composant' },
                        ]}
                    />
                    <SelectField
                        value={filters.theme}
                        onChange={(value) => onChange('theme', value)}
                        options={[
                            { value: '', label: 'Tous thèmes' },
                            { value: 'light', label: 'Clair' },
                            { value: 'dark', label: 'Sombre' },
                            { value: 'both', label: 'Auto' },
                        ]}
                    />
                    <input
                        value={filters.targetProjectType}
                        onChange={(e) => onChange('targetProjectType', e.target.value)}
                        placeholder="E-commerce, Booking, SaaS..."
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-violet-500/60"
                    />
                    <input
                        value={filters.libraries}
                        onChange={(e) => onChange('libraries', e.target.value)}
                        placeholder="Framer Motion, ShadCN, Headless UI"
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-violet-500/60"
                    />
                </div>
            )}

            {filters.type === 'image' && (
                <div className="space-y-4 pt-1 border-t border-zinc-800/70">
                    <FieldLabel icon="solar:gallery-wide-linear">Filtres contextuels Image</FieldLabel>
                    <input value={filters.imageType} onChange={(e) => onChange('imageType', e.target.value)} placeholder="illustration, photo, 3D, pixel art" className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm" />
                    <input value={filters.artCategory} onChange={(e) => onChange('artCategory', e.target.value)} placeholder="portrait, paysage, logo..." className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm" />
                    <input value={filters.style} onChange={(e) => onChange('style', e.target.value)} placeholder="cinematic, anime, watercolor..." className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm" />
                </div>
            )}

            {filters.type === 'ui_design' && (
                <div className="space-y-4 pt-1 border-t border-zinc-800/70">
                    <FieldLabel icon="solar:palette-linear">Filtres contextuels UI Design</FieldLabel>
                    <input value={filters.designTool} onChange={(e) => onChange('designTool', e.target.value)} placeholder="Figma, Adobe XD, Sketch" className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm" />
                    <input value={filters.style} onChange={(e) => onChange('style', e.target.value)} placeholder="Material, Glassmorphism, Brutalism" className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm" />
                </div>
            )}

            {filters.type === 'text' && (
                <div className="space-y-4 pt-1 border-t border-zinc-800/70">
                    <FieldLabel icon="solar:text-square-linear">Filtres contextuels Texte</FieldLabel>
                    <input value={filters.textCategory} onChange={(e) => onChange('textCategory', e.target.value)} placeholder="Rédaction, Analyse, Développement" className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-zinc-200 text-sm" />
                </div>
            )}

            <button onClick={() => onChange('__reset__', null)} className="w-full py-2 text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all">
                Réinitialiser les filtres
            </button>
        </div>
    );
}

export default function StorePro() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [templateTypes, setTemplateTypes] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, hasMore: false, page: 1 });
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        type: '',
        category: '',
        complexity: '',
        sort: 'recent',
        model: '',
        style: '',
        targetProjectType: '',
        theme: '',
        tags: '',
        subtype: '',
        webCategory: '',
        libraries: '',
        textCategory: '',
        imageType: '',
        artCategory: '',
        designTool: '',
    });

    useEffect(() => {
        Promise.all([getCategories(), getTemplateTypes()])
            .then(([cats, types]) => {
                setCategories(cats || []);
                setTemplateTypes(types || []);
            })
            .catch(() => { });
    }, []);

    const activeFilterCount = useMemo(() => {
        return Object.entries(filters)
            .filter(([key, value]) => key !== 'search' && key !== 'sort' && !!value)
            .length;
    }, [filters]);

    const fetchTemplates = useCallback(async (page = 1, append = false) => {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        try {
            const params = {
                ...(filters.search && { search: filters.search }),
                ...(filters.type && { type: filters.type }),
                ...(filters.category && { category: filters.category }),
                ...(filters.complexity && { complexity: filters.complexity }),
                ...(filters.model && { model: filters.model }),
                ...(filters.style && { style: filters.style }),
                ...(filters.targetProjectType && { targetProjectType: filters.targetProjectType }),
                ...(filters.theme && { theme: filters.theme }),
                ...(filters.tags && { tags: filters.tags }),
                ...(filters.subtype && { subtype: filters.subtype }),
                ...(filters.webCategory && { webCategory: filters.webCategory }),
                ...(filters.libraries && { libraries: filters.libraries }),
                ...(filters.textCategory && { textCategory: filters.textCategory }),
                ...(filters.imageType && { imageType: filters.imageType }),
                ...(filters.artCategory && { artCategory: filters.artCategory }),
                ...(filters.designTool && { designTool: filters.designTool }),
                sort: filters.sort,
                page,
                limit: PAGE_SIZE,
            };

            const res = await getPrompts(params);
            if (append) {
                setTemplates((prev) => [...prev, ...(res.data || [])]);
            } else {
                setTemplates(res.data || []);
            }
            setPagination({ total: res.pagination?.total || 0, hasMore: res.pagination?.hasMore || false, page });
        } catch {
            setError('Impossible de charger les templates. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTemplates(1, false);
    }, [fetchTemplates]);

    const handleLoadMore = () => {
        fetchTemplates(pagination.page + 1, true);
    };

    const resetFilters = {
        search: '',
        type: '',
        category: '',
        complexity: '',
        sort: 'recent',
        model: '',
        style: '',
        targetProjectType: '',
        theme: '',
        tags: '',
        subtype: '',
        webCategory: '',
        libraries: '',
        textCategory: '',
        imageType: '',
        artCategory: '',
        designTool: '',
    };

    const handleFilterChange = (key, value) => {
        if (key === '__reset__') {
            setFilters(resetFilters);
            return;
        }
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const activeBadges = [
        filters.type && { label: templateTypes.find((t) => t.key === filters.type)?.label || filters.type, key: 'type' },
        filters.category && { label: categories.find((c) => c.slug === filters.category)?.label || filters.category, key: 'category' },
        filters.complexity && { label: COMPLEXITY_OPTIONS.find((c) => c.value === filters.complexity)?.label || filters.complexity, key: 'complexity' },
        filters.targetProjectType && { label: `Projet: ${filters.targetProjectType}`, key: 'targetProjectType' },
        filters.theme && { label: `Thème: ${filters.theme}`, key: 'theme' },
        filters.webCategory && { label: `Web: ${filters.webCategory}`, key: 'webCategory' },
        filters.model && { label: `Modèle: ${filters.model}`, key: 'model' },
    ].filter(Boolean);

    return (
        <div className="bg-zinc-950 text-white min-h-screen antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <div className="flex">
                    <aside className="hidden xl:block w-72 flex-shrink-0 border-r border-zinc-800/50 px-5 py-8 transition-all">
                        <h2 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
                            <Icon icon="solar:filter-linear" width="16" className="text-violet-400" />
                            Filtres avancés
                        </h2>
                        <FiltersPanel filters={filters} onChange={handleFilterChange} categories={categories} templateTypes={templateTypes} />
                    </aside>

                    <main className="flex-1 p-4 sm:p-6 min-w-0">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-1.5">
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Store Pro</h1>
                                <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
                                    Pro
                                </span>
                            </div>
                            <p className="text-zinc-400 text-sm">Bibliothèque de templates organisés, indexés et prêts pour les futures fonctionnalités IA.</p>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="relative flex-1">
                                <Icon icon="solar:magnifer-linear" width="17" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Recherche full-text (titre, prompt, tags, index)"
                                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/60 border border-zinc-800/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 text-sm transition-all"
                                />
                                {filters.search && (
                                    <button onClick={() => handleFilterChange('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                                        <Icon icon="solar:close-circle-linear" width="17" />
                                    </button>
                                )}
                            </div>

                            <div className="hidden sm:flex bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-1 gap-0.5 flex-shrink-0">
                                {SORT_OPTIONS.map((s) => (
                                    <button key={s.value} onClick={() => handleFilterChange('sort', s.value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.sort === s.value ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                                        <Icon icon={s.icon} width="13" />
                                        {s.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setFilterPanelOpen((prev) => !prev)}
                                className={`xl:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all flex-shrink-0 ${filterPanelOpen || activeFilterCount > 0 ? 'bg-violet-600/20 border-violet-500/30 text-violet-400' : 'bg-zinc-900/60 border-zinc-800/50 text-zinc-400'}`}
                            >
                                <Icon icon="solar:filter-linear" width="17" />
                                Filtres
                                {activeFilterCount > 0 && <span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{activeFilterCount}</span>}
                            </button>
                        </div>

                        {filterPanelOpen && (
                            <div className="xl:hidden mb-5 bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-5 backdrop-blur-sm">
                                <FiltersPanel filters={filters} onChange={handleFilterChange} categories={categories} templateTypes={templateTypes} />
                            </div>
                        )}

                        {activeBadges.length > 0 && (
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <span className="text-xs text-zinc-600">Filtres actifs :</span>
                                {activeBadges.map((badge) => (
                                    <ActiveFilterBadge
                                        key={`${badge.key}-${badge.label}`}
                                        label={badge.label}
                                        onRemove={() => handleFilterChange(badge.key, '')}
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && !error && (
                            <p className="text-sm text-zinc-500 mb-5">
                                {pagination.total} template{pagination.total !== 1 ? 's' : ''} disponible{pagination.total !== 1 ? 's' : ''}
                                {filters.search && <span className="text-zinc-600"> pour « {filters.search} »</span>}
                            </p>
                        )}

                        {error && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-14 h-14 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Icon icon="solar:danger-triangle-linear" width="28" className="text-red-400" />
                                </div>
                                <h3 className="font-medium text-white mb-1">Erreur de chargement</h3>
                                <p className="text-sm text-zinc-500 mb-4">{error}</p>
                                <button onClick={() => fetchTemplates(1)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors">Réessayer</button>
                            </div>
                        )}

                        {loading && !error && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        )}

                        {!loading && !error && templates.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-16 h-16 mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                                    <Icon icon="solar:box-minimalistic-linear" width="30" className="text-zinc-600" />
                                </div>
                                <h3 className="font-medium text-white mb-1">Aucun résultat</h3>
                                <p className="text-sm text-zinc-500 mb-4 max-w-xs">Aucun template ne correspond aux filtres sélectionnés.</p>
                                <button onClick={() => handleFilterChange('__reset__', null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors">
                                    Effacer les filtres
                                </button>
                            </div>
                        )}

                        {!loading && !error && templates.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {templates.map((prompt) => <PromptCard key={prompt._id} prompt={prompt} onView={setSelectedPrompt} />)}
                                </div>

                                {pagination.hasMore && (
                                    <div className="flex justify-center mt-10">
                                        <button onClick={handleLoadMore} disabled={loadingMore} className="flex items-center gap-2 px-6 py-3 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 text-sm font-medium rounded-xl transition-all disabled:opacity-50">
                                            {loadingMore ? (<><Icon icon="line-md:loading-twotone-loop" width="18" />Chargement...</>) : (<><Icon icon="solar:alt-arrow-down-linear" width="18" />Charger plus</>)}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {selectedPrompt && <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />}
        </div>
    );
}
