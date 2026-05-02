import { useEffect, useMemo } from 'react';

import {
    getAllModelIds,
    getChapterModelId,
    preloadModels,
} from './modelRegistry';

function uniqueModelIds(modelIds) {
    return [...new Set(modelIds.filter(Boolean))];
}

function scheduleIdleTask(callback) {
    if (typeof window === 'undefined') {
        return () => {};
    }

    if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(callback, { timeout: 4000 });
        return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(callback, 1600);
    return () => window.clearTimeout(id);
}

export function useStrategicModelPreload({
    chapters = [],
    currentIndex = 0,
    preloadRemaining = false,
} = {}) {
    const immediateModelIds = useMemo(() => uniqueModelIds([
        getChapterModelId(chapters[currentIndex]),
        getChapterModelId(chapters[currentIndex + 1]),
    ]), [chapters, currentIndex]);

    const remainingModelIds = useMemo(() => {
        const immediate = new Set(immediateModelIds);
        return getAllModelIds().filter((modelId) => !immediate.has(modelId));
    }, [immediateModelIds]);

    useEffect(() => {
        preloadModels(immediateModelIds);
    }, [immediateModelIds]);

    useEffect(() => {
        if (!preloadRemaining || remainingModelIds.length === 0) {
            return undefined;
        }

        return scheduleIdleTask(() => {
            preloadModels(remainingModelIds);
        });
    }, [preloadRemaining, remainingModelIds]);
}
