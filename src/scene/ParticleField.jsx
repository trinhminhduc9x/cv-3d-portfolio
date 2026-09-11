/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAudioReactiveData } from '../audio/audioReactiveEngine';

const COUNT = 500;

function computeCurl(x, y, z, time) {
    const s = 0.25;
    const t = time * 0.4;
    const u = Math.sin(y * s + t) + Math.cos(z * s * 1.3);
    const v = Math.cos(z * s - t * 0.8) + Math.sin(x * s * 1.1);
    const w = Math.sin(x * s + t * 0.5) - Math.cos(y * s * 0.9);
    return [u * 0.08, v * 0.08, w * 0.08];
}

function ParticleField({ transitioning = false }) {
    const ref = useRef();
    const materialRef = useRef();
    const speedMultiplier = useRef(1);

    const { positions, initialPositions } = useMemo(() => {
        const pos = new Float32Array(COUNT * 3);
        const initPos = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const x = (Math.random() - 0.3) * 34;
            const y = (Math.random() - 0.5) * 24;
            const z = (Math.random() - 0.8) * 24;
            pos[i * 3 + 0] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            initPos[i * 3 + 0] = x;
            initPos[i * 3 + 1] = y;
            initPos[i * 3 + 2] = z;
        }
        return { positions: pos, initialPositions: initPos };
    }, []);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [positions]);

    useEffect(() => () => {
        geometry.dispose();
    }, [geometry]);

    useFrame((state, delta) => {
        if (!ref.current || !materialRef.current) return;

        const time = state.clock.elapsedTime;
        const audio = getAudioReactiveData(time);
        const targetSpeed = transitioning ? 4.5 : (1.0 + audio.bass * 2.0);

        speedMultiplier.current = THREE.MathUtils.lerp(
            speedMultiplier.current,
            targetSpeed,
            delta * 4.0,
        );

        ref.current.rotation.y += delta * 0.015 * speedMultiplier.current;

        // Apply Curl Noise fluid vector displacement
        const posArray = ref.current.geometry.attributes.position.array;
        for (let i = 0; i < COUNT; i += 4) {
            const idx = i * 3;
            const [cx, cy, cz] = computeCurl(posArray[idx], posArray[idx + 1], posArray[idx + 2], time);
            posArray[idx] += cx * delta * speedMultiplier.current * 4.0;
            posArray[idx + 1] += cy * delta * speedMultiplier.current * 4.0;
            posArray[idx + 2] += cz * delta * speedMultiplier.current * 4.0;

            // Soft constraint to keep in bounding box
            if (Math.abs(posArray[idx] - initialPositions[idx]) > 6.0) {
                posArray[idx] = initialPositions[idx];
                posArray[idx + 1] = initialPositions[idx + 1];
                posArray[idx + 2] = initialPositions[idx + 2];
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;

        // Pulse particle size to audio energy
        const baseSize = transitioning ? 0.095 : 0.055;
        const audioSize = baseSize + audio.energy * 0.04;
        materialRef.current.size = THREE.MathUtils.lerp(
            materialRef.current.size,
            audioSize,
            delta * 5.0,
        );

        // Dynamic audio sparkle opacity
        materialRef.current.opacity = 0.5 + audio.treble * 0.35;
    });

    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial
                ref={materialRef}
                size={0.055}
                color="#b8d4ff"
                transparent
                opacity={0.55}
                sizeAttenuation
            />
        </points>
    );
}

export default ParticleField;
