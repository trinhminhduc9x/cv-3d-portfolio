import {
    clampIndex,
    getNextTimelineIndex,
    getTimelineIndexFromKey,
    getTimelineIndexFromWheel,
    isEditableTarget,
} from '../../src/core/narrativeController.js';

describe('narrativeController', () => {
    test('clamps timeline indices into range', () => {
        expect(clampIndex(-1, 2)).toBe(0);
        expect(clampIndex(1, 2)).toBe(1);
        expect(clampIndex(9, 2)).toBe(2);
    });

    test('moves to next or previous stage without overflowing', () => {
        expect(getNextTimelineIndex(0, 2, 'next')).toBe(1);
        expect(getNextTimelineIndex(2, 2, 'next')).toBe(2);
        expect(getNextTimelineIndex(1, 2, 'previous')).toBe(0);
        expect(getNextTimelineIndex(0, 2, 'previous')).toBe(0);
    });

    test('maps wheel direction to timeline movement', () => {
        expect(getTimelineIndexFromWheel(1, 2, 120)).toBe(2);
        expect(getTimelineIndexFromWheel(1, 2, -120)).toBe(0);
        expect(getTimelineIndexFromWheel(1, 2, 0)).toBe(1);
    });

    test('maps keyboard navigation to timeline movement', () => {
        expect(getTimelineIndexFromKey(0, 2, 'ArrowRight')).toBe(1);
        expect(getTimelineIndexFromKey(1, 2, 'ArrowLeft')).toBe(0);
        expect(getTimelineIndexFromKey(1, 2, 'End')).toBe(2);
        expect(getTimelineIndexFromKey(1, 2, 'Home')).toBe(0);
        expect(getTimelineIndexFromKey(1, 2, 'Escape')).toBe(1);
    });

    test('detects editable keyboard targets', () => {
        expect(isEditableTarget({ tagName: 'INPUT' })).toBe(true);
        expect(isEditableTarget({ tagName: 'TEXTAREA' })).toBe(true);
        expect(isEditableTarget({ isContentEditable: true })).toBe(true);
        expect(isEditableTarget({ tagName: 'BUTTON' })).toBe(false);
    });
});
