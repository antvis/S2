---
title: 小计总计
order: 3
---

## Totals

object **必选**,_default：null_ 功能描述： 小计总计配置

| 参数       | 说明         | 类型                                          | 必选  | 默认值  |
| ---------- | ------------ | --------------------------------------------- | :---: | ------- |
| row        | 列总计       | [Total](/zh/docs/api/general/S2Options#total) |       | `{}`    |
| col        | 行总计       | [Total](/zh/docs/api/general/S2Options#total) |       | `{}`    |
| calcTotals | 是否计算总计 | `boolean`                                     |       | `false` |

## Total

object **必选**,_default：null_ 功能描述： 小计总计算配置

| 参数                | 说明                     | 类型       | 默认值  | 必选  |
| ------------------- | ------------------------ | ---------- | ------- | :---: |
| showGrandTotals     | 是否显示总计             | `boolean`  | `false` |   ✓   |
| showSubTotals       | 是否显示小计             | `boolean`  | `false` |   ✓   |
| subTotalsDimensions | 小计的汇总维度           | `string[]` | `[]`    |   ✓   |
| reverseLayout       | 总计布局位置，默认下或右 | `boolean`  | `false` |   ✓   |
| reverseSubLayout    | 小计布局位置，默认下或右 | `boolean`  | `false` |   ✓   |
| label               | 总计别名                 | `string`   |         |       |
| subLabel            | 小计别名                 | `string`   |         |       |
