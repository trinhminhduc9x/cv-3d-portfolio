/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

/**
 * Keeps the active layer mounted and unloads inactive layers after a short
 * delay. This lowers GPU memory pressure on mobile without cutting off the
 * layer immediately during camera or UI transitions.
 */
function LazyLayerMount({ active, unloadDelay = 1000, children }) {
    const [mounted, setMounted] = useState(active);

    useEffect(() => {
        if (active) {
            setMounted(true);
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setMounted(false);
        }, unloadDelay);

        return () => window.clearTimeout(timer);
    }, [active, unloadDelay]);

    if (!mounted) {
        return null;
    }

    return children;
}

export default LazyLayerMount;
