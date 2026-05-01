/* eslint-disable react/prop-types, react/no-unknown-property */
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function disposeHelper(helper) {
    helper.geometry?.dispose();

    if (Array.isArray(helper.material)) {
        helper.material.forEach((material) => material.dispose());
    } else {
        helper.material?.dispose();
    }
}

function resolveObject(target, targetRef) {
    return targetRef?.current || target || null;
}

/**
 * Displays a local XYZ axes helper for the current narrative layer.
 *
 * If `target` or `targetRef` is provided, the helper copies that object's
 * world matrix each frame, so the axes follow the layer's position, rotation,
 * and scale. If no target is provided, the helper renders at its parent origin.
 */
function AxesOverlay({
    active = false,
    target = null,
    targetRef = null,
    size = 1.5,
}) {
    const helper = useMemo(() => {
        const axes = new THREE.AxesHelper(size);
        axes.matrixAutoUpdate = false;
        return axes;
    }, [size]);

    useFrame(() => {
        if (!active) {
            return;
        }

        const object = resolveObject(target, targetRef);

        if (!object) {
            helper.matrix.identity();
            return;
        }

        object.updateWorldMatrix(true, false);
        helper.matrix.copy(object.matrixWorld);
    });

    useEffect(() => () => disposeHelper(helper), [helper]);

    if (!active) {
        return null;
    }

    return <primitive object={helper} />;
}

export default AxesOverlay;
