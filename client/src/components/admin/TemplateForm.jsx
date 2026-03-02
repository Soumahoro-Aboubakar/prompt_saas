import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { uploadTemplateImage } from '../../services/adminStoreService';

const BUILTIN_TYPE_UI = {
    text: { icon: 'solar:pen-new-square-linear', color: 'text-violet-400' },
    image: { icon: 'solar:gallery-wide-linear', color: 'text-amber-400' },
    web_ui: { icon: 'solar:monitor-smartphone-linear', color: 'text-blue-400' },
    ui_design: { icon: 'solar:palette-linear', color: 'text-fuchsia-400' },
};

const COMPLEXITIES = [
    { value: 'simple', label: 'Simple' },
    { value: 'intermédiaire', label: 'Intermédiaire' },
    { value: 'avancé', label: 'Avancé' },
];

// ─── Type-specific metadata forms ───────────────────────────────────────────

function ImageMetaFields({ metadata, onChange }) {
    return (
        <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-4">
            <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <Icon icon="solar:gallery-wide-linear" width="16" />
                Métadonnées Image
            </h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Type d'image</label>
                    <select name="imageType" value={metadata.imageType || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                        <option value="">Sélectionner...</option>
                        {['illustration', 'photorealistic', '3D render', 'pixel art', 'anime', 'concept art', 'abstract', 'logo'].map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Catégorie</label>
                    <select name="artCategory" value={metadata.artCategory || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                        <option value="">Sélectionner...</option>
                        {['portrait', 'paysage', 'architecture', 'logo', 'UI mockup', 'produit', 'personnage', 'ambiance'].map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Style artistique</label>
                    <input type="text" name="artStyle" value={metadata.artStyle || ''} onChange={onChange}
                        placeholder="Ex : cinematic, soft lighting..." className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Ratio recommandé</label>
                    <select name="ratio" value={metadata.ratio || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                        <option value="">Sélectionner...</option>
                        {['1:1', '4:3', '16:9', '9:16', '3:2', '2:3', '21:9'].map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1.5">Résolution recommandée</label>
                    <input type="text" name="resolution" value={metadata.resolution || ''} onChange={onChange}
                        placeholder="Ex : 1024×1024, 1920×1080" className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
            </div>
        </div>
    );
}

function WebUIMetaFields({ metadata, onChange, onLibraryChange }) {
    const libs = Array.isArray(metadata.libraries) ? metadata.libraries.join(', ') : (metadata.libraries || '');
    return (
        <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl space-y-4">
            <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                <Icon icon="solar:monitor-smartphone-linear" width="16" />
                Métadonnées Web UI
            </h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Sous-type</label>
                    <select name="webSubtype" value={metadata.webSubtype || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50">
                        <option value="">Sélectionner...</option>
                        <option value="page-complète">Page complète</option>
                        <option value="section">Section de page</option>
                        <option value="composant">Composant</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Catégorie web</label>
                    <select name="webCategory" value={metadata.webCategory || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50">
                        <option value="">Sélectionner...</option>
                        <option value="page">Page complète</option>
                        <option value="section">Section</option>
                        <option value="component">Composant</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Type de projet cible</label>
                    <select name="projectType" value={metadata.projectType || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50">
                        <option value="">Sélectionner...</option>
                        {['SaaS', 'E-commerce', 'Booking', 'Restaurant', 'Portfolio', 'Blog', 'Application mobile', 'Dashboard', 'Crypto / Web3'].map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Thème de couleur</label>
                    <select name="webTheme" value={metadata.webTheme || 'both'} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50">
                        <option value="light">Clair uniquement</option>
                        <option value="dark">Sombre uniquement</option>
                        <option value="both">Clair & Sombre</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Framework</label>
                    <input type="text" name="framework" value={metadata.framework || 'React + Tailwind CSS'} onChange={onChange}
                        placeholder="React + Tailwind CSS" className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Position dans l'arborescence</label>
                    <input type="text" name="treePosition" value={metadata.treePosition || ''} onChange={onChange}
                        placeholder="home.hero, pricing.section, checkout.payment..."
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Compatibilité (types, séparés par virgules)</label>
                    <input type="text" name="compatibleWith" value={Array.isArray(metadata.compatibleWith) ? metadata.compatibleWith.join(', ') : (metadata.compatibleWith || '')}
                        onChange={(e) => onLibraryChange(e, 'compatibleWith')}
                        placeholder="hero, navbar, pricing-cards..."
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1.5">Librairies additionnelles (séparées par virgules)</label>
                    <input type="text" name="libraries" value={libs} onChange={(e) => onLibraryChange(e, 'libraries')}
                        placeholder="Framer Motion, Recharts, ShadCN..." className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
            </div>
        </div>
    );
}

function UIDesignMetaFields({ metadata, onChange }) {
    return (
        <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 p-4 rounded-xl space-y-4">
            <h4 className="text-sm font-semibold text-fuchsia-400 flex items-center gap-2">
                <Icon icon="solar:palette-linear" width="16" />
                Métadonnées UI Design
            </h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Outil cible</label>
                    <select name="designTool" value={metadata.designTool || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500/50">
                        <option value="">Sélectionner...</option>
                        {['Figma', 'Adobe XD', 'Sketch', 'Framer', 'Penpot', 'Webflow'].map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Style de design</label>
                    <select name="designStyle" value={metadata.designStyle || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500/50">
                        <option value="">Sélectionner...</option>
                        {['Material Design', 'Glassmorphism', 'Neumorphism', 'Flat', 'Brutalism', 'Minimalist', 'Dark Mode', 'Gradient'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Type de produit</label>
                    <select name="productType" value={metadata.productType || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500/50">
                        <option value="">Sélectionner...</option>
                        {['Application mobile', 'Dashboard web', 'Design System', 'Landing Page', 'E-commerce', 'SaaS'].map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Catégorie</label>
                    <select name="designCategory" value={metadata.designCategory || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fuchsia-500/50">
                        <option value="">Sélectionner...</option>
                        {['Composant', 'Écran complet', 'Flux utilisateur', 'Design System', 'Wireframe'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

function TextMetaFields({ metadata, onChange }) {
    return (
        <div className="bg-violet-500/5 border border-violet-500/20 p-4 rounded-xl space-y-4">
            <h4 className="text-sm font-semibold text-violet-400 flex items-center gap-2">
                <Icon icon="solar:pen-new-square-linear" width="16" />
                Métadonnées Prompt Texte
            </h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Catégorie</label>
                    <select name="textCategory" value={metadata.textCategory || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                        <option value="">Sélectionner...</option>
                        {['Rédaction', 'Analyse', 'Développement', 'Marketing', 'SEO', 'Business', 'Éducation', 'Créatif'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Modèle recommandé</label>
                    <select name="recommendedModel" value={metadata.recommendedModel || ''} onChange={onChange}
                        className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                        <option value="">Tout modèle</option>
                        {['GPT-4o', 'GPT-4', 'Claude 3.5 Sonnet', 'Claude 3 Opus', 'Gemini 1.5 Pro', 'Mistral Large', 'Llama 3'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

// ─── Main TemplateForm ───────────────────────────────────────────────────────

export default function TemplateForm({ initialData = null, categories = [], templateTypes = [], onSubmit, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: templateTypes[0]?.key || 'text',
        category: '',
        prompt: '',
        tags: '',
        complexity: 'simple',
        aiModel: '',
        thumbnailUrl: '',
        status: 'draft',
        metadata: {}
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                category: initialData.category?._id || initialData.category || '',
                tags: initialData.tags?.join(', ') || '',
                metadata: initialData.metadata || {}
            });
        } else if (categories.length > 0) {
            setFormData(prev => ({
                ...prev,
                category: categories[0]._id || categories[0].slug,
                type: prev.type || templateTypes[0]?.key || 'text'
            }));
        }
    }, [initialData, categories, templateTypes]);

    useEffect(() => {
        if (!templateTypes.length) return;
        const allowed = templateTypes.map((t) => t.key);
        setFormData((prev) => {
            if (allowed.includes(prev.type)) return prev;
            return { ...prev, type: templateTypes[0].key };
        });
    }, [templateTypes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMetadataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            metadata: { ...prev.metadata, [name]: value }
        }));
    };

    // Special handler for libraries (convert comma-separated string to array)
    const handleCommaArrayChange = (e, field) => {
        const { value } = e.target;
        const libs = value.split(',').map(l => l.trim()).filter(Boolean);
        setFormData((prev) => ({
            ...prev,
            metadata: { ...prev.metadata, [field]: libs }
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setUploadingImage(true);
            const res = await uploadTemplateImage(file);
            if (res.success) {
                setFormData(prev => ({ ...prev, thumbnailUrl: res.url }));
            }
        } catch (err) {
            alert("Erreur lors de l'upload de l'image");
            console.error(err);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const submitData = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };
        await onSubmit(submitData);
        setLoading(false);
    };

    const fallbackTypes = [
        { key: 'text', label: 'Prompt Pur (Texte)' },
        { key: 'image', label: "Génération d'images" },
        { key: 'web_ui', label: 'Page / Composant Web (React + Tailwind)' },
        { key: 'ui_design', label: 'Design UI (Maquette)' },
    ];
    const availableTypes = templateTypes.length > 0 ? templateTypes : fallbackTypes;
    const currentType = availableTypes.find(t => t.key === formData.type) || availableTypes[0];
    const currentTypeUI = BUILTIN_TYPE_UI[formData.type] || { icon: currentType?.icon || 'solar:widget-linear', color: 'text-zinc-300' };
    const needsImage = ['image', 'ui_design', 'web_ui'].includes(formData.type);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50">
            {/* Form header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {currentType && (
                        <div className={`p-2 rounded-xl bg-zinc-800/80 ${currentTypeUI.color}`}>
                            <Icon icon={currentTypeUI.icon} width="20" />
                        </div>
                    )}
                    <h2 className="text-xl font-semibold text-white">
                        {initialData ? 'Modifier le Template' : 'Nouveau Template'}
                    </h2>
                </div>
                <button type="button" onClick={onCancel} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <Icon icon="solar:close-circle-linear" width="22" />
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left column — General Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Informations générales</h3>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Titre <span className="text-rose-400">*</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required
                            className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description <span className="text-rose-400">*</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="3"
                            className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Type <span className="text-rose-400">*</span></label>
                            <select name="type" value={formData.type} onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors">
                                {availableTypes
                                    .filter((t) => t.isActive !== false)
                                    .map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Catégorie <span className="text-rose-400">*</span></label>
                            <select name="category" value={formData.category} onChange={handleChange} required
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors">
                                <option value="" disabled>Sélectionnez...</option>
                                {categories.map(c => <option key={c._id || c.slug} value={c._id || c.slug}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Modèle IA</label>
                            <input type="text" name="aiModel" value={formData.aiModel} onChange={handleChange}
                                placeholder="GPT-4, Midjourney v6..."
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Complexité</label>
                            <select name="complexity" value={formData.complexity} onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors">
                                {COMPLEXITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Tags (séparés par des virgules)</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                            placeholder="SaaS, Landing Page, Dark Mode..."
                            className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Statut</label>
                        <div className="flex gap-3">
                            {[{ value: 'draft', label: 'Brouillon', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' }, { value: 'published', label: 'Publié', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' }].map(s => (
                                <button key={s.value} type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, status: s.value }))}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${formData.status === s.value ? s.color : 'border-zinc-700/50 text-zinc-500 bg-zinc-900 hover:border-zinc-600'}`}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column — Content & Type-specific */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contenu & Métadonnées</h3>

                    {/* Image upload (for image, ui_design, web_ui) */}
                    {needsImage && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Image / Aperçu</label>
                            <div className="flex items-center gap-3">
                                <input type="text" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange}
                                    placeholder="https://... (ou uploadez)"
                                    className="flex-1 bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors min-w-0" />
                                <div className="relative flex-shrink-0">
                                    <input type="file" accept="image/*" onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploadingImage} />
                                    <button type="button" disabled={uploadingImage}
                                        className={`bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded-lg text-sm text-white flex items-center gap-2 transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
                                        <Icon icon={uploadingImage ? 'line-md:loading-twotone-loop' : 'solar:upload-linear'} width="16" />
                                        {uploadingImage ? 'Envoi...' : 'Upload'}
                                    </button>
                                </div>
                            </div>
                            {formData.thumbnailUrl && (
                                <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-zinc-700/50">
                                    <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
                                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-900/60 text-white rounded-md transition-colors">
                                        <Icon icon="solar:trash-bin-trash-linear" width="14" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Type-specific metadata */}
                    {formData.type === 'image' && <ImageMetaFields metadata={formData.metadata} onChange={handleMetadataChange} />}
                    {formData.type === 'web_ui' && <WebUIMetaFields metadata={formData.metadata} onChange={handleMetadataChange} onLibraryChange={handleCommaArrayChange} />}
                    {formData.type === 'ui_design' && <UIDesignMetaFields metadata={formData.metadata} onChange={handleMetadataChange} />}
                    {formData.type === 'text' && <TextMetaFields metadata={formData.metadata} onChange={handleMetadataChange} />}

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Mots-clés de suggestion (virgules)</label>
                        <input
                            type="text"
                            value={Array.isArray(formData.metadata?.searchKeywords) ? formData.metadata.searchKeywords.join(', ') : ''}
                            onChange={(e) => handleCommaArrayChange(e, 'searchKeywords')}
                            placeholder="landing page, hero, ecommerce, react..."
                            className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors"
                        />
                        <p className="text-xs text-zinc-600 mt-1">Utilisé pour les suggestions instantanées futures.</p>
                    </div>

                    {/* Prompt / Code */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                            {formData.type === 'web_ui' ? 'Code complet (composant React)' : 'Texte du Prompt'} <span className="text-rose-400">*</span>
                        </label>
                        <textarea
                            name="prompt"
                            value={formData.prompt}
                            onChange={handleChange}
                            required
                            rows={formData.type === 'web_ui' ? 14 : 10}
                            placeholder={formData.type === 'web_ui' ? 'export default function MyComponent() {\n  return (\n    <div className="...">\n      ...\n    </div>\n  );\n}' : 'Act as a professional designer...\n\nCreate a...'}
                            className="w-full bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-emerald-400 font-mono text-sm focus:outline-none focus:border-violet-500/60 transition-colors resize-y"
                        />
                        <p className="text-xs text-zinc-600 mt-1">{formData.prompt.length} caractères</p>
                    </div>
                </div>
            </div>

            {/* Footer actions */}
            <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                <p className="text-xs text-zinc-600">
                    {formData.status === 'draft' ? '💡 Brouillon — non visible dans le Store' : '✅ Sera publié et visible dans le Store'}
                </p>
                <div className="flex gap-3">
                    <button type="button" onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-sm">
                        Annuler
                    </button>
                    <button type="submit" disabled={loading || uploadingImage}
                        className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 text-sm">
                        {loading ? (
                            <><Icon icon="line-md:loading-twotone-loop" width="18" />Sauvegarde...</>
                        ) : (
                            <><Icon icon="solar:disk-linear" width="18" />{initialData ? 'Mettre à jour' : 'Créer le template'}</>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
