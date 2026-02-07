/**
 * Simple persistent storage utility for the application.
 * Handles JSON serialization/deserialization and error catching.
 */
export const storage = {
    set: (key, value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    },
    get: (key, defaultValue = null) => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return defaultValue;
        }
    },
    remove: (key) => {
        window.localStorage.removeItem(key);
    },
    clear: () => {
        window.localStorage.clear();
    }
};

/**
 * Hook-style usage for state persistence
 */
import { useState, useEffect } from 'react';

export function usePersistedState(key, defaultValue) {
    const [state, setState] = useState(() => {
        return storage.get(key, defaultValue);
    });

    useEffect(() => {
        storage.set(key, state);
    }, [key, state]);

    return [state, setState];
}
