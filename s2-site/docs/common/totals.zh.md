---
title: 小计总计
order: 3
---

## Totals

object **必选**,_default：null_ 功能描述： 小计总计配置

| 参数 | 类型   | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- |
| row | [Total](/zh/docs/api/general/S2Options#total) |  |   `{}` | 列总计 |
| col | [Total](/zh/docs/api/general/S2Options#total) |  |   `{}` | 行总计 |

## Total

object **必选**,_default：null_ 功能描述： 小计总计算配置

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| showGrandTotals | `boolean` | ✓ |   `false` | 是否显示总计 |
| showSubTotals | `boolean` | ✓ |   `false` | 是否显示小计 |
| subTotalsDimensions | `string[]` | ✓ |  `[]` | 小计的汇总维度 |
| reverseLayout | `boolean` | ✓ |   `false` | 总计布局位置，默认下或右 |
|  |
| reverseSubLayout | `boolean` | ✓ |  `false` | 小计布局位置，默认下或右 |
| label | `string` |  |  |   总计别名 |
| subLabel | `string` |  |    | 小计别名 |
