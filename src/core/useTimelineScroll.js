import { useEffect } from 'react';
import {
    getTimelineIndexFromKey,
    getTimelineIndexFromWheel,
    isEditableTarget,
} from './narrativeController';

export function useTimelineScroll(setIndex, maxIndex) {
    useEffect(() => {
        let locked = false;

        function onWheel(e) {
            if (locked) return;

            locked = true;
            setIndex((current) => getTimelineIndexFromWheel(current, maxIndex, e.deltaY));

            window.setTimeout(() => {
                locked = false;
            }, 800);
        }

        function onKeyDown(e) {
            if (isEditableTarget(e.target)) {
                return;
            }

            const nextIndex = (current) => getTimelineIndexFromKey(current, maxIndex, e.key);

            setIndex((current) => {
                const next = nextIndex(current);

                if (next !== current) {
                    e.preventDefault();
                }

                return next;
            });
        }

        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [setIndex, maxIndex]);
}
