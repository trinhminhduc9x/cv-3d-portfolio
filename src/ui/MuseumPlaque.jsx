/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import { getMuseumPlaque } from '../data/museumPlaques.config';

/**
 * Compact museum placard shown next to a physical exhibit while free-roaming.
 * Replaces `TextRevealSystem` for the moment a visitor is inside a zone's
 * radius; `TextRevealSystem` resumes once `zoneId` returns to null.
 *
 * @param {object} props Plaque props.
 * @param {string|null} props.zoneId Active exhibit zone id, or null when not
 *   inside any zone (or not in free-roam mode at all).
 * @param {'vi'|'en'} props.lang Primary display language.
 * @returns {JSX.Element|null} Plaque overlay.
 */
function MuseumPlaque({ zoneId, lang = 'vi' }) {
    const [visible, setVisible] = useState(false);
    const plaque = zoneId ? getMuseumPlaque(zoneId) : null;

    useEffect(() => {
        setVisible(false);
        if (!plaque) {
            return undefined;
        }
        const timer = window.setTimeout(() => setVisible(true), 180);
        return () => window.clearTimeout(timer);
    }, [plaque]);

    if (!plaque) {
        return null;
    }

    const secondaryLang = lang === 'en' ? 'vi' : 'en';
    const title = plaque.title[lang] || plaque.title.vi;
    const titleSecondary = plaque.title[secondaryLang];
    const material = plaque.material[lang] || plaque.material.vi;
    const note = plaque.curatorialNote[lang] || plaque.curatorialNote.vi;
    const noteSecondary = plaque.curatorialNote[secondaryLang];

    return (
        <section
            aria-live="polite"
            aria-label={`${title} museum plaque`}
            style={{
                position: 'fixed',
                left: 30,
                bottom: 30,
                zIndex: 14,
                width: 320,
                maxWidth: 'calc(100vw - 48px)',
                padding: '16px 18px',
                borderRadius: 8,
                background: 'rgba(20, 15, 12, 0.82)',
                border: '1px solid rgba(255, 179, 122, 0.28)',
                color: '#ffffff',
                fontFamily: 'Inter, system-ui, sans-serif',
                pointerEvents: 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 480ms ease, transform 480ms ease',
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: 'rgba(255, 179, 122, 0.78)',
                    marginBottom: 8,
                }}
            >
                {`Exhibit №${plaque.exhibitNumber}`}
            </div>

            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>
                {title}
            </p>
            {titleSecondary && (
                <p
                    style={{
                        margin: '2px 0 0',
                        fontSize: 12,
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                        color: 'rgba(255, 255, 255, 0.6)',
                    }}
                >
                    {titleSecondary}
                </p>
            )}

            <p
                style={{
                    margin: '10px 0 0',
                    fontSize: 13,
                    letterSpacing: 0.4,
                    color: 'rgba(135, 206, 235, 0.85)',
                }}
            >
                {plaque.dateRange}
            </p>

            <p
                style={{
                    margin: '4px 0 0',
                    fontSize: 12,
                    color: 'rgba(255, 255, 255, 0.7)',
                }}
            >
                {material}
            </p>

            <p
                style={{
                    margin: '10px 0 0',
                    fontSize: 12,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    color: 'rgba(255, 255, 255, 0.55)',
                }}
            >
                {note}
            </p>
            {noteSecondary && (
                <p
                    style={{
                        margin: '4px 0 0',
                        fontSize: 11,
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                        color: 'rgba(255, 255, 255, 0.4)',
                    }}
                >
                    {noteSecondary}
                </p>
            )}
        </section>
    );
}

export default MuseumPlaque;
