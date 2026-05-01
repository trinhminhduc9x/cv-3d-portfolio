import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { CameraController } from './CameraController';
import { DEFAULT_CAMERA_PRESET } from './CameraPresets';

export function useSmoothCamera(camera, preset = DEFAULT_CAMERA_PRESET, options = {}) {
    const controllerRef = useRef(null);
    const damping = options.damping ?? 7;

    if (!controllerRef.current || controllerRef.current.camera !== camera) {
        controllerRef.current = new CameraController(camera, {
            damping,
            initialPreset: DEFAULT_CAMERA_PRESET,
        });
    }

    useEffect(() => {
        controllerRef.current.setDamping(damping);
    }, [damping]);

    useEffect(() => {
        controllerRef.current.setPreset(preset);
    }, [preset]);

    useFrame((_, delta) => {
        /*
         * React Three Fiber calls this once per rendered frame. The controller
         * receives delta seconds so interpolation remains stable at 30, 60,
         * or variable FPS.
         */
        controllerRef.current.update(delta);
    });

    return controllerRef.current;
}
