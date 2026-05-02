[**cv-3d-portfolio**](../../../../README.md)

***

[cv-3d-portfolio](../../../../README.md) / [scene/performance/LazyLayerMount](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `any`

Defined in: [src/scene/performance/LazyLayerMount.jsx:9](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/scene/performance/LazyLayerMount.jsx#L9)

Keeps the active layer mounted and unloads inactive layers after a short
delay. This lowers GPU memory pressure on mobile without cutting off the
layer immediately during camera or UI transitions.

## Parameters

### \_\_namedParameters

#### active

`any`

#### children

`any`

#### unloadDelay?

`number` = `1000`

## Returns

`any`
