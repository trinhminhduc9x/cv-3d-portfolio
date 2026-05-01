[**cv-3d-portfolio**](../../../../README.md)

***

[cv-3d-portfolio](../../../../README.md) / [scene/modules/BVHVisualizer](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Element` \| `null`

Defined in: src/scene/modules/BVHVisualizer.jsx:40

Visualizes the bounding volume hierarchy for a selected mesh.

three-mesh-bvh stores a tree of nested bounding boxes on
`geometry.boundsTree`. The visualizer renders boxes at the requested depth,
making it useful for debugging raycast and spatial-query acceleration.

## Parameters

### \_\_namedParameters

#### active?

`boolean` = `false`

#### bvhOptions?

`undefined` = `undefined`

#### color?

`string` = `'#00ff88'`

#### depth?

`number` = `8`

#### displayEdges?

`boolean` = `true`

#### displayParents?

`boolean` = `false`

#### disposeGeneratedTreeOnUnmount?

`boolean` = `false`

#### mesh?

`null` = `null`

#### meshRef?

`null` = `null`

#### opacity?

`number` = `0.35`

#### target?

`null` = `null`

#### targetRef?

`null` = `null`

## Returns

`Element` \| `null`
