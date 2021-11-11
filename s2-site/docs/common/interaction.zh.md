---
title: 交互
order: 5
---


## Interaction

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| :-- | :-- | :-: | :-- | --- |
| linkFields | `string[]` |  |  | 标记字段为链接样式，用于外链跳转 |
| selectedCellsSpotlight | `boolean` |   | `false` | 是否开启选中高亮聚光灯效果 |
| hoverHighlight | `boolean` |   | `true` | 鼠标悬停时高亮当前单元格，以及所对应的行头，列头 |
| hiddenColumnFields | `string[]` |  |  | 隐藏列 （明细表有效） |
| enableCopy | `boolean` |   | `false` | 是否允许复制 |
| copyWithFormat | `boolean` |   | `false` | 是否使用 field format 格式复制 |
| customInteractions | [CustomInteraction[]](#custominteraction) |   |  | 自定义交互 |
| scrollSpeedRatio | [ScrollRatio](/zh/docs/api/general/S2Options#scrollratio)|  | |  用于控制滚动速率，分水平和垂直两个方向，默认为 1 |
| autoResetSheetStyle | `boolean` | | `true` |  用于控制点击表格外区域和按下 esc 键时是否重置交互状态 |

### CustomInteraction

功能描述：自定义交互，继承 baseEvent:  [具体例子](/zh/docs/manual/advanced/interaction/custom)

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: |  --- | --- |
| key | `string` | ✓ |   | 交互的唯一标识 |
| interaction | [InteractionConstructor](#InteractionConstructor) | ✓ |  |  | 自定义交互类 |

### ScrollRatio

```js
interface ScrollRatio {
  horizontal?: number; // 水平滚动速率，默认为 1
  vertical?: number; // 垂直滚动速率，默认为 1
}
```
