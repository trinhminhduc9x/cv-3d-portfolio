import ShipModel from "./ShipModel";
import { Suspense } from "react";

function MechanicalLayer({ active }) {
    const scale = active ? 40 : 38.4;

    return (
        <group position={[0, 0, 0]} scale={[scale, scale, scale]}>
            <Suspense fallback={null}>
                <ShipModel />
            </Suspense>
        </group>
    );
}

export default MechanicalLayer;