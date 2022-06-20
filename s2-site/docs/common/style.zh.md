---
title: Style
order: 3
---

## Style

object **必选**,_default：null_ 功能描述：样式设置

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- | --- |
|layoutWidthType | `adaptive` \| `colAdaptive`  \| `compact` |    |  | 单元格宽度布局类型<br> `adaptive` : 行列等宽，均分整个 `Canvas` 画布宽度 <br> `colAdaptive`：列等宽，行头紧凑布局，列等分画布宽度减去行头宽度的剩余宽度<br> `compact`：行列紧凑布局，指标维度少的时候无法布满整个画布 |
| showTreeLeafNodeAlignDot | `boolean` |  |  false  | 树状模式下叶子节点是否显示层级占位点 |
| treeRowsWidth | `number` |  |  120  | 树状模式行单元格宽度 |
| hierarchyCollapse | `boolean` |  |   `false` | 在树状结构模式下行头是否默认展开。 |
| collapsedRows | `Record<string, boolean>` |  |  | 树状模式下行头自定义折叠、收起状态（透视表使用）。<br> key 值的生成需遵守指定的规则：'root[&]行头维度值'。 [查看 demo](/zh/examples/basic/pivot#tree) |
| cellCfg | [CellCfg](#cellcfg) |  |  |   单元格配置 |
| colCfg | [ColCfg](#colcfg) |  |  |   列样式配置 |
| rowCfg | [RowCfg](#rowcfg) |  |  |   行样式配置 |
| device | `pc` \| `mobile` | |  `pc` | 设备类型 |

## CellCfg

object **必选**,_default：null_ 功能描述：单元格配置

| 参数    | 说明 | 类型   | 默认值 | 必选  |
| ------- | ------------ | ------ | ------ | ---- |
| width   | 单元格宽度   | `number` |    96 | - |
| height  | 单元格高度   | `number` |    30 | - |

## ColCfg

object **必选**,_default：null_ 功能描述： 列样式配置

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| height |   单元格高度（普通状态） | `number` | 30 |  |
| widthByFieldValue | 根据度量值设置宽度（拖拽或者预设宽度场景）, `fieldValue` 对应 `s2DataConfig.fields.columns` 中的列头 | `Record<string, number>`   | - |  |
| hideMeasureColumn | 默认数值挂列头，会同时显示列头和数值，隐藏数值列，使其更美观。 | `boolean` | false |  |

## RowCfg

object **必选**,_default：null_ 功能描述： 行样式配置

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| width | 行单元格宽度 | `number` | 96 |  |
| heightByField | 可以单独设置每行的高度。`field` 是行的 id, [查看详情](/zh/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>` | - |  |
