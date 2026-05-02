/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

/**
 * Reveals chapter text as timed cinematic captions.
 * Each item in textSequence may be a plain string or a { vi, en } bilingual object.
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
            {/* Chapter label */}
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

            {/* Text blocks — each item is { vi, en } or a plain string */}
            {lines.map((item, i) => {
                const isBilingual = item !== null && typeof item === 'object';
                const vi = isBilingual ? item.vi : item;
                const en = isBilingual ? item.en : null;
                const isShowing = visible && !transitioning;
                const delay = 480 + i * 140;

                return (
                    <div
                        key={i}
                        style={{
                            marginTop: i > 0 ? 14 : 0,
                            opacity: isShowing ? 1 : 0,
                            transform: isShowing ? 'translateY(0)' : 'translateY(10px)',
                            transition: `opacity ${delay}ms ease, transform ${delay}ms ease`,
                        }}
                    >
                        {/* Vietnamese — primary */}
                        <p
                            style={{
                                margin: 0,
                                fontSize: 18,
                                lineHeight: 1.55,
                                color: '#ffffff',
                                textShadow: '0 10px 30px rgba(0, 0, 0, 0.65)',
                            }}
                        >
                            {vi}
                        </p>

                        {/* English — secondary, shown only for bilingual items */}
                        {en && (
                            <p
                                style={{
                                    margin: '4px 0 0',
                                    fontSize: 13,
                                    lineHeight: 1.5,
                                    fontStyle: 'italic',
                                    color: 'rgba(135, 206, 235, 0.55)',
                                    textShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
                                    letterSpacing: 0.2,
                                }}
                            >
                                {en}
                            </p>
                        )}
                    </div>
                );
            })}
        </section>
    );
}

export default TextRevealSystem;
