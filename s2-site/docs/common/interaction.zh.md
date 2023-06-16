---
title: 交互
order: 5
---

## Interaction

| 参数    | 说明   | 类型                                        | 默认值   |        必选        |
| -------- | ----------- |-------------------------------------------| -------- | ---------------- |
| linkFields  | 标记字段为链接样式，用于外链跳转  | `string[]` \| (meta: [Node](/docs/api/basic-class/node) \| ViewMeta) => boolean    |    |    |
| selectedCellsSpotlight               | 是否开启选中高亮聚光灯效果    | `boolean`                                 | `false`      |                  |
| hoverHighlight                       | 鼠标悬停时高亮当前单元格，以及所对应的行头，列头<br/>rowHeader：是否高亮悬停格子所在行头<br/>colHeader：是否高亮悬停格子所在列头<br/>rowCells：是否高亮悬停格子所在行<br/>colCells：是否高亮悬停格子所在列<br/>true：同 `{rowHeader: true, colHeader: true, currentRow: true, currentCol: true}`                                                                                                                 | `boolean \| { rowHeader?: boolean, colHeader?: boolean, rowCells?: boolean, colCells?: boolean}`                                 | `true`                                                |                  |
| hoverFocus                           | 鼠标悬停在当前单元格超过默认 800ms 后，保持当前高亮，显示 tooltip，悬停时间通过设置 `duration` 来控制   | `boolean  \| {duration: number}`                                   |      `true`      |       |
| hiddenColumnFields                   | 用于配置默认隐藏的列，透视表需要配置列头唯一 id, 明细表配置列头 field 字段即可                                                                                          | `string[]`                                |                                                       |                  |
| enableCopy                           | 是否允许复制                                                                                                                                 | `boolean`                                 | `false`                                               |                  |
| copyWithHeader                       | 复制数据是否带表头信息                                                                                                                            | `boolean`                                 | `false`                                               |                  |
| copyWithFormat                       | 是否使用 field format 格式复制                                                                                                                 | `boolean`                                 | `false`                                               |                  |
| customInteractions                   | 自定义交互 [详情](/docs/manual/advanced/interaction/custom)                                                                                | [CustomInteraction[]](#custominteraction) |                                                       |                  |
| scrollSpeedRatio                     | 用于控制滚动速率，分水平和垂直两个方向，默认为 1                                                                                                              | [ScrollSpeedRatio](#scrollspeedratio)     |                                                       |                  |
| autoResetSheetStyle                  | 用于控制点击表格外区域和按下 esc 键时是否重置交互状态                                                                                                          | `boolean`                                 | `true`                                                |                  |
| resize                               | 用于控制 resize 热区是否显示     | `boolean`  \| [ResizeInteractionOptions](#resizeinteractionoptions) |      `true`      |       |
| brushSelection         | 是否允许单元格（包含行头，列头，数值单元格）刷选。行头，列头刷选只支持透视表     | `boolean` \|  [BrushSelection](#brushSelection)  | `true`                         |     |  1.29.0 后支持 [BrushSelection](#brushSelection)   |
| multiSelection                       | 是否允许多选 （包含行头，列头，数值单元格）                                                                                                                 | `boolean`                                 | `true`                                                |                  |
| rangeSelection                       | 是否允许区间快捷多选                                                                                                                             | `boolean`                                 | `true`                                                |                  |
| scrollbarPosition                    | 用于控制滚动条展示在内容区边缘还是画布边缘                                                                                                                  | `content \| canvas`                                              |    `content`     |   |
| eventListenerOptions                 | 事件监听函数 `addEventListener` 的 [可选项配置](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener), 可控制事件从冒泡阶段还是捕获阶段触发 | `false`                                   |                                                       |
| selectedCellHighlight                | 选中格子后的高亮行为<br/>rowHeader：是否高亮选中格子所在行头<br/>colHeader：是否高亮选中格子所在列头<br/>currentRow：是否高亮选中格子所在行<br/>currentCol：是否高亮选中格子所在列<br/>true：同{rowHeader: true, colHeader: true}     | `boolean \| { rowHeader?: boolean, colHeader?: boolean, currentRow?: boolean, currentCol?: boolean }` | `false`                                               |                  |
| overscrollBehavior                   | 控制滚动至边界的行为，可禁用浏览器的默认滚动行为。[详情](/docs/manual/advanced/interaction/basic/#修改滚动至边界行为)  | `auto \| contain \| none \| null`  |  `auto` |
| hoverAfterScroll                   | 滚动结束后是否在当前鼠标所处单元格自动触发悬停表现  | `boolean`  |  `false` |

### CustomInteraction

功能描述：自定义交互，继承 baseEvent:  [具体例子](/docs/manual/advanced/interaction/custom)

| 参数        | 说明           | 类型                                              | 默认值 | 必选  |
| ----------- | -------------- | ------------------------------------------------- | ------ | --- |
| key         | 交互的唯一标识 | `string`                                          |        |   ✓   |
| interaction |                | [InteractionConstructor](/docs/api/basic-class/interaction#interactionconstructor) |        |   ✓   |

### ScrollSpeedRatio

```js
interface ScrollSpeedRatio {
  horizontal?: number; // 水平滚动速率，默认为 1
  vertical?: number; // 垂直滚动速率，默认为 1
}
```

### ResizeInteractionOptions

| 参数                 | 说明     | 类型    | 默认值 | 必选  |
| -------------------- | ------- | ----------------- | ------ | --- |
| rowCellVertical      | 是否开启行头垂直方向 resize 热区                                                   | `boolean`         | true   |       |
| cornerCellHorizontal | 是否开启角头水平方向 resize 热区                                                   | `boolean`         | true   |       |
| colCellHorizontal    | 是否开启列头水平方向 resize 热区                                                   | `boolean`         | true   |       |
| colCellVertical      | 是否开启列头垂直方向 resize 热区 （列头隐藏时该配置无效）                                                   | `boolean`         | true   |       |
| rowResizeType        | 用于控制行高 resize 时是同时对所有 Cell 生效，还是只对当前行生效。默认对所有行生效 | `all`\| `current` | `all`  |       |
| disable        | 用于控制行高 resize 是否生效 查看例子 | (resizeInfo: [S2CellType](/docs/api/components/sheet-component#resizeinfo)) => boolean |   |       |
| visible        | 自定义当前单元格是否显示 resize 热区 | (cell: [S2CellType](/docs/api/basic-class/base-cell)) => boolean |   |       |

### brushSelection

| 参数              | 说明                  | 类型              | 默认值   | 必选  |
| ----------------- | --------------------- | ----------------- | ------- | --- |
| data            | 是否允许数值单元格刷选         | `boolean`         | true  |       |
| row             | 是否允许行头单元格刷选（仅支持透视表） | `boolean`         | false |       |
| col             | 是否允许列头单元格刷选（仅支持透视表） | `boolean`         | false |       |
