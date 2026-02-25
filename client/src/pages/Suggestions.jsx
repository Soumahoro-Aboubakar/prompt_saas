import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../context/AuthContext';
import * as suggestionsService from '../services/suggestionsService';

// Category config
const CATEGORIES = {
    feature: { label: 'New Feature', icon: 'solar:star-shine-linear', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/25' },
    improvement: { label: 'Improvement', icon: 'solar:pen-new-square-linear', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/25' },
    optimization: { label: 'Optimization', icon: 'solar:bolt-circle-linear', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
};

// Status config
const STATUSES = {
    all: { label: 'All', icon: 'solar:list-linear', color: 'text-zinc-300' },
    pending: { label: 'Pending', icon: 'solar:clock-circle-linear', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/25' },
    in_review: { label: 'In Review', icon: 'solar:eye-linear', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25' },
    in_progress: { label: 'In Progress', icon: 'solar:programming-linear', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25' },
    implemented: { label: 'Implemented', icon: 'solar:check-circle-linear', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
    declined: { label: 'Declined', icon: 'solar:close-circle-linear', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25' },
};

// Skeleton loader
function SkeletonCard() {
    return (
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
                    <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
            </div>
        </div>
    );
}

export default function Suggestions() {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMine, setShowMine] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [expandedAdmin, setExpandedAdmin] = useState(null);
    const [adminResponseText, setAdminResponseText] = useState('');
    const [adminStatusId, setAdminStatusId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'feature' });

    const isAdmin = user?.role === 'admin';

    // Fetch suggestions
    const fetchSuggestions = useCallback(async () => {
        setLoading(true);
        try {
            let res;
            if (showMine) {
                res = await suggestionsService.getMySuggestions();
            } else {
                res = await suggestionsService.getSuggestions({
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    sort: sortBy
                });
            }
            setSuggestions(res.data || []);
        } catch {
            showToast('Failed to load suggestions', 'error');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, sortBy, showMine]);

    useEffect(() => { fetchSuggestions(); }, [fetchSuggestions]);

    // Toast helper
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Create suggestion
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) return;
        setSubmitting(true);
        try {
            const res = await suggestionsService.createSuggestion(formData);
            setSuggestions(prev => [res.data, ...prev]);
            setFormData({ title: '', description: '', category: 'feature' });
            setShowCreateModal(false);
            showToast('Suggestion submitted successfully!');
        } catch {
            showToast('Failed to submit suggestion', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Toggle vote
    const handleVote = async (id) => {
        try {
            const res = await suggestionsService.toggleVote(id);
            setSuggestions(prev => prev.map(s =>
                s._id === id
                    ? { ...s, voteCount: res.data.voteCount, hasVoted: res.data.hasVoted }
                    : s
            ));
        } catch {
            showToast('Failed to vote', 'error');
        }
    };

    // Admin: update status
    const handleStatusChange = async (id, status) => {
        try {
            await suggestionsService.updateStatus(id, status);
            setSuggestions(prev => prev.map(s =>
                s._id === id ? { ...s, status } : s
            ));
            setAdminStatusId(null);
            showToast('Status updated');
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    // Admin: respond
    const handleAdminRespond = async (id) => {
        if (!adminResponseText.trim()) return;
        try {
            const res = await suggestionsService.respondToSuggestion(id, adminResponseText);
            setSuggestions(prev => prev.map(s =>
                s._id === id ? { ...s, adminResponse: res.data.adminResponse, adminRespondedBy: res.data.adminRespondedBy, adminRespondedAt: res.data.adminRespondedAt } : s
            ));
            setAdminResponseText('');
            setExpandedAdmin(null);
            showToast('Response sent');
        } catch {
            showToast('Failed to send response', 'error');
        }
    };

    // Delete
    const handleDelete = async (id) => {
        try {
            await suggestionsService.deleteSuggestion(id);
            setSuggestions(prev => prev.filter(s => s._id !== id));
            showToast('Suggestion deleted');
        } catch {
            showToast('Failed to delete suggestion', 'error');
        }
    };

    // Stats
    const totalCount = suggestions.length;
    const implementedCount = suggestions.filter(s => s.status === 'implemented').length;

    const formatDate = (d) => {
        const date = new Date(d);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `${diffH}h ago`;
        const diffD = Math.floor(diffH / 24);
        if (diffD < 30) return `${diffD}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 lg:ml-64">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                    Suggestions
                                </h1>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Propose ideas, vote for features, and shape the future of the platform
                                </p>
                            </div>
                            <motion.button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-violet-500/20"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Icon icon="solar:add-circle-linear" width="18" />
                                New Suggestion
                            </motion.button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-violet-400">{totalCount}</div>
                                <div className="text-xs text-zinc-500 mt-1">Total Ideas</div>
                            </div>
                            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-emerald-400">{implementedCount}</div>
                                <div className="text-xs text-zinc-500 mt-1">Implemented</div>
                            </div>
                            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-sky-400">
                                    {suggestions.reduce((sum, s) => sum + (s.voteCount || 0), 0)}
                                </div>
                                <div className="text-xs text-zinc-500 mt-1">Total Votes</div>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            {/* Status Tabs */}
                            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-wrap">
                                {Object.entries(STATUSES).map(([key, s]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setStatusFilter(key); setShowMine(false); }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === key && !showMine
                                                ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                                                : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-700/50'
                                            }`}
                                    >
                                        <Icon icon={s.icon} width="14" />
                                        {s.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowMine(!showMine)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${showMine
                                            ? 'bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30'
                                            : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-700/50'
                                        }`}
                                >
                                    <Icon icon="solar:user-circle-linear" width="14" />
                                    My Ideas
                                </button>
                            </div>

                            {/* Sort */}
                            <div className="flex gap-1.5 shrink-0">
                                <button
                                    onClick={() => setSortBy('recent')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'recent' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    <Icon icon="solar:clock-circle-linear" width="14" />
                                    Recent
                                </button>
                                <button
                                    onClick={() => setSortBy('popular')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'popular' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    <Icon icon="solar:fire-linear" width="14" />
                                    Popular
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions List */}
                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : suggestions.length === 0 ? (
                            /* Empty State */
                            <motion.div
                                className="text-center py-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                    <Icon icon="solar:lightbulb-bolt-linear" width="40" className="text-violet-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No suggestions yet</h3>
                                <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
                                    Be the first to share your ideas! Your feedback helps us build a better platform.
                                </p>
                                <motion.button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Share Your Idea
                                </motion.button>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {suggestions.map((s) => {
                                    const cat = CATEGORIES[s.category] || CATEGORIES.feature;
                                    const st = STATUSES[s.status] || STATUSES.pending;
                                    const isOwner = s.author?._id === user?._id;

                                    return (
                                        <motion.div
                                            key={s._id}
                                            layout
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 sm:p-6 hover:border-zinc-700/60 transition-all duration-300"
                                        >
                                            <div className="flex gap-4">
                                                {/* Vote button */}
                                                <div className="flex flex-col items-center gap-1 pt-0.5">
                                                    <motion.button
                                                        onClick={() => handleVote(s._id)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${s.hasVoted
                                                                ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400'
                                                                : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 hover:text-violet-400 hover:border-violet-500/30'
                                                            }`}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Icon icon={s.hasVoted ? 'solar:like-bold' : 'solar:like-linear'} width="18" />
                                                    </motion.button>
                                                    <span className={`text-xs font-semibold ${s.hasVoted ? 'text-violet-400' : 'text-zinc-500'}`}>
                                                        {s.voteCount || 0}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        {/* Category badge */}
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${cat.bg} ${cat.color} border ${cat.border}`}>
                                                            <Icon icon={cat.icon} width="11" />
                                                            {cat.label}
                                                        </span>
                                                        {/* Status badge */}
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${st.bg} ${st.color} border ${st.border}`}>
                                                            <Icon icon={st.icon} width="11" />
                                                            {st.label}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-base font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
                                                        {s.title}
                                                    </h3>
                                                    <p className="text-sm text-zinc-400 leading-relaxed mb-3 line-clamp-3">
                                                        {s.description}
                                                    </p>

                                                    {/* Admin Response */}
                                                    {s.adminResponse && (
                                                        <div className="mb-3 bg-violet-500/5 border border-violet-500/15 rounded-xl p-3">
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <Icon icon="solar:shield-check-linear" width="14" className="text-violet-400" />
                                                                <span className="text-[11px] font-semibold text-violet-400">Admin Response</span>
                                                                {s.adminRespondedBy && (
                                                                    <span className="text-[11px] text-zinc-500">— {s.adminRespondedBy.fullName}</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-zinc-300 leading-relaxed">{s.adminResponse}</p>
                                                        </div>
                                                    )}

                                                    {/* Meta row */}
                                                    <div className="flex items-center gap-3 text-xs text-zinc-600">
                                                        <span className="flex items-center gap-1">
                                                            <Icon icon="solar:user-circle-linear" width="13" />
                                                            {s.author?.fullName || 'Anonymous'}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{formatDate(s.createdAt)}</span>
                                                        {(isOwner || isAdmin) && (
                                                            <>
                                                                <span>•</span>
                                                                <button
                                                                    onClick={() => handleDelete(s._id)}
                                                                    className="text-zinc-600 hover:text-red-400 transition-colors"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Admin Actions */}
                                                    {isAdmin && (
                                                        <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-wrap gap-2">
                                                            {/* Status changer */}
                                                            {adminStatusId === s._id ? (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {Object.entries(STATUSES).filter(([k]) => k !== 'all').map(([key, st]) => (
                                                                        <button
                                                                            key={key}
                                                                            onClick={() => handleStatusChange(s._id, key)}
                                                                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${st.bg} ${st.color} border ${st.border} hover:opacity-80`}
                                                                        >
                                                                            {st.label}
                                                                        </button>
                                                                    ))}
                                                                    <button
                                                                        onClick={() => setAdminStatusId(null)}
                                                                        className="px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-300"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setAdminStatusId(s._id)}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-white bg-zinc-800/50 border border-zinc-700/50 transition-all"
                                                                >
                                                                    <Icon icon="solar:refresh-linear" width="12" />
                                                                    Change Status
                                                                </button>
                                                            )}
                                                            {/* Reply */}
                                                            {expandedAdmin === s._id ? (
                                                                <div className="w-full mt-2 flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={adminResponseText}
                                                                        onChange={(e) => setAdminResponseText(e.target.value)}
                                                                        placeholder="Type your response..."
                                                                        className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50"
                                                                        onKeyDown={(e) => e.key === 'Enter' && handleAdminRespond(s._id)}
                                                                    />
                                                                    <button
                                                                        onClick={() => handleAdminRespond(s._id)}
                                                                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                                    >
                                                                        Send
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { setExpandedAdmin(null); setAdminResponseText(''); }}
                                                                        className="px-2 py-1.5 text-zinc-500 hover:text-zinc-300 text-xs"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setExpandedAdmin(s._id)}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-white bg-zinc-800/50 border border-zinc-700/50 transition-all"
                                                                >
                                                                    <Icon icon="solar:chat-round-dots-linear" width="12" />
                                                                    Reply
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </div>
                </main>
            </div>

            {/* Create Suggestion Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                        <motion.div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="relative bg-zinc-900 border border-zinc-800/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/50"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {/* Accent glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

                            <form onSubmit={handleCreate} className="p-6 relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Icon icon="solar:lightbulb-bolt-linear" width="22" className="text-violet-400" />
                                        Share Your Idea
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="w-8 h-8 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <Icon icon="solar:close-circle-linear" width="18" />
                                    </button>
                                </div>

                                {/* Category Selector */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-zinc-400 mb-2">Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.entries(CATEGORIES).map(([key, c]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${formData.category === key
                                                        ? `${c.bg} ${c.border} ${c.color}`
                                                        : 'border-zinc-700/50 text-zinc-500 hover:border-zinc-600'
                                                    }`}
                                            >
                                                <Icon icon={c.icon} width="20" />
                                                <span className="text-[11px] font-medium">{c.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-zinc-400 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="A concise title for your idea..."
                                        maxLength={150}
                                        required
                                        className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                                    />
                                    <div className="text-right text-[10px] text-zinc-600 mt-1">{formData.title.length}/150</div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-zinc-400 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe your idea in detail. What problem does it solve? How should it work?"
                                        maxLength={2000}
                                        required
                                        rows={4}
                                        className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                                    />
                                    <div className="text-right text-[10px] text-zinc-600 mt-1">{formData.description.length}/2000</div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={submitting || !formData.title.trim() || !formData.description.trim()}
                                        className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                                    >
                                        {submitting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Icon icon="solar:plain-2-linear" width="16" />
                                                Submit
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        className={`fixed bottom-6 right-6 z-[70] flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-sm font-medium ${toast.type === 'error'
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            }`}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    >
                        <Icon
                            icon={toast.type === 'error' ? 'solar:danger-circle-linear' : 'solar:check-circle-linear'}
                            width="18"
                        />
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
