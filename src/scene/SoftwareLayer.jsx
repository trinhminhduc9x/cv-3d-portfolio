import SoftwareModel from "./SoftwareModel";
import { Suspense, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { applyLayerVisualState } from './applyLayerVisualState';

function SoftwareLayer({ active, opacity = 1, wireframe = false, scaleMultiplier = 1 }) {
    const scale = (active ? 1.0 : 0.96) * scaleMultiplier;
    const groupRef = useRef();

    useEffect(() => {
        applyLayerVisualState(groupRef.current, { opacity, wireframe });
    }, [opacity, wireframe]);

    useFrame((_, delta) => {
        if (!groupRef.current || !active) return;
        groupRef.current.rotation.y += delta * 0.15;
        applyLayerVisualState(groupRef.current, { opacity, wireframe });
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={[scale, scale, scale]}>
            <Suspense fallback={null}>
                <SoftwareModel />
            </Suspense>
        </group>
    );
}

export default SoftwareLayer;
