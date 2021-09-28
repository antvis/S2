---
title: 维度切换组件
order: 2
---

# 维度切换组件

## Switcher 组件 Props

| 属性       | 类型            | 必选  | 默认值 | 功能描述   |
| :---------- | :--------------- |  :---- | :------ | :---------- |
| rows       | `SwitcherItem[]`           |      | `[]`   | 行头配置描述   |
| cols | `SwitcherItem[]`          |      | `[]`   | 列头配置描述   |
| values   | `SwitcherItem[]`           |      | `[]`   | 指标配置描述 |
| expandBtnText       | `string`       |      | `展开同环比`   | 展开按钮文字   |
| resetBtnText       | `string`       |      | `恢复默认`   | 重置按钮文字   |
| onSubmit       | `(result: SwitcherResult) => void`       |      | -   | 关闭弹窗后，处理行列切换结果的回调函数   |

## SwitcherItem

行列头以及指标值得配置描述对象

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
| rows       | `string[]`           |       | `[]`  | 所有行头字段 id 的集合，按拖拽后顺序排列   |
| cols | `string[]`          |      | `[]`   | 所有列头字段 id 的集合，按拖拽后顺序排序   |
| values   | `string[]`           |      | `[]`   | 所有指标字段 id 的集合，按拖拽后顺序排序 |
| hiddenValues       | `string[]`       |      | `[]`   | 所有需要隐藏字段 id 的集合，按拖拽后顺序排序   |
