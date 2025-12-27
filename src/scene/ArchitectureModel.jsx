import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function ArchitectureModel(props) {
    const { scene } = useGLTF("/models/architecture.glb");

    useEffect(() => {
        if (!scene) return;

        // Reset transforms và scale down 50x
        scene.position.set(0, 0, 0);
        scene.scale.set(0.1, 0.1, 0.1); // 1/50 = 0.02
        scene.rotation.set(0, 0, 0);

        // Configure all meshes
        scene.traverse((child) => {
            if (child.isMesh) {
                child.visible = true;
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    const materials = Array.isArray(child.material)
                        ? child.material
                        : [child.material];

                    child.material = materials.map(m => {
                        const cloned = m.clone();
                        cloned.transparent = false;
                        cloned.opacity = 1;
                        cloned.side = THREE.DoubleSide;
                        cloned.depthTest = true;
                        cloned.depthWrite = true;
                        cloned.needsUpdate = true;
                        return cloned;
                    });

                    if (child.material.length === 1) {
                        child.material = child.material[0];
                    }
                }
            }
        });
    }, [scene]);

    return <primitive object={scene} dispose={null} {...props} />;
}

// Preload GLB file
useGLTF.preload("/models/architecture.glb");