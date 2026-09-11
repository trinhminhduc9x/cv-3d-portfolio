/* eslint-disable react/prop-types, react/no-unknown-property */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAudioReactiveData } from '../../audio/audioReactiveEngine';

const STREAM_COUNT = 70;

function MatrixStreamField({ visible = false, opacity = 1, origin = [10, 0, 0], energy = 1 }) {
    const lineRef = useRef();

    const { positions, initialY } = useMemo(() => {
        const pos = new Float32Array(STREAM_COUNT * 6);
        const yInit = new Float32Array(STREAM_COUNT);
        const [originX, , originZ] = origin;

        for (let i = 0; i < STREAM_COUNT; i++) {
            const x = originX - 3 + (Math.random() - 0.2) * 12;
            const z = originZ + (Math.random() - 0.5) * 14;
            const y = Math.random() * 10 - 0.5;
            const len = 0.8 + Math.random() * 1.5;

            yInit[i] = y;

            pos[i * 6 + 0] = x;
            pos[i * 6 + 1] = y;
            pos[i * 6 + 2] = z;

            pos[i * 6 + 3] = x;
            pos[i * 6 + 4] = y - len;
            pos[i * 6 + 5] = z;
        }

        return { positions: pos, initialY: yInit };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [origin[0], origin[2]]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [positions]);

    useEffect(() => () => {
        geometry.dispose();
    }, [geometry]);

    useFrame((state, delta) => {
        if (!lineRef.current || !visible) return;

        const posAttr = lineRef.current.geometry.attributes.position;
        const array = posAttr.array;
        const audio = getAudioReactiveData(state.clock.elapsedTime);
        const speed = (2.2 + audio.treble * 4.0) * energy * delta;

        for (let i = 0; i < STREAM_COUNT; i++) {
            array[i * 6 + 1] -= speed;
            array[i * 6 + 4] -= speed;

            // Reset when hitting the floor
            if (array[i * 6 + 4] < -0.55) {
                const len = array[i * 6 + 1] - array[i * 6 + 4];
                array[i * 6 + 1] = 9.5 + Math.random() * 2;
                array[i * 6 + 4] = array[i * 6 + 1] - len;
            }
        }

        posAttr.needsUpdate = true;
    });

    if (!visible || opacity <= 0.01) return null;

    return (
        <lineSegments ref={lineRef} geometry={geometry}>
            <lineBasicMaterial
                color="#00eaff"
                transparent
                opacity={opacity * 0.45}
                depthWrite={false}
            />
        </lineSegments>
    );
}

export default MatrixStreamField;
