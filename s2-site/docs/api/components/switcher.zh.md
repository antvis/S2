---
title: 维度切换组件
order: 3
---

## Switcher 组件 Props

| 属性                  | 类型                                                    | 必选 | 默认值   | 功能描述                               |
| :-------------------- | :------------------------------------------------------ | :--- | :------- | :------------------------------------- |
| rows                  | [SwitcherField](#switcherfield)                         |      |          | 行头配置描述                           |
| columns               | [SwitcherField](#switcherfield)                         |      |          | 列头配置描述                           |
| values                | [SwitcherField](#switcherfield)                         |      |          | 指标配置描述                           |
| title                 | `ReactNode`                                             |      |          | 打开切换弹窗的触发节点                 |
| contentTitleText      | `string`                                                |      | 行列切换 | 弹窗默认标题文字                       |
| resetText             | `string`                                                |      | 恢复默认 | 重置按钮文字                           |
| triggerClassName      | `string`                                                |      |          | 触发按钮样式名                         |
| overlayClassName      | `string`                                                |      |          | 弹出框样式名                           |
| innerContentClassName | `string`                                                |      |          | 弹出框内容样式名                       |
| onSubmit              | `(result:` [SwitcherResult](#switcherresult)`) => void` |      |          | 关闭弹窗后，处理行列切换结果的回调函数 |
| popover              | [PopoverProps](https://ant.design/components/popover-cn/#API) |      |          | 弹窗配置, 透传给 `antd` 的 `Popover` 组件 |

## SwitcherField

行列头以及指标值得配置描述对象

| 属性       | 类型                              | 必选 | 默认值     | 功能描述                                           |
| :--------- | :-------------------------------- | :--- | :--------- | :------------------------------------------------- |
| items      | [SwitcherItem](#switcheritem)`[]` | ✓    |            | 配置字段对象                                       |
| expandable | `boolean`                         |      | `false`    | 是否打开展开子项的 checkbox 用于控制展开和隐藏子项 |
| expandText | `string`                          |      | `展开子项` | 展开子项的 checkbox 对应的文字                     |
| selectable | `boolean`                         |      | `false`    | 是否打开字段的 checkbox 用于控制显隐               |

## SwitcherItem

配置字段对象

| 属性        | 类型                              | 必选 | 默认值 | 功能描述                                               |
| :---------- | :-------------------------------- | :--- | :----- | :----------------------------------------------------- |
| id          | `string`                          | ✓    |        | 字段 id                                                |
| displayName | `string`                          |      |        | 字段显示名字，该字段不存在时直接显示 id                |
| checked     | `boolean`                         |      | `true` | 字段是否需要显示                                       |
| children    | [SwitcherItem](#switcheritem)`[]` |      | `[]`   | 如果字段存在关联子项（如：同环比），使用该属性配置子项 |

## SwitcherResult

关闭弹窗后，处理行列切换结果的回调函数的参数

| 属性    | 类型                                      | 必选 | 默认值 | 功能描述             |
| :------ | :---------------------------------------- | :--- | :----- | :------------------- |
| rows    | [SwitcherResultItem](#switcherresultitem) |      |        | 所有行头字段操作结果 |
| columns | [SwitcherResultItem](#switcherresultitem) |      |        | 所有列头字段操作结果 |
| values  | [SwitcherResultItem](#switcherresultitem) |      |        | 所有指标字段操作结果 |

## SwitcherResultItem

关闭弹窗后，每个维度结果的描述对象

| 属性      | 类型                              | 必选 | 默认值 | 功能描述                                             |
| :-------- | :-------------------------------- | :--- | :----- | :--------------------------------------------------- |
| items     | [SwitcherItem](#switcheritem)`[]` |      | `[]`   | 全部字段的被**扁平化**集合，按拖拽后顺序排序         |
| hideItems | [SwitcherItem](#switcheritem)`[]` |      | `[]`   | 所有需要隐藏字段被**扁平化**的集合，按拖拽后顺序排序 |
