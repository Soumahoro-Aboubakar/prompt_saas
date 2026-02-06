import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Sidebar({ isOpen, onClose }) {
    const navItems = [
        { icon: 'solar:home-2-linear', label: 'Dashboard', href: '/dashboard', active: false },
        { icon: 'solar:book-bookmark-linear', label: 'Mes formations', href: '/formations', active: false },
        { icon: 'solar:route-linear', label: 'Parcours', href: '/parcours', active: false },
        { icon: 'solar:cpu-bolt-linear', label: 'Mentor IA', href: '/mentor', active: false },
        { icon: 'solar:code-square-linear', label: 'Sandbox', href: '/sandbox', active: false },
        { icon: 'solar:library-linear', label: 'Bibliothèque', href: '/bibliotheque', active: false },
        { icon: 'solar:cup-star-linear', label: 'Compétitions', href: '/competitions', active: false },
        { icon: 'solar:diploma-linear', label: 'Certifications', href: '/certifications', active: false },
    ];

    const communityItems = [
        { icon: 'solar:users-group-rounded-linear', label: 'Forum', href: '#' },
        { icon: 'solar:ranking-linear', label: 'Classement', href: '#' },
    ];

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
            <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="p-6 border-b border-zinc-800/50">
                    <Link to="/" className="text-lg font-semibold tracking-tight text-white">
                        <span className="text-violet-500">✦</span> prompt<span className="text-violet-500">academy</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${item.active
                                ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }`}
                        >
                            <Icon icon={item.icon} width="20" style={{ strokeWidth: 1.5 }} />
                            <span className={`text-sm ${item.active ? 'font-medium' : ''}`}>{item.label}</span>
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-zinc-800/50">
                        <span className="px-4 text-xs font-medium text-zinc-600 uppercase tracking-wider">Communauté</span>
                    </div>

                    {communityItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
                        >
                            <Icon icon={item.icon} width="20" style={{ strokeWidth: 1.5 }} />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-medium">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">Jean Dupont</div>
                            <div className="text-xs text-zinc-500">Niveau 3 • 1,250 XP</div>
                        </div>
                        <Icon icon="solar:alt-arrow-right-linear" width="16" className="text-zinc-500" />
                    </div>
                </div>
            </aside>
        </>
    );
}
