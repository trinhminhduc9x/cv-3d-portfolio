import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export function useCameraController(targetPosition) {
    const { camera } = useThree();
    const target = useRef(new THREE.Vector3());
    const lookAt = useRef(new THREE.Vector3(0, 0, 0));

    const positionKey = useMemo(
        () => targetPosition.join(','),
        [targetPosition],
    );

    useEffect(() => {
        if (!targetPosition || targetPosition.length !== 3) {
            return;
        }

        target.current.set(targetPosition[0], targetPosition[1], targetPosition[2]);

        const cameraX = targetPosition[0];
        let lookAtX;

        if (cameraX < 0) {
            lookAtX = 0;
        } else if (cameraX >= 5 && cameraX < 7) {
            lookAtX = 5;
        } else {
            lookAtX = 10;
        }

        lookAt.current.set(lookAtX, 0, 0);
    }, [positionKey, targetPosition]);

    useFrame(() => {
        camera.position.lerp(target.current, 0.08);
        camera.lookAt(lookAt.current);
    });
}
