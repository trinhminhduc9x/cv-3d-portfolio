/* eslint-disable react/prop-types */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// TODO: Add shared layer behavior such as activation animation, shadows, and bounds.
function BaseLayer({ active = false, rotationSpeed = 0, children }) {
    const groupRef = useRef(null);

    useFrame((_, delta) => {
        if (!active || !groupRef.current || rotationSpeed === 0) {
            return;
        }

        groupRef.current.rotation.y += delta * rotationSpeed;
    });

    return <group ref={groupRef}>{children}</group>;
}

export default BaseLayer;
