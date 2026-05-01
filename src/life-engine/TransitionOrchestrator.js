import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { AnimationTimelineSystem, EASING, cubicInOut } from './AnimationTimelineSystem';

const DEFAULT_VISUAL_STATE = {
    active: false,
    progress: 1,
    eased: 1,
    opacity: 1,
    dissolveOpacity: 1,
    wireframeEnabled: false,
    scale: 1,
    gridOpacity: 0.18,
    infiniteGridOpacity: 0,
    mechanicalOpacity: 0,
    mechanicalWireframe: 0,
    architectureOpacity: 0,
    architectureScale: 1,
    softwareOpacity: 0,
    softwareWireframe: 0,
    nodeOpacity: 0,
    lineProgress: 0,
    warmLightIntensity: 0,
    bloomIntensity: 0.25,
    desaturate: 0,
    neonRimIntensity: 0,
    fadeOverlay: 0,
    fogDensity: 0.03,
    fogColor: null,
    fromChapter: null,
    toChapter: null,
};

function resolveTransitionProfile(fromChapter, toChapter) {
    return (
        fromChapter?.transitionProfile?.[toChapter?.id]
        || fromChapter?.transitions?.[toChapter?.id]
        || toChapter?.transitionProfile?.default
        || toChapter?.transition
        || {}
    );
}

function resolveEasing(easing) {
    if (typeof easing === 'function') {
        return easing;
    }

    return EASING[easing] || cubicInOut;
}

function readFogDensity(chapter, fallback = 0.03) {
    return chapter?.lightingMood?.fogDensity
        ?? chapter?.fogDensity
        ?? chapter?.fog?.density
        ?? fallback;
}

function readFogColor(chapter) {
    return chapter?.lightingMood?.fogColor
        ?? chapter?.lightingMood?.background
        ?? chapter?.fog?.color
        ?? null;
}

function readScale(profile, key, fallback) {
    const value = profile?.scale?.[key] ?? profile?.scaleMorph?.[key];

    if (Array.isArray(value)) {
        return value;
    }

    if (Number.isFinite(value)) {
        return value;
    }

    return fallback;
}

function lerpScale(fromScale, toScale, t) {
    if (Array.isArray(fromScale) || Array.isArray(toScale)) {
        const from = Array.isArray(fromScale) ? fromScale : [fromScale, fromScale, fromScale];
        const to = Array.isArray(toScale) ? toScale : [toScale, toScale, toScale];

        return [
            THREE.MathUtils.lerp(from[0] ?? 1, to[0] ?? 1, t),
            THREE.MathUtils.lerp(from[1] ?? from[0] ?? 1, to[1] ?? to[0] ?? 1, t),
            THREE.MathUtils.lerp(from[2] ?? from[0] ?? 1, to[2] ?? to[0] ?? 1, t),
        ];
    }

    return THREE.MathUtils.lerp(fromScale, toScale, t);
}

/**
 * Interpolates a named profile field when it has shape { from, to }.
 * Falls back to `fallback` when the field is absent or not a lerp descriptor.
 *
 * @param {object} profile Transition profile.
 * @param {string} key Field name.
 * @param {number} eased Eased progress 0–1.
 * @param {number} fallback Value used when the field is not a lerp descriptor.
 * @returns {number} Interpolated value.
 */
function lerpProfileField(profile, key, eased, fallback) {
    const field = profile?.[key];

    if (
        field !== null
        && typeof field === 'object'
        && typeof field.from === 'number'
        && typeof field.to === 'number'
    ) {
        return THREE.MathUtils.lerp(field.from, field.to, eased);
    }

    return fallback;
}

function readChapterBaseState(chapter) {
    const scene = chapter?.scene;

    return {
        mechanicalOpacity: scene === 'mechanical' ? 1 : 0,
        architectureOpacity: scene === 'architecture' ? 1 : 0,
        softwareOpacity: scene === 'software' ? 1 : 0,
        gridOpacity: chapter?.modules?.grid ? 0.32 : 0.12,
        infiniteGridOpacity: chapter?.modules?.infiniteGrid ? 0.55 : 0,
        nodeOpacity: chapter?.modules?.nodes ? 1 : 0,
        lineProgress: chapter?.modules?.nodes ? 1 : 0,
        mechanicalWireframe: 0,
        softwareWireframe: chapter?.modules?.wireframe ? 1 : 0,
        architectureScale: 1,
        bloomIntensity: chapter?.lightingMood?.bloomIntensity ?? 0.25,
        warmLightIntensity: chapter?.lightingMood?.warmLightIntensity ?? 0,
        neonRimIntensity: chapter?.lightingMood?.neonRimIntensity ?? 0,
        fogDensity: readFogDensity(chapter),
        fogColor: readFogColor(chapter),
    };
}

function buildTransitionState(fromChapter, toChapter, profile, progress, eased) {
    const fromBase = readChapterBaseState(fromChapter);
    const toBase = readChapterBaseState(toChapter);

    const fromFog = profile?.fog?.from ?? fromBase.fogDensity;
    const toFog = profile?.fog?.to ?? toBase.fogDensity;

    const hasDissolve = Boolean(profile?.dissolve);
    const dissolveFrom = profile?.dissolve?.from ?? 1;
    const dissolveTo = profile?.dissolve?.to ?? (hasDissolve ? 0 : 1);

    const scaleFrom = readScale(profile, 'from', 1);
    const scaleTo = readScale(profile, 'to', 1);

    // wireframe.layer targets a specific layer; wireframeAt/wireframe.at sets the trigger point
    const wireframeAt = profile?.wireframe?.at ?? profile?.wireframeAt ?? profile?.wireframe?.time ?? 0.5;
    const wireframeLayer = profile?.wireframe?.layer ?? null;
    const wireframeActive = progress >= wireframeAt
        && (wireframeLayer !== null || Number.isFinite(profile?.wireframeAt));
    const forceWireframe = profile?.wireframe?.enabled;
    const hasWireframeProfile = forceWireframe !== undefined
        || wireframeLayer !== null
        || Number.isFinite(profile?.wireframeAt);

    const wireframeEnabled = typeof forceWireframe === 'boolean'
        ? forceWireframe && wireframeActive
        : hasWireframeProfile && wireframeActive;

    // Layer wireframe: targeted layer toggles at wireframeAt; others auto-lerp from/to base
    const mechanicalWireframe = wireframeLayer === 'mechanical' && wireframeActive
        ? 1
        : THREE.MathUtils.lerp(fromBase.mechanicalWireframe, toBase.mechanicalWireframe, eased);

    const softwareWireframe = wireframeLayer === 'software' && wireframeActive
        ? 1
        : THREE.MathUtils.lerp(fromBase.softwareWireframe, toBase.softwareWireframe, eased);

    // Per-layer opacities: profile { from, to } overrides auto-lerp from/to base
    const mechanicalOpacity = lerpProfileField(
        profile, 'mechanicalOpacity', eased,
        THREE.MathUtils.lerp(fromBase.mechanicalOpacity, toBase.mechanicalOpacity, eased),
    );

    const architectureOpacity = lerpProfileField(
        profile, 'architectureOpacity', eased,
        THREE.MathUtils.lerp(fromBase.architectureOpacity, toBase.architectureOpacity, eased),
    );

    const softwareOpacity = lerpProfileField(
        profile, 'softwareOpacity', eased,
        THREE.MathUtils.lerp(fromBase.softwareOpacity, toBase.softwareOpacity, eased),
    );

    const architectureScale = lerpProfileField(
        profile, 'architectureScale', eased,
        THREE.MathUtils.lerp(fromBase.architectureScale, toBase.architectureScale, eased),
    );

    const warmLightIntensity = lerpProfileField(
        profile, 'warmLightIntensity', eased,
        THREE.MathUtils.lerp(fromBase.warmLightIntensity, toBase.warmLightIntensity, eased),
    );

    // nodeOpacity drives both the node spheres/lines and the line draw progress
    const nodeOpacity = lerpProfileField(
        profile, 'nodeOpacity', eased,
        THREE.MathUtils.lerp(fromBase.nodeOpacity, toBase.nodeOpacity, eased),
    );

    const lineProgress = lerpProfileField(
        profile, 'nodeOpacity', eased,
        THREE.MathUtils.lerp(fromBase.lineProgress, toBase.lineProgress, eased),
    );

    const bloomIntensity = lerpProfileField(
        profile, 'bloomIntensity', eased,
        THREE.MathUtils.lerp(fromBase.bloomIntensity, toBase.bloomIntensity, eased),
    );

    const neonRimIntensity = lerpProfileField(
        profile, 'neonRimIntensity', eased,
        THREE.MathUtils.lerp(fromBase.neonRimIntensity, toBase.neonRimIntensity, eased),
    );

    // desaturateArc peaks at the midpoint (sin wave); desaturate { from, to } lerps linearly
    const desaturate = profile?.desaturateArc
        ? Math.sin(progress * Math.PI) * profile.desaturateArc
        : lerpProfileField(profile, 'desaturate', eased, 0);

    return {
        ...DEFAULT_VISUAL_STATE,
        active: true,
        progress,
        eased,
        opacity: THREE.MathUtils.lerp(dissolveFrom, dissolveTo, eased),
        dissolveOpacity: THREE.MathUtils.lerp(dissolveFrom, dissolveTo, eased),
        wireframeEnabled,
        mechanicalWireframe,
        softwareWireframe,
        scale: lerpScale(scaleFrom, scaleTo, eased),
        fogDensity: THREE.MathUtils.lerp(fromFog, toFog, eased),
        fogColor: readFogColor(toChapter) || readFogColor(fromChapter),
        fadeOverlay: Math.sin(progress * Math.PI) * (profile?.fadeOpacity ?? 0.18),
        mechanicalOpacity,
        architectureOpacity,
        softwareOpacity,
        architectureScale,
        warmLightIntensity,
        nodeOpacity,
        lineProgress,
        bloomIntensity,
        neonRimIntensity,
        desaturate,
        gridOpacity: THREE.MathUtils.lerp(fromBase.gridOpacity, toBase.gridOpacity, eased),
        infiniteGridOpacity: THREE.MathUtils.lerp(
            fromBase.infiniteGridOpacity,
            toBase.infiniteGridOpacity,
            eased,
        ),
        fromChapter,
        toChapter,
    };
}

/**
 * Coordinates interrupt-safe chapter transitions through AnimationTimelineSystem.
 */
export class TransitionOrchestrator {
    /**
     * @param {object} options Orchestrator options.
     * @param {(state:object)=>void} options.onUpdate Per-frame transition callback.
     * @param {(payload:object)=>void} options.onComplete Completion callback.
     * @param {(payload:object)=>void} options.onKeyframe Keyframe callback.
     * @param {(fog:object)=>void} options.onFogChange Fog hook callback.
     */
    constructor({
        onUpdate = () => {},
        onComplete = () => {},
        onKeyframe = () => {},
        onFogChange = () => {},
    } = {}) {
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;
        this.onKeyframe = onKeyframe;
        this.onFogChange = onFogChange;
        this.timeline = null;
        this.activeTransition = null;
        this.transitionToken = 0;
        this.isTransitioning = false;
    }

    /**
     * Plays an interrupt-safe transition between chapters.
     * Each call increments transitionToken, invalidating any in-flight callbacks.
     *
     * @param {object} fromChapter Source chapter.
     * @param {object} toChapter Target chapter.
     * @returns {object} Transition metadata.
     */
    playTransition(fromChapter, toChapter) {
        this.stop();
        this.transitionToken += 1;

        const token = this.transitionToken;
        const profile = resolveTransitionProfile(fromChapter, toChapter);
        const duration = Math.max(profile.duration ?? 1.8, 0.0001);
        const easing = resolveEasing(profile.easing);

        this.isTransitioning = true;
        this.activeTransition = {
            fromChapter,
            toChapter,
            duration,
            profile,
            token,
        };

        this.timeline = new AnimationTimelineSystem(duration, {
            easing,
            onUpdate: ({ progress, eased }) => {
                if (token !== this.transitionToken) {
                    return;
                }

                const state = buildTransitionState(fromChapter, toChapter, profile, progress, eased);
                this.onUpdate(state);
                this.onFogChange({
                    density: state.fogDensity,
                    color: state.fogColor,
                    progress,
                    eased,
                    fromChapter,
                    toChapter,
                });
            },
            onComplete: ({ progress, eased }) => {
                if (token !== this.transitionToken) {
                    return;
                }

                const state = {
                    ...buildTransitionState(fromChapter, toChapter, profile, progress, eased),
                    active: false,
                    progress: 1,
                    eased: 1,
                };

                this.isTransitioning = false;
                this.activeTransition = null;
                this.onUpdate(state);
                this.onComplete({ fromChapter, toChapter, state });
            },
        });

        const wireframeAt = profile?.wireframe?.at
            ?? profile?.wireframeAt
            ?? profile?.wireframe?.time
            ?? 0.5;

        this.timeline.registerKeyframe(0, (state) => {
            if (token === this.transitionToken) {
                this.onKeyframe({ type: 'start', fromChapter, toChapter, state });
            }
        });
        this.timeline.registerKeyframe(wireframeAt, (state) => {
            if (token === this.transitionToken) {
                this.onKeyframe({ type: 'wireframe', enabled: true, fromChapter, toChapter, state });
            }
        });
        this.timeline.registerKeyframe(1, (state) => {
            if (token === this.transitionToken) {
                this.onKeyframe({ type: 'complete', fromChapter, toChapter, state });
            }
        });

        this.timeline.play();
        return this.activeTransition;
    }

    /**
     * Advances the active transition timeline.
     *
     * @param {number} delta Frame delta in seconds.
     * @returns {object | null} Timeline state.
     */
    update(delta) {
        if (!this.timeline || !this.isTransitioning) {
            return null;
        }

        return this.timeline.update(delta);
    }

    /**
     * Stops the active transition and invalidates pending callbacks.
     */
    stop() {
        if (this.timeline) {
            this.timeline.stop();
        }

        this.transitionToken += 1;
        this.timeline = null;
        this.activeTransition = null;
        this.isTransitioning = false;
    }

    /**
     * Releases all internal transition references.
     */
    dispose() {
        this.stop();
        this.onUpdate = () => {};
        this.onComplete = () => {};
        this.onKeyframe = () => {};
        this.onFogChange = () => {};
    }

    /**
     * Returns a static visual state for a chapter with all fields resolved.
     *
     * @param {object} chapter Chapter config.
     * @returns {object} Visual state.
     */
    getChapterState(chapter) {
        return {
            ...DEFAULT_VISUAL_STATE,
            ...readChapterBaseState(chapter),
            active: false,
            progress: 1,
            eased: 1,
            toChapter: chapter,
        };
    }
}

/**
 * Creates a TransitionOrchestrator instance.
 *
 * @param {object} options Orchestrator options.
 * @returns {TransitionOrchestrator} Transition orchestrator.
 */
export function createTransitionOrchestrator(options = {}) {
    return new TransitionOrchestrator(options);
}

/**
 * React wrapper for TransitionOrchestrator without DOM or UI dependencies.
 *
 * @param {Function} onComplete Completion callback.
 * @returns {object} Transition state and orchestrator.
 */
export function useTransitionOrchestrator(onComplete = () => {}) {
    const [visualState, setVisualState] = useState(DEFAULT_VISUAL_STATE);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const orchestrator = useMemo(
        () => new TransitionOrchestrator({
            onUpdate: setVisualState,
            onComplete: (payload) => onCompleteRef.current(payload),
        }),
        [],
    );

    useEffect(() => () => orchestrator.dispose(), [orchestrator]);

    return {
        visualState,
        setVisualState,
        orchestrator,
    };
}

export default TransitionOrchestrator;
