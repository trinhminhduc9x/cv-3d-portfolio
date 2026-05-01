import { useCallback, useMemo, useState } from 'react';

export const INTERACTION_MODES = {
    guided: 'guided',
    explore: 'explore',
};

function setControlsEnabled(controlsRef, enabled) {
    if (controlsRef?.current) {
        controlsRef.current.enabled = enabled;
    }
}

/**
 * Creates a non-DOM interaction mode manager for OrbitControls-like refs.
 *
 * @param {object} controlsRef React ref containing OrbitControls.
 * @param {string} initialMode Initial interaction mode.
 * @returns {object} Interaction manager API.
 */
export function createInteractionModeManager(
    controlsRef,
    initialMode = INTERACTION_MODES.guided,
) {
    let currentMode = initialMode;

    const applyMode = () => {
        setControlsEnabled(controlsRef, currentMode === INTERACTION_MODES.explore);
    };

    applyMode();

    return {
        get currentMode() {
            return currentMode;
        },
        /**
         * Enables guided mode and disables OrbitControls.
         *
         * @returns {string} Current mode.
         */
        guidedMode() {
            currentMode = INTERACTION_MODES.guided;
            applyMode();
            return currentMode;
        },
        /**
         * Enables explore mode and enables OrbitControls.
         *
         * @returns {string} Current mode.
         */
        exploreMode() {
            currentMode = INTERACTION_MODES.explore;
            applyMode();
            return currentMode;
        },
        /**
         * Enables OrbitControls without changing mode.
         */
        enableControls() {
            setControlsEnabled(controlsRef, true);
        },
        /**
         * Disables OrbitControls without changing mode.
         */
        disableControls() {
            setControlsEnabled(controlsRef, false);
        },
    };
}

/**
 * React state wrapper for guided/explore interaction mode.
 *
 * @param {object} controlsRef React ref containing OrbitControls.
 * @param {string} initialMode Initial interaction mode.
 * @returns {object} Interaction mode API.
 */
export function useInteractionModeManager(
    controlsRef,
    initialMode = INTERACTION_MODES.guided,
) {
    const manager = useMemo(
        () => createInteractionModeManager(controlsRef, initialMode),
        [controlsRef, initialMode],
    );
    const [currentMode, setCurrentMode] = useState(manager.currentMode);

    const guidedMode = useCallback(() => {
        setCurrentMode(manager.guidedMode());
    }, [manager]);

    const exploreMode = useCallback(() => {
        setCurrentMode(manager.exploreMode());
    }, [manager]);

    const enableControls = useCallback(() => {
        manager.enableControls();
    }, [manager]);

    const disableControls = useCallback(() => {
        manager.disableControls();
    }, [manager]);

    return {
        currentMode,
        mode: currentMode,
        guidedMode,
        exploreMode,
        enableControls,
        disableControls,
    };
}

export default useInteractionModeManager;
