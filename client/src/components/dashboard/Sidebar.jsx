import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
    const { user, stats, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close modal on Escape key
    const handleCloseModal = useCallback(() => setShowLogoutModal(false), []);
    useEffect(() => {
        if (!showLogoutModal) return;
        const onKey = (e) => { if (e.key === 'Escape') handleCloseModal(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showLogoutModal, handleCloseModal]);

    const initials = user?.fullName
        ? user.fullName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || '')
            .join('')
        : 'U';
    const displayName = user?.fullName || 'Utilisateur';
    const level = stats?.level || 1;
    const totalXP = stats?.totalXP || 0;

    const navItems = [
        { icon: 'solar:home-2-linear', activeIcon: 'solar:home-2-bold', label: 'Dashboard', href: '/dashboard' },
        { icon: 'solar:book-bookmark-linear', activeIcon: 'solar:book-bookmark-bold', label: 'Mes formations', href: '/formations' },
        { icon: 'solar:route-linear', activeIcon: 'solar:route-bold', label: 'Parcours', href: '/parcours' },
        { icon: 'solar:cpu-bolt-linear', activeIcon: 'solar:cpu-bolt-bold', label: 'Mentor IA', href: '/mentor' },
        { icon: 'solar:code-square-linear', activeIcon: 'solar:code-square-bold', label: 'Sandbox', href: '/sandbox' },
        { icon: 'solar:library-linear', activeIcon: 'solar:library-bold', label: 'Bibliothèque', href: '/bibliotheque' },
        { icon: 'solar:cup-star-linear', activeIcon: 'solar:cup-star-bold', label: 'Compétitions', href: '/competitions' },
        { icon: 'solar:diploma-linear', activeIcon: 'solar:diploma-bold', label: 'Certifications', href: '/certifications' },
    ];

    const communityItems = [
        { icon: 'solar:users-group-rounded-linear', activeIcon: 'solar:users-group-rounded-bold', label: 'Forum', href: '/forum' },
        { icon: 'solar:ranking-linear', activeIcon: 'solar:ranking-bold', label: 'Classement', href: '/classement' },
    ];

    // Determine if a nav item is active based on the current route
    const isActive = (href) => {
        if (href === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-800/50 flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="p-6 border-b border-zinc-800/50">
                    <Link to="/" className="text-lg font-semibold tracking-tight text-white">
                        <span className="text-violet-500">✦</span> prompt<span className="text-violet-500">academy</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={index}
                                to={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${active
                                    ? 'bg-violet-600/15 text-violet-400 border border-violet-500/25 shadow-sm shadow-violet-500/10'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                                    }`}
                            >
                                <Icon
                                    icon={active ? item.activeIcon : item.icon}
                                    width="20"
                                    style={{ strokeWidth: 1.5 }}
                                    className={active ? 'text-violet-400' : ''}
                                />
                                <span className={`text-sm ${active ? 'font-medium' : ''}`}>{item.label}</span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                                )}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-zinc-800/50">
                        <span className="px-4 text-xs font-medium text-zinc-600 uppercase tracking-wider">Communauté</span>
                    </div>

                    {communityItems.map((item, index) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={index}
                                to={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${active
                                    ? 'bg-violet-600/15 text-violet-400 border border-violet-500/25 shadow-sm shadow-violet-500/10'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                                    }`}
                            >
                                <Icon
                                    icon={active ? item.activeIcon : item.icon}
                                    width="20"
                                    style={{ strokeWidth: 1.5 }}
                                    className={active ? 'text-violet-400' : ''}
                                />
                                <span className={`text-sm ${active ? 'font-medium' : ''}`}>{item.label}</span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-medium">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{displayName}</div>
                            <div className="text-xs text-zinc-500">Niveau {level} • {totalXP.toLocaleString()} XP</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-3 w-full mt-2 px-4 py-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
                    >
                        <Icon icon="solar:logout-2-linear" width="20" />
                        <span className="text-sm">Se déconnecter</span>
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={handleCloseModal}>
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative bg-zinc-900 border border-zinc-800/50 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl shadow-black/50"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {/* Red accent glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="p-6 text-center relative">
                                {/* Icon */}
                                <motion.div
                                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <Icon icon="solar:logout-2-bold" width="28" className="text-red-400" />
                                </motion.div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-white mb-2">Se déconnecter ?</h3>

                                {/* Description */}
                                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                                    Vous êtes sur le point de quitter votre session.<br />
                                    Votre progression est sauvegardée.
                                </p>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Annuler
                                    </motion.button>
                                    <motion.button
                                        onClick={handleLogout}
                                        className="flex-1 px-4 py-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon icon="solar:logout-2-linear" width="16" />
                                        Déconnexion
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
