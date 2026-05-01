import * as THREE from 'three';

import { initializeShaderChunks } from '../../src/core/webglSupport.js';

describe('webglSupport', () => {
    const originalColorspaceFragment = THREE.ShaderChunk.colorspace_fragment;
    const originalColorspaceParsFragment = THREE.ShaderChunk.colorspace_pars_fragment;

    afterAll(() => {
        if (originalColorspaceFragment === undefined) {
            delete THREE.ShaderChunk.colorspace_fragment;
        } else {
            THREE.ShaderChunk.colorspace_fragment = originalColorspaceFragment;
        }

        if (originalColorspaceParsFragment === undefined) {
            delete THREE.ShaderChunk.colorspace_pars_fragment;
        } else {
            THREE.ShaderChunk.colorspace_pars_fragment = originalColorspaceParsFragment;
        }
    });

    test('aliases newer colorspace shader chunks to legacy encodings chunks', () => {
        delete THREE.ShaderChunk.colorspace_fragment;
        delete THREE.ShaderChunk.colorspace_pars_fragment;

        initializeShaderChunks();

        expect(THREE.ShaderChunk.colorspace_fragment).toBe(THREE.ShaderChunk.encodings_fragment);
        expect(THREE.ShaderChunk.colorspace_pars_fragment).toBe(THREE.ShaderChunk.encodings_pars_fragment);
    });
});
