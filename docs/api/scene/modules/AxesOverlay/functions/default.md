[**cv-3d-portfolio**](../../../../README.md)

***

[cv-3d-portfolio](../../../../README.md) / [scene/modules/AxesOverlay](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Element` \| `null`

Defined in: src/scene/modules/AxesOverlay.jsx:27

Displays a local XYZ axes helper for the current narrative layer.

If `target` or `targetRef` is provided, the helper copies that object's
world matrix each frame, so the axes follow the layer's position, rotation,
and scale. If no target is provided, the helper renders at its parent origin.

## Parameters

### \_\_namedParameters

#### active?

`boolean` = `false`

#### size?

`number` = `1.5`

#### target?

`null` = `null`

#### targetRef?

`null` = `null`

## Returns

`Element` \| `null`
