---
title: Advanced Sort
order: 4
---

## React Advanced Sorting Component

### AdvancedSortProps

The `props` of the `AdvancedSort` component

| parameter     | illustrate                                                             | type                                                                                                                           | required | Defaults |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | -------- |
| sheet         | current table instance                                                 | [SpreadSheet](/docs/api/basic-class/spreadsheet)                                                                               | ✓        |          |
| open          | whether to display                                                     | `boolean`                                                                                                                      | ✓        |          |
| className     | class class name                                                       | `string`                                                                                                                       |          |          |
| icon          | sort button icon                                                       | `React.ReactNode`                                                                                                              |          |          |
| text          | sort button name                                                       | `string`                                                                                                                       |          |          |
| ruleText      | Rule description                                                       | `string`                                                                                                                       |          |          |
| dimensions    | list of optional fields                                                | [Dimension](#dimension) \[]                                                                                                    |          |          |
| ruleOptions   | Rule configuration list                                                | [RuleOption](#ruleoption) \[]                                                                                                  |          |          |
| sortParams    | There are already sort rules by default                                | [SortParams](/docs/api/general/S2DataConfig#sortparams)                                                                        |          |          |
| onSortOpen    | Callback for opening sort popup                                        | `() => void`                                                                                                                   |          |          |
| onSortConfirm | Callback for processing sorting results after closing the popup window | `(ruleValues:` [RuleValue](#rulevalue) \[] `, sortParams:` [SortParams](/docs/api/general/S2DataConfig#sortparams) `) => void` |          |          |

### AdvancedSortCfgProps

Configure the `props` of `advancedSort` in the `header`

| parameter     | illustrate                                                             | type                                                                                                                           | required | Defaults |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | -------- |
| open          | whether to display                                                     | `boolean`                                                                                                                      |          | false    |
| className     | class class name                                                       | `string`                                                                                                                       |          |          |
| icon          | sort button icon                                                       | `React.ReactNode`                                                                                                              |          |          |
| text          | sort button name                                                       | `ReactNode`                                                                                                                    |          |          |
| ruleText      | Rule description                                                       | `string`                                                                                                                       |          |          |
| dimensions    | list of optional fields                                                | [Dimension](#dimension) \[]                                                                                                    |          |          |
| ruleOptions   | Rule configuration list                                                | [RuleOption](#ruleoption) \[]                                                                                                  |          |          |
| sortParams    | There are already sort rules by default                                | [SortParams](/docs/api/general/S2DataConfig#sortparams)                                                                        |          |          |
| onSortOpen    | Callback for opening sort popup                                        | `() => void`                                                                                                                   |          |          |
| onSortConfirm | Callback for processing sorting results after closing the popup window | `(ruleValues:` [RuleValue](#rulevalue) \[] `, sortParams:` [SortParams](/docs/api/general/S2DataConfig#sortparams) `) => void` |          |          |

### Dimension

Optional field list, if not configured, the default is:`行头+列头+数值`

| parameter | illustrate     | type       | Defaults | required |
| --------- | -------------- | ---------- | -------- | -------- |
| field     | dimension id   | `string`   | ✓        |          |
| name      | dimension name | `string`   | ✓        |          |
| list      | dimension list | `string[]` | ✓        |          |

### RuleOption

Rule configuration list, if not configured, the default is:`首字母、手动排序、其他字段`

| parameter | illustrate   | type           | Defaults | required          |
| --------- | ------------ | -------------- | -------- | ----------------- |
| label     | rule name    | `string`       | ✓        |                   |
| value     | rule value   | \`'sortMethod' | 'sortBy' | 'sortByMeasure'\` |
| children  | rule sublist | `RuleOption[]` | ✓        |                   |

### RuleValue

The first parameter of the callback function that processes the sorting results after closing the pop-up window: the obtained sorting information

| parameter     | illustrate                     | type                               | Defaults | required |
| ------------- | ------------------------------ | ---------------------------------- | -------- | -------- |
| field         | dimension id                   | `string`                           | ✓        |          |
| name          | dimension name                 | `string`                           | ✓        |          |
| sortMethod    | Sort By (Ascending/Descending) | `ASC` \| `DESC` \| `asc` \| `desc` |          |          |
| sortBy        | custom sorted list             | `string[]`                         |          |          |
| sortByMeasure | kind                           | `string`                           |          |          |

## Vue Advanced Sorting Component

In development, please look forward to
