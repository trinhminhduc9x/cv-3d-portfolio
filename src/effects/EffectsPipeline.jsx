/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const MOOD_PRESETS = {
    origin: {
        background: '#0c1620',
        fogColor: '#0c1620',
        bloomIntensity: 0.12,
        fogDensity: 0.03,
        toneMappingExposure: 0.88,
        vignetteDarkness: 0.55,
    },
    awakening: {
        background: '#15110c',
        fogColor: '#17130d',
        bloomIntensity: 0.25,
        fogDensity: 0.018,
        toneMappingExposure: 0.98,
        vignetteDarkness: 0.48,
    },
    transformation: {
        background: '#080a10',
        fogColor: '#080a10',
        bloomIntensity: 1.05,
        fogDensity: 0.02,
        toneMappingExposure: 0.92,
        vignetteDarkness: 0.62,
    },
    vision: {
        background: '#05070a',
        fogColor: '#05070a',
        bloomIntensity: 0.12,
        fogDensity: 0.002,
        toneMappingExposure: 0.86,
        vignetteDarkness: 0.42,
    },
};

function resolveMood(mood) {
    if (typeof mood === 'string') {
        return MOOD_PRESETS[mood] || MOOD_PRESETS.origin;
    }

    if (!mood) {
        return MOOD_PRESETS.origin;
    }

    const presetName = mood.preset || mood.id || mood.name || 'origin';
    const preset = MOOD_PRESETS[presetName] || MOOD_PRESETS.origin;

    return {
        ...preset,
        ...mood,
        toneMappingExposure: mood.toneMappingExposure ?? mood.exposure ?? preset.toneMappingExposure,
    };
}

/**
 * R3F postprocessing pipeline for cinematic chapter moods.
 * Drives fog density per-frame from visualState for smooth transitions.
 *
 * @param {object} props Component props.
 * @param {string | object} props.mood Mood preset name or chapter mood override.
 * @param {object} [props.visualState] Live transition state from TransitionOrchestrator.
 * @returns {JSX.Element} Postprocessing composer.
 */
function EffectsPipeline({ mood = 'origin', visualState = null }) {
    const scene = useThree((state) => state.scene);
    const gl = useThree((state) => state.gl);
    const fogRef = useRef(null);
    const visualStateRef = useRef(visualState);

    useEffect(() => {
        visualStateRef.current = visualState;
    }, [visualState]);

    const resolvedMood = useMemo(() => resolveMood(mood), [mood]);

    // Scene background and tone mapping — only when mood changes
    useEffect(() => {
        const previousBackground = scene.background;
        const previousToneMapping = gl.toneMapping;
        const previousExposure = gl.toneMappingExposure;

        scene.background = new THREE.Color(resolvedMood.background);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = resolvedMood.toneMappingExposure;

        return () => {
            scene.background = previousBackground;
            gl.toneMapping = previousToneMapping;
            gl.toneMappingExposure = previousExposure;
        };
    }, [resolvedMood.background, resolvedMood.toneMappingExposure, gl, scene]);

    // Fog object — recreated only when COLOR changes, never on density changes.
    // Density is driven exclusively by useFrame to avoid jumps when chapters switch.
    useEffect(() => {
        const initialDensity = visualStateRef.current?.fogDensity ?? resolvedMood.fogDensity;
        const fog = new THREE.FogExp2(resolvedMood.fogColor, initialDensity);
        scene.fog = fog;
        fogRef.current = fog;

        return () => {
            if (scene.fog === fog) {
                scene.fog = null;
            }
        };
    }, [resolvedMood.fogColor, scene]); // intentionally excludes fogDensity — useFrame owns density

    // Per-frame fog density: smooth animated transitions, no chapter-change jumps
    useFrame(() => {
        const fog = fogRef.current;

        if (!fog) {
            return;
        }

        const vs = visualStateRef.current;
        fog.density = vs?.fogDensity ?? resolvedMood.fogDensity;

        if (vs?.fogColor) {
            fog.color.set(vs.fogColor);
        }
    });

    // Bloom intensity driven by live visual state during transitions
    const bloomIntensity = visualState?.bloomIntensity ?? resolvedMood.bloomIntensity;

    return (
        <EffectComposer multisampling={0} disableNormalPass>
            <Bloom
                intensity={bloomIntensity}
                luminanceThreshold={0.82}
                luminanceSmoothing={0.22}
                mipmapBlur
            />
            <Vignette offset={0.22} darkness={resolvedMood.vignetteDarkness} />
        </EffectComposer>
    );
}

export default EffectsPipeline;
