/* eslint-disable react/prop-types */
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';

function readRenderStats(gl) {
    const render = gl.info.render;
    const memory = gl.info.memory;

    return {
        calls: render.calls,
        triangles: render.triangles,
        lines: render.lines,
        points: render.points,
        geometries: memory.geometries,
        textures: memory.textures,
    };
}

/**
 * Lightweight FPS + renderer stats overlay.
 *
 * The frame callback accumulates elapsed time and frame count. Every 500 ms it
 * converts frames/time into FPS and reads `renderer.info`, avoiding a React
 * state update on every frame.
 */
function PerformanceSystem({ active = false }) {
    const gl = useThree((state) => state.gl);
    const frameCount = useRef(0);
    const elapsed = useRef(0);
    const [fps, setFps] = useState(0);
    const [stats, setStats] = useState(() => readRenderStats(gl));

    useFrame((_, delta) => {
        if (!active) {
            return;
        }

        frameCount.current += 1;
        elapsed.current += delta;

        if (elapsed.current >= 0.5) {
            setFps(Math.round(frameCount.current / elapsed.current));
            setStats(readRenderStats(gl));
            frameCount.current = 0;
            elapsed.current = 0;
        }
    });

    if (!active) {
        return null;
    }

    return (
        <Html fullscreen zIndexRange={[60, 0]}>
            <section
                aria-label="Render performance statistics"
                style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    minWidth: 150,
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: 'rgba(8, 12, 16, 0.78)',
                    border: '1px solid rgba(135, 206, 235, 0.22)',
                    color: '#dff6ff',
                    fontFamily: 'Consolas, monospace',
                    fontSize: 11,
                    lineHeight: 1.45,
                    pointerEvents: 'none',
                }}
            >
                <div>FPS: {fps}</div>
                <div>Calls: {stats.calls}</div>
                <div>Tris: {stats.triangles}</div>
                <div>Lines: {stats.lines}</div>
                <div>Points: {stats.points}</div>
                <div>Geo: {stats.geometries}</div>
                <div>Tex: {stats.textures}</div>
            </section>
        </Html>
    );
}

export default PerformanceSystem;
