---
title: BaseBBox
order: 9

---

Description: Bounding box model. [Details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/bbox/base-bbox.ts)

```ts
bbox.x
```

| Name | Description | Type |
| --- | --- | --- |
| facet | The current visible rendering area | [BaseFacet](/api/basic-class/base-facet) |
| spreadsheet | The spreadsheet instance | [SpreadSheet](/api/basic-class/spreadsheet) |
| layoutResult | Layout information | [LayoutResult](/api/basic-class/base-facet#layoutresult) |
| x | The x-coordinate | `number` |
| y | The y-coordinate | `number` |
| minX | The minimum x-coordinate | `number` |
| minY | The minimum y-coordinate | `number` |
| maxX | The maximum x-coordinate | `number` |
| maxY | The maximum y-coordinate | `number` |
| width | The width of the bounding box | `number` |
| height | The height of the bounding box | `number` |
| originalWidth | The original width before clipping | `number` |
| originalHeight | The original height before clipping | `number` |
| viewportWidth | The width of the viewport, which may be smaller than the width of the bounding box when there is less data | `number` |
| viewportHeight | The height of the viewport, which may be smaller than the height of the bounding box when there is less data | `number` |
| calculateBBox | Calculates the bounding box | () => void |
