import { useCallback, useMemo, useState } from 'react';

/**
 * Normalizes a chapter config into a predictable list + map structure.
 *
 * @param {Array<object> | Record<string, object>} chapterConfig External chapter config.
 * @returns {{ chapters: Array<object>, chapterMap: Map<string, object> }} Normalized chapters.
 */
export function normalizeChapterConfig(chapterConfig = []) {
    const chapters = Array.isArray(chapterConfig)
        ? chapterConfig
        : Object.values(chapterConfig);
    const chapterMap = new Map();

    chapters.forEach((chapter) => {
        if (chapter?.id) {
            chapterMap.set(chapter.id, chapter);
        }
    });

    return { chapters, chapterMap };
}

/**
 * Creates a React state-backed chapter manager.
 *
 * @param {Array<object> | Record<string, object>} chapterConfig External chapter config.
 * @param {string} initialChapterId Initial chapter id.
 * @returns {object} Chapter manager API.
 */
export function useChapterManager(chapterConfig = [], initialChapterId) {
    const { chapters, chapterMap } = useMemo(
        () => normalizeChapterConfig(chapterConfig),
        [chapterConfig],
    );
    const fallbackChapterId = chapters[0]?.id || null;
    const [currentChapterId, setCurrentChapterId] = useState(
        initialChapterId || fallbackChapterId,
    );

    const currentChapter = useMemo(
        () => chapterMap.get(currentChapterId) || chapters[0] || null,
        [chapterMap, chapters, currentChapterId],
    );

    const currentIndex = useMemo(
        () => chapters.findIndex((chapter) => chapter.id === currentChapter?.id),
        [chapters, currentChapter],
    );

    const setChapter = useCallback((id) => {
        if (chapterMap.has(id)) {
            setCurrentChapterId(id);
            return true;
        }

        return false;
    }, [chapterMap]);

    const getCurrentChapter = useCallback(
        () => currentChapter,
        [currentChapter],
    );

    const getChapterConfig = useCallback((id = currentChapter?.id) => {
        if (!id) {
            return null;
        }

        return chapterMap.get(id) || null;
    }, [chapterMap, currentChapter]);

    return {
        chapters,
        currentChapter,
        currentChapterId: currentChapter?.id || null,
        currentIndex,
        setChapter,
        getCurrentChapter,
        getChapterConfig,
    };
}

/**
 * Creates a non-React chapter manager for tests and orchestration code.
 *
 * @param {Array<object> | Record<string, object>} chapterConfig External chapter config.
 * @param {string} initialChapterId Initial chapter id.
 * @returns {object} Chapter manager API.
 */
export function createChapterManager(chapterConfig = [], initialChapterId) {
    const { chapters, chapterMap } = normalizeChapterConfig(chapterConfig);
    let currentChapterId = initialChapterId || chapters[0]?.id || null;

    return {
        chapters,
        get currentChapter() {
            return chapterMap.get(currentChapterId) || chapters[0] || null;
        },
        get currentChapterId() {
            return this.currentChapter?.id || null;
        },
        /**
         * Sets the active chapter by id.
         *
         * @param {string} id Chapter id.
         * @returns {boolean} True when the chapter exists and was selected.
         */
        setChapter(id) {
            if (!chapterMap.has(id)) {
                return false;
            }

            currentChapterId = id;
            return true;
        },
        /**
         * Returns the active chapter.
         *
         * @returns {object | null} Current chapter config.
         */
        getCurrentChapter() {
            return this.currentChapter;
        },
        /**
         * Returns a chapter config by id.
         *
         * @param {string} id Chapter id.
         * @returns {object | null} Chapter config.
         */
        getChapterConfig(id = currentChapterId) {
            return chapterMap.get(id) || null;
        },
    };
}

export default useChapterManager;
