import {
    INTERACTION_MODES,
    createInteractionModeManager,
} from '../../src/life-engine/InteractionModeManager.js';

function createControlsRef(enabled = false) {
    return { current: { enabled } };
}

describe('InteractionModeManager', () => {
    test('starts in guided mode with OrbitControls disabled', () => {
        const controlsRef = createControlsRef(true);
        const manager = createInteractionModeManager(controlsRef);

        expect(manager.currentMode).toBe(INTERACTION_MODES.guided);
        expect(controlsRef.current.enabled).toBe(false);
    });

    test('exploreMode enables OrbitControls', () => {
        const controlsRef = createControlsRef(false);
        const manager = createInteractionModeManager(controlsRef);

        manager.exploreMode();

        expect(manager.currentMode).toBe(INTERACTION_MODES.explore);
        expect(controlsRef.current.enabled).toBe(true);
    });

    test('freeroamMode disables OrbitControls, same as guided', () => {
        const controlsRef = createControlsRef(true);
        const manager = createInteractionModeManager(controlsRef);

        manager.exploreMode();
        expect(controlsRef.current.enabled).toBe(true);

        manager.freeroamMode();

        expect(manager.currentMode).toBe(INTERACTION_MODES.freeroam);
        expect(controlsRef.current.enabled).toBe(false);
    });

    test('guidedMode disables OrbitControls', () => {
        const controlsRef = createControlsRef(true);
        const manager = createInteractionModeManager(controlsRef);

        manager.exploreMode();
        manager.guidedMode();

        expect(manager.currentMode).toBe(INTERACTION_MODES.guided);
        expect(controlsRef.current.enabled).toBe(false);
    });

    test('enableControls/disableControls toggle without changing mode', () => {
        const controlsRef = createControlsRef(false);
        const manager = createInteractionModeManager(controlsRef);

        manager.enableControls();
        expect(controlsRef.current.enabled).toBe(true);
        expect(manager.currentMode).toBe(INTERACTION_MODES.guided);

        manager.disableControls();
        expect(controlsRef.current.enabled).toBe(false);
        expect(manager.currentMode).toBe(INTERACTION_MODES.guided);
    });
});
