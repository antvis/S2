---
title: BaseBBox
order: 9
tag: New
---

功能描述：盒模型。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/bbox/baseBBox.ts)

```ts
bbox.x
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| facet | 当前可视渲染区域 | [BaseFacet](/api/basic-class/base-facet) |
| spreadsheet | 表格实例 | [SpreadSheet](/api/basic-class/spreadsheet) |
| layoutResult | 布局信息 | [LayoutResult](/api/basic-class/base-facet#layoutresult) |
| x | x 坐标 | `number` |
| y | y 坐标 | `number` |
| minX | 最小 x 坐标  | `number` |
| minY | 最小 y 坐标  | `number` |
| maxX | 最大 x 坐标  | `number` |
| maxY | 最大 y 坐标 | `number` |
| width | 宽度 | `number` |
| height | 高度 | `number` |
| originalWidth | 未裁剪时的原始宽度 | `number` |
| originalHeight | 未裁剪时的原始高度 | `number` |
| viewportWidth | 视口宽度，数据少时可能小于 bbox 的宽 | `number` |
| viewportHeight | 视口高度，数据少时可能小于 bbox 的高 | `number` |
| calculateBBox | 计算盒模型 | () => void |
