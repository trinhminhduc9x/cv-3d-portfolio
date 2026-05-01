[**cv-3d-portfolio**](../../../../README.md)

***

[cv-3d-portfolio](../../../../README.md) / [scene/modules/FrustumVisualizer](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Element`

Defined in: src/scene/modules/FrustumVisualizer.jsx:13

Renders a CameraHelper for the current view camera or a supplied camera.

A camera frustum is the truncated pyramid that represents what the camera
can see. CameraHelper derives its line geometry from the camera projection
matrix, so it must be updated whenever the camera moves or its FOV changes.

## Parameters

### \_\_namedParameters

#### active?

`boolean` = `false`

#### camera?

`null` = `null`

#### cameraRef?

`null` = `null`

## Returns

`Element`
