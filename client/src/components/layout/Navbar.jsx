import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuVariants = {
        hidden: {
            opacity: 0,
            y: -20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut",
                staggerChildren: 0.05,
                delayChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: "easeIn"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between h-14 px-6 bg-white/95 backdrop-blur-xl rounded-full shadow-lg shadow-black/5 border border-zinc-200/50">
                    {/* Logo */}
                    <Link to="/" className="text-lg font-semibold tracking-tight text-zinc-900">
                        <span className="text-violet-600">✦</span> prompt<span className="text-violet-600">academy</span>
                    </Link>

                    {/* Center Navigation - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100">
                                Produit
                                <Icon icon="solar:alt-arrow-down-linear" width="14" className="text-zinc-400" />
                            </button>
                        </div>
                        <a href="#" className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100">Parcours</a>
                        <a href="#" className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100">Tarifs</a>
                    </div>

                    {/* Right Actions - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2">
                            Connexion
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-full transition-colors shadow-md shadow-violet-600/20"
                        >
                            Commencer gratuitement
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden p-2 text-zinc-600 hover:text-zinc-900"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.div
                            animate={{ rotate: isMenuOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Icon icon={isMenuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} width="24" />
                        </motion.div>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-zinc-200/50 overflow-hidden"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="p-4 space-y-2">
                                <motion.a
                                    href="#"
                                    className="block px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon icon="solar:box-linear" width="18" className="text-violet-500" />
                                        Produit
                                    </span>
                                </motion.a>
                                <motion.a
                                    href="#"
                                    className="block px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon icon="solar:map-linear" width="18" className="text-violet-500" />
                                        Parcours
                                    </span>
                                </motion.a>
                                <motion.a
                                    href="#"
                                    className="block px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon icon="solar:tag-price-linear" width="18" className="text-violet-500" />
                                        Tarifs
                                    </span>
                                </motion.a>

                                <motion.hr
                                    className="border-zinc-200"
                                    variants={itemVariants}
                                />

                                <motion.div variants={itemVariants}>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Icon icon="solar:login-2-linear" width="18" className="text-violet-500" />
                                            Connexion
                                        </span>
                                    </Link>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Link
                                        to="/signup"
                                        className="block w-full px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors shadow-md shadow-violet-600/20 text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Commencer gratuitement
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
