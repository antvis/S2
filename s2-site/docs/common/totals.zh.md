---
title: 小计总计
order: 3
---

## Totals

object **必选**,_default：null_ 功能描述： 小计总计配置

| 参数 | 说明   | 类型                                          | 必选  | 默认值 |
| ---- | ------ | --------------------------------------------- | ---- | ------ |
| row  | 行总计 | [Total](/docs/api/general/S2Options#total) |       |    |
| col  | 列总计 | [Total](/docs/api/general/S2Options#total) |       |    |

## Total

object **必选**,_default：null_ 功能描述： 小计总计配置

| 参数                | 说明                     | 类型         | 默认值  | 必选  |
| ------------------- | ------------------------ | ------------ | ------- | ---- |
| showGrandTotals     | 是否显示总计             | `boolean`    | `false` |      |
| showSubTotals       | 是否显示小计。当配置为对象时，always 控制是否在子维度不足 2 个时始终展示小计，默认不展示             | `boolean \| { always: boolean }`    | `false` |      |
| subTotalsDimensions | 小计的汇总维度           | `string[]`   | `[]`    |      |
| reverseLayout       | 总计布局位置，默认下或右 | `boolean`    | `false` |      |
| reverseSubLayout    | 小计布局位置，默认下或右 | `boolean`    | `false` |      |
| label               | 总计别名                 | `string`     |         |       |
| subLabel            | 小计别名                 | `string`     |         |       |
| calcTotals          | 自定义计算总计                 | [CalcTotals](#calctotals) |         |       |
| calcSubTotals       | 自定义计算小计                 | [CalcTotals](#calctotals) |         |       |
| totalsGroupDimensions                  | 总计的分组维度                                            |`string[]`    |                    |      |
| subTotalsGroupDimensions               | 小计的分组维度                                            |  `string[]`            |                    |      |

## CalcTotals

object **可选**,_default：null_ 功能描述： 计算小计总计配置

| 参数        | 说明       | 类型                                                                 | 必选  | 默认值 |
| ----------- | ---------- | -------------------------------------------------------------------- | --- | ------ |
| aggregation | 聚合方式   | `Aggregation.SUM` \| `Aggregation.MIN` \| `Aggregation.MAX` \| `Aggregation.AVG`                                                                |       |        |
| calcFunc    | 自定义方法 | `(query: Record<string, any>, arr: Record<string, any>[]) => number` |       |        |
