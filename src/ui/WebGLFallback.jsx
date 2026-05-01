function WebGLFallback() {
    return (
        <main
            role="main"
            aria-labelledby="webgl-fallback-title"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                background: '#0f1419',
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            <section
                style={{
                    width: 'min(560px, 100%)',
                    padding: 28,
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(135, 206, 235, 0.22)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
                }}
            >
                <h1 id="webgl-fallback-title" style={{ margin: '0 0 12px', fontSize: 24 }}>
                    WebGL is not available
                </h1>
                <p style={{ margin: 0, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.76)' }}>
                    This 3D CV requires browser WebGL support. Try a modern browser with hardware
                    acceleration enabled, or open the full CV from the download link when available.
                </p>
            </section>
        </main>
    );
}

export default WebGLFallback;
