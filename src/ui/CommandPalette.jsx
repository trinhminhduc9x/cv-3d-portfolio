/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { CHAPTER_SEQUENCE, LIFE_CHAPTERS } from '../data/narrative.config';
import { playClickSound, playHoverSound } from '../audio/uiSoundSynth';

function CommandPalette({
    isOpen,
    onClose,
    onNavigateChapter,
    onToggleLang,
    onToggleWireframeInspect,
    explodedView,
    onToggleExplodedView,
    lang,
    wireframeInspect,
}) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                onClose((prev) => !prev);
            } else if (e.key === 'Escape' && isOpen) {
                onClose(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filteredChapters = CHAPTER_SEQUENCE.map((id, index) => ({
        id,
        index,
        chapter: LIFE_CHAPTERS[index],
    })).filter(({ chapter }) =>
        chapter.label.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            onClick={() => onClose(false)}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: 'rgba(10, 7, 5, 0.75)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '12vh',
                pointerEvents: 'auto',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 'min(580px, calc(100vw - 32px))',
                    background: 'rgba(18, 14, 11, 0.95)',
                    border: '1px solid rgba(255, 122, 60, 0.4)',
                    borderRadius: 14,
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 122, 60, 0.15)',
                    overflow: 'hidden',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {/* Search Header */}
                <div
                    style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <span style={{ color: '#ff7a3c', fontSize: 16 }}>🔍</span>
                    <input
                        type="text"
                        autoFocus
                        placeholder="Type a command or chapter name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#ffffff',
                            fontSize: 15,
                            fontFamily: 'inherit',
                        }}
                    />
                    <span
                        style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.4)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '3px 7px',
                            borderRadius: 4,
                        }}
                    >
                        ESC
                    </span>
                </div>

                {/* Command Items List */}
                <div style={{ maxHeight: 360, overflowY: 'auto', padding: '10px 12px' }}>
                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: 1.5,
                            color: 'rgba(255, 122, 60, 0.6)',
                            padding: '8px 10px 4px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Chapters Navigation
                    </div>

                    {filteredChapters.map(({ id, index, chapter }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                playClickSound();
                                onNavigateChapter(index);
                                onClose(false);
                            }}
                            onMouseEnter={playHoverSound}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: 8,
                                color: '#ffffff',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'background 0.15s ease',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 122, 60, 0.12)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <div>
                                <span style={{ fontWeight: 600, fontSize: 13 }}>{chapter.label}</span>
                                <span style={{ fontSize: 11, color: 'rgba(255, 179, 122, 0.6)', marginLeft: 10 }}>
                                    Chapter {index + 1}
                                </span>
                            </div>
                            <span style={{ fontSize: 11, color: '#ff7a3c' }}>Jump →</span>
                        </button>
                    ))}

                    <div
                        style={{
                            fontSize: 10,
                            letterSpacing: 1.5,
                            color: 'rgba(255, 122, 60, 0.6)',
                            padding: '14px 10px 4px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Quick Actions
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            playClickSound();
                            onToggleExplodedView?.();
                        }}
                        onMouseEnter={playHoverSound}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 8,
                            color: '#ffffff',
                            cursor: 'pointer',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 59, 31, 0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span style={{ fontSize: 13 }}>Toggle 3D Exploded View (Disassembly)</span>
                        <span style={{ fontSize: 11, color: '#ff3b1f' }}>
                            {explodedView ? 'ON' : 'OFF (Space)'}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            playClickSound();
                            onToggleLang();
                        }}
                        onMouseEnter={playHoverSound}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 8,
                            color: '#ffffff',
                            cursor: 'pointer',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 122, 60, 0.12)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span style={{ fontSize: 13 }}>Toggle Language (Current: {lang.toUpperCase()})</span>
                        <span style={{ fontSize: 11, color: '#ffb37a' }}>Switch VI/EN</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            playClickSound();
                            onToggleWireframeInspect();
                        }}
                        onMouseEnter={playHoverSound}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 8,
                            color: '#ffffff',
                            cursor: 'pointer',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 122, 60, 0.12)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span style={{ fontSize: 13 }}>Toggle 3D Wireframe Inspect Mode</span>
                        <span style={{ fontSize: 11, color: '#ffb37a' }}>
                            {wireframeInspect ? 'ON' : 'OFF'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommandPalette;
