import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { getAllFormations } from '../../services/formationService';

export default function DashboardHeader({ onMenuClick }) {
    const { stats } = useAuth();
    const navigate = useNavigate();
    const streak = stats?.streak || 0;
    const totalXP = stats?.totalXP || 0;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search logic
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            setIsSearchOpen(false);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const formations = getAllFormations();

        const results = formations.filter((f) => {
            const title = f.title?.toLowerCase() || '';
            const category = f.category?.toLowerCase() || '';
            const concept = f.concept?.content?.toLowerCase() || '';
            return (
                title.includes(lowerQuery) ||
                category.includes(lowerQuery) ||
                concept.includes(lowerQuery)
            );
        }).slice(0, 6); // Limit to 6 results

        setSearchResults(results);
        setIsSearchOpen(true);
    };

    const handleResultClick = (formation) => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchOpen(false);
        navigate(`/formations/${formation.id}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

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
                <div className="hidden sm:flex items-center flex-1 max-w-md" ref={searchRef}>
                    <div className="relative w-full">
                        <Icon icon="solar:magnifer-linear" width="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setIsSearchOpen(true)}
                            onKeyDown={handleKeyDown}
                            placeholder="Rechercher modules, prompts..."
                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                        />

                        {/* Search Results Dropdown */}
                        {isSearchOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                                {searchResults.length > 0 ? (
                                    <>
                                        <div className="px-4 py-2 border-b border-zinc-800/50">
                                            <span className="text-xs text-zinc-500 font-medium">
                                                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        {searchResults.map((formation) => (
                                            <button
                                                key={formation.id}
                                                onClick={() => handleResultClick(formation)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors text-left"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                                    <Icon icon="solar:book-bookmark-linear" width="18" className="text-violet-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-white truncate">{formation.title}</div>
                                                    <div className="text-xs text-zinc-500 truncate">
                                                        {formation.category} • {formation.levelLabel} • +{formation.xp} XP
                                                    </div>
                                                </div>
                                                <Icon icon="solar:arrow-right-linear" width="16" className="text-zinc-600 flex-shrink-0" />
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <div className="p-6 text-center">
                                        <Icon icon="solar:magnifer-broken" width="28" className="text-zinc-600 mx-auto mb-2" />
                                        <p className="text-sm text-zinc-500">Aucun résultat pour "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Mode Toggle */}
                    <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-md">Débutant</button>
                     {/*  <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md">Avancé</button>*/}  
                    </div>

                    {/* Notifications 
                    <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
                        <Icon icon="solar:bell-linear" width="22" style={{ strokeWidth: 1.5 }} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full"></span>
                    </button>*/}

                    {/* Streak 
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <Icon icon="solar:fire-bold" width="18" className="text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">{streak}</span>
                    </div>*/}

                    {/* XP */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                        <Icon icon="solar:star-bold" width="18" className="text-violet-400" />
                        <span className="text-sm font-medium text-violet-400">{totalXP.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
