/* eslint-disable react/prop-types, react/no-unknown-property */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';

import EffectsPipeline from '../effects/EffectsPipeline';
import { useCameraDirector } from '../life-engine/CameraDirector';
import { useChapterManager } from '../life-engine/ChapterManager';
import { useInteractionModeManager } from '../life-engine/InteractionModeManager';
import { useTransitionOrchestrator } from '../life-engine/TransitionOrchestrator';
import { LIFE_CHAPTERS, CHAPTER_SEQUENCE } from '../data/narrative.config';
import { isEditableTarget } from '../core/narrativeController';
import { initializeShaderChunks } from '../core/webglSupport';

import HeaderStatement from '../ui/HeaderStatement';
import TimelineIndicator from '../ui/TimelineIndicator';
import ScrollHint from '../ui/ScrollHint';
import LoadingScreen from '../ui/LoadingScreen';
import TextRevealSystem from '../ui/TextRevealSystem';
import FadeOverlay from '../ui/FadeOverlay';

import MechanicalLayer from './MechanicalLayer';
import ArchitectureLayer from './ArchitectureLayer';
import SoftwareLayer from './SoftwareLayer';
import ParticleField from './ParticleField';
import LazyLayerMount from './performance/LazyLayerMount';
import { usePerformanceProfile } from './performance/usePerformanceProfile';

const FINAL_CHAPTER_ID = CHAPTER_SEQUENCE[CHAPTER_SEQUENCE.length - 1];

initializeShaderChunks();

function LifeEngineFrame({ orchestrator }) {
    useFrame((_, delta) => {
        orchestrator.update(delta);
    });

    return null;
}

function LifeCameraRig({ chapter, controlsRef, locked }) {
    useCameraDirector({
        preset: chapter.cameraPreset,
        controlsRef,
        locked,
    });

    return null;
}

function CinematicGrid({ opacity = 0, infinite = false }) {
    const ref = useRef(null);

    useFrame(() => {
        if (!ref.current) {
            return;
        }

        const materials = Array.isArray(ref.current.material)
            ? ref.current.material
            : [ref.current.material];

        materials.forEach((material) => {
            material.transparent = true;
            material.opacity = opacity;
            material.depthWrite = false;
            material.needsUpdate = true;
        });
    });

    if (opacity <= 0.01) {
        return null;
    }

    return (
        <gridHelper
            ref={ref}
            args={[
                infinite ? 120 : 30,
                infinite ? 120 : 30,
                infinite ? '#294a66' : '#2f6f91',
                infinite ? '#102232' : '#15384b',
            ]}
            position={[5, -0.57, 0]}
        />
    );
}

function TransformationNodes({ opacity = 0, lineProgress = 0 }) {
    const lineRef = useRef(null);
    const materialRef = useRef(null);

    const nodes = useMemo(() => ([
        [8.8, 1.15, -1.4],
        [10, 1.85, -0.7],
        [11.15, 1.1, -1.25],
        [9.4, 0.7, 0.9],
        [10.8, 0.85, 0.8],
    ]), []);

    const linePositions = useMemo(() => {
        const pairs = [
            [nodes[0], nodes[1]],
            [nodes[1], nodes[2]],
            [nodes[1], nodes[3]],
            [nodes[3], nodes[4]],
            [nodes[4], nodes[2]],
        ];

        return new Float32Array(pairs.flat(2));
    }, [nodes]);

    useEffect(() => {
        lineRef.current?.computeLineDistances?.();
    }, [linePositions]);

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.opacity = opacity;
            materialRef.current.dashOffset = -lineProgress * 2.5;
            materialRef.current.needsUpdate = true;
        }
    });

    if (opacity <= 0.01) {
        return null;
    }

    return (
        <group>
            {nodes.map((position) => (
                <mesh key={position.join(':')} position={position}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshBasicMaterial color="#87ceeb" transparent opacity={opacity} depthWrite={false} />
                </mesh>
            ))}
            <lineSegments ref={lineRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={linePositions}
                        count={linePositions.length / 3}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineDashedMaterial
                    ref={materialRef}
                    color="#87ceeb"
                    dashSize={0.16}
                    gapSize={0.1}
                    transparent
                    opacity={opacity}
                    depthWrite={false}
                />
            </lineSegments>
        </group>
    );
}

function LifeModeControls({ interaction, exploreUnlocked }) {
    if (!exploreUnlocked) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                right: 30,
                bottom: 30,
                zIndex: 15,
                display: 'flex',
                gap: 8,
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <button
                type="button"
                onClick={interaction.guidedMode}
                aria-label="Switch to guided camera mode"
                style={{
                    padding: '9px 12px',
                    borderRadius: 6,
                    border: '1px solid rgba(135, 206, 235, 0.28)',
                    background: interaction.mode === 'guided' ? '#2f6f91' : 'rgba(15, 20, 25, 0.82)',
                    color: '#ffffff',
                    cursor: 'pointer',
                }}
            >
                Guided
            </button>
            <button
                type="button"
                onClick={interaction.exploreMode}
                aria-label="Switch to explore camera mode"
                style={{
                    padding: '9px 12px',
                    borderRadius: 6,
                    border: '1px solid rgba(135, 206, 235, 0.28)',
                    background: interaction.mode === 'explore' ? '#2f6f91' : 'rgba(15, 20, 25, 0.82)',
                    color: '#ffffff',
                    cursor: 'pointer',
                }}
            >
                Explore
            </button>
        </div>
    );
}

function SceneRoot() {
    const controlsRef = useRef(null);
    const navigationLocked = useRef(false);
    const unlockTimer = useRef(null);
    const [exploreUnlocked, setExploreUnlocked] = useState(false);

    const performanceProfile = usePerformanceProfile();
    const chapterManager = useChapterManager(LIFE_CHAPTERS);
    const interaction = useInteractionModeManager(controlsRef);
    const { chapters, currentChapter, currentIndex, setChapter } = chapterManager;

    const { visualState, setVisualState, orchestrator } = useTransitionOrchestrator(({ toChapter }) => {
        if (toChapter.id === FINAL_CHAPTER_ID) {
            setExploreUnlocked(true);
        }
    });

    const timelineItems = useMemo(
        () => chapters.map((chapter) => ({ id: chapter.id, label: chapter.label })),
        [chapters],
    );

    useEffect(() => {
        setVisualState(orchestrator.getChapterState(currentChapter));
    }, [currentChapter, orchestrator, setVisualState]);

    useEffect(() => () => {
        if (unlockTimer.current) {
            window.clearTimeout(unlockTimer.current);
        }
    }, []);

    const navigateToIndex = useCallback((nextIndex) => {
        if (navigationLocked.current || nextIndex === currentIndex) {
            return;
        }

        const nextChapter = chapters[nextIndex];
        if (!nextChapter) {
            return;
        }

        const fromChapter = currentChapter;
        const transition = orchestrator.playTransition(fromChapter, nextChapter);
        setChapter(nextChapter.id);
        interaction.guidedMode();

        navigationLocked.current = true;
        if (unlockTimer.current) {
            window.clearTimeout(unlockTimer.current);
        }

        const profile = fromChapter.transitionProfile?.[nextChapter.id]
            || nextChapter.transitionProfile?.default
            || { climaxPause: 700 };

        unlockTimer.current = window.setTimeout(() => {
            navigationLocked.current = false;
        }, (transition.duration * 1000) + (profile.climaxPause ?? 700));
    }, [chapters, currentChapter, currentIndex, interaction, orchestrator, setChapter]);

    useEffect(() => {
        const onWheel = (event) => {
            if (Math.abs(event.deltaY) < 12) {
                return;
            }

            navigateToIndex(Math.min(
                Math.max(currentIndex + (event.deltaY > 0 ? 1 : -1), 0),
                chapters.length - 1,
            ));
        };

        const onKeyDown = (event) => {
            if (isEditableTarget(event.target)) {
                return;
            }

            if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown') {
                event.preventDefault();
                navigateToIndex(Math.min(currentIndex + 1, chapters.length - 1));
            }

            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {
                event.preventDefault();
                navigateToIndex(Math.max(currentIndex - 1, 0));
            }
        };

        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [chapters.length, currentIndex, navigateToIndex]);

    const { shadowMapSize } = performanceProfile;
    const mechanicalVisible = visualState.mechanicalOpacity > 0.02;
    const architectureVisible = visualState.architectureOpacity > 0.02;
    const softwareVisible = visualState.softwareOpacity > 0.02;
    const warmIntensity = Math.max(
        currentChapter.lightingMood?.warmLightIntensity ?? 0,
        visualState.warmLightIntensity ?? 0,
    );

    return (
        <>
            <Canvas
                aria-label="Interactive cinematic 3D life narrative"
                role="img"
                camera={{ position: [0, 4, 18], fov: 54 }}
                style={{ width: '100vw', height: '100vh' }}
                dpr={[1, performanceProfile.maxDevicePixelRatio]}
                shadows
                gl={{
                    alpha: false,
                    outputColorSpace: THREE.LinearSRGBColorSpace,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 0.9,
                }}
            >
                <ambientLight intensity={0.45} color="#ffffff" />
                <directionalLight
                    position={[12, 15, 8]}
                    intensity={1.2}
                    color="#ffffff"
                    castShadow
                    shadow-mapSize-width={shadowMapSize}
                    shadow-mapSize-height={shadowMapSize}
                    shadow-camera-far={50}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
                <directionalLight position={[-10, 10, -8]} intensity={0.65} color="#b8d4ff" />
                <directionalLight position={[-5, 8, -10]} intensity={warmIntensity} color="#ffd2a3" />
                <pointLight position={[-3, 5, 0]} intensity={0.4} color="#ffa040" />
                <pointLight position={[11, 4, -3]} intensity={0.5 + visualState.bloomIntensity * 0.25} color="#40a0ff" />
                <pointLight position={[10, 2.5, 1.5]} intensity={visualState.neonRimIntensity * 3.0} color="#00cfff" distance={14} />
                <hemisphereLight skyColor="#87ceeb" groundColor="#1b1b1b" intensity={0.34} />

                <Environment preset="warehouse" background={false} environmentIntensity={0.72} />

                <group position={[0, 0, 0]}>
                    <LazyLayerMount active={mechanicalVisible} unloadDelay={performanceProfile.lazyUnloadDelay}>
                        <MechanicalLayer
                            active={mechanicalVisible}
                            opacity={visualState.mechanicalOpacity}
                            wireframe={visualState.mechanicalWireframe > 0.5}
                        />
                        {mechanicalVisible && (
                            <ContactShadows
                                position={[0, -0.5, 0]}
                                opacity={0.45 * visualState.mechanicalOpacity}
                                scale={performanceProfile.contactShadowScale}
                                blur={performanceProfile.contactShadowBlur}
                                far={4}
                            />
                        )}
                    </LazyLayerMount>
                </group>

                <group position={[5, 0, 0]}>
                    <LazyLayerMount active={architectureVisible} unloadDelay={performanceProfile.lazyUnloadDelay}>
                        <ArchitectureLayer
                            active={architectureVisible}
                            opacity={visualState.architectureOpacity}
                            wireframe={false}
                            scaleMultiplier={visualState.architectureScale}
                        />
                        {architectureVisible && (
                            <ContactShadows
                                position={[0, -0.5, 0]}
                                opacity={0.45 * visualState.architectureOpacity}
                                scale={performanceProfile.contactShadowScale}
                                blur={performanceProfile.contactShadowBlur}
                                far={4}
                            />
                        )}
                    </LazyLayerMount>
                </group>

                <group position={[10, 0, 0]}>
                    <LazyLayerMount active={softwareVisible} unloadDelay={performanceProfile.lazyUnloadDelay}>
                        <SoftwareLayer
                            active={softwareVisible}
                            opacity={visualState.softwareOpacity}
                            wireframe={visualState.softwareWireframe > 0.5}
                        />
                        {softwareVisible && (
                            <ContactShadows
                                position={[0, -0.5, 0]}
                                opacity={0.45 * visualState.softwareOpacity}
                                scale={performanceProfile.contactShadowScale}
                                blur={performanceProfile.contactShadowBlur}
                                far={4}
                            />
                        )}
                    </LazyLayerMount>
                </group>

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.6, 0]} receiveShadow>
                    <planeGeometry args={[120, 120]} />
                    <meshStandardMaterial color="#080c10" metalness={0.1} roughness={0.86} />
                </mesh>

                <CinematicGrid opacity={visualState.gridOpacity} />
                <CinematicGrid opacity={visualState.infiniteGridOpacity} infinite />
                <TransformationNodes opacity={visualState.nodeOpacity} lineProgress={visualState.lineProgress} />
                <ParticleField />
                <LifeEngineFrame orchestrator={orchestrator} />
                <LifeCameraRig
                    chapter={currentChapter}
                    controlsRef={controlsRef}
                    locked={interaction.mode !== 'explore'}
                />
                <EffectsPipeline mood={currentChapter.lightingMood} visualState={visualState} />
                <OrbitControls
                    ref={controlsRef}
                    enableRotate
                    enableZoom
                    enablePan
                    enableDamping
                    dampingFactor={0.05}
                    enabled={interaction.mode === 'explore'}
                />
            </Canvas>

            <HeaderStatement />
            <TextRevealSystem chapter={currentChapter} transitioning={visualState.active} />
            <TimelineIndicator index={currentIndex} onNavigate={navigateToIndex} items={timelineItems} />
            <LifeModeControls interaction={interaction} exploreUnlocked={exploreUnlocked} />
            <FadeOverlay opacity={visualState.fadeOverlay} />
            <ScrollHint />
            <LoadingScreen />
        </>
    );
}

export default SceneRoot;
