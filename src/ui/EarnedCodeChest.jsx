/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const GAME_URL = 'https://tmducdev-source.github.io/cyber-runner-3d-game/';

const KEYFRAMES = `
@keyframes earnedChestGlow {
    0%, 100% { box-shadow: 0 0 32px rgba(0,234,255,0.07), inset 0 1px 0 rgba(255,255,255,0.04); }
    50%       { box-shadow: 0 0 48px rgba(0,234,255,0.13), inset 0 1px 0 rgba(255,255,255,0.06); }
}
@keyframes gameCardScan {
    0%   { transform: translateY(-100%); opacity: 0.18; }
    100% { transform: translateY(200%);  opacity: 0; }
}
`;

function useWindowWidth() {
    const [width, setWidth] = useState(() => window.innerWidth);
    useEffect(() => {
        const handler = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return width;
}

/**
 * Cyberpunk game launcher panel shown on chapters that expose game links.
 *
 * @param {object} props
 * @param {object} props.chapter Active chapter config.
 * @param {boolean} props.transitioning Whether a scene transition is active.
 */
function EarnedCodeChest({ chapter, transitioning }) {
    const [visible, setVisible] = useState(false);
    const [gameHover, setGameHover] = useState(false);
    const windowWidth = useWindowWidth();

    const show = (chapter?.links?.length ?? 0) > 0;
    const isTablet = windowWidth >= 900 && windowWidth < 1200;
    const isMobile = windowWidth < 900;

    useEffect(() => {
        const styleId = 'earned-code-chest-kf';
        if (!document.getElementById(styleId)) {
            const tag = document.createElement('style');
            tag.id = styleId;
            tag.textContent = KEYFRAMES;
            document.head.appendChild(tag);
        }
    }, []);

    useEffect(() => {
        if (!show || isMobile) { setVisible(false); return; }
        setVisible(false);
        const t = window.setTimeout(() => setVisible(true), 500);
        return () => window.clearTimeout(t);
    }, [chapter?.id, show, isMobile]);

    if (!show || isMobile) return null;

    const right = isTablet ? 18 : 30;
    const top = isTablet ? 320 : 350;
    const cardWidth = isTablet ? 270 : 310;
    const isShowing = visible && !transitioning;

    return (
        <aside
            aria-label="Game launcher panel"
            style={{
                position: 'fixed',
                right,
                top,
                width: cardWidth,
                zIndex: 14,
                pointerEvents: 'auto',
                opacity: isShowing ? 1 : 0,
                transform: isShowing ? 'translateX(0)' : 'translateX(28px)',
                transition: 'opacity 550ms ease, transform 550ms ease',
                filter: isShowing
                    ? 'drop-shadow(0 0 22px rgba(0,234,255,0.14))'
                    : 'drop-shadow(0 0 0px rgba(0,234,255,0))',
            }}
        >
            <div
                style={{
                    background: 'rgba(6, 14, 24, 0.82)',
                    border: '1px solid rgba(0,234,255,0.32)',
                    borderRadius: 18,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '16px 16px 16px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    animation: isShowing ? 'earnedChestGlow 4s ease-in-out infinite' : 'none',
                }}
            >
                {/* ── Panel header ────────────────────── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 9,
                                letterSpacing: 3,
                                color: 'rgba(0,234,255,0.5)',
                                textTransform: 'uppercase',
                                marginBottom: 3,
                            }}
                        >
                            GAME PORTAL
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                letterSpacing: 2.5,
                                color: '#00eaff',
                                textTransform: 'uppercase',
                                textShadow: '0 0 12px rgba(0,234,255,0.45)',
                            }}
                        >
                            LAUNCH GAME
                        </div>
                    </div>
                    <span style={{ fontSize: 18, lineHeight: 1, marginTop: 2 }} aria-hidden="true">
                        🎮
                    </span>
                </div>

                {/* ── Divider ─────────────────────────── */}
                <div
                    style={{
                        height: 1,
                        background:
                            'linear-gradient(90deg, rgba(0,234,255,0.45) 0%, rgba(0,234,255,0.05) 100%)',
                        marginBottom: 12,
                    }}
                />

                {/* ── Game launch card ────────────────── */}
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Launch Cyber Runner 3D game in new tab"
                    onClick={() => window.open(GAME_URL, '_blank', 'noopener,noreferrer')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                            window.open(GAME_URL, '_blank', 'noopener,noreferrer');
                    }}
                    onMouseEnter={() => setGameHover(true)}
                    onMouseLeave={() => setGameHover(false)}
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 12,
                        border: `1px solid ${gameHover ? 'rgba(0,234,255,0.75)' : 'rgba(0,234,255,0.42)'}`,
                        background: gameHover
                            ? 'linear-gradient(135deg, rgba(0,26,40,0.95) 0%, rgba(0,18,30,0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(0,20,32,0.88) 0%, rgba(4,12,22,0.88) 100%)',
                        boxShadow: gameHover
                            ? '0 0 28px rgba(0,234,255,0.22), inset 0 1px 0 rgba(0,234,255,0.12)'
                            : '0 0 12px rgba(0,234,255,0.08), inset 0 1px 0 rgba(0,234,255,0.06)',
                        cursor: 'pointer',
                        transform: gameHover ? 'scale(1.02)' : 'scale(1)',
                        transition:
                            'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease, background 200ms ease',
                    }}
                >
                    {/* Thumbnail */}
                    <div
                        style={{
                            height: 90,
                            background:
                                'linear-gradient(135deg, #001428 0%, #002040 30%, #001a30 60%, #000d1a 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '11px 11px 0 0',
                        }}
                    >
                        {/* Grid lines */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage:
                                    'linear-gradient(rgba(0,234,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,234,255,0.06) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />
                        {/* Scan line */}
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: 40,
                                background:
                                    'linear-gradient(180deg, transparent 0%, rgba(0,234,255,0.08) 50%, transparent 100%)',
                                animation: gameHover ? 'gameCardScan 1.4s linear infinite' : 'none',
                                pointerEvents: 'none',
                            }}
                        />
                        {/* Center icon */}
                        <div
                            style={{
                                position: 'relative',
                                fontSize: 32,
                                lineHeight: 1,
                                filter: gameHover
                                    ? 'drop-shadow(0 0 10px rgba(0,234,255,0.7))'
                                    : 'drop-shadow(0 0 4px rgba(0,234,255,0.4))',
                                transition: 'filter 200ms ease',
                            }}
                            aria-hidden="true"
                        >
                            🎮
                        </div>
                        {/* Corner brackets */}
                        {[
                            { top: 6, left: 6, borderTop: 1, borderLeft: 1 },
                            { top: 6, right: 6, borderTop: 1, borderRight: 1 },
                            { bottom: 6, left: 6, borderBottom: 1, borderLeft: 1 },
                            { bottom: 6, right: 6, borderBottom: 1, borderRight: 1 },
                        ].map((pos, i) => (
                            <div
                                key={i}
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    width: 10,
                                    height: 10,
                                    borderColor: 'rgba(0,234,255,0.5)',
                                    borderStyle: 'solid',
                                    borderWidth: 0,
                                    ...Object.fromEntries(
                                        Object.entries(pos).map(([k, v]) =>
                                            k.startsWith('border') ? [k + 'Width', v] : [k, v]
                                        )
                                    ),
                                }}
                            />
                        ))}
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '11px 13px 13px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 4,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: 1.8,
                                    color: gameHover ? '#ffffff' : 'rgba(255,255,255,0.92)',
                                    textTransform: 'uppercase',
                                    transition: 'color 200ms ease',
                                }}
                            >
                                CYBER RUNNER 3D
                            </div>
                            <div
                                style={{
                                    fontSize: 8,
                                    letterSpacing: 1.5,
                                    textTransform: 'uppercase',
                                    color: '#00eaff',
                                    border: '1px solid rgba(0,234,255,0.5)',
                                    borderRadius: 4,
                                    padding: '2px 6px',
                                    background: 'rgba(0,234,255,0.08)',
                                    boxShadow: gameHover ? '0 0 8px rgba(0,234,255,0.3)' : 'none',
                                    transition: 'box-shadow 200ms ease',
                                }}
                            >
                                ● PLAYABLE
                            </div>
                        </div>
                        <div
                            style={{
                                fontSize: 10,
                                color: 'rgba(135,206,235,0.6)',
                                letterSpacing: 0.5,
                                marginBottom: 10,
                            }}
                        >
                            3D Endless Runner / WebGL
                        </div>
                        {/* Launch button row */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                padding: '7px 0',
                                borderRadius: 7,
                                border: `1px solid ${gameHover ? 'rgba(0,234,255,0.6)' : 'rgba(0,234,255,0.25)'}`,
                                background: gameHover
                                    ? 'rgba(0,234,255,0.12)'
                                    : 'rgba(0,234,255,0.04)',
                                transition: 'border-color 200ms ease, background 200ms ease',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 10,
                                    color: gameHover ? '#00eaff' : 'rgba(0,234,255,0.55)',
                                    transition: 'color 200ms ease',
                                }}
                            >
                                ▶
                            </span>
                            <span
                                style={{
                                    fontSize: 10,
                                    letterSpacing: 2,
                                    textTransform: 'uppercase',
                                    color: gameHover ? '#00eaff' : 'rgba(0,234,255,0.55)',
                                    transition: 'color 200ms ease',
                                }}
                            >
                                PLAY NOW
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default EarnedCodeChest;
