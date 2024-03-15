---
title: Style
order: 3
---

## Style

 功能描述：样式设置。查看 [文档](/manual/advanced/custom/cell-size) 和 [示例](/examples/layout/custom/#custom-pivot-size)

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | ---  | --- | --- |
| layoutWidthType | `adaptive \| colAdaptive \| compact` |    |  | 单元格宽度布局类型<br/> `adaptive` : 行列等宽，均分整个 `Canvas` 画布宽度 <br> `colAdaptive`：列等宽，行头紧凑布局，列等分画布宽度减去行头宽度的剩余宽度 <br/> `compact`：行列紧凑布局，指标维度少的时候无法布满整个画布，列头宽度为实际内容宽度（取当前列最大值，采样每一列前 50 条数据）|
| dataCell | [DataCell](#datacell) |  |  | 数值单元格配置 |
| rowCell | [RowCell](#rowcell) |  |  | 行头单元格配置 |
| colCell | [ColCell](#colcell) |  |  |   列头单元格配置 |
| cornerCell | [CornerCell](#cornercell) |  |  |   角头单元格配置 |
| mergedCell | [MergedCell](#mergedcell) |  |  |   合并单元格配置 |
| seriesNumberCell | [SeriesNumberCell](#seriesnumbercell) |  |  |   序号单元格配置 |

### DataCell

功能描述：数值单元格配置

| 参数    | 说明 | 类型   | 默认值 | 必选  |
| ------- | ------------ | ------ | ------ | ---- |
| width   | 单元格宽度   | `number` |    96 | - |
| height  | 单元格高度   | `number` |    30 | - |
| valuesCfg  | 单元格配置   | `{ originalValueField?: string, widthPercent?: number[], showOriginalValue?: boolean }` |   | - |

其他公用配置见 [CellTextWordWrapStyle](#celltextwordwrapstyle)

### ColCell

功能描述：列头单元格配置

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | ---  |
| width |   单元格宽度，可根据当前列头节点动态设置 （叶子节点有效） | `number \| (colNode: Node) => number` | 96 |  |
| height |  单元格高度，可根据当前列头节点动态设置 （叶子节点有效） | `number \| (colNode: Node) => number` | 30 |  |
| widthByField | 根据度量值设置宽度（拖拽或者预设宽度场景）, `field` 对应 `s2DataConfig.fields.columns` 中的 `field` 或 列头 id, [查看详情](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>`   | - |  |
| heightByField | 根据度量值设置高度（拖拽或者预设高度场景）, `field` 对应 `s2DataConfig.fields.columns` 中的 `field` 或 列头 id, [查看详情](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>`   | - |  |
| hideValue | 默认数值挂列头，会同时显示列头和数值，隐藏数值，使其更美观。（即 `s2DataConfig.fields.values` 且仅在单数值时有效，多数值时推荐使用 [隐藏列头](https://s2.antv.vision/manual/advanced/interaction/hide-columns#2-%E9%80%8F%E8%A7%86%E8%A1%A8)) | `boolean` | false |  |

### RowCell

功能描述：行头单元格配置

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | ---  |
| width | 行单元格宽度，可根据当前行头节点动态设置，树状结构同样适用 | `number \| (rowNode: Node) => number` | 平铺：`96`, 树状：`120` |  |
| height | 行单元格高度，可根据当前行头节点动态设置 | `number \| (rowNode: Node) => number` | 30 |  |
| collapseFields | 树状模式下行头自定义折叠节点。<br> 支持 id (`'root[&] 行头维度值'`) 和 维度 field (`'city'`) 两种格式，优先级大于 `collapseAll` 和 `expandDepth`, 设置为 `null` 时优先级最低。 [查看 demo](/examples/basic/pivot#tree) | `Record<string, boolean>` |  | |
| collapseAll | 在树状结构模式下行头是否默认收起全部。 | `boolean` |   `false` | |
| expandDepth | 在树状结构模式下行头默认展开展开的层级（层级从 0 开始）,  设置为 `null` 时优先级最低 |  `number` |  | |
| showTreeLeafNodeAlignDot | 树状模式下行头叶子节点是否显示层级占位点 | `boolean` | `false` |  |
| withByField | 根据 `field` 设置每行的宽度。`field` 对应 `s2DataConfig.fields.rows` 中的 `field` 或 列头 id, [查看详情](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>` | - |  |
| heightByField | 根据 `field` 设置每行的高度。<br/> 1. 透视表：`field` 对应 `s2DataConfig.fields.rows` 中的 `field` 或 列头 id. <br/> 2. 明细表：`field` 对应 行序号，从 `1` 开始。[查看详情](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>` | - |  |

### CornerCell

其他公用配置见 [CellTextWordWrapStyle](#celltextwordwrapstyle)

### MergedCell

其他公用配置见 [CellTextWordWrapStyle](#celltextwordwrapstyle)

### SeriesNumberCell

其他公用配置见 [CellTextWordWrapStyle](#celltextwordwrapstyle)

### CellTextWordWrapStyle

功能描述：单元格换行配置。[查看示例](/examples/layout/multi-line-text#pivot)

| 参数    | 说明 | 类型   | 默认值 | 必选  |
| ------- | ------------ | ------ | ------ | ---- |
| wordWrap      | 文本是否自动换行（数值单元格不建议换行）。[了解更多](https://g.antv.antgroup.com/api/basic/text#wordwrap)                                                                    | `boolean`                      | `true`                                                                                                 |      |
| maxLines      | 最大行数，文本超出后将被截断（数值单元格不建议换行），需要配合 `wordWrap` 和 `textOverflow` 一起使用。[了解更多](https://g.antv.antgroup.com/api/basic/text#maxlines)                                                                      | `number`                      | `1`                                                                                                 |      |
| textOverflow      | 自定义隐藏的文本溢出内容，例如直接裁剪、追加省略号或一个自定义字符串，需要配合 `wordWrap` 和 `maxLines` 一起使用。[了解更多](https://g.antv.antgroup.com/api/basic/text#textoverflow)                                                                 | `string`                      | `ellipsis`                                                                                                |      |
