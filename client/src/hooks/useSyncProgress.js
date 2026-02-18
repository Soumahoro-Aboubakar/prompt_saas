import { useState, useCallback, useRef } from 'react';
import progressService from '../services/progressService';
import statsService from '../services/statsService';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

/**
 * Hook for synchronizing module progress with the backend
 * Implements optimistic updates with retry logic and rollback
 */
export default function useSyncProgress() {
    const [pendingSync, setPendingSync] = useState(false);
    const [syncError, setSyncError] = useState(null);
    const abortControllerRef = useRef(null);
    const { updateStats } = useAuth();
    const { syncModuleProgress } = useProgress();

    /**
     * Retry a function with exponential backoff
     * @param {Function} fn - Async function to retry
     * @param {number} maxRetries - Maximum number of retries (default: 3)
     * @param {number} baseDelay - Base delay in ms (default: 1000)
     */
    const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
        let lastError;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                // Don't retry on 4xx errors (client errors)
                if (error.response && error.response.status >= 400 && error.response.status < 500) {
                    throw error;
                }

                // Wait before retrying with exponential backoff
                if (attempt < maxRetries - 1) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    console.log(`Sync retry ${attempt + 1}/${maxRetries} in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    };

    /**
     * Sync module completion to the backend
     * @param {number} moduleId - The module ID
     * @param {number} score - Score achieved (0-100)
     * @param {number} xpGained - XP to add
     * @returns {Promise<{success: boolean, data?: any, error?: string}>}
     */
    const syncModuleCompletion = useCallback(async (moduleId, score, xpGained) => {
        // Cancel any pending sync
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setPendingSync(true);
        setSyncError(null);

        try {
            // Sync progress to backend with retry
            const result = await retryWithBackoff(async () => {
                // completeModule expects (moduleId, score, xpEarned)
                const progressResponse = await progressService.completeModule(moduleId, score, xpGained, {
                    signal: abortControllerRef.current?.signal
                });

                return progressResponse;
            });

            // Keep progress and stats stores in sync from a single source of truth.
            if (result?.progress) {
                syncModuleProgress(result.progress);
            }

            if (result?.stats) {
                updateStats(result.stats, { replace: true });
            } else {
                // Fallback for backward compatibility if backend response is partial.
                try {
                    const freshStats = await statsService.getStats();
                    if (freshStats?.stats) {
                        updateStats(freshStats.stats, { replace: true });
                    }
                } catch {
                    // Non-blocking fallback failure
                }
            }
        
            console.log("result ", result);
            setPendingSync(false);
            return { success: true, data: result };

        } catch (error) {
            if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
                setPendingSync(false);
                return {
                    success: false,
                    error: 'Synchronisation annulée',
                    canceled: true
                };
            }

            const errorMessage = error.response?.data?.message
                || error.message
                || 'Serveur indisponible, progression non enregistrée';

            console.error('Sync failed after all retries:', error);
            setSyncError(errorMessage);
            setPendingSync(false);

            return {
                success: false,
                error: errorMessage
            };
        }
    }, []);

    /**
     * Clear any sync error
     */
    const clearError = useCallback(() => {
        setSyncError(null);
    }, []);

    /**
     * Cancel pending sync operation
     */
    const cancelSync = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setPendingSync(false);
    }, []);

    return {
        syncModuleCompletion,
        pendingSync,
        syncError,
        clearError,
        cancelSync
    };
}
