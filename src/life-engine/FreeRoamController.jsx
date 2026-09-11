import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { MUSEUM_BOUNDS, MUSEUM_ZONES } from '../data/museumLayout.config';
import { isEditableTarget } from '../core/narrativeController';

export const EYE_HEIGHT = 4.5;
export const WALK_SPEED = 9;
export const ZONE_ENTER_MARGIN = 1.5;

// ADR-0002: walking-camera feel constants.
const ACCEL_RATE = 8; // exponential damp rate for velocity toward its target
const LOOK_SMOOTH_RATE = 22; // exponential damp rate for mouse-look yaw/pitch
const LOOK_SENSITIVITY = 0.0022;
const MAX_PITCH = Math.PI / 2 - 0.02;
const BOB_FREQUENCY = 9;
const BOB_AMPLITUDE = 0.07;
const VELOCITY_SNAP_EPSILON = 0.0004;

const MOVE_KEYS = {
    KeyW: 'forward',
    ArrowUp: 'forward',
    KeyS: 'backward',
    ArrowDown: 'backward',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
};

/**
 * Frame-rate-independent exponential damp — moves `current` toward `target`
 * covering a fixed fraction of the remaining distance per second, the same
 * idiom already used for `mouseOffset` in `CameraDirector.js`.
 *
 * @param {number} current Current value.
 * @param {number} target Target value.
 * @param {number} rate Damping rate (higher = snappier).
 * @param {number} delta Frame delta time in seconds.
 * @returns {number} Damped value.
 */
function damp(current, target, rate, delta) {
    return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-rate * delta));
}

/**
 * Clamps a position to the walkable museum floor rectangle.
 *
 * @param {THREE.Vector3} position Mutable position to clamp in place.
 * @param {object} bounds `{ minX, maxX, minZ, maxZ }`.
 */
export function clampToBounds(position, bounds = MUSEUM_BOUNDS) {
    position.x = THREE.MathUtils.clamp(position.x, bounds.minX, bounds.maxX);
    position.z = THREE.MathUtils.clamp(position.z, bounds.minZ, bounds.maxZ);
}

/**
 * Pushes a position out of any exhibit zone it has walked into.
 * Simple circle collision — adequate for three zones, not a navmesh.
 *
 * @param {THREE.Vector3} position Mutable position to resolve in place.
 * @param {object} zones `MUSEUM_ZONES`-shaped map.
 */
export function resolveZoneCollisions(position, zones = MUSEUM_ZONES) {
    Object.values(zones).forEach((zone) => {
        const dx = position.x - zone.position[0];
        const dz = position.z - zone.position[2];
        const distance = Math.sqrt((dx * dx) + (dz * dz));

        if (distance < zone.radius && distance > 0.0001) {
            const push = zone.radius / distance;
            position.x = zone.position[0] + (dx * push);
            position.z = zone.position[2] + (dz * push);
        }
    });
}

/**
 * Finds the nearest zone whose (radius + margin) currently contains the
 * given position, if any.
 *
 * @param {THREE.Vector3} position Position to test.
 * @param {object} zones `MUSEUM_ZONES`-shaped map.
 * @param {number} margin Extra radius so the plaque triggers slightly before collision.
 * @returns {string|null} Zone id, or null if not inside any zone.
 */
export function findActiveZoneId(position, zones = MUSEUM_ZONES, margin = ZONE_ENTER_MARGIN) {
    let closestId = null;
    let closestDistance = Infinity;

    Object.entries(zones).forEach(([zoneId, zone]) => {
        const dx = position.x - zone.position[0];
        const dz = position.z - zone.position[2];
        const distance = Math.sqrt((dx * dx) + (dz * dz));

        if (distance <= zone.radius + margin && distance < closestDistance) {
            closestDistance = distance;
            closestId = zoneId;
        }
    });

    return closestId;
}

/**
 * Computes the camera yaw (radians) that faces `target` from `position`,
 * matching three.js's default -Z-forward convention. Used to make a
 * teleport (TimelineIndicator click while free-roaming) face the same way
 * the guided camera preset would.
 *
 * @param {[number, number, number]} position World position.
 * @param {[number, number, number]} target World look-at target.
 * @returns {number} Yaw in radians.
 */
export function computeYawToTarget(position, target) {
    const dx = target[0] - position[0];
    const dz = target[2] - position[2];
    const length = Math.sqrt((dx * dx) + (dz * dz)) || 1;

    return Math.atan2(-dx / length, -dz / length);
}

/**
 * Free-roam museum controller: hand-rolled pointer-lock mouse-look (smoothed)
 * + WASD walking (damped velocity + head-bob) with basic exhibit collision.
 * Mounted inside `<Canvas>` only while its `active` prop is true; owns the
 * camera directly and must coexist with `CameraDirector` being passed
 * `active={false}` for the same duration.
 *
 * Pointer-lock is hand-rolled (not drei's `<PointerLockControls>`) because
 * ADR-0002 needs a smoothing stage between raw mouse input and the applied
 * camera rotation, which drei's component doesn't expose a hook for.
 *
 * @param {object} props Component props.
 * @param {boolean} props.active Whether free-roam currently owns the camera.
 * @param {(zoneId: string|null) => void} props.onZoneChange Called when the
 *   nearest exhibit zone id changes (or is left, with `null`). Callers map
 *   `zoneId` to a chapter id (via `MUSEUM_ZONES[zoneId].primaryChapterId`) and/or
 *   use it directly for zone-keyed content like `MuseumPlaque`.
 * @param {() => void} props.onLockChange Called with `true`/`false` when
 *   pointer-lock is acquired/released (e.g. via the browser's own Escape key)
 *   so the caller can show a "click to look around" prompt or fall back to
 *   another mode.
 */
export const FreeRoamController = forwardRef(function FreeRoamController(
    { active, onZoneChange, onLockChange },
    ref,
) {
    const camera = useThree((state) => state.camera);
    const gl = useThree((state) => state.gl);
    const keysRef = useRef(new Set());
    const positionRef = useRef(new THREE.Vector3(0, EYE_HEIGHT, 12));
    const velocityRef = useRef(new THREE.Vector3());
    const distanceWalkedRef = useRef(0);
    const yawRef = useRef(0);
    const pitchRef = useRef(0);
    const targetYawRef = useRef(0);
    const targetPitchRef = useRef(0);
    const activeZoneRef = useRef(null);
    const [locked, setLocked] = useState(false);

    // Keyboard (WASD/arrows) — only while active, ignored while typing in an input.
    useEffect(() => {
        if (!active) {
            keysRef.current.clear();
            return undefined;
        }

        const onKeyDown = (event) => {
            if (isEditableTarget(event.target)) {
                return;
            }
            if (MOVE_KEYS[event.code]) {
                keysRef.current.add(MOVE_KEYS[event.code]);
            }
        };

        const onKeyUp = (event) => {
            if (MOVE_KEYS[event.code]) {
                keysRef.current.delete(MOVE_KEYS[event.code]);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            keysRef.current.clear();
        };
    }, [active]);

    // Hand-rolled pointer-lock: request-on-click + smoothed mouse-look.
    useEffect(() => {
        if (!active) {
            return undefined;
        }

        const domElement = gl.domElement;
        const promptElements = Array.from(document.querySelectorAll('#museum-lock-prompt'));

        const requestLock = () => {
            domElement.requestPointerLock();
        };

        const onMouseMove = (event) => {
            if (document.pointerLockElement !== domElement) {
                return;
            }
            targetYawRef.current -= event.movementX * LOOK_SENSITIVITY;
            targetPitchRef.current = THREE.MathUtils.clamp(
                targetPitchRef.current - (event.movementY * LOOK_SENSITIVITY),
                -MAX_PITCH,
                MAX_PITCH,
            );
        };

        const onPointerLockChange = () => {
            const isLocked = document.pointerLockElement === domElement;
            setLocked(isLocked);
            onLockChange?.(isLocked);
        };

        const onPointerLockError = () => {
            console.error('FreeRoamController: unable to acquire Pointer Lock');
        };

        promptElements.forEach((el) => el.addEventListener('click', requestLock));
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('pointerlockchange', onPointerLockChange);
        document.addEventListener('pointerlockerror', onPointerLockError);

        return () => {
            promptElements.forEach((el) => el.removeEventListener('click', requestLock));
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('pointerlockchange', onPointerLockChange);
            document.removeEventListener('pointerlockerror', onPointerLockError);
            if (document.pointerLockElement === domElement) {
                document.exitPointerLock();
            }
        };
    }, [active, gl, onLockChange]);

    useEffect(() => {
        if (active) {
            // Start walking from wherever guided/explore left the camera,
            // not a fixed default — continuity matters for immersion.
            positionRef.current.copy(camera.position);
            positionRef.current.y = EYE_HEIGHT;
            camera.position.copy(positionRef.current);

            const initialEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
            yawRef.current = initialEuler.y;
            targetYawRef.current = initialEuler.y;
            pitchRef.current = 0;
            targetPitchRef.current = 0;
            velocityRef.current.set(0, 0, 0);
            distanceWalkedRef.current = 0;
        }
    }, [active, camera]);

    useImperativeHandle(ref, () => ({
        /**
         * Snaps the controller to a teleported position (e.g. after clicking a
         * TimelineIndicator waypoint) so walking continues from there instead
         * of the pre-teleport spot. Bypasses look-smoothing — a teleport should
         * snap instantly, not drift into its new facing direction.
         *
         * @param {[number, number, number]} position World position to snap to.
         * @param {number} yaw Camera yaw in radians.
         */
        syncPosition(position, yaw = yawRef.current) {
            positionRef.current.set(position[0], EYE_HEIGHT, position[2]);
            camera.position.copy(positionRef.current);
            yawRef.current = yaw;
            targetYawRef.current = yaw;
            pitchRef.current = 0;
            targetPitchRef.current = 0;
            camera.quaternion.setFromEuler(new THREE.Euler(0, yaw, 0, 'YXZ'));
        },
        get isLocked() {
            return locked;
        },
        requestLock() {
            gl.domElement.requestPointerLock();
        },
    }), [camera, gl, locked]);

    useFrame((state, delta) => {
        if (!active) {
            return;
        }

        // Smoothed mouse-look.
        yawRef.current = damp(yawRef.current, targetYawRef.current, LOOK_SMOOTH_RATE, delta);
        pitchRef.current = damp(pitchRef.current, targetPitchRef.current, LOOK_SMOOTH_RATE, delta);
        camera.quaternion.setFromEuler(new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ'));

        // Damped WASD velocity (acceleration/deceleration).
        const keys = keysRef.current;
        const targetVelocity = new THREE.Vector3();

        if (keys.size > 0) {
            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
            forward.y = 0;
            forward.normalize();

            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
            right.y = 0;
            right.normalize();

            if (keys.has('forward')) targetVelocity.add(forward);
            if (keys.has('backward')) targetVelocity.sub(forward);
            if (keys.has('right')) targetVelocity.add(right);
            if (keys.has('left')) targetVelocity.sub(right);

            if (targetVelocity.lengthSq() > 0) {
                targetVelocity.normalize().multiplyScalar(WALK_SPEED);
            }
        }

        velocityRef.current.x = damp(velocityRef.current.x, targetVelocity.x, ACCEL_RATE, delta);
        velocityRef.current.z = damp(velocityRef.current.z, targetVelocity.z, ACCEL_RATE, delta);
        if (velocityRef.current.lengthSq() < VELOCITY_SNAP_EPSILON) {
            velocityRef.current.set(0, 0, 0);
        }

        positionRef.current.x += velocityRef.current.x * delta;
        positionRef.current.z += velocityRef.current.z * delta;

        resolveZoneCollisions(positionRef.current);
        clampToBounds(positionRef.current);
        positionRef.current.y = EYE_HEIGHT;

        // Head-bob — amplitude fades to zero at a standstill.
        const speed = velocityRef.current.length();
        distanceWalkedRef.current += speed * delta;
        const speedFactor = THREE.MathUtils.clamp(speed / WALK_SPEED, 0, 1);
        const bobOffset = Math.sin(distanceWalkedRef.current * BOB_FREQUENCY) * BOB_AMPLITUDE * speedFactor;

        camera.position.set(
            positionRef.current.x,
            positionRef.current.y + bobOffset,
            positionRef.current.z,
        );

        const nextZoneId = findActiveZoneId(positionRef.current);
        if (nextZoneId !== activeZoneRef.current) {
            activeZoneRef.current = nextZoneId;
            onZoneChange?.(nextZoneId);
        }
    });

    return null;
});

export default FreeRoamController;
