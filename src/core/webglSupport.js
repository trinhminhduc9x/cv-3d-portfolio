import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';

export { WEBGL };

export function isWebGLSupported() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false;
    }

    return WEBGL.isWebGLAvailable();
}

export function initializeShaderChunks() {
    const { ShaderChunk } = THREE;

    if (!ShaderChunk.colorspace_pars_fragment && ShaderChunk.encodings_pars_fragment) {
        ShaderChunk.colorspace_pars_fragment = ShaderChunk.encodings_pars_fragment;
    }

    if (!ShaderChunk.colorspace_fragment) {
        ShaderChunk.colorspace_fragment = ShaderChunk.encodings_fragment
            || 'gl_FragColor = linearToOutputTexel( gl_FragColor );';
    }

    return true;
}
