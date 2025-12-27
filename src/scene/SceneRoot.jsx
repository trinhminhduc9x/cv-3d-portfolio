import { useState } from 'react';
import * as THREE from 'three';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

import HeaderStatement from '../ui/HeaderStatement';
import NarrativePanel from '../ui/NarrativePanel';

import MechanicalLayer from './MechanicalLayer';
import ArchitectureLayer from './ArchitectureLayer';
import SoftwareLayer from './SoftwareLayer';

import { TIMELINE } from '../data/timeline';
import { useTimelineScroll } from '../core/useTimelineScroll';
import { CAMERA_POSITIONS } from '../core/cameraState';
import { useCameraController } from '../core/useCameraController';

/* ================= CAMERA RIG ================= */

function CameraRig({ active }) {
    useCameraController(CAMERA_POSITIONS[active]);
    return null;
}

/* ================= SCENE ROOT ================= */

function SceneRoot() {
    const [index, setIndex] = useState(0);
    useTimelineScroll(setIndex, TIMELINE.length - 1);

    const active = TIMELINE[index].id;

    return (
        <>
            <Canvas
                camera={{ position: [0, 4, 14], fov: 50 }}
                style={{ width: '100vw', height: '100vh' }}
                shadows
                gl={{
                    alpha: false,
                    outputColorSpace: THREE.SRGBColorSpace,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 0.9,
                }}
            >
                <color attach="background" args={['#0f1419']} />
                <fog attach="fog" args={['#0f1419', 15, 50]} />

                {/* ================= LIGHTING ================= */}
                <ambientLight intensity={0.6} color="#ffffff" />

                <directionalLight
                    position={[12, 15, 8]}
                    intensity={1.5}
                    color="#ffffff"
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-far={50}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />

                <directionalLight
                    position={[-10, 10, -8]}
                    intensity={0.7}
                    color="#b8d4ff"
                />

                <directionalLight
                    position={[-5, 8, -10]}
                    intensity={0.5}
                    color="#ffd9a8"
                />

                {/* Additional lighting for active layers */}
                {active === 'mechanical' && (
                    <>
                        <spotLight position={[-8, 10, 5]} angle={0.5} penumbra={0.5} intensity={1.0} castShadow />
                        <spotLight position={[5, 8, 8]} angle={0.4} penumbra={0.5} intensity={0.8} />
                    </>
                )}

                {active === 'software' && (
                    <>
                        <spotLight position={[10, 10, 5]} angle={0.5} penumbra={0.5} intensity={1.2} castShadow />
                        <spotLight position={[15, 8, 8]} angle={0.4} penumbra={0.5} intensity={1.0} />
                    </>
                )}

                <pointLight position={[-3, 5, 0]} intensity={0.5} color="#ffa040" />
                <pointLight position={[3, 4, -5]} intensity={0.4} color="#40a0ff" />

                <Environment preset="warehouse" background={false} environmentIntensity={0.8} />
                <hemisphereLight skyColor="#87ceeb" groundColor="#2a2a2a" intensity={0.4} />

                {/* ================= SCENE LAYERS ================= */}

                <group position={[0, 0, 0]}>
                    <MechanicalLayer active={active === 'mechanical'} />
                    {active === 'mechanical' && (
                        <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={15} blur={2} far={4} />
                    )}
                </group>

                <group position={[5, 0, 0]}>
                    <ArchitectureLayer active={active === 'architecture'} />
                    {active === 'architecture' && (
                        <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={15} blur={2} far={4} />
                    )}
                </group>

                <group position={[10, 0, 0]}>
                    <SoftwareLayer active={active === 'software'} />
                    {active === 'software' && (
                        <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={15} blur={2} far={4} />
                    )}
                </group>

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#0f1419" metalness={0.1} roughness={0.8} />
                </mesh>

                <CameraRig active={active} />
                <OrbitControls enableRotate={true} enableZoom={true} enablePan={true} enableDamping={true} dampingFactor={0.05} />
            </Canvas>

            <HeaderStatement />
            <NarrativePanel active={active} />
        </>
    );
}

export default SceneRoot;