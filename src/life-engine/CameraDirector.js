import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { cubicInOut, expoOut, quadInOut } from './AnimationTimelineSystem';

const DEFAULT_PRESET = {
    position: [0, 4, 18],
    target: [0, 0, 0],
    fov: 50,
    duration: 1.35,
    easing: 'cubicInOut',
};

const EASING_MAP = {
    cubicInOut,
    quadInOut,
    expoOut,
    linear: (value) => Math.min(Math.max(value, 0), 1),
};

function resolveEasing(easing) {
    if (typeof easing === 'function') {
        return easing;
    }

    return EASING_MAP[easing] || cubicInOut;
}

function toVector3(value, fallback) {
    const source = Array.isArray(value) && value.length === 3 ? value : fallback;
    return new THREE.Vector3(source[0], source[1], source[2]);
}

function readControlsTarget(controlsRef, fallback) {
    return controlsRef?.current?.target?.clone?.() || fallback.clone();
}

/**
 * Creates the mutable internal camera director state.
 *
 * @param {THREE.Camera} camera R3F camera.
 * @param {object} controlsRef React ref for OrbitControls.
 * @returns {object} Camera director mutable state.
 */
function createDirectorState(camera, controlsRef) {
    const initialTarget = readControlsTarget(
        controlsRef,
        toVector3(DEFAULT_PRESET.target, DEFAULT_PRESET.target),
    );

    return {
        disposed: false,
        controlsLocked: true,
        transitionId: 0,
        currentTarget: initialTarget.clone(),
        mouseOffset: new THREE.Vector3(0, 0, 0),
        transition: {
            active: false,
            elapsed: 0,
            duration: DEFAULT_PRESET.duration,
            easing: resolveEasing(DEFAULT_PRESET.easing),
            fromPosition: camera.position.clone(),
            toPosition: toVector3(DEFAULT_PRESET.position, DEFAULT_PRESET.position),
            fromTarget: initialTarget.clone(),
            toTarget: initialTarget.clone(),
            fromFov: camera.fov,
            toFov: camera.fov,
        },
    };
}

/**
 * R3F camera director hook.
 *
 * The hook owns transition state in refs, updates via `useFrame`, and always
 * starts interrupted transitions from the camera's current interpolated state.
 *
 * @param {object} options Director options.
 * @param {object} options.controlsRef React ref for OrbitControls.
 * @param {object} options.preset Optional preset to apply reactively.
 * @param {boolean} options.locked Whether OrbitControls should be locked.
 * @param {boolean} options.active Whether this director should drive the
 *   camera at all. Set to `false` while another system (e.g.
 *   FreeRoamController) owns the camera directly — the director then reads
 *   no state and writes nothing to `camera` or `controlsRef` each frame.
 * @returns {object} Camera director API.
 */
export function useCameraDirector({
    controlsRef, preset = null, locked = true, active = true,
} = {}) {
    const camera = useThree((state) => state.camera);
    const directorRef = useRef(null);

    if (!directorRef.current) {
        directorRef.current = createDirectorState(camera, controlsRef);
    }

    const applyControlsLock = useCallback((isLocked) => {
        directorRef.current.controlsLocked = isLocked;

        if (controlsRef?.current) {
            controlsRef.current.enabled = !isLocked;
        }
    }, [controlsRef]);

    const applyPreset = useCallback((nextPreset = DEFAULT_PRESET) => {
        const director = directorRef.current;

        if (!director || director.disposed) {
            return;
        }

        const targetPosition = toVector3(
            nextPreset.position,
            DEFAULT_PRESET.position,
        );
        const targetLookAt = toVector3(
            nextPreset.target,
            DEFAULT_PRESET.target,
        );
        const duration = Math.max(nextPreset.duration ?? DEFAULT_PRESET.duration, 0.0001);
        const easing = resolveEasing(nextPreset.easing ?? DEFAULT_PRESET.easing);
        const targetFov = typeof nextPreset.fov === 'number'
            ? nextPreset.fov
            : DEFAULT_PRESET.fov;

        director.transitionId += 1;
        director.transition = {
            active: true,
            elapsed: 0,
            duration,
            easing,
            fromPosition: camera.position.clone(),
            toPosition: targetPosition,
            fromTarget: director.currentTarget.clone(),
            toTarget: targetLookAt,
            fromFov: camera.fov,
            toFov: targetFov,
        };
    }, [camera]);

    const lockControls = useCallback(() => {
        applyControlsLock(true);
    }, [applyControlsLock]);

    const unlockControls = useCallback(() => {
        applyControlsLock(false);
    }, [applyControlsLock]);

    const update = useCallback((delta, pointer = null) => {
        const director = directorRef.current;

        if (!director || director.disposed || !active) {
            return;
        }

        const transition = director.transition;

        if (transition.active) {
            transition.elapsed = Math.min(
                transition.elapsed + Math.max(delta, 0),
                transition.duration,
            );

            const rawProgress = transition.elapsed / transition.duration;
            const progress = transition.easing(rawProgress);

            camera.position.lerpVectors(
                transition.fromPosition,
                transition.toPosition,
                progress,
            );
            director.currentTarget.lerpVectors(
                transition.fromTarget,
                transition.toTarget,
                progress,
            );
            camera.fov = THREE.MathUtils.lerp(
                transition.fromFov,
                transition.toFov,
                progress,
            );
            camera.updateProjectionMatrix();

            if (rawProgress >= 1) {
                transition.active = false;
                camera.position.copy(transition.toPosition);
                director.currentTarget.copy(transition.toTarget);
                camera.fov = transition.toFov;
                camera.updateProjectionMatrix();
            }
        }

        if (director.controlsLocked && pointer) {
            const targetX = pointer.x * 0.3;
            const targetY = pointer.y * 0.2;
            director.mouseOffset.x = THREE.MathUtils.lerp(director.mouseOffset.x, targetX, delta * 3.0);
            director.mouseOffset.y = THREE.MathUtils.lerp(director.mouseOffset.y, targetY, delta * 3.0);
            camera.position.x += director.mouseOffset.x;
            camera.position.y += director.mouseOffset.y;
        }

        if (director.controlsLocked) {
            // Only the guided-tour script owns the look-at target. In explore
            // (unlocked) mode, OrbitControls must own its own target from user
            // input — overwriting it here every frame would fight the user's pan.
            // (FreeRoamController's true walk-around mode never reaches this code
            // at all — `active` is false and `update` returns before this point.)
            camera.lookAt(director.currentTarget);
        }

        if (controlsRef?.current) {
            if (director.controlsLocked) {
                controlsRef.current.target.copy(director.currentTarget);
            }
            controlsRef.current.enabled = !director.controlsLocked;
            controlsRef.current.update();
        }
    }, [active, camera, controlsRef]);

    useEffect(() => {
        if (!active) {
            return;
        }
        applyControlsLock(locked);
    }, [active, applyControlsLock, locked]);

    useEffect(() => {
        if (preset) {
            applyPreset(preset);
        }
    }, [applyPreset, preset]);

    useEffect(() => () => {
        if (directorRef.current) {
            directorRef.current.disposed = true;
        }
    }, []);

    useFrame((state, delta) => {
        update(delta, state.pointer);
    });


    return useMemo(() => ({
        applyPreset,
        applyCameraPreset: applyPreset,
        update,
        lockControls,
        unlockControls,
        get locked() {
            return directorRef.current?.controlsLocked ?? true;
        },
    }), [applyPreset, lockControls, unlockControls, update]);
}

export default useCameraDirector;
