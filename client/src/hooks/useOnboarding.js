import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_PREFIX = 'onboarding_';
const MAX_VIEWS = 1;

/**
 * Reads the full onboarding state object from localStorage for the given user.
 * Shape: { [routeKey]: { count: number, dismissed: boolean } }
 */
function getOnboardingState(userId) {
    try {
        const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/**
 * Persists the full onboarding state object to localStorage for the given user.
 */
function setOnboardingState(userId, state) {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(state));
}

/**
 * Custom hook to manage per-route onboarding modal visibility.
 *
 * @param {string} routeKey - The route identifier (e.g. '/dashboard').
 * @returns {{ showModal: boolean, dismiss: () => void, dismissForever: () => void, viewCount: number }}
 */
export default function useOnboarding(routeKey) {
    const { user } = useAuth();
    const userId = user?._id || user?.id || 'anonymous';

    const [showModal, setShowModal] = useState(false);
    const [viewCount, setViewCount] = useState(0);

    // On mount: decide whether to show and increment counter
    useEffect(() => {
        if (!routeKey || !userId) return;

        const state = getOnboardingState(userId);
        const routeState = state[routeKey] || { count: 0, dismissed: false };

        // Don't show if dismissed or already reached max views
        if (routeState.dismissed || routeState.count >= MAX_VIEWS) {
            setShowModal(false);
            setViewCount(routeState.count);
            return;
        }

        // Increment view count
        const newCount = routeState.count + 1;
        state[routeKey] = { ...routeState, count: newCount };
        setOnboardingState(userId, state);

        setViewCount(newCount);
        setShowModal(true);
    }, [routeKey, userId]);

    // Close for this session only
    const dismiss = useCallback(() => {
        setShowModal(false);
    }, []);

    // Permanently dismiss for this route
    const dismissForever = useCallback(() => {
        setShowModal(false);

        const state = getOnboardingState(userId);
        state[routeKey] = { ...(state[routeKey] || {}), dismissed: true };
        setOnboardingState(userId, state);
    }, [userId, routeKey]);

    return { showModal, dismiss, dismissForever, viewCount };
}
