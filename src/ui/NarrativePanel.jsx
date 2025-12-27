import { CV_SECTIONS } from '../data/cvData';

function NarrativePanel({ active }) {
    const section = CV_SECTIONS[active];

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 30,
                left: 30,
                maxWidth: 480,
                maxHeight: '70vh',
                overflowY: 'auto',
                background: 'rgba(15, 20, 25, 0.92)',
                backdropFilter: 'blur(12px)',
                padding: '24px 28px',
                borderRadius: 12,
                border: '1px solid rgba(135, 206, 235, 0.2)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            {/* Section Header */}
            <div style={{ marginBottom: 20, borderBottom: '2px solid rgba(135, 206, 235, 0.3)', paddingBottom: 14 }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#87ceeb',
                        letterSpacing: '-0.3px',
                        marginBottom: 6,
                    }}
                >
                    {section.title}
                </h2>
                <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>
                    {section.subtitle}
                </div>
                <div style={{ fontSize: 12, opacity: 0.6, fontStyle: 'italic' }}>
                    {section.period}
                </div>
            </div>

            {/* Content Items */}
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                {section.content.map((item, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                        {/* Education/Experience Header */}
                        {item.type === 'education' && (
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: '#87ceeb', marginBottom: 4 }}>
                                    {item.institution}
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.7, fontStyle: 'italic' }}>
                                    {item.degree}
                                </div>
                            </div>
                        )}

                        {item.type === 'training' && (
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: '#87ceeb', marginBottom: 4 }}>
                                    {item.institution}
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.7, fontStyle: 'italic' }}>
                                    {item.period}
                                </div>
                            </div>
                        )}

                        {item.type === 'experience' && (
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: '#87ceeb', marginBottom: 4 }}>
                                    {item.project || item.role}
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>
                                    {item.company} • {item.period}
                                </div>
                                {item.product && (
                                    <div style={{ fontSize: 11, opacity: 0.6 }}>
                                        <a
                                            href={item.product}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#87ceeb', textDecoration: 'none' }}
                                        >
                                            🔗 {item.product.replace('https://', '')}
                                        </a>
                                    </div>
                                )}
                                {item.portfolio && (
                                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                                        <a
                                            href={item.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#87ceeb', textDecoration: 'none' }}
                                        >
                                            🎨 View Portfolio
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Highlights */}
                        <ul style={{ paddingLeft: 18, margin: 0, opacity: 0.9 }}>
                            {item.highlights.map((highlight, j) => (
                                <li key={j} style={{ marginBottom: 8 }}>
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Skills (Software section only) */}
                {section.skills && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(135, 206, 235, 0.2)' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#87ceeb', marginBottom: 10 }}>
                            Core Skills
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {section.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    style={{
                                        fontSize: 11,
                                        padding: '4px 10px',
                                        background: 'rgba(135, 206, 235, 0.15)',
                                        border: '1px solid rgba(135, 206, 235, 0.3)',
                                        borderRadius: 4,
                                        opacity: 0.85,
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Awards (Software section only) */}
                {section.awards && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(135, 206, 235, 0.2)' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#87ceeb', marginBottom: 10 }}>
                            Awards & Recognition
                        </div>
                        {section.awards.map((award, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 12, fontWeight: 600 }}>
                                    🏆 {award.title} ({award.year})
                                </div>
                                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                                    {award.description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NarrativePanel;