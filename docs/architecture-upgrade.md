# Kien Truc He Thong Nang Cap CV 3D

## 1. Muc tieu

Du an hien tai la mot CV/portfolio 3D tuong tac dung React, Vite, Three.js, `@react-three/fiber` va `@react-three/drei`. Ban nang cap nen huong toi cac muc tieu sau:

- Bien CV 3D thanh mot san pham portfolio on dinh, de mo rong va de deploy.
- Tach ro du lieu CV, dieu khien scene 3D, UI overlay va asset pipeline.
- Cho phep them/sua/xoa cac moc nghe nghiep ma khong phai sua nhieu logic render.
- Cai thien hieu nang tai model GLB, kha nang responsive, loading va fallback.
- Chuan bi nen tang cho cac tinh nang nang cao nhu ngon ngu song ngu, routing, analytics va CMS nhe.

## 2. Hien trang

### 2.1 Stack

- Frontend: React 18 + Vite.
- 3D engine: Three.js, `@react-three/fiber`, `@react-three/drei`.
- Asset 3D: cac file `.glb` trong `public/models`.
- Deploy: GitHub Pages qua `gh-pages -d dist`.

### 2.2 Luong hien tai

```text
App.jsx
  -> SceneRoot.jsx
      -> Canvas
      -> MechanicalLayer / ArchitectureLayer / SoftwareLayer
      -> CameraRig
      -> Overlay UI:
          HeaderStatement
          NarrativePanel
          TimelineIndicator
          ScrollHint
          LoadingScreen
```

### 2.3 Van de can cai thien

- `SceneRoot.jsx` dang nam qua nhieu trach nhiem: canvas, lighting, camera, layer layout, UI overlay.
- Moi career stage dang gan cung thanh component rieng, kho mo rong khi them layer moi.
- UI inline style nhieu, kho tai su dung va kho dam bao responsive.
- Du lieu CV chua co schema ro rang, mot so text hien bi loi encoding.
- Chua co test, lint script, performance budget, hay tai lieu architecture chinh thuc.
- README van la README mau cua Vite, chua mo ta san pham.

## 3. Kien truc de xuat

```text
src/
  app/
    App.jsx
    AppProviders.jsx
  config/
    siteConfig.js
    sceneConfig.js
    routeConfig.js
  data/
    profile.js
    timeline.js
    cvSections.js
    schema.js
  scene/
    CanvasRoot.jsx
    SceneStage.jsx
    StageRenderer.jsx
    CameraRig.jsx
    LightingRig.jsx
    EnvironmentRig.jsx
    effects/
      ParticleField.jsx
    models/
      ModelAsset.jsx
      modelRegistry.js
  ui/
    layout/
      AppShell.jsx
      OverlayLayer.jsx
    profile/
      HeaderStatement.jsx
      ContactLinks.jsx
    timeline/
      TimelineIndicator.jsx
      TimelineControls.jsx
    narrative/
      NarrativePanel.jsx
      SectionRenderer.jsx
    common/
      LoadingScreen.jsx
      ErrorBoundary.jsx
      IconButton.jsx
  hooks/
    useTimelineNavigation.js
    useCameraController.js
    useMediaQuery.js
  styles/
    tokens.js
    global.css
```

## 4. Module chinh

### 4.1 App Layer

Trach nhiem:

- Khoi tao state cap ung dung.
- Quan ly active timeline index.
- Ket noi scene 3D va UI overlay.
- Bao loi bang `ErrorBoundary`.

De xuat:

```text
App
  -> AppProviders
  -> AppShell
      -> CanvasRoot
      -> OverlayLayer
```

### 4.2 Data Layer

Trach nhiem:

- Chua thong tin ca nhan, timeline, sections, links, skills va awards.
- Dinh nghia schema de validate du lieu.
- Ho tro chuyen sang CMS hoac JSON remote trong tuong lai.

De xuat data shape:

```js
{
  id: 'software',
  label: 'Software',
  title: 'Software Engineering & 3D Geometry Systems',
  period: '2023-Present',
  model: 'software',
  camera: {
    position: [7.2, 2.1, 4.2],
    lookAt: [10, 0, 0]
  },
  content: [
    {
      type: 'experience',
      title: 'Large-Scale 3D Systems & Parametric Geometry Engine',
      organization: 'Prima Solutions Vietnam',
      period: 'Sep 2024-Present',
      links: [],
      highlights: []
    }
  ]
}
```

Loi ich:

- `SceneRoot` khong can biet co bao nhieu stage.
- Timeline, camera va model co the render tu cung mot source of truth.
- De them ngon ngu `vi` / `en` bang cach tach text theo locale.

### 4.3 Scene Layer

Trach nhiem:

- Render `Canvas`.
- Render cac stage theo cau hinh.
- Dieu khien camera, lighting, environment va effects.

De xuat:

```text
CanvasRoot
  -> LightingRig
  -> EnvironmentRig
  -> StageRenderer
      -> SceneStage[]
          -> ModelAsset
  -> CameraRig
  -> ParticleField
```

`StageRenderer` nen nhan danh sach timeline:

```jsx
{stages.map((stage, index) => (
  <SceneStage
    key={stage.id}
    stage={stage}
    position={[index * LAYER_SPACING, 0, 0]}
    active={stage.id === activeStageId}
  />
))}
```

### 4.4 Camera System

Hien tai camera position va lookAt duoc suy luan tu toa do X. Nen doi sang camera config ro rang tren tung stage:

```js
camera: {
  position: [-2.8, 2.1, 4.2],
  lookAt: [0, 0, 0],
  fov: 50
}
```

Loi ich:

- Them stage moi khong can sua `if/else`.
- Camera co the custom theo tung model.
- Co the them animation preset: `orbit`, `dolly`, `hero`, `detail`.

### 4.5 Model Asset System

Tao `modelRegistry.js`:

```js
export const MODEL_REGISTRY = {
  mechanical: {
    path: 'models/liberty_ship.glb',
    scale: 40,
    inactiveScale: 38.4,
    rotationSpeed: 0.15
  },
  architecture: {
    path: 'models/architecture.glb',
    scale: 0.1,
    stageScale: 1,
    inactiveStageScale: 0.96,
    rotationSpeed: 0.15
  },
  software: {
    path: 'models/software.glb',
    scale: 0.1,
    stageScale: 1,
    inactiveStageScale: 0.96,
    rotationSpeed: 0.15
  }
};
```

`ModelAsset` chiu trach nhiem:

- Load GLB bang `useGLTF`.
- Clone material an toan.
- Bat shadow.
- Apply transform tu config.
- Hien fallback neu model loi.

### 4.6 UI Overlay

Trach nhiem:

- Header profile.
- Narrative panel.
- Timeline controls.
- Loading va scroll hint.

De xuat:

- Tach style token: color, spacing, radius, shadow, font size.
- Giam inline style trung lap.
- Them responsive layout:
  - Desktop: header ben phai, narrative ben trai, timeline o duoi.
  - Mobile: header compact, narrative dang bottom sheet, timeline sticky bottom.

### 4.7 Navigation

Thay `useTimelineScroll` bang `useTimelineNavigation`:

- Ho tro wheel.
- Ho tro keyboard: ArrowUp, ArrowDown, ArrowLeft, ArrowRight.
- Ho tro click timeline.
- Co debounce/throttle.
- Dong bo active index voi URL hash: `#mechanical`, `#architecture`, `#software`.

Loi ich:

- Co the share link toi tung stage.
- UX tot hon tren desktop va mobile.

## 5. Quan ly asset va performance

### 5.1 Asset pipeline

- Luu model goc o `assets/source-models` neu can, khong deploy.
- Luu model da optimize trong `public/models`.
- Nen nen GLB bang Draco hoac Meshopt neu dung duoc trong pipeline.
- Dat ten file co version khi model thay doi lon, vi GitHub Pages co cache.

### 5.2 Loading strategy

- Preload model cua active stage truoc.
- Lazy preload cac stage con lai sau khi first paint.
- Dung loading progress hien tai, nhung them error state neu GLB load that bai.

### 5.3 Performance budget

Muc tieu de xuat:

- Initial JS bundle duoi 500 KB gzip neu co the.
- Tong model tai lan dau duoi 8-12 MB sau optimize.
- FPS desktop >= 50.
- FPS mobile/tablet >= 30 hoac hien che do fallback.

### 5.4 Fallback

- Neu WebGL khong ho tro: hien CV 2D fallback.
- Neu thiet bi yeu: giam particle count, shadow quality, environment intensity.
- Neu model load loi: hien placeholder stage va van cho doc noi dung CV.

## 6. Chat luong va kiem thu

### 6.1 Scripts nen them

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "check": "npm run lint && npm run build"
  }
}
```

### 6.2 Test muc can co

- Build test: `npm run build`.
- Lint: `npm run lint`.
- Smoke test bang Playwright neu them sau:
  - Trang load khong blank.
  - Timeline co 3 stage.
  - Click/scroll doi active stage.
  - Link download CV dung.

### 6.3 Monitoring thu cong

- Kiem tra console khong co GLB load error.
- Kiem tra responsive o 375px, 768px, 1440px.
- Kiem tra GitHub Pages base path `/cv-3d-portfolio/`.

## 7. Lo trinh nang cap

### Phase 1: On dinh nen tang

- Sua README de mo ta dung du an.
- Them `docs/architecture-upgrade.md`.
- Them script `lint` va `check`.
- Sua encoding text trong `cvData.js` va UI.
- Xoa hoac an `console.log` trong camera controller.

### Phase 2: Tach module

- Tach `SceneRoot.jsx` thanh `CanvasRoot`, `LightingRig`, `StageRenderer`, `CameraRig`.
- Tao `modelRegistry.js`.
- Gop 3 model component thanh `ModelAsset`.
- Doi camera config sang data-driven.

### Phase 3: Cai thien UX

- Them keyboard navigation.
- Them URL hash cho stage.
- Lam responsive layout cho mobile.
- Them WebGL/model error fallback.

### Phase 4: Performance

- Optimize GLB.
- Lazy/preload model co chien luoc.
- Giam shadow va particle theo device capability.
- Them performance check thu cong vao quy trinh release.

### Phase 5: Noi dung va mo rong

- Ho tro song ngu Viet/Anh.
- Tach CV data sang JSON hoac CMS nhe.
- Them project case studies.
- Them trang fallback CV 2D de nha tuyen dung co the doc nhanh.

## 8. Ranh gioi trach nhiem

```text
Data
  -> Noi dung CV, timeline, profile, links, model/camera config

Scene
  -> Canvas, GLB, camera, lighting, effects, shadows

UI
  -> Overlay, timeline controls, narrative, loading, fallback

Hooks
  -> Navigation, camera animation, media/device capability

Config
  -> Base path, site metadata, scene constants, feature flags
```

## 9. Nguyen tac khi phat trien tiep

- Mot source of truth cho moi stage: title, content, model, camera, label.
- Khong hard-code logic theo `mechanical/architecture/software` trong scene neu co the dung config.
- UI van phai doc duoc khi model 3D loi.
- Moi thay doi scene nen chay `npm run build` va kiem tra browser.
- Giu deploy path tuong thich voi GitHub Pages bang `import.meta.env.BASE_URL`.

## 10. Ket qua mong doi sau nang cap

Sau khi refactor theo kien truc nay, du an se:

- De them stage moi nhu `projects`, `leadership`, `research`.
- De thay model 3D ma khong can sua core scene.
- Co trai nghiem tot hon tren mobile va desktop.
- Giam rui ro loi khi deploy GitHub Pages.
- Tro thanh mot portfolio 3D co nen tang ky thuat ro rang, thay vi chi la demo Three.js.
