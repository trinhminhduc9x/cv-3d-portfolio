[**cv-3d-portfolio**](../../../../README.md)

***

[cv-3d-portfolio](../../../../README.md) / [scene/performance/PerformanceSystem](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Element` \| `null`

Defined in: src/scene/performance/PerformanceSystem.jsx:27

Lightweight FPS + renderer stats overlay.

The frame callback accumulates elapsed time and frame count. Every 500 ms it
converts frames/time into FPS and reads `renderer.info`, avoiding a React
state update on every frame.

## Parameters

### \_\_namedParameters

#### active?

`boolean` = `false`

## Returns

`Element` \| `null`
