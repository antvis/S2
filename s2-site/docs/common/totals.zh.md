---
title: 小计总计
order: 3
---

## Totals

功能描述：行/列小计总计配置。

| 参数 | 说明   | 类型                                          | 必选  | 默认值 |
| ---- | ------ | --------------------------------------------- | ---- | ------ |
| row  | 行总计 | [Total](/docs/api/general/S2Options#total) |       |    |
| col  | 列总计 | [Total](/docs/api/general/S2Options#total) |       |    |

## Total

功能描述：小计总计配置。查看 [文档](/manual/basic/totals) 和 [示例](/examples/analysis/totals/#basic)

| 参数                | 说明                     | 类型         | 默认值  | 必选  |
| ------------------- | ------------------------ | ------------ | ------- | ---- |
| showGrandTotals     | 是否显示总计             | `boolean`    | `false` |      |
| showSubTotals       | 是否显示小计。当配置为对象时，always 控制是否在子维度不足 2 个时始终展示小计，默认不展示             | `boolean \| { always: boolean }`    | `false` |      |
| subTotalsDimensions | 小计的汇总维度           | `string[]`   | `[]`    |      |
| reverseGrandTotalsLayout       | 总计布局位置，默认下或右 | `boolean`    | `false` |      |
| reverseSubTotalsLayout    | 小计布局位置，默认下或右 | `boolean`    | `false` |      |
| label               | 总计别名                 | `string`     |         |       |
| subLabel            | 小计别名                 | `string`     |         |       |
| calcGrandTotals          | 自定义计算总计                 | [CalcTotals](#calctotals) |         |       |
| calcSubTotals       | 自定义计算小计                 | [CalcTotals](#calctotals) |         |       |
| totalsGroupDimensions                  | 总计的分组维度                                            |`string[]`    |                    |      |
| subTotalsGroupDimensions               | 小计的分组维度                                            |  `string[]`            |                    |      |

## CalcTotals

功能描述： 小计总计计算方式配置。查看 [文档](/manual/basic/totals) 和 [示例](/examples/analysis/totals/#calculate)

| 参数        | 说明       | 类型                                                                 | 必选  | 默认值 |
| ----------- | ---------- | -------------------------------------------------------------------- | --- | ------ |
| aggregation | 聚合方式   | `SUM \| MIN \| MAX \| AVG`            |       |        |
| calcFunc    | 自定义方法 | `(query: Record<string, any>, arr: Record<string, any>[]) => number` |       |        |
