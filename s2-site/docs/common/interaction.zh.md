---
title: 交互
order: 5
---

## Interaction

| 参数                   | 说明                                                  | 类型                                                                                     | 默认值  | 必选  |
| :--------------------- | ----------------------------------------------------- | :--------------------------------------------------------------------------------------- | :------ | :---: |
| linkFields             | 标记字段为链接样式，用于外链跳转                      | `string[]`                                                                               |         |       |
| selectedCellsSpotlight | 是否开启选中高亮聚光灯效果                            | `boolean`                                                                                | `false` |       |
| hoverHighlight         | 鼠标悬停时高亮当前单元格，以及所对应的行头，列头      | `boolean`                                                                                | `true`  |       |
| hoverFocus             | 鼠标悬停在当前单元格超过 800ms 后，保持当前高亮，显示 tooltip, 所对应的行头，列头取消高亮       | `boolean`                                                                                | `true`  |       |
| hiddenColumnFields     | 用于配置默认隐藏的列，透视表需要配置列头唯一 id, 明细表配置列头 field 字段即可                                | `string[]`                                                                               |         |       |
| enableCopy             | 是否允许复制                                          | `boolean`                                                                                | `false` |       |
| copyWithFormat         | 是否使用 field format 格式复制                        | `boolean`                                                                                | `false` |       |
| customInteractions     | 自定义交互 [详情](zh/docs/manual/advanced/interaction/custom)                                          | [CustomInteraction[]](#custominteraction)                                                |         |       |
| scrollSpeedRatio       | 用于控制滚动速率，分水平和垂直两个方向，默认为 1      | [ScrollSpeedRatio](/zh/docs/api/general/S2Options#scrollspeedratio)                                |         |       |
| autoResetSheetStyle    | 用于控制点击表格外区域和按下 esc 键时是否重置交互状态 | `boolean`                                                                                | `true`  |       |
| resize                 | 用于控制 resize 热区是否显示                          | `boolean`   \| [ResizeActiveOptions](/zh/docs/api/general/S2Options#resizeactiveoptions) | `true`  |       |
| brushSelection                 | 是否允许刷选                         | `boolean` | `true`  |       |
| multiSelection                 | 是否允许多选                         | `boolean` | `true`  |       |
| rangeSelection                 | 是否允许区间快捷多选                         | `boolean` | `true`  |       |
| scrollbarPosition | 用于控制滚动条展示在内容区边缘还是画布边缘 | `content`\| `canvas`  | `content`  |   |
| eventListenerOptions | 事件监听函数 `addEventListener` 的 [可选项配置](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener), 可控制事件从冒泡阶段还是捕获阶段触发 | `false`  |   |

### CustomInteraction

功能描述：自定义交互，继承 baseEvent:  [具体例子](/zh/docs/manual/advanced/interaction/custom)

| 参数        | 说明           | 类型                                              | 默认值 | 必选  |
| ----------- | -------------- | ------------------------------------------------- | ------ | :---: |
| key         | 交互的唯一标识 | `string`                                          |        |   ✓   |
| interaction |                | [InteractionConstructor](#InteractionConstructor) |        |   ✓   |

### ScrollSpeedRatio

```js
interface ScrollSpeedRatio {
  horizontal?: number; // 水平滚动速率，默认为 1
  vertical?: number; // 垂直滚动速率，默认为 1
}
```

### ResizeActiveOptions

| 参数                 | 说明                                                                               | 类型              | 默认值 | 必选  |
| -------------------- | ---------------------------------------------------------------------------------- | ----------------- | ------ | :---: |
| rowCellVertical      | 是否开启行头垂直方向 resize 热区                                                   | `boolean`         | true   |       |
| cornerCellHorizontal | 是否开启角头水平方向 resize 热区                                                   | `boolean`         | true   |       |
| colCellHorizontal    | 是否开启列头水平方向 resize 热区                                                   | `boolean`         | true   |       |
| colCellVertical      | 是否开启列头垂直方向 resize 热区                                                   | `boolean`         | true   |       |
| rowResizeType        | 用于控制行高 resize 时是同时对所有 Cell 生效，还是只对当前行生效。默认对所有行生效 | `all`\| `current` | `all`  |       |
