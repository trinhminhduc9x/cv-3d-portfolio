/* eslint-disable react/prop-types, react/no-unknown-property */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';
import {
    ContactShadows, Environment, MeshReflectorMaterial, OrbitControls, useProgress,
} from '@react-three/drei';

// Hub & spokes world layout: the "origin" zone sits at the hub ([0,0,0]), the
// other two zones fan out ahead of it — both at radius 18, ±30° off the
// forward (-z) axis — so they are visible from the hub instead of hidden
// behind a single linear corridor. Positions are the single source of truth
// in `museumLayout.config.js` (also used by `FreeRoamController` for
// collision/proximity) — kept as local consts here just to avoid touching
// every JSX usage site below.
const ARCHITECTURE_ZONE_POSITION = MUSEUM_ZONES.architecture.position;
const SOFTWARE_ZONE_POSITION = MUSEUM_ZONES.software.position;

// Per-zone environment lighting mood (background=false, so this only affects
// IBL/reflections, not a visible skybox — swapping presets when the chapter
// changes reads as a lighting shift, not a jarring background pop).
const SCENE_ENVIRONMENT_PRESET = {
    mechanical: 'warehouse',
    architecture: 'dawn',
    software: 'night',
};

// Transformation/Mastery/Vision share the software zone and model — this
// tunes decorative-effect "energy" per chapter instead (energetic build-up
// -> steady discipline -> calm, settled vision) so the shared zone still
// reads as three distinct moments without needing separate 3D assets.
const CHAPTER_ENERGY = {
    transformation: 1.4,
    mastery: 1.0,
    vision: 0.6,
};

import EffectsPipeline from '../effects/EffectsPipeline';
import { useCameraDirector } from '../life-engine/CameraDirector';
import { useChapterManager } from '../life-engine/ChapterManager';
import { useInteractionModeManager } from '../life-engine/InteractionModeManager';
import { useTransitionOrchestrator } from '../life-engine/TransitionOrchestrator';
import FreeRoamController, { computeYawToTarget } from '../life-engine/FreeRoamController';
import { NotificationProvider, NotificationTray, useNotifications } from '../life-engine/NotificationCenter';
import { LIFE_CHAPTERS } from '../data/narrative.config';
import { MUSEUM_ZONES } from '../data/museumLayout.config';
import { getMuseumPlaque } from '../data/museumPlaques.config';
import { isEditableTarget } from '../core/narrativeController';
import { initializeShaderChunks } from '../core/webglSupport';
import { supportsFreeRoam } from '../core/pointerCapability';
import {
    hasSeenIntro, markIntroSeen, hasVisitedZone, markZoneVisited,
    hasSeenMuseumComplete, markMuseumComplete,
} from '../core/visitProgress';

import HeaderStatement from '../ui/HeaderStatement';
import TimelineIndicator from '../ui/TimelineIndicator';
import ScrollHint from '../ui/ScrollHint';
import LoadingScreen from '../ui/LoadingScreen';
import TextRevealSystem from '../ui/TextRevealSystem';
import MuseumPlaque from '../ui/MuseumPlaque';
import MuseumWelcome from '../ui/MuseumWelcome';
import MuseumExitPrompt from '../ui/MuseumExitPrompt';
import IntroBriefing from '../ui/IntroBriefing';
import FadeOverlay from '../ui/FadeOverlay';
import EarnedCodeChest from '../ui/EarnedCodeChest';
import MusicToggle from '../ui/MusicToggle';
import DeveloperHUD from '../ui/DeveloperHUD';
import CommandPalette from '../ui/CommandPalette';
import { playTransitionSound } from '../audio/uiSoundSynth';

import MechanicalLayer from './layers/MechanicalLayer';
import ArchitectureLayer from './layers/ArchitectureLayer';
import SoftwareLayer from './layers/SoftwareLayer';
import ParticleField from './ParticleField';
import FloatingSkillBadges from './modules/FloatingSkillBadges';
import MatrixStreamField from './modules/MatrixStreamField';
import MuseumShell from './MuseumShell';
import LazyLayerMount from './performance/LazyLayerMount';
import { usePerformanceProfile } from './performance/usePerformanceProfile';
import { useStrategicModelPreload } from './models/useStrategicModelPreload';
import { getAllModelIds, preloadModels } from './models/modelRegistry';

initializeShaderChunks();

function LifeEngineFrame({ orchestrator }) {
    useFrame((_, delta) => {
        orchestrator.update(delta);
    });

    return null;
}

function LifeCameraRig({ chapter, controlsRef, locked, active }) {
    useCameraDirector({
        preset: chapter.cameraPreset,
        controlsRef,
        locked,
        active,
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
            position={[0, -0.57, -6]}
        />
    );
}

function TransformationNodes({ opacity = 0, lineProgress = 0 }) {
    const lineRef = useRef(null);
    const materialRef = useRef(null);

    // Translated to fan out around SOFTWARE_ZONE_POSITION ([9,0,-15.588]) —
    // same relative shape as the original layout centered on the old [10,0,0].
    const nodes = useMemo(() => ([
        [7.8, 1.15, -16.988],
        [9, 1.85, -16.288],
        [10.15, 1.1, -16.838],
        [8.4, 0.7, -14.688],
        [9.8, 0.85, -14.788],
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

function LifeModeControls({ interaction, canFreeRoam, onOpenMuseumWelcome }) {
    return (
        <div
            className="life-mode-controls"
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
                    border: '1px solid rgba(255, 179, 122, 0.28)',
                    background: interaction.mode === 'guided' ? '#a8531f' : 'rgba(20, 15, 12, 0.82)',
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
                    border: '1px solid rgba(255, 179, 122, 0.28)',
                    background: interaction.mode === 'explore' ? '#a8531f' : 'rgba(20, 15, 12, 0.82)',
                    color: '#ffffff',
                    cursor: 'pointer',
                }}
            >
                Explore
            </button>
            {canFreeRoam && (
                <button
                    type="button"
                    onClick={interaction.mode === 'freeroam' ? undefined : onOpenMuseumWelcome}
                    aria-label="Switch to museum free-roam mode"
                    style={{
                        padding: '9px 12px',
                        borderRadius: 6,
                        border: '1px solid rgba(255, 179, 122, 0.28)',
                        background: interaction.mode === 'freeroam' ? '#a8531f' : 'rgba(20, 15, 12, 0.82)',
                        color: '#ffffff',
                        cursor: 'pointer',
                    }}
                >
                    Museum
                </button>
            )}
        </div>
    );
}

function SceneRootContent() {
    const controlsRef = useRef(null);
    const freeRoamRef = useRef(null);
    const navigationLocked = useRef(false);
    const unlockTimer = useRef(null);
    const [lang, setLang] = useState('vi');
    const [wireframeInspect, setWireframeInspect] = useState(false);
    const [explodedView, setExplodedView] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [pointerLocked, setPointerLocked] = useState(false);
    const [canFreeRoam] = useState(() => supportsFreeRoam());
    const [activeZoneId, setActiveZoneId] = useState(null);
    const [museumWelcomeOpen, setMuseumWelcomeOpen] = useState(false);
    const [visitedZoneIds, setVisitedZoneIds] = useState(() => new Set());
    const [showIntro, setShowIntro] = useState(false);

    const { notify } = useNotifications();
    const { active: loadingActive, progress: loadingProgress, total: loadingTotal } = useProgress();
    const assetsLoaded = !loadingActive && (loadingProgress >= 100 || loadingTotal === 0);

    useEffect(() => {
        if (assetsLoaded && !hasSeenIntro()) {
            setShowIntro(true);
        }
    }, [assetsLoaded]);

    const toggleLang = useCallback(() => {
        setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
        notify({
            priority: 'normal',
            message: { vi: 'Đã chuyển sang Tiếng Việt', en: 'Switched to English' },
        });
    }, [notify]);

    const performanceProfile = usePerformanceProfile();
    const chapterManager = useChapterManager(LIFE_CHAPTERS);
    const interaction = useInteractionModeManager(controlsRef);
    const { chapters, currentChapter, currentIndex, setChapter } = chapterManager;

    const dismissIntro = useCallback(() => {
        markIntroSeen();
        setShowIntro(false);
    }, []);

    const handleSelectGuided = useCallback(() => {
        dismissIntro();
        interaction.guidedMode();
    }, [dismissIntro, interaction]);

    const handleSelectMuseum = useCallback(() => {
        dismissIntro();
        interaction.freeroamMode();
    }, [dismissIntro, interaction]);

    const { visualState, setVisualState, orchestrator } = useTransitionOrchestrator();

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

        // Clicking a waypoint while free-roaming should teleport the camera
        // there and then hand control back to the visitor, rather than
        // permanently dropping them into the guided tour.
        const wasExploring = interaction.mode === 'explore';
        const wasFreeroam = interaction.mode === 'freeroam';

        playTransitionSound();

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
            if (wasExploring) {
                interaction.exploreMode();
            }
            if (wasFreeroam) {
                interaction.freeroamMode();
                const yaw = computeYawToTarget(
                    nextChapter.cameraPreset.position,
                    nextChapter.cameraPreset.target,
                );
                freeRoamRef.current?.syncPosition(nextChapter.cameraPreset.position, yaw);
            }
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
    useStrategicModelPreload({
        chapters,
        currentIndex,
        preloadRemaining: !performanceProfile.lowEnd,
    });

    const freeroamActive = interaction.mode === 'freeroam';

    useEffect(() => {
        if (freeroamActive) {
            // A visitor can walk to any of the three zones immediately once
            // free-roaming — get every model resident rather than relying on
            // the current/next-chapter preload heuristic above.
            preloadModels(getAllModelIds());
        }
    }, [freeroamActive]);

    useEffect(() => {
        if (visitedZoneIds.size >= Object.keys(MUSEUM_ZONES).length && !hasSeenMuseumComplete()) {
            markMuseumComplete();
            notify({
                priority: 'critical',
                message: {
                    vi: '🎉 Đã khám phá toàn bộ bảo tàng!',
                    en: "🎉 You've explored the whole museum!",
                },
            });
        }
    }, [visitedZoneIds, notify]);

    const mechanicalVisible = visualState.mechanicalOpacity > 0.02;
    const architectureVisible = visualState.architectureOpacity > 0.02;
    const softwareVisible = visualState.softwareOpacity > 0.02;
    const warmIntensity = Math.max(
        currentChapter.lightingMood?.warmLightIntensity ?? 0,
        visualState.warmLightIntensity ?? 0,
    );
    const environmentPreset = SCENE_ENVIRONMENT_PRESET[currentChapter.scene] || 'warehouse';
    const chapterEnergy = CHAPTER_ENERGY[currentChapter.id] ?? 1;

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

                <Environment preset={environmentPreset} background={false} environmentIntensity={0.72} />

                <group position={[0, 0, 0]}>
                    <LazyLayerMount active={mechanicalVisible || freeroamActive} unloadDelay={performanceProfile.lazyUnloadDelay}>
                        <MechanicalLayer
                            active={mechanicalVisible}
                            opacity={visualState.mechanicalOpacity}
                            wireframe={wireframeInspect || visualState.mechanicalWireframe > 0.5}
                            exploded={explodedView}
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

                <group position={ARCHITECTURE_ZONE_POSITION}>
                    <LazyLayerMount active={architectureVisible || freeroamActive} unloadDelay={performanceProfile.lazyUnloadDelay}>
                        <ArchitectureLayer
                            active={architectureVisible}
                            opacity={visualState.architectureOpacity}
                            wireframe={wireframeInspect}
                            exploded={explodedView}
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

                <group position={SOFTWARE_ZONE_POSITION}>
                    <LazyLayerMount active={softwareVisible || freeroamActive} unloadDelay={performanceProfile.lazyUnloadDelay}>
                        <SoftwareLayer
                            active={softwareVisible}
                            opacity={visualState.softwareOpacity}
                            wireframe={wireframeInspect || visualState.softwareWireframe > 0.5}
                            exploded={explodedView}
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

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, -6]} receiveShadow>
                    <planeGeometry args={[120, 120]} />
                    {performanceProfile.lowEnd ? (
                        <meshStandardMaterial color="#080c10" metalness={0.1} roughness={0.86} />
                    ) : (
                        <MeshReflectorMaterial
                            blur={[300, 100]}
                            resolution={512}
                            mirror={0.35}
                            mixBlur={0.85}
                            mixStrength={1.2}
                            roughness={0.7}
                            depthScale={1.0}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#070a0e"
                            metalness={0.4}
                        />
                    )}
                </mesh>

                <FloatingSkillBadges
                    visible={softwareVisible}
                    opacity={visualState.softwareOpacity}
                    position={SOFTWARE_ZONE_POSITION}
                    energy={chapterEnergy}
                />
                <MatrixStreamField
                    visible={softwareVisible}
                    opacity={visualState.softwareOpacity}
                    origin={SOFTWARE_ZONE_POSITION}
                    energy={chapterEnergy}
                />
                <CinematicGrid opacity={visualState.gridOpacity} />
                <CinematicGrid opacity={visualState.infiniteGridOpacity} infinite />
                <TransformationNodes opacity={visualState.nodeOpacity} lineProgress={visualState.lineProgress} />
                <ParticleField transitioning={visualState.active} />
                <LifeEngineFrame orchestrator={orchestrator} />
                <LifeCameraRig
                    chapter={currentChapter}
                    controlsRef={controlsRef}
                    locked={interaction.mode !== 'explore'}
                    active={!freeroamActive}
                />
                <FreeRoamController
                    ref={freeRoamRef}
                    active={freeroamActive}
                    onZoneChange={(zoneId) => {
                        setActiveZoneId(zoneId);
                        if (zoneId) {
                            setVisitedZoneIds((prev) => (prev.has(zoneId) ? prev : new Set(prev).add(zoneId)));
                            if (!hasVisitedZone(zoneId)) {
                                markZoneVisited(zoneId);
                                const plaque = getMuseumPlaque(zoneId);
                                if (plaque) {
                                    notify({
                                        priority: 'normal',
                                        message: {
                                            vi: `🏛️ Hiện vật mới: ${plaque.title.vi}`,
                                            en: `🏛️ New exhibit: ${plaque.title.en}`,
                                        },
                                    });
                                }
                            }
                        }
                        const chapterId = zoneId ? MUSEUM_ZONES[zoneId]?.primaryChapterId : null;
                        if (chapterId) {
                            setChapter(chapterId);
                        }
                    }}
                    onLockChange={setPointerLocked}
                />
                {freeroamActive && <MuseumShell />}
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

            <DeveloperHUD
                currentChapter={currentChapter}
                interactionMode={interaction.mode}
                wireframeInspect={wireframeInspect}
                onToggleWireframeInspect={() => setWireframeInspect((prev) => !prev)}
                explodedView={explodedView}
                onToggleExplodedView={() => setExplodedView((prev) => !prev)}
                onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            />
            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={setCommandPaletteOpen}
                onNavigateChapter={navigateToIndex}
                onToggleLang={toggleLang}
                onToggleWireframeInspect={() => setWireframeInspect((prev) => !prev)}
                explodedView={explodedView}
                onToggleExplodedView={() => setExplodedView((prev) => !prev)}
                lang={lang}
                wireframeInspect={wireframeInspect}
            />

            <HeaderStatement lang={lang} onToggleLang={toggleLang} />
            <EarnedCodeChest chapter={currentChapter} transitioning={visualState.active} />
            {(() => {
                const plaqueZoneId = freeroamActive ? activeZoneId : null;
                return plaqueZoneId ? (
                    <MuseumPlaque zoneId={plaqueZoneId} lang={lang} />
                ) : (
                    <TextRevealSystem chapter={currentChapter} transitioning={visualState.active} lang={lang} />
                );
            })()}
            <TimelineIndicator index={currentIndex} onNavigate={navigateToIndex} items={timelineItems} />
            <LifeModeControls
                interaction={interaction}
                canFreeRoam={canFreeRoam}
                onOpenMuseumWelcome={() => setMuseumWelcomeOpen(true)}
            />
            <MuseumExitPrompt
                visible={freeroamActive && visitedZoneIds.size >= Object.keys(MUSEUM_ZONES).length}
                lang={lang}
            />
            {museumWelcomeOpen && (
                <MuseumWelcome
                    lang={lang}
                    onEnter={() => {
                        setMuseumWelcomeOpen(false);
                        interaction.freeroamMode();
                    }}
                    onCancel={() => setMuseumWelcomeOpen(false)}
                />
            )}
            {freeroamActive && !pointerLocked && (
                <div
                    id="museum-lock-prompt"
                    role="button"
                    tabIndex={0}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(5, 7, 10, 0.55)',
                        color: '#ffffff',
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                    }}
                >
                    Click to look around · WASD to walk
                </div>
            )}
            <MusicToggle />
            <FadeOverlay opacity={visualState.fadeOverlay} />
            <ScrollHint />
            <LoadingScreen />
            <NotificationTray lang={lang} />
            {showIntro && (
                <IntroBriefing
                    lang={lang}
                    canFreeRoam={canFreeRoam}
                    onSelectGuided={handleSelectGuided}
                    onSelectMuseum={handleSelectMuseum}
                />
            )}
        </>
    );
}

function SceneRoot() {
    return (
        <NotificationProvider>
            <SceneRootContent />
        </NotificationProvider>
    );
}

export default SceneRoot;
