import ShipModel from "./ShipModel";
import { Suspense, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { applyLayerVisualState } from './applyLayerVisualState';

function MechanicalLayer({ active, opacity = 1, wireframe = false, scaleMultiplier = 1 }) {
    const scale = (active ? 40 : 38.4) * scaleMultiplier;
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
                <ShipModel />
            </Suspense>
        </group>
    );
}

export default MechanicalLayer;
