/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';

import { resolveCameraPreset } from './CameraController';
import { CAMERA_PRESETS } from './CameraPresets';
import { useSmoothCamera } from './useSmoothCamera';

function CameraSystem({
    preset,
    presetId,
    presets = CAMERA_PRESETS,
    damping = 7,
}) {
    const camera = useThree((state) => state.camera);

    const resolvedPreset = useMemo(() => {
        if (preset) {
            return preset;
        }

        return resolveCameraPreset(presetId, presets);
    }, [preset, presetId, presets]);

    useSmoothCamera(camera, resolvedPreset, { damping });

    return null;
}

export default CameraSystem;
