import { CV_SECTIONS } from '../data/cvData';

function NarrativePanel({ active }) {
    const section = CV_SECTIONS[active];

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 40,
                left: 40,
                maxWidth: 360,
                background: 'rgba(255,255,255,0.9)',
                padding: 20,
                borderRadius: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            }}
        >
            <h2 style={{ marginBottom: 6 }}>{section.title}</h2>
            <p style={{ fontSize: 13, opacity: 0.65, marginBottom: 12 }}>
                {section.subtitle}
            </p>
            <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>
                {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

        </div>
    );
}

export default NarrativePanel;
