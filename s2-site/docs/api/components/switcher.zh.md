---
title: 维度切换组件
order: 2
---

# 维度切换组件

## Switcher 组件 Props

| 属性       | 类型            | 必选  | 默认值 | 功能描述   |
| :---------- | :--------------- |  :---- | :------ | :---------- |
| rows       | `SwitcherField`           |      | `[]`   | 行头配置描述   |
| columns | `SwitcherField`          |      | `[]`   | 列头配置描述   |
| values   | `SwitcherField`           |      | `[]`   | 指标配置描述 |
| title       | `ReactNode`       |      | 默认按钮   |  打开切换弹窗的触发节点  |
| resetText       | `string`       |      | `恢复默认`   | 重置按钮文字   |
| onSubmit       | `(result: SwitcherResult) => void`       |      | -   | 关闭弹窗后，处理行列切换结果的回调函数   |

## SwitcherField

行列头以及指标值得配置描述对象

| 属性       | 类型            | 必选  | 默认值 | 功能描述   |
| :---------- | :--------------- |  :---- | :------ | :---------- |
| items       | `SwitcherItem[]`           |   ✓    | -   | 配置字段对象   |
| expandable       | `boolean`           |       | `false`   | 是否打开展开子项的 checkbox 用于控制展开和隐藏子项   |
| expandText | `string`          |      | `展开子项`  | 展开子项的 checkbox 对应的文字   |
| selectable   | `boolean`           |      | `false`   | 是否打开字段的 checkbox用于控制显隐 |

## SwitcherItem

配置字段对象

| 属性       | 类型            | 必选  | 默认值 | 功能描述   |
| :---------- | :--------------- |  :---- | :------ | :---------- |
| id       | `string`           |   ✓    | -   | 字段 id   |
| displayName | `string`          |      | -   | 字段显示名字，该字段不存在时直接显示 id   |
| checked   | `boolean`           |      | `true`   | 字段是否需要显示 |
| children       | `SwitcherItem[]`       |      | `[]`   | 如果字段存在关联子项（如：同环比），使用该属性配置子项   |

## SwitcherResult

关闭弹窗后，处理行列切换结果的回调函数的参数

| 属性       | 类型            | 必选  | 默认值 | 功能描述   |
| :---------- | :--------------- |  :---- | :------ | :---------- |
| rows       | `SwitcherResultItem[]`           |       | `[]`  | 所有行头字段操作结果   |
| cols | `SwitcherResultItem[]`          |      | `[]`   | 所有列头字段操作结果   |
| values   | `SwitcherResultItem[]`           |      | `[]`   | 所有指标字段操作结果 |

## SwitcherResultItem

关闭弹窗后，每个维度结果的描述对象

| 属性       | 类型            | 必选  | 默认值 | 功能描述   |
| :---------- | :--------------- |  :---- | :------ | :---------- |
| items       | `SwitcherItem[]`           |       | `[]`  |  全部字段的被**压平**集合，按拖拽后顺序排序   |
| hideItems | `SwitcherItem[]`          |      | `[]`   | 所有需要隐藏字段被**压平**的集合，按拖拽后顺序排序   |
