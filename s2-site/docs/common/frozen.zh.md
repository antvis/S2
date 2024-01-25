---
title: 行列头冻结
order: 1
---

## Frozen

功能描述：行列头冻结配置。查看 [透视表示例](/examples/layout/frozen/#pivot-frozen-row-header) 和 [明细表示例](/examples/layout/frozen/#table-frozen)

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| -- | --- | --  | -- | --- |
| rowHeader | `boolean \| number` |  |   `true` | 冻结行头<br/>当值为 number 时，标识行头冻结的最大区域，取值范围： (0, 1)，0 表示不固定行头。<br/>当值为 boolean 时，true 对应冻结最大区域为 0.5, false 对应 0。<br/> （透视表有效） |
| firstRow | `boolean` |  |   `false` | 是否冻结首行（适用于总计置于顶部，树状模式等场景，透视表有效）[查看示例](/examples/layout/frozen/#frozen-pivot-grid) |
| rowCount | `number` |  |  `0`  | 冻结行的数量，从顶部开始计数 （明细表有效） |
| colCount | `number` |  |  `0`  | 冻结列的数量，从左侧开始计数 （明细表有效） |
| trailingRowCount | `number` |    | `0` | 冻结行数量，从底部开始计数 （明细表有效） |
| trailingColCount | `number` |   | `0` | 冻结列的数量，从右侧开始计数 （明细表有效） |
