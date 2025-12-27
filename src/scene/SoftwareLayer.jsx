import SoftwareModel from "./SoftwareModel";
import { Suspense } from "react";

function SoftwareLayer({ active }) {
    const scale = active ? 1.0 : 0.96;

    return (
        <group position={[0, 0, 0]} scale={[scale, scale, scale]}>
            <Suspense fallback={null}>
                <SoftwareModel />
            </Suspense>
        </group>
    );
}

export default SoftwareLayer;