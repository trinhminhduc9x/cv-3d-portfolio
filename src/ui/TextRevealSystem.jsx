/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

/**
 * Reveals chapter text as timed cinematic captions.
 *
 * @param {object} props Text reveal props.
 * @param {object} props.chapter Active chapter.
 * @param {boolean} props.transitioning Whether a transition is active.
 * @returns {JSX.Element | null} Text reveal overlay.
 */
function TextRevealSystem({ chapter, transitioning }) {
    const [visible, setVisible] = useState(false);
    const lines = chapter?.textSequence || [];

    useEffect(() => {
        setVisible(false);
        const timer = window.setTimeout(() => setVisible(true), 180);
        return () => window.clearTimeout(timer);
    }, [chapter?.id]);

    if (!chapter || lines.length === 0) {
        return null;
    }

    return (
        <section
            aria-live="polite"
            aria-label={`${chapter.label} narrative text`}
            style={{
                position: 'fixed',
                left: '50%',
                bottom: 108,
                transform: 'translateX(-50%)',
                width: 'min(760px, calc(100vw - 48px))',
                color: '#ffffff',
                fontFamily: 'Inter, system-ui, sans-serif',
                textAlign: 'center',
                pointerEvents: 'none',
                zIndex: 14,
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: 'rgba(135, 206, 235, 0.78)',
                    marginBottom: 10,
                    opacity: transitioning ? 0.45 : 1,
                    transition: 'opacity 360ms ease',
                }}
            >
                {chapter.label}
            </div>
            {lines.map((line, i) => (
                <p
                    key={i}
                    style={{
                        margin: i > 0 ? '10px 0 0' : 0,
                        fontSize: 18,
                        lineHeight: 1.55,
                        textShadow: '0 10px 30px rgba(0, 0, 0, 0.65)',
                        opacity: visible && !transitioning ? 1 : 0,
                        transform: visible && !transitioning ? 'translateY(0)' : 'translateY(10px)',
                        transition: `opacity ${480 + i * 120}ms ease, transform ${480 + i * 120}ms ease`,
                    }}
                >
                    {line}
                </p>
            ))}
        </section>
    );
}

export default TextRevealSystem;
