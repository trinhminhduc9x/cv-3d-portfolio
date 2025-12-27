import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 400;

function ParticleField() {
    const ref = useRef();

    const geometry = useMemo(() => {
        const positions = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3]     = (Math.random() - 0.3) * 30;  // x: spread across scene
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;  // y
            positions[i * 3 + 2] = (Math.random() - 0.8) * 20;  // z: mostly behind
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y += delta * 0.018;
    });

    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial
                size={0.055}
                color="#b8d4ff"
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
}

export default ParticleField;
