/* eslint-disable react/no-unknown-property */
import { Environment } from '@react-three/drei';

// TODO: Centralize environment presets, floor, shadows, and background effects here.
function EnvironmentSystem() {
    return (
        <>
            <Environment preset="warehouse" background={false} environmentIntensity={0.8} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#0f1419" metalness={0.1} roughness={0.8} />
            </mesh>
        </>
    );
}

export default EnvironmentSystem;
