/* eslint-disable react/prop-types */
import { useState } from 'react';

import { PORTFOLIO_PROFILE } from '../data/narrative.config';

const COPY = {
    vi: {
        title: 'Bạn đã xem hết 3 hiện vật',
        body: 'Cảm ơn đã ghé thăm — xem thêm hoặc tải CV đầy đủ bên dưới.',
        cv: 'Tải CV',
        profile: 'Hồ sơ đầy đủ',
        dismiss: 'Đóng',
    },
    en: {
        title: "You've seen all 3 exhibits",
        body: 'Thanks for visiting — see more or download the full CV below.',
        cv: 'Download CV',
        profile: 'Full profile',
        dismiss: 'Dismiss',
    },
};

/**
 * Non-modal "exit hall" banner shown once a free-roaming visitor has entered
 * all three exhibit zones (ADR-0002). Never blocks continued exploration —
 * a real museum doesn't eject you once you've seen everything either.
 *
 * @param {object} props Prompt props.
 * @param {boolean} props.visible Whether all zones have been visited.
 * @param {'vi'|'en'} props.lang Display language.
 * @returns {JSX.Element|null} Exit banner, or null when not yet earned/dismissed.
 */
function MuseumExitPrompt({ visible, lang = 'vi' }) {
    const [dismissed, setDismissed] = useState(false);
    const copy = COPY[lang] || COPY.vi;

    if (!visible || dismissed) {
        return null;
    }

    return (
        <div
            role="complementary"
            aria-label={copy.title}
            style={{
                position: 'fixed',
                right: 30,
                bottom: 90,
                zIndex: 15,
                width: 280,
                padding: '14px 16px',
                borderRadius: 8,
                background: 'rgba(20, 15, 12, 0.9)',
                border: '1px solid rgba(255, 179, 122, 0.28)',
                color: '#ffffff',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label={copy.dismiss}
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: 12,
                    lineHeight: '20px',
                    padding: 0,
                }}
            >
                ×
            </button>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600 }}>{copy.title}</p>
            <p style={{ margin: '0 0 12px', fontSize: 12, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.75)' }}>
                {copy.body}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
                <a
                    href={PORTFOLIO_PROFILE.cvDownloadUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                        padding: '7px 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(255, 179, 122, 0.5)',
                        background: '#a8531f',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    {copy.cv}
                </a>
                <a
                    href={PORTFOLIO_PROFILE.profileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                        padding: '7px 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        background: 'transparent',
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: 12,
                        textDecoration: 'none',
                    }}
                >
                    {copy.profile}
                </a>
            </div>
        </div>
    );
}

export default MuseumExitPrompt;
