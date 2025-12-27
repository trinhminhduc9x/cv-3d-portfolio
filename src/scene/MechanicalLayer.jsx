import ShipModel from "./ShipModel";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";

function MechanicalLayer({ active }) {
    const scale = active ? 40 : 38.4;
    const groupRef = useRef();

    useFrame((_, delta) => {
        if (!groupRef.current || !active) return;
        groupRef.current.rotation.y += delta * 0.15;
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