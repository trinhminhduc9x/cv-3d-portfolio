import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useExplodedDisassembly(rootScene, exploded = false, intensity = 1.4) {
    const partsRef = useRef([]);

    useEffect(() => {
        if (!rootScene) return;

        const parts = [];
        const box = new THREE.Box3().setFromObject(rootScene);
        const center = new THREE.Vector3();
        box.getCenter(center);

        let index = 0;
        rootScene.traverse((child) => {
            if (child.isMesh) {
                const childBox = new THREE.Box3().setFromObject(child);
                const childCenter = new THREE.Vector3();
                childBox.getCenter(childCenter);

                const dir = childCenter.clone().sub(center);
                if (dir.lengthSq() < 0.001) {
                    dir.set(
                        (Math.sin(index * 1.7) || 0.5),
                        (Math.cos(index * 2.3) || 0.5),
                        (Math.sin(index * 3.1) || 0.5),
                    );
                }
                dir.normalize();

                parts.push({
                    mesh: child,
                    initialPos: child.position.clone(),
                    dir: dir.multiplyScalar(intensity * (1.0 + (index % 3) * 0.4)),
                });
                index += 1;
            }
        });

        partsRef.current = parts;
    }, [rootScene, intensity]);

    useFrame((_, delta) => {
        if (!partsRef.current.length) return;

        const targetProgress = exploded ? 1.0 : 0.0;
        partsRef.current.forEach(({ mesh, initialPos, dir }) => {
            const targetPos = initialPos.clone().addScaledVector(dir, targetProgress);
            mesh.position.lerp(targetPos, delta * 6.0);
        });
    });
}
