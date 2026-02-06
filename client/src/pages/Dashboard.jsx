import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const stats = [
        { icon: 'solar:chart-2-linear', iconColor: 'text-violet-400', bgColor: 'bg-violet-500/10', value: 'Niveau 3', label: 'Débutant' },
        { icon: 'solar:star-linear', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', value: '1,250', label: 'XP Total' },
        { icon: 'solar:fire-linear', iconColor: 'text-amber-400', bgColor: 'bg-amber-500/10', value: '7 jours', label: 'Série active' },
        { icon: 'solar:medal-ribbons-star-linear', iconColor: 'text-blue-400', bgColor: 'bg-blue-500/10', value: '5', label: 'Badges obtenus' },
    ];

    const recommendedModules = [
        { icon: 'solar:document-text-linear', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', title: "Extraction d'informations", description: 'Extraire des données structurées des réponses IA', level: 'Niveau 4', xp: '+350 XP' },
        { icon: 'solar:layers-linear', iconColor: 'text-blue-400', bgColor: 'bg-blue-500/10', title: 'Contexte et clarté', description: 'Fournir le contexte optimal pour des réponses précises', level: 'Niveau 5', xp: '+350 XP' },
        { icon: 'solar:pen-new-square-linear', iconColor: 'text-amber-400', bgColor: 'bg-amber-500/10', title: 'Instructions explicites', description: 'Rédiger des instructions claires et non ambiguës', level: 'Niveau 6', xp: '+400 XP' },
    ];

    const weeklyActivity = [
        { day: 'Lun', height: '80%', isToday: false },
        { day: 'Mar', height: '60%', isToday: false },
        { day: 'Mer', height: '100%', isToday: false },
        { day: 'Jeu', height: '40%', isToday: false },
        { day: 'Ven', height: '90%', isToday: false },
        { day: 'Sam', height: '70%', isToday: false },
        { day: 'Auj.', height: '50%', isToday: true },
    ];

    const quickActions = [
        { icon: 'solar:cpu-bolt-linear', iconColor: 'text-violet-400', bgColor: 'bg-violet-500/10', hoverBg: 'hover:bg-violet-600/10 hover:border-violet-500/30', hoverIconBg: 'group-hover:bg-violet-500/20', label: 'Mentor IA' },
        { icon: 'solar:code-square-linear', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', hoverBg: 'hover:bg-emerald-600/10 hover:border-emerald-500/30', hoverIconBg: 'group-hover:bg-emerald-500/20', label: 'Sandbox' },
        { icon: 'solar:library-linear', iconColor: 'text-blue-400', bgColor: 'bg-blue-500/10', hoverBg: 'hover:bg-blue-600/10 hover:border-blue-500/30', hoverIconBg: 'group-hover:bg-blue-500/20', label: 'Prompts' },
        { icon: 'solar:cup-star-linear', iconColor: 'text-amber-400', bgColor: 'bg-amber-500/10', hoverBg: 'hover:bg-amber-600/10 hover:border-amber-500/30', hoverIconBg: 'group-hover:bg-amber-500/20', label: 'Défi' },
    ];

    const badges = [
   /*     { icon: 'solar:rocket-linear', gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20', title: 'Premier pas' },
        { icon: 'solar:pen-new-square-linear', gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', title: 'Reformulateur' },
        { icon: 'solar:fire-linear', gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20', title: 'Série de 3' },
        { icon: 'solar:diploma-linear', gradient: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-500/20', title: 'Quiz Master' },
        { icon: 'solar:lock-linear', isLocked: true },
   */ ];

    const leaderboard = [
        { rank: 1, initials: 'SA', name: 'Sophie A.', level: 'Niveau 45', xp: '15,420 XP', gradient: 'from-amber-400 to-orange-500', rankColor: 'text-amber-400' },
        { rank: 2, initials: 'MK', name: 'Marc K.', level: 'Niveau 42', xp: '14,890 XP', gradient: 'from-zinc-400 to-zinc-500', rankColor: 'text-zinc-400' },
        { rank: 3, initials: 'LB', name: 'Léa B.', level: 'Niveau 38', xp: '12,450 XP', gradient: 'from-amber-600 to-amber-700', rankColor: 'text-amber-600' },
    ];

    const dailyGoals = [
        { text: 'Compléter 1 leçon', completed: true },
        { text: 'Pratiquer avec le Mentor IA', completed: true },
        { text: 'Gagner 100 XP', completed: false },
    ];

    return (
        <div className="bg-zinc-950 text-white min-h-screen antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Header */}
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                {/* Dashboard Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">Bonjour, Jean 👋</h1>
                        <p className="text-zinc-400">Continuez votre apprentissage et atteignez le niveau 4 !</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon icon={stat.icon} width="22" className={stat.iconColor} />
                                    </div>
                                </div>
                                <div className="text-2xl font-semibold tracking-tight text-white">{stat.value}</div>
                                <div className="text-sm text-zinc-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Current Progress */}
                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-white">Progression actuelle</h2>
                                    <a href="#" className="text-sm text-violet-400 hover:text-violet-300">Voir tout</a>
                                </div>

                                {/* Level Progress */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-zinc-400">Niveau 3 → Niveau 4</span>
                                        <span className="text-sm font-medium text-white">65%</span>
                                    </div>
                                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-zinc-500">650 XP</span>
                                        <span className="text-xs text-zinc-500">350 XP restants</span>
                                    </div>
                                </div>

                                {/* Continue Learning */}
                                <div className="bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 rounded-xl p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                            <Icon icon="solar:chat-round-dots-linear" width="26" className="text-violet-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-full">En cours</span>
                                                <span className="text-xs text-zinc-500">Module 3</span>
                                            </div>
                                            <h3 className="font-medium text-white mb-1">Questions intelligentes</h3>
                                            <p className="text-sm text-zinc-400 mb-4">Formuler des questions claires et précises pour obtenir des réponses optimales.</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Icon icon="solar:clock-circle-linear" width="14" className="text-zinc-500" />
                                                        <span className="text-xs text-zinc-500">15 min</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Icon icon="solar:star-linear" width="14" className="text-amber-400" />
                                                        <span className="text-xs text-zinc-400">+300 XP</span>
                                                    </div>
                                                </div>
                                                <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                                                    Continuer
                                                    <Icon icon="solar:arrow-right-linear" width="16" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Modules */}
                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-white">Modules recommandés</h2>
                                    <a href="#" className="text-sm text-violet-400 hover:text-violet-300">Voir tous</a>
                                </div>

                                <div className="space-y-3">
                                    {recommendedModules.map((module, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-xl cursor-pointer transition-colors group">
                                            <div className={`w-12 h-12 rounded-xl ${module.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                <Icon icon={module.icon} width="24" className={module.iconColor} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors">{module.title}</h3>
                                                <p className="text-sm text-zinc-500 truncate">{module.description}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-sm font-medium text-white">{module.level}</div>
                                                <div className="text-xs text-zinc-500">{module.xp}</div>
                                            </div>
                                            <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-zinc-600 group-hover:text-violet-400 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Activity */}
                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-white">Activité de la semaine</h2>
                                    <span className="text-sm text-zinc-500">7 jours consécutifs</span>
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                    {weeklyActivity.map((day, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2">
                                            <div className={`w-full h-24 ${day.isToday ? 'bg-fuchsia-600/20 ring-2 ring-fuchsia-500/50' : 'bg-violet-600/20'} rounded-lg relative overflow-hidden`}>
                                                <div
                                                    className={`absolute bottom-0 left-0 right-0 ${day.isToday ? 'bg-gradient-to-t from-violet-500 to-fuchsia-500' : 'bg-violet-500'} rounded-b-lg`}
                                                    style={{ height: day.height }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs ${day.isToday ? 'text-violet-400 font-medium' : 'text-zinc-500'}`}>{day.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Actions rapides</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickActions.map((action, index) => (
                                        <button key={index} className={`flex flex-col items-center gap-2 p-4 bg-zinc-800/30 ${action.hoverBg} border border-transparent rounded-xl transition-all group`}>
                                            <div className={`w-10 h-10 rounded-lg ${action.bgColor} ${action.hoverIconBg} flex items-center justify-center transition-colors`}>
                                                <Icon icon={action.icon} width="22" className={action.iconColor} />
                                            </div>
                                            <span className="text-sm text-zinc-300 group-hover:text-white">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-white">Badges récents</h2>
                                    <span className="text-sm text-zinc-500">5/24</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {badges.map((badge, index) => (
                                        badge.isLocked ? (
                                            <div key={index} className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center opacity-50" title="Verrouillé">
                                                <Icon icon={badge.icon} width="20" className="text-zinc-600" />
                                            </div>
                                        ) : (
                                            <div key={index} className={`w-14 h-14 rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-lg ${badge.shadow}`} title={badge.title}>
                                                <Icon icon={badge.icon} width="24" className="text-white" />
                                            </div>
                                        )
                                    ))}
                                </div>
                                <a href="#" className="flex items-center gap-1 mt-4 text-sm text-violet-400 hover:text-violet-300">
                                    Voir tous les badges
                                    <Icon icon="solar:arrow-right-linear" width="14" />
                                </a>
                            </div>

                            {/* Upcoming Competition */}
                            <div className="bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Icon icon="solar:cup-star-bold" width="20" className="text-amber-400" />
                                    <span className="text-sm font-medium text-amber-400">Compétition</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">Prompt Challenge #12</h3>
                                <p className="text-sm text-zinc-400 mb-4">Créez le prompt le plus efficace pour résumer des articles complexes.</p>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Icon icon="solar:clock-circle-linear" width="16" className="text-zinc-500" />
                                        <span className="text-sm text-zinc-400">3 jours restants</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Icon icon="solar:users-group-rounded-linear" width="16" className="text-zinc-500" />
                                        <span className="text-sm text-zinc-400">234 participants</span>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
                                    Participer
                                </button>
                            </div>

                            {/* Leaderboard */}
                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-white">Classement</h2>
                                    <a href="#" className="text-sm text-violet-400 hover:text-violet-300">Voir tout</a>
                                </div>
                                <div className="space-y-3">
                                    {leaderboard.map((player, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className={`w-6 text-center text-sm font-semibold ${player.rankColor}`}>{player.rank}</span>
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${player.gradient} flex items-center justify-center text-xs font-medium`}>
                                                {player.initials}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-white">{player.name}</div>
                                                <div className="text-xs text-zinc-500">{player.level}</div>
                                            </div>
                                            <span className="text-sm font-medium text-zinc-400">{player.xp}</span>
                                        </div>
                                    ))}
                                    {/* Current User */}
                                    <div className="flex items-center gap-3 p-2 -mx-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
                                        <span className="w-6 text-center text-sm font-medium text-violet-400">156</span>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-medium">
                                            JD
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-white">Vous</div>
                                            <div className="text-xs text-zinc-500">Niveau 3</div>
                                        </div>
                                        <span className="text-sm font-medium text-violet-400">1,250 XP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Goal */}
                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Objectif du jour</h2>
                                <div className="space-y-4">
                                    {dailyGoals.map((goal, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            {goal.completed ? (
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <Icon icon="solar:check-circle-bold" width="16" className="text-emerald-400" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                                                </div>
                                            )}
                                            <span className={`text-sm ${goal.completed ? 'text-zinc-300 line-through' : 'text-zinc-400'}`}>{goal.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500">Progression</span>
                                        <span className="text-white font-medium">2/3</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '66%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
