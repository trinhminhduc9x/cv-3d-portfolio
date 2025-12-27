import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function SoftwareModel(props) {
    const { scene } = useGLTF(
        import.meta.env.BASE_URL + 'models/software.glb'
    );

    useEffect(() => {
        if (!scene) return;

        // Reset transforms
        scene.position.set(0, 0, 0);
        scene.scale.set(0.1, 0.1, 0.1);
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
useGLTF.preload("/models/software.glb");