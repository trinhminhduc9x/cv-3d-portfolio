[**cv-3d-portfolio**](../../../README.md)

***

[cv-3d-portfolio](../../../README.md) / [life-engine/AnimationTimelineSystem](../README.md) / AnimationTimelineSystem

# Class: AnimationTimelineSystem

Defined in: [src/life-engine/AnimationTimelineSystem.js:58](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L58)

Normalized animation timeline for cinematic sequencing.

## Constructors

### Constructor

> **new AnimationTimelineSystem**(`duration?`, `options?`): `AnimationTimelineSystem`

Defined in: [src/life-engine/AnimationTimelineSystem.js:66](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L66)

#### Parameters

##### duration?

`number` = `1`

Timeline duration in seconds.

##### options?

Timeline options.

###### easing

(`t`) => `number`

Easing function.

###### onComplete

(`state`) => `void`

Completion callback.

###### onUpdate

(`state`) => `void`

Per-frame update callback.

#### Returns

`AnimationTimelineSystem`

## Properties

### clock

> **clock**: `number`

Defined in: [src/life-engine/AnimationTimelineSystem.js:71](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L71)

***

### duration

> **duration**: `number`

Defined in: [src/life-engine/AnimationTimelineSystem.js:67](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L67)

***

### easing

> **easing**: (`t`) => `number`

Defined in: [src/life-engine/AnimationTimelineSystem.js:68](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L68)

#### Parameters

##### t

`number`

#### Returns

`number`

***

### firedKeyframes

> **firedKeyframes**: `Set`\<`any`\>

Defined in: [src/life-engine/AnimationTimelineSystem.js:75](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L75)

***

### isComplete

> **isComplete**: `boolean`

Defined in: [src/life-engine/AnimationTimelineSystem.js:73](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L73)

***

### isPlaying

> **isPlaying**: `boolean`

Defined in: [src/life-engine/AnimationTimelineSystem.js:72](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L72)

***

### keyframes

> **keyframes**: `any`[]

Defined in: [src/life-engine/AnimationTimelineSystem.js:74](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L74)

***

### onComplete

> **onComplete**: (`state`) => `void`

Defined in: [src/life-engine/AnimationTimelineSystem.js:70](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L70)

#### Parameters

##### state

`object`

#### Returns

`void`

***

### onUpdate

> **onUpdate**: (`state`) => `void`

Defined in: [src/life-engine/AnimationTimelineSystem.js:69](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L69)

#### Parameters

##### state

`object`

#### Returns

`void`

## Accessors

### normalized

#### Get Signature

> **get** **normalized**(): `number`

Defined in: [src/life-engine/AnimationTimelineSystem.js:177](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L177)

Returns normalized progress from 0 to 1.

##### Returns

`number`

Normalized progress.

***

### playing

#### Get Signature

> **get** **playing**(): `boolean`

Defined in: [src/life-engine/AnimationTimelineSystem.js:205](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L205)

Backward-compatible playing getter.

##### Returns

`boolean`

Whether the timeline is playing.

***

### progress

#### Get Signature

> **get** **progress**(): `number`

Defined in: [src/life-engine/AnimationTimelineSystem.js:196](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L196)

Backward-compatible progress getter.

##### Returns

`number`

Normalized progress.

## Methods

### play()

> **play**(): `AnimationTimelineSystem`

Defined in: [src/life-engine/AnimationTimelineSystem.js:100](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L100)

Starts timeline playback from the current clock.

#### Returns

`AnimationTimelineSystem`

This timeline.

***

### registerKeyframe()

> **registerKeyframe**(`timeNormalized`, `callback`): `AnimationTimelineSystem`

Defined in: [src/life-engine/AnimationTimelineSystem.js:85](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L85)

Registers a keyframe callback at normalized time.

#### Parameters

##### timeNormalized

`number`

Keyframe time between 0 and 1.

##### callback

(`state`) => `void`

Callback invoked when reached.

#### Returns

`AnimationTimelineSystem`

This timeline.

***

### reset()

> **reset**(): `AnimationTimelineSystem`

Defined in: [src/life-engine/AnimationTimelineSystem.js:121](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L121)

Resets timeline state to the beginning.

#### Returns

`AnimationTimelineSystem`

This timeline.

***

### start()

> **start**(): `AnimationTimelineSystem`

Defined in: [src/life-engine/AnimationTimelineSystem.js:186](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L186)

Backward-compatible alias for old callers.

#### Returns

`AnimationTimelineSystem`

This timeline.

***

### stop()

> **stop**(): `AnimationTimelineSystem`

Defined in: [src/life-engine/AnimationTimelineSystem.js:111](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L111)

Stops timeline playback.

#### Returns

`AnimationTimelineSystem`

This timeline.

***

### update()

> **update**(`delta`): `object`

Defined in: [src/life-engine/AnimationTimelineSystem.js:135](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/AnimationTimelineSystem.js#L135)

Updates internal clock and invokes due callbacks.

#### Parameters

##### delta

`number`

Delta time in seconds.

#### Returns

`object`

Timeline state.
