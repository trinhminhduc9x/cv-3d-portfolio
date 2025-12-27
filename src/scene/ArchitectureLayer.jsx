import ArchitectureModel from "./ArchitectureModel";
import { Suspense } from "react";

function ArchitectureLayer({ active }) {
    // Scale tương tự MechanicalLayer: active vs inactive
    const scale = active ? 1.0 : 0.96;

    return (
        <group position={[0, 0, 0]} scale={[scale, scale, scale]}>
            <Suspense fallback={null}>
                <ArchitectureModel />
            </Suspense>
        </group>
    );
}

export default ArchitectureLayer;