/* eslint-disable react/prop-types, react/no-unknown-property */
import { useRef, useState } from 'react';
import { Float, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playHoverSound } from '../../audio/uiSoundSynth';

const SKILLS = [
    { name: 'C++', pos: [-2.2, 1.8, 1.2], color: '#00eaff' },
    { name: 'WebGL', pos: [2.4, 2.2, 0.8], color: '#87ceeb' },
    { name: 'Three.js', pos: [-1.8, 3.2, -1.0], color: '#00ffcc' },
    { name: 'React/R3F', pos: [2.0, 3.0, -1.2], color: '#40a0ff' },
    { name: 'GLSL', pos: [0, 3.8, 0.5], color: '#ff00aa' },
    { name: 'Rust/Wasm', pos: [-2.5, 0.6, 2.0], color: '#ffa040' },
];

function SkillBadge({ name, position, color, opacity = 1, energy = 1 }) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        const targetScale = hovered ? 1.15 : 1.0;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8.0);
    });

    return (
        <Float speed={2.5 * energy} rotationIntensity={0.6 * energy} floatIntensity={0.8}>
            <group position={position}>
                <mesh
                    ref={meshRef}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHovered(true);
                        playHoverSound();
                    }}
                    onPointerOut={() => setHovered(false)}
                >
                    <boxGeometry args={[1.2, 0.45, 0.12]} />
                    <meshStandardMaterial
                        color={hovered ? color : '#081420'}
                        emissive={color}
                        emissiveIntensity={hovered ? 0.85 : 0.25}
                        roughness={0.2}
                        metalness={0.8}
                        transparent
                        opacity={opacity * 0.9}
                    />
                </mesh>

                <Text
                    position={[0, 0, 0.08]}
                    fontSize={0.2}
                    color={hovered ? '#ffffff' : color}
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={opacity}
                >
                    {name}
                </Text>
            </group>
        </Float>
    );
}

function FloatingSkillBadges({ visible = false, opacity = 1, position = [10, 0, 0], energy = 1 }) {
    if (!visible || opacity <= 0.01) return null;

    return (
        <group position={position}>
            {SKILLS.map((skill) => (
                <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    position={skill.pos}
                    color={skill.color}
                    opacity={opacity}
                    energy={energy}
                />
            ))}
        </group>
    );
}

export default FloatingSkillBadges;
