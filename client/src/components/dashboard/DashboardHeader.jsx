import { Icon } from '@iconify/react';

export default function DashboardHeader({ onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Mobile Menu */}
                <button
                    className="lg:hidden p-2 text-zinc-400 hover:text-white"
                    onClick={onMenuClick}
                >
                    <Icon icon="solar:hamburger-menu-linear" width="24" />
                </button>

                {/* Search */}
                <div className="hidden sm:flex items-center flex-1 max-w-md">
                    <div className="relative w-full">
                        <Icon icon="solar:magnifer-linear" width="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Rechercher modules, prompts..."
                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Mode Toggle */}
                    <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-md">Débutant</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md">Avancé</button>
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
                        <Icon icon="solar:bell-linear" width="22" style={{ strokeWidth: 1.5 }} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full"></span>
                    </button>

                    {/* Streak */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <Icon icon="solar:fire-bold" width="18" className="text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">7</span>
                    </div>

                    {/* XP */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                        <Icon icon="solar:star-bold" width="18" className="text-violet-400" />
                        <span className="text-sm font-medium text-violet-400">1,250</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
