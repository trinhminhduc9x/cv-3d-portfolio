function HeaderStatement() {
    return (
        <div
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
            {/* Name & Title */}
            <div style={{ marginBottom: 16 }}>
                <h1
                    style={{
                        margin: 0,
                        fontSize: 22,
                        fontWeight: 600,
                        letterSpacing: '-0.5px',
                        color: '#ffffff',
                    }}
                >
                    Trinh Minh Duc
                </h1>
                <div
                    style={{
                        fontSize: 13,
                        color: '#87ceeb',
                        marginTop: 6,
                        fontWeight: 500,
                    }}
                >
                    Software Engineer | 3D Systems & Visualization
                </div>
            </div>

            {/* Contact Info */}
            <div
                style={{
                    fontSize: 12,
                    lineHeight: 1.8,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: 14,
                    marginBottom: 14,
                    opacity: 0.9,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#87ceeb', fontWeight: 600 }}>📍</span>
                    <span>Da Nang, Vietnam</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#87ceeb', fontWeight: 600 }}>📧</span>
                    <a
                        href="mailto:tmduc.dev@gmail.com"
                        style={{ color: '#ffffff', textDecoration: 'none' }}
                    >
                        tmduc.dev@gmail.com
                    </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#87ceeb', fontWeight: 600 }}>📱</span>
                    <span>+84 975 514 667</span>
                </div>
            </div>

            {/* Download CV Button */}
            <a
                href="https://drive.google.com/file/d/1t3d7xtGQSKnYM_iHsHQs6PsBugmzO-JW/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
            >
                <button
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
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
                    }}
                >
                    📄 Download Full CV
                </button>
            </a>

            {/* Tagline */}
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
                Engineering • Architecture • Software
            </div>
        </div>
    );
}

export default HeaderStatement;