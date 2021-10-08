---
title: 交互
order: 5
---

## Interaction

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| :-- | :-- | :-: | :-- | :-- | :-- | --- |
| linkFields | `string[]` |  |  |  | 标记字段为链接样式，用于外链跳转 |
| selectedCellsSpotlight | `boolean` |  |  | `true` | 是否开启选中高亮聚光灯效果 |
| hoverHighlight | `boolean` |  |  | `true` | 鼠标悬停时高亮当前单元格，以及所对应的行头，列头 |
| hiddenColumnFields | `string[]` |  |  |  | 隐藏列 （明细表有效） |
| enableCopy | `boolean` |  |  | `false` | 是否允许复制 |
| customInteractions | [CustomInteraction[]](#custominteraction) |  |  |  | 自定义交互 |

### CustomInteraction

功能描述：自定义交互, 继承 baseEvent:  [具体例子](/zh/docs/manual/advanced/interaction/custom)

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- | --- |
| key | `string` | ✓ |  |  | 交互的唯一标识 |
| interaction | [InteractionConstructor](#InteractionConstructor) | ✓ |  |  | 自定义交互类 |

```ts
export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
  interaction: RootInteraction,
) => BaseEvent;

```

### BaseEvent

```ts
export abstract class BaseEvent {
  public spreadsheet: SpreadSheet;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  public abstract bindEvents(): void;
}
```
