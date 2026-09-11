import { useState } from 'react';
import { PORTFOLIO_PROFILE } from '../data/narrative.config';

/* eslint-disable react/prop-types */
function HeaderStatement({ lang = 'vi', onToggleLang }) {
    const {
        displayName,
        titleLine,
        eyebrow,
        location,
        phoneDisplay,
        phoneTel,
        email,
        profileUrl,
        profileLabel,
        cvDownloadUrl,
    } = PORTFOLIO_PROFILE;

    // On phones there isn't room for the full card alongside the narrative
    // text below it — start collapsed to a small chip on narrow viewports,
    // full card on desktop. Purely a starting value; resizing mid-session
    // doesn't force a re-collapse once the visitor has opened it.
    const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 720);

    if (collapsed) {
        return (
            <button
                type="button"
                className="header-statement-chip"
                onClick={() => setCollapsed(false)}
                aria-label={`Show profile card for ${displayName}`}
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 30,
                    zIndex: 16,
                    background: 'rgba(20, 15, 12, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 999,
                    padding: '8px 14px',
                    color: '#ffffff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                }}
            >
                {displayName}
            </button>
        );
    }

    return (
        <header
            className="header-statement-panel"
            aria-labelledby="profile-heading"
            style={{
                position: 'fixed',
                top: 20,
                right: 30,
                maxWidth: 320,
                background: 'rgba(20, 15, 12, 0.85)',
                backdropFilter: 'blur(10px)',
                padding: '20px 25px',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p
                        style={{
                            margin: '0 0 6px',
                            fontSize: 11,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'rgba(255, 179, 122, 0.85)',
                            fontWeight: 600,
                        }}
                    >
                        {eyebrow}
                    </p>
                    <button
                        type="button"
                        className="header-statement-collapse-btn"
                        onClick={() => setCollapsed(true)}
                        aria-label="Collapse profile card"
                        style={{
                            display: 'none',
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: 16,
                            lineHeight: 1,
                            cursor: 'pointer',
                            padding: '0 0 0 8px',
                        }}
                    >
                        ✕
                    </button>
                    {onToggleLang && (
                        <button
                            type="button"
                            onClick={onToggleLang}
                            aria-label={`Switch language to ${lang === 'vi' ? 'English' : 'Vietnamese'}`}
                            style={{
                                background: 'rgba(255, 179, 122, 0.15)',
                                border: '1px solid rgba(255, 179, 122, 0.35)',
                                borderRadius: 6,
                                color: '#ffb37a',
                                fontSize: 11,
                                fontWeight: 600,
                                padding: '3px 8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {lang === 'vi' ? 'VI | EN' : 'EN | VI'}
                        </button>
                    )}
                </div>
                <h1
                    id="profile-heading"
                    style={{
                        margin: 0,
                        fontSize: 22,
                        fontWeight: 600,
                        letterSpacing: '-0.5px',
                        color: '#ffffff',
                    }}
                >
                    {displayName}
                </h1>
                <div
                    style={{
                        fontSize: 13,
                        color: '#ffb37a',
                        marginTop: 6,
                        fontWeight: 500,
                        lineHeight: 1.35,
                    }}
                >
                    {titleLine}
                </div>
            </div>

            <address
                aria-label="Contact information"
                style={{
                    fontStyle: 'normal',
                    fontSize: 12,
                    lineHeight: 1.8,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: 14,
                    marginBottom: 14,
                    opacity: 0.9,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span aria-hidden="true" style={{ color: '#ffb37a', fontWeight: 600 }}>
                        Loc
                    </span>
                    <span>{location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span aria-hidden="true" style={{ color: '#ffb37a', fontWeight: 600 }}>
                        Mail
                    </span>
                    <a
                        href={`mailto:${email}`}
                        aria-label={`Email ${displayName}`}
                        style={{ color: '#ffffff', textDecoration: 'none' }}
                    >
                        {email}
                    </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span aria-hidden="true" style={{ color: '#ffb37a', fontWeight: 600 }}>
                        Tel
                    </span>
                    <a
                        href={`tel:${phoneTel}`}
                        aria-label={`Phone ${displayName}`}
                        style={{ color: '#ffffff', textDecoration: 'none' }}
                    >
                        {phoneDisplay}
                    </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span aria-hidden="true" style={{ color: '#ffb37a', fontWeight: 600 }}>
                        Web
                    </span>
                    <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Profile and links (opens in new tab)"
                        style={{ color: '#ffffff', textDecoration: 'none' }}
                    >
                        {profileLabel}
                    </a>
                </div>
            </address>

            <a href={cvDownloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button
                    aria-label="Open full CV in a new tab"
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #e8973f 0%, #a85a1f 100%)',
                        border: 'none',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(232, 151, 63, 0.3)',
                    }}
                    onMouseOver={(event) => {
                        event.currentTarget.style.transform = 'translateY(-2px)';
                        event.currentTarget.style.boxShadow = '0 6px 16px rgba(232, 151, 63, 0.4)';
                    }}
                    onMouseOut={(event) => {
                        event.currentTarget.style.transform = 'translateY(0)';
                        event.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 151, 63, 0.3)';
                    }}
                    type="button"
                >
                    Download Full CV
                </button>
            </a>

            <div
                style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: 11,
                    color: '#ffb37a',
                    textAlign: 'center',
                    fontStyle: 'italic',
                }}
            >
                Real-time 3D · Engine · Tools
            </div>
        </header>
    );
}

export default HeaderStatement;
