[**cv-3d-portfolio**](../../../../README.md)

***

[cv-3d-portfolio](../../../../README.md) / [scene/modules/WireframeToggle](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `null`

Defined in: src/scene/modules/WireframeToggle.jsx:24

Toggles wireframe rendering for every mesh material under a root Object3D.

Previous material wireframe values are stored before mutation and restored
when `active` becomes false or the component unmounts. This keeps the module
safe for debugging narrative states without permanently changing materials.

## Parameters

### \_\_namedParameters

#### active?

`boolean` = `false`

#### target?

`null` = `null`

#### targetRef?

`null` = `null`

#### watchDynamicMeshes?

`boolean` = `true`

## Returns

`null`
