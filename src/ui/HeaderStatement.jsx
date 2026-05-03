import { PORTFOLIO_PROFILE } from '../data/narrative.config';

function HeaderStatement() {
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

    return (
        <header
            aria-labelledby="profile-heading"
            style={{
                position: 'fixed',
                top: 20,
                right: 30,
                maxWidth: 320,
                background: 'rgba(15, 20, 25, 0.85)',
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
                <p
                    style={{
                        margin: '0 0 6px',
                        fontSize: 11,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'rgba(135, 206, 235, 0.85)',
                        fontWeight: 600,
                    }}
                >
                    {eyebrow}
                </p>
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
                        color: '#87ceeb',
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
                    <span aria-hidden="true" style={{ color: '#87ceeb', fontWeight: 600 }}>
                        Loc
                    </span>
                    <span>{location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span aria-hidden="true" style={{ color: '#87ceeb', fontWeight: 600 }}>
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
                    <span aria-hidden="true" style={{ color: '#87ceeb', fontWeight: 600 }}>
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
                    <span aria-hidden="true" style={{ color: '#87ceeb', fontWeight: 600 }}>
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
                        background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                        border: 'none',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                    }}
                    onMouseOver={(event) => {
                        event.currentTarget.style.transform = 'translateY(-2px)';
                        event.currentTarget.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
                    }}
                    onMouseOut={(event) => {
                        event.currentTarget.style.transform = 'translateY(0)';
                        event.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
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
                    color: '#87ceeb',
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
