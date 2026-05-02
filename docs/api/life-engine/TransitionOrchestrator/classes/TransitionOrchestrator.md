[**cv-3d-portfolio**](../../../README.md)

***

[cv-3d-portfolio](../../../README.md) / [life-engine/TransitionOrchestrator](../README.md) / TransitionOrchestrator

# Class: TransitionOrchestrator

Defined in: [src/life-engine/TransitionOrchestrator.js:270](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L270)

Coordinates interrupt-safe chapter transitions through AnimationTimelineSystem.

## Constructors

### Constructor

> **new TransitionOrchestrator**(`options?`): `TransitionOrchestrator`

Defined in: [src/life-engine/TransitionOrchestrator.js:278](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L278)

#### Parameters

##### options?

Orchestrator options.

###### onComplete

(`payload`) => `void` = `...`

Completion callback.

###### onFogChange

(`fog`) => `void` = `...`

Fog hook callback.

###### onKeyframe

(`payload`) => `void` = `...`

Keyframe callback.

###### onUpdate

(`state`) => `void` = `...`

Per-frame transition callback.

#### Returns

`TransitionOrchestrator`

## Properties

### activeTransition

> **activeTransition**: \{ `duration`: `number`; `fromChapter`: `object`; `profile`: `any`; `toChapter`: `object`; `token`: `number`; \} \| `null`

Defined in: [src/life-engine/TransitionOrchestrator.js:289](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L289)

***

### isTransitioning

> **isTransitioning**: `boolean`

Defined in: [src/life-engine/TransitionOrchestrator.js:291](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L291)

***

### onComplete

> **onComplete**: (`payload`) => `void`

Defined in: [src/life-engine/TransitionOrchestrator.js:285](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L285)

#### Parameters

##### payload

`object`

#### Returns

`void`

***

### onFogChange

> **onFogChange**: (`fog`) => `void`

Defined in: [src/life-engine/TransitionOrchestrator.js:287](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L287)

#### Parameters

##### fog

`object`

#### Returns

`void`

***

### onKeyframe

> **onKeyframe**: (`payload`) => `void`

Defined in: [src/life-engine/TransitionOrchestrator.js:286](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L286)

#### Parameters

##### payload

`object`

#### Returns

`void`

***

### onUpdate

> **onUpdate**: (`state`) => `void`

Defined in: [src/life-engine/TransitionOrchestrator.js:284](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L284)

#### Parameters

##### state

`object`

#### Returns

`void`

***

### timeline

> **timeline**: [`AnimationTimelineSystem`](../../AnimationTimelineSystem/classes/AnimationTimelineSystem.md) \| `null`

Defined in: [src/life-engine/TransitionOrchestrator.js:288](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L288)

***

### transitionToken

> **transitionToken**: `number`

Defined in: [src/life-engine/TransitionOrchestrator.js:290](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L290)

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [src/life-engine/TransitionOrchestrator.js:413](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L413)

Releases all internal transition references.

#### Returns

`void`

***

### getChapterState()

> **getChapterState**(`chapter`): `object`

Defined in: [src/life-engine/TransitionOrchestrator.js:427](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L427)

Returns a static visual state for a chapter with all fields resolved.

#### Parameters

##### chapter

`object`

Chapter config.

#### Returns

`object`

Visual state.

***

### playTransition()

> **playTransition**(`fromChapter`, `toChapter`): `object`

Defined in: [src/life-engine/TransitionOrchestrator.js:302](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L302)

Plays an interrupt-safe transition between chapters.
Each call increments transitionToken, invalidating any in-flight callbacks.

#### Parameters

##### fromChapter

`object`

Source chapter.

##### toChapter

`object`

Target chapter.

#### Returns

`object`

Transition metadata.

***

### stop()

> **stop**(): `void`

Defined in: [src/life-engine/TransitionOrchestrator.js:399](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L399)

Stops the active transition and invalidates pending callbacks.

#### Returns

`void`

***

### update()

> **update**(`delta`): `object` \| `null`

Defined in: [src/life-engine/TransitionOrchestrator.js:388](https://github.com/trinhminhduc9x/cv-3d-portfolio/blob/8ef3842b2deed0b5bbf22894a612c1dc8aed0901/src/life-engine/TransitionOrchestrator.js#L388)

Advances the active transition timeline.

#### Parameters

##### delta

`number`

Frame delta in seconds.

#### Returns

`object` \| `null`

Timeline state.
