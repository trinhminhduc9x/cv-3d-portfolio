/* eslint-disable react/prop-types, react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import CameraSystem from '../camera/CameraSystem';
import LayerManager from '../layers/LayerManager';
import PerformanceSystem from '../performance/PerformanceSystem';
import { usePerformanceProfile } from '../performance/usePerformanceProfile';
import EnvironmentSystem from './EnvironmentSystem';
import LightingSystem from './LightingSystem';
import {
    CANVAS_CAMERA,
    CANVAS_STYLE,
    FOG_CONFIG,
    GL_CONFIG,
    SCENE_BACKGROUND,
} from './RenderConfig';

// TODO: Keep SceneCore free of CV/business logic; accept state/config via props only.
function SceneCore({ activeLayerId, layers, cameraPreset }) {
    const performanceProfile = usePerformanceProfile();

    return (
        <Canvas
            aria-label="Interactive 3D career portfolio"
            role="img"
            camera={CANVAS_CAMERA}
            style={CANVAS_STYLE}
            dpr={[1, performanceProfile.maxDevicePixelRatio]}
            shadows
            gl={GL_CONFIG}
        >
            <color attach="background" args={[SCENE_BACKGROUND]} />
            <fog attach="fog" args={[FOG_CONFIG.color, FOG_CONFIG.near, FOG_CONFIG.far]} />

            <LightingSystem shadowMapSize={performanceProfile.shadowMapSize} />
            <EnvironmentSystem />
            <LayerManager
                activeLayerId={activeLayerId}
                layers={layers}
                unloadDelay={performanceProfile.lazyUnloadDelay}
            />
            <CameraSystem preset={cameraPreset} />
            <PerformanceSystem active={performanceProfile.showRenderStats} />

            <OrbitControls enableRotate enableZoom enablePan enableDamping dampingFactor={0.05} />
        </Canvas>
    );
}

export default SceneCore;
