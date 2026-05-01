import * as THREE from 'three';

import { CAMERA_PRESETS, DEFAULT_CAMERA_PRESET } from './CameraPresets';

const DEFAULT_DAMPING = 7;

function toVector3(value, fallback) {
    const source = Array.isArray(value) && value.length === 3 ? value : fallback;
    return new THREE.Vector3(source[0], source[1], source[2]);
}

export function resolveCameraPreset(presetId, cameraPresets = CAMERA_PRESETS) {
    if (!presetId || !cameraPresets) {
        return DEFAULT_CAMERA_PRESET;
    }

    return cameraPresets[presetId] || DEFAULT_CAMERA_PRESET;
}

export function normalizeCameraPreset(preset = DEFAULT_CAMERA_PRESET) {
    return {
        position: toVector3(preset.position, DEFAULT_CAMERA_PRESET.position),
        target: toVector3(preset.target, DEFAULT_CAMERA_PRESET.target),
        fov: typeof preset.fov === 'number' ? preset.fov : DEFAULT_CAMERA_PRESET.fov,
    };
}

export function dampingToAlpha(damping, delta) {
    /*
     * Convert a damping value into a frame-rate independent lerp alpha.
     * A plain alpha like 0.08 changes speed when FPS changes. The exponential
     * form keeps the transition speed stable because it scales by frame delta.
     */
    return 1 - Math.exp(-Math.max(0, damping) * Math.max(0, delta));
}

export class CameraController {
    constructor(camera, options = {}) {
        this.camera = camera;
        this.damping = options.damping ?? DEFAULT_DAMPING;

        const initialPreset = normalizeCameraPreset(options.initialPreset);
        this.targetPosition = initialPreset.position.clone();
        this.targetLookAt = initialPreset.target.clone();
        this.currentLookAt = initialPreset.target.clone();
        this.targetFov = initialPreset.fov;
    }

    setDamping(damping = DEFAULT_DAMPING) {
        this.damping = damping;
    }

    setPreset(preset) {
        const nextPreset = normalizeCameraPreset(preset);

        this.targetPosition.copy(nextPreset.position);
        this.targetLookAt.copy(nextPreset.target);
        this.targetFov = nextPreset.fov;
    }

    update(delta) {
        if (!this.camera) {
            return;
        }

        const alpha = dampingToAlpha(this.damping, delta);

        /*
         * Vector3.lerp moves the current value toward the desired value by
         * alpha. Because alpha is derived from damping + delta, the camera
         * eases out naturally and behaves consistently across frame rates.
         */
        this.camera.position.lerp(this.targetPosition, alpha);
        this.currentLookAt.lerp(this.targetLookAt, alpha);

        /*
         * FOV is a scalar, so MathUtils.lerp applies the same interpolation
         * idea used for Vector3 position and target movement.
         */
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, alpha);
        this.camera.updateProjectionMatrix();
        this.camera.lookAt(this.currentLookAt);
    }
}
