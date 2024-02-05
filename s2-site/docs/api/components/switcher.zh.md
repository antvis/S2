---
title: 维度切换组件
order: 3
---

## React 维度切换组件 <Badge>@antv/s2-react</Badge>

### Switcher 组件 Props

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| rows | 行头配置描述 | [SwitcherField](#switcherfield) |  |  |
| columns | 列头配置描述 | [SwitcherField](#switcherfield) |  |  |
| values | 指标配置描述 | [SwitcherField](#switcherfield) |  |  |
| disabled | 是否禁用 | `boolean` | `false` |  |
| title | 打开切换弹窗的触发节点 | `ReactNode` |  |  |
| contentTitleText | 弹窗默认标题文字 | `string` | 行列切换 |  |
| resetText | 重置按钮文字 | `string` | 恢复默认 |  |
| innerContentClassName | 弹出框内容样式名 | `string` |  |  |
| allowExchangeHeader| 是否允许指标在行列维度之间相互切换 | `boolean` |  |  `true`|
| onSubmit | 关闭弹窗后，处理行列切换结果的回调函数 | `(result:` [SwitcherResult](#switcherresult)`) => void` |  |  |
| popover | 弹窗配置，透传给 `antd` 的 `Popover` 组件 | [PopoverProps](https://ant.design/components/popover-cn/#API) |  |  |

### SwitcherField

行列头以及指标值的配置描述对象

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| items | 配置字段对象 | [SwitcherItem](#switcheritem)`[]` | - | ✓ |
| expandable | 是否打开展开子项的 checkbox 用于控制展开和隐藏子项 | `boolean` | `false` |  |
| expandText | 展开子项的 checkbox 对应的文字 | `string` | `展开子项` |  |
| selectable | 是否打开字段的 checkbox 用于控制显隐 | `boolean` | `false` |  |
| allowEmpty | 当前维度是否可以将全部子项拖出 | `boolean` | `true` |  |

### SwitcherItem

配置字段对象

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| id | 字段 id | `string` | - | ✓ |
| displayName | 字段显示名字，该字段不存在时直接显示 id | `string` | - |  |
| checked | 字段是否需要显示 | `boolean` | `true` |  |
| children | 如果字段存在关联子项（如：同环比），使用该属性配置子项 | [SwitcherItem](#switcheritem)`[]` | `[]` |  |

### SwitcherResult

关闭弹窗后，处理行列切换结果的回调函数的参数

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| rows | 所有行头字段操作结果 | [SwitcherResultItem](#switcherresultitem) |  |  |
| columns | 所有列头字段操作结果 | [SwitcherResultItem](#switcherresultitem) |  |  |
| values | 所有指标字段操作结果 | [SwitcherResultItem](#switcherresultitem) |  |  |

### SwitcherResultItem

关闭弹窗后，每个维度结果的描述对象

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| items | 全部字段的被**扁平化**集合，按拖拽后顺序排序 | [SwitcherItem](#switcheritem)`[]` | `[]` |  |
| hideItems | 所有需要隐藏字段被**扁平化**的集合，按拖拽后顺序排序 | [SwitcherItem](#switcheritem)`[]` | `[]` |  |

### SwitcherCfgProps

内置 header 组件配置参数，本质上是 Switcher 组件 Props 的子集

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| sheetType | [表格类型](/api/components/sheet-component) | `pivot` |  |  |  |
| title | 打开切换弹窗的触发节点 | `ReactNode` |  |  |
| contentTitleText | 弹窗默认标题文字 | `string` | 行列切换 |  |
| resetText | 重置按钮文字 | `string` | 恢复默认 |  |
| innerContentClassName | 弹出框内容样式名 | `string` |  |  |
| popover | 弹窗配置，透传给 `antd` 的 `Popover` 组件 | [PopoverProps](https://ant.design/components/popover-cn/#API) |
| disabled | 是否禁用 | `boolean` | `false` |  |
