import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

// Toast Context
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
    success: {
        icon: 'solar:check-circle-bold',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        iconColor: 'text-emerald-400',
        progressColor: 'bg-emerald-500'
    },
    error: {
        icon: 'solar:danger-triangle-bold',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        iconColor: 'text-red-400',
        progressColor: 'bg-red-500'
    },
    warning: {
        icon: 'solar:info-circle-bold',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        iconColor: 'text-amber-400',
        progressColor: 'bg-amber-500'
    },
    info: {
        icon: 'solar:info-square-bold',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        iconColor: 'text-blue-400',
        progressColor: 'bg-blue-500'
    }
};

// Individual Toast Component
const ToastItem = ({ toast, onDismiss }) => {
    const config = toastConfig[toast.type] || toastConfig.info;
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (toast.duration === 0) return; // Persistent toast

        const startTime = Date.now();
        const duration = toast.duration || 5000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining === 0) {
                clearInterval(interval);
                onDismiss(toast.id);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [toast.id, toast.duration, onDismiss]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`relative overflow-hidden min-w-80 max-w-md ${config.bgColor} border ${config.borderColor} rounded-xl backdrop-blur-xl shadow-2xl`}
        >
            <div className="p-4 flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                    <Icon icon={config.icon} width="20" className={config.iconColor} />
                </div>

                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <h4 className="text-sm font-semibold text-white mb-0.5">{toast.title}</h4>
                    )}
                    <p className="text-sm text-zinc-300">{toast.message}</p>

                    {toast.action && (
                        <button
                            onClick={() => {
                                toast.action.onClick();
                                onDismiss(toast.id);
                            }}
                            className={`mt-2 text-sm font-medium ${config.iconColor} hover:underline`}
                        >
                            {toast.action.label}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => onDismiss(toast.id)}
                    className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
                >
                    <Icon icon="solar:close-circle-linear" width="18" />
                </button>
            </div>

            {/* Progress bar */}
            {toast.duration !== 0 && (
                <div className="h-0.5 bg-zinc-800">
                    <motion.div
                        className={`h-full ${config.progressColor}`}
                        initial={{ width: '100%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.05 }}
                    />
                </div>
            )}
        </motion.div>
    );
};

// Toast Container Component
export const ToastContainer = () => {
    const { toasts, dismissToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onDismiss={dismissToast}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, duration: 5000, ...toast }]);
        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message, options = {}) => {
        return addToast({ type: 'success', message, ...options });
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast({ type: 'error', message, ...options });
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast({ type: 'warning', message, ...options });
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast({ type: 'info', message, ...options });
    }, [addToast]);

    const value = {
        toasts,
        addToast,
        dismissToast,
        success,
        error,
        warning,
        info
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
