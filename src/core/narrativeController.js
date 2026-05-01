export const NAVIGATION_KEYS = {
    next: new Set(['ArrowDown', 'ArrowRight', 'PageDown']),
    previous: new Set(['ArrowUp', 'ArrowLeft', 'PageUp']),
};

export function clampIndex(index, maxIndex) {
    return Math.min(Math.max(index, 0), maxIndex);
}

export function getNextTimelineIndex(currentIndex, maxIndex, direction) {
    const delta = direction === 'previous' ? -1 : 1;
    return clampIndex(currentIndex + delta, maxIndex);
}

export function getTimelineIndexFromWheel(currentIndex, maxIndex, deltaY) {
    if (deltaY > 0) {
        return getNextTimelineIndex(currentIndex, maxIndex, 'next');
    }

    if (deltaY < 0) {
        return getNextTimelineIndex(currentIndex, maxIndex, 'previous');
    }

    return clampIndex(currentIndex, maxIndex);
}

export function getTimelineIndexFromKey(currentIndex, maxIndex, key) {
    if (NAVIGATION_KEYS.next.has(key)) {
        return getNextTimelineIndex(currentIndex, maxIndex, 'next');
    }

    if (NAVIGATION_KEYS.previous.has(key)) {
        return getNextTimelineIndex(currentIndex, maxIndex, 'previous');
    }

    if (key === 'Home') {
        return 0;
    }

    if (key === 'End') {
        return maxIndex;
    }

    return clampIndex(currentIndex, maxIndex);
}

export function isEditableTarget(target) {
    const tagName = target?.tagName?.toLowerCase();

    return (
        target?.isContentEditable ||
        tagName === 'input' ||
        tagName === 'select' ||
        tagName === 'textarea'
    );
}
