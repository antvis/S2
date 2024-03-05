---
title: 交互
order: 5
---

## Interaction

功能描述：交互配置。查看 [文档](/manual/advanced/interaction/basic) 和 [示例](/examples/interaction/basic/#hover)

| 参数    | 说明                                                                                                                                                                  | 类型                                                                                                        | 默认值   |        必选        |
| -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------| -------- | ---------------- |
| linkFields  | 标记字段为链接样式，用于外链跳转                                                                                                                                                    | `string[]` \| (meta: [Node](/docs/api/basic-class/node) \| ViewMeta) => boolean                           |    |    |
| selectedCellsSpotlight               | 是否开启选中高亮聚光灯效果                                                                                                                                                       | `boolean`                                                                                                 | `false`      |                  |
| hoverHighlight                       | 鼠标悬停时高亮当前单元格，以及所对应的行头，列头                                                                                                                                            | `boolean`                                                                                                 | `true`                                                |                  |
| hoverFocus                           | 鼠标悬停在当前单元格超过默认 800ms 后，保持当前高亮，显示 tooltip，悬停时间通过设置 `duration` 来控制                                                                                                    | `boolean  \| {duration: number}`                                                                          |      `true`      |       |
| hiddenColumnFields                   | 用于配置默认隐藏的列，透视表需要配置列头唯一 id, 明细表配置列头 field 字段即可                                                                                                                       | `string[]`                                                                                                |                                                       |                  |
| copy                   | 单元格复制配置  | [Copy](#copy)         |         |                  |
| customInteractions                   | 自定义交互 [详情](/docs/manual/advanced/interaction/custom)                                                                                                                | [CustomInteraction[]](#custominteraction)                                                                 |                                                       |                  |
| scrollSpeedRatio                     | 用于控制滚动速率，分水平和垂直两个方向，默认为 1                                                                                                                                           | [ScrollSpeedRatio](#scrollspeedratio)                                                                     |                                                       |                  |
| autoResetSheetStyle                  | 用于控制点击表格外区域和按下 esc 键时是否重置交互状态                                                                                                                                       | `boolean`                                                                                                 | `true`                                                |                  |
| resize                               | 用于控制 resize 热区是否显示                                                                                                                                                  | `boolean`  \| [ResizeInteractionOptions](#resizeinteractionoptions)                                       |      `true`      |       |
| brushSelection         | 是否允许单元格（包含行头，列头，数值单元格）刷选。行头，列头刷选只支持透视表                                                                                                                              | `boolean` \|  [BrushSelection](#brushSelection)                                                           | `true`                         |     |  1.29.0 后支持 [BrushSelection](#brushSelection)   |
| multiSelection                       | 是否允许多选 （包含行头，列头，数值单元格）                                                                                                                                              | `boolean`                                                                                                 | `true`                                                |                  |
| rangeSelection                       | 是否允许区间快捷多选                                                                                                                                                          | `boolean`                                                                                                 | `true`                                                |                  |
| scrollbarPosition                    | 用于控制滚动条展示在内容区边缘还是画布边缘                                                                                                                                               | `content \| canvas`                                                                                       |    `content`     |   |
| eventListenerOptions                 | 事件监听函数 `addEventListener` 的 [可选项配置](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener), 可控制事件从冒泡阶段还是捕获阶段触发                              | `false`                                                                                                   |                                           |
| selectedCellHighlight                | 选中数值单元格后的行列高亮联动<br/>rowHeader：选中数值单元格后高亮对应行头 <br/> colHeader：选中数值单元格后高亮对应列头 <br/> currentRow：选中数值单元格后高亮整行 <br/> currentCol：选中数值单元格后高亮整列 <br/>true：同 { rowHeader: true, colHeader: true, currentRow: true, currentCol: true } | `boolean \| { rowHeader?: boolean, colHeader?: boolean, currentRow?: boolean, currentCol?: boolean }`     |  `false`   |                  |
| overscrollBehavior                   | 控制滚动至边界的行为，可禁用浏览器的默认滚动行为。[详情](/docs/manual/advanced/interaction/basic/#修改滚动至边界行为)                                                                                   | `auto \| contain \| none \| null`                                                                         |  `auto` |

### Copy

功能描述：单元格复制。查看 [文档](/manual/advanced/interaction/copy) 和 [示例](/examples/interaction/basic/#copy-export)

| 参数        | 说明           | 类型     | 默认值 | 必选  |
| ----------- | -------------- | ------------------------------------------------- | ------ | --- |
| enable | 是否允许复制       | `boolean`          | `true`  |     |
| withFormat   | 是否使用 [s2DataConfig](/api/general/s2-data-config#meta) 的 `formatter` 格式复制数据      | `boolean`      | `true`            |    |
| withHeader  | 复制数据是否带表头信息    | `boolean`  | `false`              |   |
| customTransformer  | 复制时支持自定义 (transformer) 数据格式化方法    | (transformer: [Transformer](/docs/api/components/export#transformer)) => `Partial<Transformer>` | `transformer` |      |

### CustomInteraction

功能描述：自定义交互，继承 BaseEvent:  [查看示例](/docs/manual/advanced/interaction/custom)

| 参数        | 说明           | 类型                                              | 默认值 | 必选  |
| ----------- | -------------- | ------------------------------------------------- | ------ | --- |
| key         | 交互的唯一标识 | `string`                                          |        |   ✓   |
| interaction |  交互实例             | [InteractionConstructor](/docs/api/basic-class/interaction#interactionconstructor) |        |   ✓   |

### ScrollSpeedRatio

功能描述：滚动速率配置。[查看示例](/examples/interaction/advanced/#scroll-speed-ratio)

```js
interface ScrollSpeedRatio {
  horizontal?: number; // 水平滚动速率，默认为 1
  vertical?: number; // 垂直滚动速率，默认为 1
}
```

### ResizeInteractionOptions

功能描述：宽高调整配置。[查看示例](/examples/interaction/advanced/#resize-active)

| 参数                 | 说明     | 类型    | 默认值 | 必选  |
| -------------------- | ------- | ----------------- | ------ | --- |
| rowCellVertical      | 是否开启行头垂直方向 resize 热区                                                   | `boolean`         | true   |       |
| cornerCellHorizontal | 是否开启角头水平方向 resize 热区                                                   | `boolean`         | true   |       |
| colCellHorizontal    | 是否开启列头水平方向 resize 热区                                                   | `boolean`         | true   |       |
| colCellVertical      | 是否开启列头垂直方向 resize 热区 （列头隐藏时该配置无效）                                                   | `boolean`         | true   |       |
| rowResizeType        | 用于控制行高 resize 时的生效范围 <br/> 1. `all`: 对所有单元格生效，2. `current`: 对当前单元格生效，3. `selected`: 对当前单元格生效，如果单元格是多选状态，调整任意选中单元格，对所有选中的生效。| `all`\| `current` \| `selected` | `current`  |       |
| colResizeType        | 用于控制列宽 resize 时的生效范围 <br/> 1. `all`: 对所有单元格生效，2. `current`: 对当前单元格生效，3. `selected`: 对当前单元格生效，如果单元格是多选状态，调整任意选中单元格，对所有选中的生效。| `all`\| `current` \| `selected` | `current`  |       |
| disable        | 用于控制行高 resize 是否生效。[查看示例](/examples/interaction/advanced/#resize-disable) | (resizeInfo: [S2CellType](/docs/api/components/sheet-component#resizeinfo)) => boolean |   |       |
| visible        | 自定义当前单元格是否显示 resize 热区 | (cell: [S2CellType](/docs/api/basic-class/base-cell)) => boolean |   |       |
| minCellWidth  | 单元格可拖拽最小宽度            | `number`|  20       |      |
| minCellHeight  | 单元格可拖拽最小高度        | `number` | 20        |      |

### brushSelection

功能描述：单元格刷选配置。[查看示例](/examples/interaction/basic/#brush-selection)

| 参数              | 说明                  | 类型              | 默认值   | 必选  |
| ----------------- | --------------------- | ----------------- | ------- | --- |
| dataCell            | 是否允许数值单元格刷选         | `boolean`         | true  |       |
| rowCell             | 是否允许行头单元格刷选（仅支持透视表） | `boolean`         | false |       |
| colCell             | 是否允许列头单元格刷选 | `boolean`         | false |       |
