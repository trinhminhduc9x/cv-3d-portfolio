/* eslint-disable react/prop-types, react/no-unknown-property */
import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Renders a CameraHelper for the current view camera or a supplied camera.
 *
 * A camera frustum is the truncated pyramid that represents what the camera
 * can see. CameraHelper derives its line geometry from the camera projection
 * matrix, so it must be updated whenever the camera moves or its FOV changes.
 */
function FrustumVisualizer({
    active = false,
    camera = null,
    cameraRef = null,
}) {
    const canvasCamera = useThree((state) => state.camera);
    const sourceCamera = cameraRef?.current || camera || canvasCamera;

    const helper = useMemo(() => {
        const cameraHelper = new THREE.CameraHelper(sourceCamera);
        cameraHelper.visible = false;
        return cameraHelper;
    }, [sourceCamera]);

    useFrame(() => {
        if (!active) {
            helper.visible = false;
            return;
        }

        sourceCamera.updateMatrixWorld();
        sourceCamera.updateProjectionMatrix();
        helper.visible = true;
        helper.update();
    });

    useEffect(() => () => {
        helper.geometry?.dispose();
        helper.material?.dispose();
    }, [helper]);

    return <primitive object={helper} visible={active} />;
}

export default FrustumVisualizer;
