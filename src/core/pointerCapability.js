/**
 * Free-roam (pointer-lock + WASD) is desktop-first per ADR-0001 — touch
 * input is an accepted, known gap for the whole project (see
 * technical-preferences.md), so we simply don't offer the entry point
 * rather than shipping a half-working touch control scheme.
 *
 * @returns {boolean} Whether this device/browser can reasonably support free-roam.
 */
export function supportsFreeRoam() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false;
    }

    const hasFinePointer = typeof window.matchMedia === 'function'
        && window.matchMedia('(pointer: fine)').matches;
    const hasPointerLock = 'pointerLockElement' in document;

    return hasFinePointer && hasPointerLock;
}

export default supportsFreeRoam;
