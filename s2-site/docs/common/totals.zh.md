---
title: 小计总计
order: 3
---

## Totals

功能描述：行/列小计总计配置。

| 参数 | 说明   | 类型                                          | 必选  | 默认值 |
| ---- | ------ | --------------------------------------------- | ---- | ------ |
| row  | 行总计配置（在 [自定义行头时](/manual/advanced/custom/custom-header#11-自定义行头) 无效） | [Total](#total) |  -     |      |
| col  | 列总计配置（在 [自定义列头时](/manual/advanced/custom/custom-header#12-自定义列头) 无效） | [Total](#total) | -     |      |

## Total

功能描述：小计总计配置。查看 [文档](/manual/basic/totals) 和 [示例](/examples/analysis/totals/#basic)

| 参数                | 说明                     | 类型         | 默认值  | 必选  |
| ------------------- | ------------------------ | ------------ | ------- | ---- |
| showGrandTotals     | 是否显示总计             | `boolean`    | `false` |      |
| showSubTotals       | 是否显示小计。配置为对象时，`always` 用于控制当子维度小于 2 个时是否始终展示小计，默认展示 | `boolean \| { always: boolean }`    | `false` |      |
| subTotalsDimensions | 小计的汇总维度           | `string[]`   | `[]`    |      |
| reverseGrandTotalsLayout       | 总计布局位置，默认下或右 | `boolean`    | `false` |      |
| reverseSubTotalsLayout    | 小计布局位置，默认下或右 | `boolean`    | `false` |      |
| grandTotalsLabel               | 总计别名                 | `string`     |   `总计`      |       |
| subTotalsLabel            | 小计别名                 | `string`     |   `小计`      |       |
| calcGrandTotals          | 自定义计算总计                 | [CalcTotals](#calctotals) |         |       |
| calcSubTotals       | 自定义计算小计                 | [CalcTotals](#calctotals) |         |       |
| grandTotalsGroupDimensions                  | 总计的分组维度                                            |`string[]`    |                    |      |
| subTotalsGroupDimensions               | 小计的分组维度                                            |  `string[]`            |                    |      |

## CalcTotals

功能描述： 小计总计计算方式配置。查看 [文档](/manual/basic/totals) 和 [示例](/examples/analysis/totals/#calculate)

| 参数        | 说明       | 类型                                                                 | 必选  | 默认值 |
| ----------- | ---------- | -------------------------------------------------------------------- | --- | ------ |
| aggregation | 聚合方式   | `SUM \| MIN \| MAX \| AVG`            |       |        |
| calcFunc    | 自定义方法 | `(query: Record<string, any>, data: Record<string, any>[], spreadsheet: SpreadSheet) => number` |       |        |
