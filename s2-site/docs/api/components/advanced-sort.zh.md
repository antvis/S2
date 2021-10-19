---
title: 高级排序
order: 4
---

## AdvancedSortProps

`AdvancedSort` 组件的 `props`

| 属性          | 类型                                                                                                                                             | 必选 | 默认值 | 功能描述                     |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--- | :----- | :--------------------------- |
| sheet         | [SpreadSheet](https://g.antv.vision/zh/docs/api/basic-class/spreadsheet)                                                                         |      | ✓      | 当前表实例                   |
| open          | `boolean`                                                                                                                                        |      | ✓      | 是否展示                     |
| className     | `string`                                                                                                                                         |      |        | class类名称                  |
| icon          | `React.ReactNode`                                                                                                                                |      |        | 排序按钮图标                 |
| text          | `string`                                                                                                                                         |      |        | 排序按钮名称                 |
| ruleText      | `string`                                                                                                                                         |      |        | 规则描述                     |
| demissions    | [Demission](#Demission)[]                                                                                                                        |      |        | 可选字段列表                 |
| ruleOptions   | [RuleOption](#RuleOption)[]                                                                                                                      |      |        | 规则配置列表                 |
| sortParams    | [SortParams](https://g.antv.vision/zh/docs/api/general/S2DataConfig#SortParams)                                                                  |      |        | 默认已有 sort 规则           |
| onSortOpen    | `() => void`                                                                                                                                     |      |        | 打开排序弹窗的回调           |
| onSortConfirm | `(ruleValues:`[RuleValue](#RuleValue)[]`, sortParams:`[SortParams](https://g.antv.vision/zh/docs/api/general/S2DataConfig#SortParams)`) => void` |      |        | 关闭弹窗后处理排序结果的回调 |

## AdvancedSortCfgProps

在 `header` 中配置 `advancedSortCfg` 的 `props`

| 属性          | 类型                                                                                                                                             | 必选 | 默认值 | 功能描述                     |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--- | :----- | :--------------------------- |
| open          | `boolean`                                                                                                                                        |      | ✓      | 是否展示                     |
| className     | `string`                                                                                                                                         |      |        | class类名称                  |
| icon          | `React.ReactNode`                                                                                                                                |      |        | 排序按钮图标                 |
| text          | `ReactNode`                                                                                                                                      |      |        | 排序按钮名称                 |
| ruleText      | `string`                                                                                                                                         |      |        | 规则描述                     |
| demissions    | [Demission](#Demission)[]                                                                                                                        |      |        | 可选字段列表                 |
| ruleOptions   | [RuleOption](#RuleOption)[]                                                                                                                      |      |        | 规则配置列表                 |
| sortParams    | [SortParams](https://g.antv.vision/zh/docs/api/general/S2DataConfig#SortParams)                                                                  |      |        | 默认已有 sort 规则           |
| onSortOpen    | `() => void`                                                                                                                                     |      |        | 打开排序弹窗的回调           |
| onSortConfirm | `(ruleValues:`[RuleValue](#RuleValue)[]`, sortParams:`[SortParams](https://g.antv.vision/zh/docs/api/general/S2DataConfig#SortParams)`) => void` |      |        | 关闭弹窗后处理排序结果的回调 |

## Demission

可选字段列表，不配置默认为：`行头+列头+数值`

| 属性  | 类型       | 必选 | 默认值 | 功能描述 |
| :---- | :--------- | :--- | :----- | :------- |
| field | `string`   |      | ✓      | 维度id   |
| name  | `string`   |      | ✓      | 维度名称 |
| list  | `string[]` |      | ✓      | 维度列表 |

## RuleOption

规则配置列表，不配置默认为：`首字母、手动排序、其他字段`

| 属性     | 类型                                        | 必选 | 默认值 | 功能描述   |
| :------- | :------------------------------------------ | :--- | :----- | :--------- |
| label    | `string`                                    |      | ✓      | 规则名称   |
| value    | `'sortMethod' | 'sortBy' | 'sortByMeasure'` | ✓    |        | 规则值     |
| children | `RuleOption[]`                              |      | ✓      | 规则子列表 |

## RuleValue

关闭弹窗后处理排序结果的回调函数的第一个参数：获取到的排序信息

| 属性          | 类型                               | 必选 | 默认值 | 功能描述            |
| :------------ | :--------------------------------- | :--- | :----- | :------------------ |
| field         | `string`                           |      | ✓      | 维度id              |
| name          | `string`                           |      | ✓      | 维度名称            |
| sortMethod    | `ASC` \| `DESC` \| `asc` \| `desc` |      |        | 排序方式（升/降序） |
| sortBy        | `string[]`                         |      |        | 自定义排序列表      |
| sortByMeasure | `string`                           |      |        | 类                  |
