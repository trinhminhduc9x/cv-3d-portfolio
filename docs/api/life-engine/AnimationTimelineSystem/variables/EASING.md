[**cv-3d-portfolio**](../../../README.md)

***

[cv-3d-portfolio](../../../README.md) / [life-engine/AnimationTimelineSystem](../README.md) / EASING

# Variable: EASING

> `const` **EASING**: `object`

Defined in: [src/life-engine/AnimationTimelineSystem.js:48](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L48)

## Type Declaration

### cubicInOut

> **cubicInOut**: (`t`) => `number`

Cubic ease-in-out curve.

#### Parameters

##### t

`number`

Normalized progress.

#### Returns

`number`

Eased progress.

### expoOut

> **expoOut**: (`t`) => `number`

Exponential ease-out curve.

#### Parameters

##### t

`number`

Normalized progress.

#### Returns

`number`

Eased progress.

### linear

> **linear**: (`value`) => `number` = `clamp01`

Clamps a number to the normalized timeline range.

#### Parameters

##### value

`number`

Input value.

#### Returns

`number`

Value clamped between 0 and 1.

### quadInOut

> **quadInOut**: (`t`) => `number`

Quadratic ease-in-out curve.

#### Parameters

##### t

`number`

Normalized progress.

#### Returns

`number`

Eased progress.
