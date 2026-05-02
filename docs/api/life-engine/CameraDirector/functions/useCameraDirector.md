[**cv-3d-portfolio**](../../../README.md)

***

[cv-3d-portfolio](../../../README.md) / [life-engine/CameraDirector](../README.md) / useCameraDirector

# Function: useCameraDirector()

> **useCameraDirector**(`options?`): `object`

Defined in: [src/life-engine/CameraDirector.js:84](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/CameraDirector.js#L84)

R3F camera director hook.

The hook owns transition state in refs, updates via `useFrame`, and always
starts interrupted transitions from the camera's current interpolated state.

## Parameters

### options?

Director options.

#### controlsRef

`object`

React ref for OrbitControls.

#### locked

`boolean` = `true`

Whether OrbitControls should be locked.

#### preset

`object` = `null`

Optional preset to apply reactively.

## Returns

`object`

Camera director API.
