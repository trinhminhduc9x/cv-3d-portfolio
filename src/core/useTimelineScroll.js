import { useEffect } from 'react';

export function useTimelineScroll(setIndex, maxIndex) {
    useEffect(() => {
        let current = 0;
        let locked = false;

        function onWheel(e) {
            if (locked) return;

            if (e.deltaY > 0 && current < maxIndex) {
                current++;
            } else if (e.deltaY < 0 && current > 0) {
                current--;
            }

            locked = true;
            setIndex(current);

            setTimeout(() => {
                locked = false;
            }, 800);
        }

        window.addEventListener('wheel', onWheel, { passive: true });
        return () => window.removeEventListener('wheel', onWheel);
    }, [setIndex, maxIndex]);
}
