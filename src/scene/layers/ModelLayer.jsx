/* eslint-disable react/prop-types */
import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { applyLayerVisualState } from '../applyLayerVisualState';
import ModelAsset from '../models/ModelAsset';
import { getModelConfig } from '../models/modelRegistry';

function ModelLayer({
    active,
    modelId,
    opacity = 1,
    wireframe = false,
    scaleMultiplier = 1,
}) {
    const groupRef = useRef(null);
    const config = getModelConfig(modelId);

    const baseScale = active
        ? config?.layerScale?.active ?? 1
        : config?.layerScale?.inactive ?? config?.layerScale?.active ?? 1;
    const scale = baseScale * scaleMultiplier;
    const rotationSpeed = config?.rotationSpeed ?? 0;

    useEffect(() => {
        applyLayerVisualState(groupRef.current, { opacity, wireframe });
    }, [opacity, wireframe]);

    useFrame((_, delta) => {
        if (!groupRef.current || !active) {
            return;
        }

        if (rotationSpeed !== 0) {
            groupRef.current.rotation.y += delta * rotationSpeed;
        }

        applyLayerVisualState(groupRef.current, { opacity, wireframe });
    });

    if (!config) {
        return null;
    }

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={[scale, scale, scale]}>
            <Suspense fallback={null}>
                <ModelAsset modelId={modelId} />
            </Suspense>
        </group>
    );
}

export default ModelLayer;
