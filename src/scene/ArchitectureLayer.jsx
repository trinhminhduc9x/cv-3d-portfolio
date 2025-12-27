import ArchitectureModel from "./ArchitectureModel";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";

function ArchitectureLayer({ active }) {
    const scale = active ? 1.0 : 0.96;
    const groupRef = useRef();

    useFrame((_, delta) => {
        if (!groupRef.current || !active) return;
        groupRef.current.rotation.y += delta * 0.15;
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={[scale, scale, scale]}>
            <Suspense fallback={null}>
                <ArchitectureModel />
            </Suspense>
        </group>
    );
}

export default ArchitectureLayer;