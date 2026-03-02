import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import TemplateForm from '../../components/admin/TemplateForm';
import {
    getAdminTemplates, deleteTemplate,
    getAdminCategories, createCategory, updateCategory, deleteCategory,
    createTemplate, updateTemplate,
    getAdminTemplateTypes, createTemplateType, updateTemplateType, deleteTemplateType
} from '../../services/adminStoreService';

const TYPE_BADGES = {
    image: { label: 'Image', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    web_ui: { label: 'Web UI', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    ui_design: { label: 'UI Design', color: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20' },
    text: { label: 'Texte', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
};

// ─── Category Manager ────────────────────────────────────────────────────────

function CategoryManager({ categories, onRefresh }) {
    const [editingId, setEditingId] = useState(null);
    const [newCat, setNewCat] = useState({ label: '', slug: '', description: '', order: 0 });
    const [editData, setEditData] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createCategory(newCat);
            setNewCat({ label: '', slug: '', description: '', order: 0 });
            setShowForm(false);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id) => {
        setSaving(true);
        try {
            await updateCategory(id, editData);
            setEditingId(null);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, label) => {
        if (!window.confirm(`Supprimer la catégorie «${label}» ?`)) return;
        try {
            await deleteCategory(id);
            onRefresh();
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat._id);
        setEditData({ label: cat.label, slug: cat.slug, description: cat.description || '', order: cat.order, isActive: cat.isActive });
    };

    const autoSlug = (label) => label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return (
        <div className="space-y-5">
            {/* New category button */}
            {!showForm ? (
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-400 text-sm font-medium rounded-xl transition-all">
                    <Icon icon="solar:add-square-linear" width="18" />
                    Nouvelle catégorie
                </button>
            ) : (
                <form onSubmit={handleCreate} className="bg-zinc-900/60 border border-violet-500/20 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-violet-400 flex items-center gap-2">
                        <Icon icon="solar:add-circle-linear" width="16" />
                        Créer une catégorie
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Label (affiché)</label>
                            <input type="text" value={newCat.label} required
                                onChange={e => setNewCat(p => ({ ...p, label: e.target.value, slug: autoSlug(e.target.value) }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Slug (URL)</label>
                            <input type="text" value={newCat.slug} required
                                onChange={e => setNewCat(p => ({ ...p, slug: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Description</label>
                            <input type="text" value={newCat.description}
                                onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Ordre d'affichage</label>
                            <input type="number" value={newCat.order} min="0"
                                onChange={e => setNewCat(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">Annuler</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                            {saving && <Icon icon="line-md:loading-twotone-loop" width="16" />}
                            Créer
                        </button>
                    </div>
                </form>
            )}

            {/* Category list */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
                {categories.length === 0 ? (
                    <div className="p-10 text-center text-zinc-500 text-sm">Aucune catégorie. Créez-en une ci-dessus.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-800/30 text-zinc-400">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium">Label</th>
                                <th className="px-5 py-3 text-left font-medium">Slug</th>
                                <th className="px-5 py-3 text-left font-medium">Ordre</th>
                                <th className="px-5 py-3 text-left font-medium">Statut</th>
                                <th className="px-5 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {categories.map(cat => (
                                <tr key={cat._id} className="hover:bg-zinc-800/20 transition-colors">
                                    {editingId === cat._id ? (
                                        <>
                                            <td className="px-5 py-3">
                                                <input type="text" value={editData.label}
                                                    onChange={e => setEditData(p => ({ ...p, label: e.target.value }))}
                                                    className="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-white text-sm w-full" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <input type="text" value={editData.slug}
                                                    onChange={e => setEditData(p => ({ ...p, slug: e.target.value }))}
                                                    className="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-white text-sm w-full font-mono" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <input type="number" value={editData.order}
                                                    onChange={e => setEditData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                                                    className="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-white text-sm w-20" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <button onClick={() => setEditData(p => ({ ...p, isActive: !p.isActive }))}
                                                    className={`px-2 py-1 rounded text-xs border transition-colors ${editData.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}`}>
                                                    {editData.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleUpdate(cat._id)} disabled={saving}
                                                        className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors">
                                                        <Icon icon="solar:check-circle-linear" width="18" />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)}
                                                        className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors">
                                                        <Icon icon="solar:close-circle-linear" width="18" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-5 py-3 font-medium text-white">{cat.label}</td>
                                            <td className="px-5 py-3 text-zinc-400 font-mono text-xs">{cat.slug}</td>
                                            <td className="px-5 py-3 text-zinc-400">{cat.order}</td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-1 rounded text-xs border ${cat.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}`}>
                                                    {cat.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => startEdit(cat)}
                                                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
                                                        <Icon icon="solar:pen-linear" width="17" />
                                                    </button>
                                                    <button onClick={() => handleDelete(cat._id, cat.label)}
                                                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                                                        <Icon icon="solar:trash-bin-trash-linear" width="17" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function TemplateTypeManager({ templateTypes, onRefresh }) {
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newType, setNewType] = useState({ label: '', key: '', description: '', icon: 'solar:widget-linear', order: 100 });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const normalizeKey = (label) => label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createTemplateType(newType);
            setNewType({ label: '', key: '', description: '', icon: 'solar:widget-linear', order: 100 });
            setShowForm(false);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la création du type');
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (type) => {
        setEditingId(type._id);
        setEditData({
            label: type.label,
            key: type.key,
            description: type.description || '',
            icon: type.icon || 'solar:widget-linear',
            order: type.order || 100,
            isActive: type.isActive
        });
    };

    const handleUpdate = async (id) => {
        setSaving(true);
        try {
            await updateTemplateType(id, editData);
            setEditingId(null);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, label) => {
        if (!window.confirm(`Supprimer le type «${label}» ?`)) return;
        try {
            await deleteTemplateType(id);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Suppression impossible');
        }
    };

    return (
        <div className="space-y-5">
            {!showForm ? (
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-400 text-sm font-medium rounded-xl transition-all">
                    <Icon icon="solar:add-square-linear" width="18" />
                    Nouveau type
                </button>
            ) : (
                <form onSubmit={handleCreate} className="bg-zinc-900/60 border border-violet-500/20 rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-violet-400">Créer un type personnalisé</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Label</label>
                            <input type="text" required value={newType.label}
                                onChange={(e) => setNewType((p) => ({ ...p, label: e.target.value, key: normalizeKey(e.target.value) }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Key</label>
                            <input type="text" required value={newType.key}
                                onChange={(e) => setNewType((p) => ({ ...p, key: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Icône (Iconify)</label>
                            <input type="text" value={newType.icon}
                                onChange={(e) => setNewType((p) => ({ ...p, icon: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Ordre</label>
                            <input type="number" value={newType.order}
                                onChange={(e) => setNewType((p) => ({ ...p, order: Number(e.target.value) || 100 }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs text-zinc-400 mb-1">Description</label>
                            <input type="text" value={newType.description}
                                onChange={(e) => setNewType((p) => ({ ...p, description: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">Annuler</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50">Créer</button>
                    </div>
                </form>
            )}

            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm whitespace-nowrap">
                        <thead className="bg-zinc-800/30 text-zinc-400">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium">Type</th>
                                <th className="px-5 py-3 text-left font-medium">Key</th>
                                <th className="px-5 py-3 text-left font-medium">Statut</th>
                                <th className="px-5 py-3 text-left font-medium">Système</th>
                                <th className="px-5 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {templateTypes.map((type) => (
                                <tr key={type._id}>
                                    {editingId === type._id ? (
                                        <>
                                            <td className="px-5 py-3">
                                                <input value={editData.label} onChange={(e) => setEditData((p) => ({ ...p, label: e.target.value }))}
                                                    className="bg-zinc-900 border border-zinc-700/50 rounded px-2 py-1 text-white" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <input disabled={type.isSystem} value={editData.key} onChange={(e) => setEditData((p) => ({ ...p, key: e.target.value }))}
                                                    className="bg-zinc-900 border border-zinc-700/50 rounded px-2 py-1 text-white font-mono disabled:opacity-50" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <button onClick={() => setEditData((p) => ({ ...p, isActive: !p.isActive }))}
                                                    className={`px-2 py-1 rounded text-xs border ${editData.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}`}>
                                                    {editData.isActive ? 'Actif' : 'Inactif'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3 text-zinc-500">{type.isSystem ? 'Oui' : 'Non'}</td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleUpdate(type._id)} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors">
                                                        <Icon icon="solar:check-circle-linear" width="18" />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors">
                                                        <Icon icon="solar:close-circle-linear" width="18" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-5 py-3 text-white font-medium flex items-center gap-2">
                                                <Icon icon={type.icon || 'solar:widget-linear'} width="16" className="text-zinc-500" />
                                                {type.label}
                                            </td>
                                            <td className="px-5 py-3 text-zinc-400 font-mono">{type.key}</td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-1 rounded text-xs border ${type.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}`}>
                                                    {type.isActive ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-zinc-500">{type.isSystem ? 'Oui' : 'Non'}</td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => startEdit(type)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
                                                        <Icon icon="solar:pen-linear" width="17" />
                                                    </button>
                                                    {!type.isSystem && (
                                                        <button onClick={() => handleDelete(type._id, type.label)} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                                                            <Icon icon="solar:trash-bin-trash-linear" width="17" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function TemplateAdmin() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'categories'
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [templateTypes, setTemplateTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState(null); // null | 'create' | 'edit'
    const [templateToEdit, setTemplateToEdit] = useState(null);

    // Admin filters
    const [adminFilters, setAdminFilters] = useState({ status: '', type: '', search: '' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [tplRes, catRes, typeRes] = await Promise.all([
                getAdminTemplates({ limit: 100, ...adminFilters }),
                getAdminCategories(),
                getAdminTemplateTypes()
            ]);
            setTemplates(tplRes.data || []);
            setCategories(catRes.data || []);
            setTemplateTypes(typeRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [adminFilters]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce template ?')) return;
        try {
            await deleteTemplate(id);
            setTemplates(prev => prev.filter(t => t._id !== id));
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (templateToEdit) {
                await updateTemplate(templateToEdit._id, data);
            } else {
                await createTemplate(data);
            }
            setViewState(null);
            setTemplateToEdit(null);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        }
    };

    const openEdit = (tpl) => {
        setTemplateToEdit(tpl);
        setViewState('edit');
    };

    const TABS = [
        { id: 'templates', label: 'Templates', icon: 'solar:box-minimalistic-linear' },
        { id: 'categories', label: 'Catégories', icon: 'solar:folder-with-files-linear' },
        { id: 'types', label: 'Types', icon: 'solar:widget-linear' },
    ];

    return (
        <div className="bg-zinc-950 text-white min-h-screen antialiased">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64 flex flex-col min-h-screen">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Page header */}
                    <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                                Gestion Store Pro
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">Admin</span>
                            </h1>
                            <p className="text-zinc-400 text-sm mt-1">Gérez la bibliothèque de templates et de catégories.</p>
                        </div>
                        {!viewState && activeTab === 'templates' && (
                            <button onClick={() => { setTemplateToEdit(null); setViewState('create'); }}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-all">
                                <Icon icon="solar:add-square-linear" width="20" />
                                Nouveau Template
                            </button>
                        )}
                    </div>

                    {viewState ? (
                        <div className="max-w-5xl">
                            <TemplateForm
                                initialData={templateToEdit}
                                categories={categories}
                                templateTypes={templateTypes}
                                onSubmit={handleFormSubmit}
                                onCancel={() => { setViewState(null); setTemplateToEdit(null); }}
                            />
                        </div>
                    ) : (
                        <>
                            {/* Tabs */}
                            <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-1 w-fit mb-6">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-zinc-800 text-white'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        <Icon icon={tab.icon} width="16" />
                                        {tab.label}
                                        {tab.id === 'templates' && templates.length > 0 && (
                                            <span className="bg-zinc-700 text-zinc-300 text-xs px-1.5 py-0.5 rounded-full">
                                                {templates.length}
                                            </span>
                                        )}
                                        {tab.id === 'categories' && categories.length > 0 && (
                                            <span className="bg-zinc-700 text-zinc-300 text-xs px-1.5 py-0.5 rounded-full">
                                                {categories.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Templates tab */}
                            {activeTab === 'templates' && (
                                <>
                                    {/* Quick filters */}
                                    <div className="flex flex-wrap items-center gap-3 mb-5">
                                        <div className="relative">
                                            <Icon icon="solar:magnifer-linear" width="15" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                            <input
                                                type="text"
                                                value={adminFilters.search}
                                                onChange={e => setAdminFilters(p => ({ ...p, search: e.target.value }))}
                                                placeholder="Rechercher..."
                                                className="pl-9 pr-4 py-2 bg-zinc-900/60 border border-zinc-800/50 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50 w-52"
                                            />
                                        </div>
                                        <select value={adminFilters.type} onChange={e => setAdminFilters(p => ({ ...p, type: e.target.value }))}
                                            className="bg-zinc-900/60 border border-zinc-800/50 rounded-lg px-3 py-2 text-zinc-300 text-sm focus:outline-none focus:border-violet-500/50">
                                            <option value="">Tous les types</option>
                                            {templateTypes.map((type) => (
                                                <option key={type._id} value={type.key}>{type.label}</option>
                                            ))}
                                        </select>
                                        <select value={adminFilters.status} onChange={e => setAdminFilters(p => ({ ...p, status: e.target.value }))}
                                            className="bg-zinc-900/60 border border-zinc-800/50 rounded-lg px-3 py-2 text-zinc-300 text-sm focus:outline-none focus:border-violet-500/50">
                                            <option value="">Tous les statuts</option>
                                            <option value="published">Publié</option>
                                            <option value="draft">Brouillon</option>
                                        </select>
                                        {(adminFilters.type || adminFilters.status || adminFilters.search) && (
                                            <button onClick={() => setAdminFilters({ status: '', type: '', search: '' })}
                                                className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1">
                                                <Icon icon="solar:close-circle-linear" width="14" />
                                                Réinitialiser
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
                                        {loading ? (
                                            <div className="p-8 flex justify-center text-zinc-500">
                                                <Icon icon="line-md:loading-twotone-loop" width="32" />
                                            </div>
                                        ) : templates.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                                                    <Icon icon="solar:box-minimalistic-linear" width="32" />
                                                </div>
                                                <h3 className="text-white font-medium mb-1">Aucun template</h3>
                                                <p className="text-zinc-400 text-sm">
                                                    {adminFilters.type || adminFilters.status || adminFilters.search
                                                        ? 'Aucun résultat pour ces filtres.'
                                                        : 'Créez votre premier template.'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-sm whitespace-nowrap">
                                                    <thead className="bg-zinc-800/30 text-zinc-400">
                                                        <tr>
                                                            <th className="px-5 py-4 font-medium">Titre</th>
                                                            <th className="px-5 py-4 font-medium">Type</th>
                                                            <th className="px-5 py-4 font-medium">Catégorie</th>
                                                            <th className="px-5 py-4 font-medium">Statut</th>
                                                            <th className="px-5 py-4 font-medium">Vues / Copies</th>
                                                            <th className="px-5 py-4 font-medium text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-zinc-800/50">
                                                        {templates.map(tpl => {
                                                            const configuredType = templateTypes.find((t) => t.key === tpl.type);
                                                            const typeBadge = TYPE_BADGES[tpl.type] || {
                                                                label: configuredType?.label || tpl.type,
                                                                color: 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                            };
                                                            return (
                                                                <tr key={tpl._id} className="hover:bg-zinc-800/20 transition-colors group">
                                                                    <td className="px-5 py-3.5">
                                                                        <div className="flex items-center gap-3">
                                                                            {tpl.thumbnailUrl && (
                                                                                <img src={tpl.thumbnailUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-zinc-800 flex-shrink-0" />
                                                                            )}
                                                                            <span className="font-medium text-white truncate max-w-[200px]">{tpl.title}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${typeBadge.color}`}>
                                                                            {typeBadge.label}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-zinc-400">{tpl.category?.label || '—'}</td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${tpl.status === 'published'
                                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                                            {tpl.status === 'published' ? 'Publié' : 'Brouillon'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-zinc-500 font-mono text-xs">
                                                                        <span className="flex items-center gap-3">
                                                                            <span className="flex items-center gap-1"><Icon icon="solar:eye-linear" width="13" />{tpl.views}</span>
                                                                            <span className="flex items-center gap-1"><Icon icon="solar:copy-linear" width="13" />{tpl.copies}</span>
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-right">
                                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <button onClick={() => openEdit(tpl)}
                                                                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Modifier">
                                                                                <Icon icon="solar:pen-linear" width="17" />
                                                                            </button>
                                                                            <button onClick={() => handleDelete(tpl._id)}
                                                                                className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Supprimer">
                                                                                <Icon icon="solar:trash-bin-trash-linear" width="17" />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Categories tab */}
                            {activeTab === 'categories' && (
                                <CategoryManager categories={categories} onRefresh={loadData} />
                            )}
                            {activeTab === 'types' && (
                                <TemplateTypeManager templateTypes={templateTypes} onRefresh={loadData} />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
