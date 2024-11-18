---
title: Node
order: 5
---

功能描述：布局节点。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/layout/node.ts)

```ts
node.isTotals // false
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| id | 节点 id （如维值为空，会将 `null` 转换为 `$$null$$`, 便于内部识别原始维值） | `string` |
| field | 节点 key | `string` |
| value | 节点值 | `string` |
| level | 节点等级 | `number` |
| rowIndex | 行头索引 | `number` |
| colIndex | 列头索引 | `number` |
| parent | 父节点 | [Node](/api/basic-class/node) |
| isTotals | 是否是汇总 | `boolean` |
| isSubTotals | 是否是小计 | `boolean` |
| isGrandTotals | 是否是总计 | `boolean` |
| isCollapsed | 是否展开 | `boolean` |
| hierarchy | 层级结构 | [Hierarchy](/api/basic-class/hierarchy) |
| isPivotMode | 是否是透视表 | `boolean` |
| seriesNumberWidth | 序号宽度 | `number` |
| field | dataCfg 对应的 field | `string` |
| spreadsheet | 表格实例 | [SpreadSheet](/api/basic-class/spreadsheet)  |
| query | 当前节点对应的查询条件 [详情](/manual/advanced/get-cell-data) | `Record<string, any>` |
| belongsCell | 当前节点对应的单元格 | [S2CellType](/api/basic-class/base-cell)  |
| isTotalMeasure | 是否是数值小计 | `boolean` |
| isCollapseNode | 是否展开的节点 | `boolean` |
| isSeriesNumberNode | 是否是序号列节点 | () => `boolean` |
| isLeaf | 是否是叶子节点 | `boolean` |
| x | x 轴坐标 | `number` |
| y | y 轴坐标 | `number` |
| width | 宽度 | `number` |
| height | 高度 | `number` |
| padding | 间距 | `number` |
| children | 子节点 | [Node[]](/api/basic-class/node)  |
| extra | 节点额外信息 | `Record<string, any>` |
| relatedNode | 给序号列单元格用，标识该序号单元格对应了行头节点，有了关联关系后，就可以在行头冻结时做区分 | [Node[]](/api/basic-class/node)  |
