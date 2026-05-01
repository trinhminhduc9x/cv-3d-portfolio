[**cv-3d-portfolio**](../../../../README.md)

***

[cv-3d-portfolio](../../../../README.md) / [scene/modules/BoundingBoxOverlay](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Element`

Defined in: src/scene/modules/BoundingBoxOverlay.jsx:16

Computes an axis-aligned world-space bounding box for a target Object3D.

Box3.setFromObject walks all visible descendants and expands the bounds in
world space. Box3Helper then renders that min/max volume as a wireframe box.

## Parameters

### \_\_namedParameters

#### active?

`boolean` = `false`

#### color?

`string` = `'#87ceeb'`

#### target?

`null` = `null`

#### targetRef?

`null` = `null`

## Returns

`Element`
