import SceneRoot from './scene/SceneRoot';
import { isWebGLSupported } from './core/webglSupport';
import WebGLFallback from './ui/WebGLFallback';

function App() {
    if (!isWebGLSupported()) {
        return <WebGLFallback />;
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <SceneRoot />
        </div>
    );
}

export default App;
