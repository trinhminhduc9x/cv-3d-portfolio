/* eslint-disable react/prop-types, react/no-unknown-property */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function resolveObject(target, targetRef) {
    return targetRef?.current || target || null;
}

/**
 * Computes an axis-aligned world-space bounding box for a target Object3D.
 *
 * Box3.setFromObject walks all visible descendants and expands the bounds in
 * world space. Box3Helper then renders that min/max volume as a wireframe box.
 */
function BoundingBoxOverlay({
    active = false,
    target = null,
    targetRef = null,
    color = '#87ceeb',
}) {
    const boxRef = useRef(new THREE.Box3());

    const helper = useMemo(() => {
        const boxHelper = new THREE.Box3Helper(boxRef.current, color);
        boxHelper.visible = false;
        return boxHelper;
    }, [color]);

    useFrame(() => {
        if (!active) {
            helper.visible = false;
            return;
        }

        const object = resolveObject(target, targetRef);

        if (!object) {
            helper.visible = false;
            return;
        }

        boxRef.current.setFromObject(object);
        helper.visible = !boxRef.current.isEmpty();
        helper.updateMatrixWorld(true);
    });

    useEffect(() => () => {
        helper.geometry?.dispose();
        helper.material?.dispose();
    }, [helper]);

    return <primitive object={helper} visible={active} />;
}

export default BoundingBoxOverlay;
