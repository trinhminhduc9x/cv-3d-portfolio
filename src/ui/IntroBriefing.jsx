/* eslint-disable react/prop-types */
import { useState } from 'react';

import { PORTFOLIO_PROFILE } from '../data/narrative.config';

const COPY = {
    vi: {
        eyebrow: 'Nhiệm vụ',
        title: `Hành trình của ${PORTFOLIO_PROFILE.displayName}`,
        mission: 'Từ xưởng thép đến real-time 3D — chọn cách bạn muốn khám phá.',
        guidedTitle: 'Guided Tour',
        guidedBody: 'Camera dẫn chuyện qua từng chương, như một bộ phim tài liệu.',
        museumTitle: 'Museum Walk',
        museumBody: 'Tự do đi bộ (WASD) giữa các hiện vật như một bảo tàng thật.',
        start: 'Bắt đầu',
    },
    en: {
        eyebrow: 'Mission',
        title: `${PORTFOLIO_PROFILE.displayName}'s Journey`,
        mission: 'From a steel workshop to real-time 3D — choose how you want to explore it.',
        guidedTitle: 'Guided Tour',
        guidedBody: 'A scripted camera carries you through each chapter, documentary-style.',
        museumTitle: 'Museum Walk',
        museumBody: 'Walk freely (WASD) between exhibits like a real museum.',
        start: 'Start',
    },
};

/**
 * First-contact gate (ADR-0003) — shown once, ever, right after `LoadingScreen`
 * finishes. Frames the visit as a mission and lets the visitor pick Guided Tour
 * or Museum Walk before anything else happens. Blocks interaction with
 * everything beneath it (full-screen opaque backdrop) while visible.
 *
 * @param {object} props Briefing props.
 * @param {'vi'|'en'} props.lang Display language.
 * @param {boolean} props.canFreeRoam Whether the Museum Walk path should be offered.
 * @param {() => void} props.onSelectGuided Called when Guided Tour is chosen.
 * @param {() => void} props.onSelectMuseum Called when Museum Walk is chosen.
 * @returns {JSX.Element} Full-screen intro overlay.
 */
function IntroBriefing({ lang = 'vi', canFreeRoam, onSelectGuided, onSelectMuseum }) {
    const [dismissing, setDismissing] = useState(false);
    const copy = COPY[lang] || COPY.vi;

    const select = (handler) => {
        setDismissing(true);
        window.setTimeout(handler, 400);
    };

    return (
        <div
            role="dialog"
            aria-label={copy.title}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#05070a',
                fontFamily: 'Inter, system-ui, sans-serif',
                opacity: dismissing ? 0 : 1,
                transition: 'opacity 400ms ease',
                pointerEvents: dismissing ? 'none' : 'auto',
            }}
        >
            <div style={{ width: 'min(620px, calc(100vw - 48px))', textAlign: 'center' }}>
                <div
                    style={{
                        fontSize: 12,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        color: 'rgba(255, 179, 122, 0.78)',
                        marginBottom: 12,
                    }}
                >
                    {copy.eyebrow}
                </div>
                <h1 style={{ margin: '0 0 14px', fontSize: 30, fontWeight: 700, color: '#ffffff' }}>
                    {copy.title}
                </h1>
                <p style={{ margin: '0 0 32px', fontSize: 15, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)' }}>
                    {copy.mission}
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: 16,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => select(onSelectGuided)}
                        aria-label={`${copy.start} — ${copy.guidedTitle}`}
                        style={{
                            width: 240,
                            padding: '20px 18px',
                            borderRadius: 10,
                            border: '1px solid rgba(255, 179, 122, 0.5)',
                            background: 'rgba(168, 83, 31, 0.35)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{copy.guidedTitle}</div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.78)' }}>
                            {copy.guidedBody}
                        </div>
                    </button>

                    {canFreeRoam && (
                        <button
                            type="button"
                            onClick={() => select(onSelectMuseum)}
                            aria-label={`${copy.start} — ${copy.museumTitle}`}
                            style={{
                                width: 240,
                                padding: '20px 18px',
                                borderRadius: 10,
                                border: '1px solid rgba(135, 206, 235, 0.4)',
                                background: 'rgba(20, 15, 12, 0.6)',
                                color: '#ffffff',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{copy.museumTitle}</div>
                            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.78)' }}>
                                {copy.museumBody}
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IntroBriefing;
