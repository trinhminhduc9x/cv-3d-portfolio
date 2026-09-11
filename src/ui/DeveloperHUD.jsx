/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { playClickSound, playHoverSound } from '../audio/uiSoundSynth';
import { isEditableTarget } from '../core/narrativeController';

function DeveloperHUD({
    currentChapter,
    interactionMode,
    wireframeInspect,
    onToggleWireframeInspect,
    explodedView,
    onToggleExplodedView,
    onOpenCommandPalette,
}) {
    const [fps, setFps] = useState(60);

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let animId;

        const loop = (now) => {
            frameCount += 1;
            if (now - lastTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
            }
            animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animId);
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.code === 'Space' && !isEditableTarget(e.target)) {
                e.preventDefault();
                playClickSound();
                onToggleExplodedView?.();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onToggleExplodedView]);

    return (
        <aside
            className="developer-hud"
            aria-label="Developer Telemetry HUD"
            style={{
                position: 'fixed',
                top: 20,
                left: 30,
                zIndex: 15,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: 11,
                color: 'rgba(255, 179, 122, 0.85)',
                pointerEvents: 'auto',
            }}
        >
            {/* FPS & Telemetry Panel */}
            <div
                style={{
                    background: 'rgba(16, 12, 10, 0.82)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 179, 122, 0.25)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: fps >= 45 ? '#ff7a3c' : fps >= 30 ? '#ffd2a3' : '#ff4a4a',
                            boxShadow: `0 0 8px ${fps >= 45 ? '#ff7a3c' : '#ff4a4a'}`,
                        }}
                    />
                    <span>{fps} FPS</span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</div>
                <div style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    MODE: <span style={{ color: '#ffffff' }}>{interactionMode}</span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</div>
                <div style={{ textTransform: 'uppercase' }}>
                    CH: <span style={{ color: '#ffb37a' }}>{currentChapter?.label}</span>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="developer-hud-controls" style={{ display: 'flex', gap: 6 }}>
                <button
                    type="button"
                    onClick={() => {
                        playClickSound();
                        onToggleExplodedView?.();
                    }}
                    onMouseEnter={playHoverSound}
                    style={{
                        background: explodedView
                            ? 'rgba(255, 59, 31, 0.28)'
                            : 'rgba(16, 12, 10, 0.82)',
                        border: `1px solid ${
                            explodedView ? '#ff3b1f' : 'rgba(255, 179, 122, 0.25)'
                        }`,
                        borderRadius: 6,
                        color: explodedView ? '#ff3b1f' : '#ffffff',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {explodedView ? '💥 EXPLODED: ON' : '💥 EXPLODE (Space)'}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        playClickSound();
                        onToggleWireframeInspect?.();
                    }}
                    onMouseEnter={playHoverSound}
                    style={{
                        background: wireframeInspect
                            ? 'rgba(255, 122, 60, 0.25)'
                            : 'rgba(16, 12, 10, 0.82)',
                        border: `1px solid ${
                            wireframeInspect ? '#ff7a3c' : 'rgba(255, 179, 122, 0.25)'
                        }`,
                        borderRadius: 6,
                        color: wireframeInspect ? '#ff7a3c' : '#ffffff',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {wireframeInspect ? '❖ WIREFRAME: ON' : '❖ INSPECT 3D'}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        playClickSound();
                        onOpenCommandPalette?.();
                    }}
                    onMouseEnter={playHoverSound}
                    style={{
                        background: 'rgba(16, 12, 10, 0.82)',
                        border: '1px solid rgba(255, 179, 122, 0.25)',
                        borderRadius: 6,
                        color: 'rgba(255, 179, 122, 0.9)',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    ⌘ COMMAND (Ctrl+K)
                </button>
            </div>
        </aside>
    );
}

export default DeveloperHUD;
