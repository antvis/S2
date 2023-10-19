---
title: Totals
order: 3
---

## Totals

object is **required** , *default: null* Function description: subtotal total configuration

| parameter | illustrate   | type                                       | required | Defaults |
| --------- | ------------ | ------------------------------------------ | -------- | -------- |
| row       | row total    | [Total](/docs/api/general/S2Options#total) |          |          |
| col       | column total | [Total](/docs/api/general/S2Options#total) |          |          |

## Total

object is **required** , *default: null* Function description: subtotal total configuration

| parameter           | illustrate                                                                                                                                                                                | type                             | Defaults | required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------- | -------- |
| showGrandTotals     | Whether to display the total                                                                                                                                                              | `boolean`                        | `false`  |          |
| showSubTotals       | Whether to display subtotals. When configured as an object, always controls whether to always display subtotals when there are less than 2 subdimensions, and does not display by default | `boolean \| { always: boolean }` | `false`  |          |
| subTotalsDimensions | Summary Dimensions for Subtotals                                                                                                                                                          | `string[]`                       | `[]`     |          |
| reverseGrandTotalsLayout       | total layout position, default bottom or right                                                                                                                                            | `boolean`                        | `false`  |          |
| reverseSubTotalsLayout    | Subtotal layout position, default bottom or right                                                                                                                                         | `boolean`                        | `false`  |          |
| label               | total alias                                                                                                                                                                               | `string`                         |          |          |
| subLabel            | subtotal alias                                                                                                                                                                            | `string`                         |          |          |
| calcGrandTotals          | Custom Calculated Totals                                                                                                                                                                  | [CalcTotals](#calctotals)        |          |          |
| calcSubTotals       | Custom Calculated Subtotals                                                                                                                                                               | [CalcTotals](#calctotals)        |          |          |

## CalcTotals

object **optional** , *default: null* Function description: calculate subtotal total configuration

| parameter   | illustrate         | type                                                                             | required | Defaults |
| ----------- | ------------------ | -------------------------------------------------------------------------------- | -------- | -------- |
| aggregation | aggregation method | `Aggregation.SUM` \| `Aggregation.MIN` \| `Aggregation.MAX` \| `Aggregation.AVG` |          |          |
| calcFunc    | custom method      | `(query: Record<string, any>, arr: Record<string, any>[]) => number`             |          |          |
