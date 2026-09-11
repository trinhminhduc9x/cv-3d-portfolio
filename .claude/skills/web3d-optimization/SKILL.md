---
name: web3d-optimization
description: "Procedure for auditing WebGL/Three.js memory usage, optimizing GLB models with Draco compression, checking draw calls in React Three Fiber, and updating visual regression testing baselines."
argument-hint: "[model-path | audit | visual-update]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash, Edit
model: sonnet
agent: technical-artist
---

# Web 3D Asset & Performance Optimization Skill

Step-by-step procedures for optimizing 3D assets, auditing R3F scene performance, preventing memory leaks, and managing visual regression tests in the `cv-3d-portfolio` project.

---

## 1. 3D Model Optimization Pipeline

When adding or updating `.glb` models in `public/models/`:

1. **Verify Asset Size**: Keep GLB files ideally under 5MB each.
2. **Apply Draco Compression**:
   ```bash
   npx gltf-pipeline -i public/models/your_model.glb -o public/models/your_model.glb -d
   ```
3. **Generate Component Draft (Optional)**:
   ```bash
   npx gltfjsx public/models/your_model.glb --transform
   ```
4. **Register Model**: Update `src/scene/models/modelRegistry.js` with model path, default scale, rotation, and camera focus offset. Ask before writing.

---

## 2. Memory Leak Audit Procedure

To verify proper GPU memory cleanup on layer unmount:

1. In R3F components, check `useEffect` cleanup return functions.
2. Ensure geometries and cloned materials call `.dispose()`:
   ```javascript
   useEffect(() => {
     return () => {
       geometry.dispose();
       if (Array.isArray(material)) {
         material.forEach((m) => m.dispose());
       } else {
         material.dispose();
       }
     };
   }, [geometry, material]);
   ```
3. Inspect `renderer.info.memory` (geometries, textures) during chapter transitions to ensure counts return to baseline after `lazyUnloadDelay`.

---

## 3. Visual Regression Test Maintenance

When updating lighting moods, camera angles, or chapter transitions:

1. Install browser binary if needed: `npm run test:visual:install-browser`
2. Run visual tests: `npm run test:visual`
3. If visual changes were intentional, ask the user before updating baselines:
   ```bash
   UPDATE_VISUAL_BASELINES=1 npm run test:visual
   ```
4. Verify screenshots in `test-results/visual` match expected design.

---

## Next Steps

After optimizing a model or fixing a leak, run `/code-review` on the touched files, and `npm run check` before considering the work done.
