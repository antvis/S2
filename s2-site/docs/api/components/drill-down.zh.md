---
title: 维度下钻
order: 1
---

## PartDrillDown

类型：`object`，**可选**，默认值：`{}`

<description>功能描述：配置维度下钻，当前仅支持树形模式下的行头维度下钻</description>

| 参数       | 类型            | 必选 | 取值 | 默认值 | 功能描述   |
| ---------- | --------------- | ---- | ---- | ------ | ---------- |
| drillConfig | [DrillDownProps]('#drilldownprops') | ✓ |  | | 下钻菜单组件配置项 |
| drillItemsNum | `number` | | | -1 | 下钻完成后展示的个数，默认全部展示  |
| fetchData | [FetchCallBack](#fetchcallback) | ✓ | | | 点击下钻后的回调 |
| clearDrillDown | `{rowId: string;}` | | | | 清除下钻信息，当有指定的rowId 传递时清除对应rowId的下钻信息；如果参数是 空对象 {}，则清空所有的下钻信息 |
| displayCondition | `(meta: Node) => boolean` | | | | 配置下钻  `icon` 的展示条件， 同 HeaderActionIcon |

### FetchCallBack

```js
(meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>
```

功能描述：点击下钻后的回调
参数：[PartDrillDownInfo](#partdrilldowninfo)

#### PartDrillDownInfo

类型：`object`，**必选**，默认值：`{}`

<description>功能描述：下钻数据请求参数配置</description>

| 参数       | 类型            | 必选 | 取值 | 默认值 | 功能描述   |
| --- | --- | --- | --- | --- | --- |
| drillData |  <code class="language-text">Record<string, string \| number> </code> | ✓ |  |  | 下钻的数据 |
| drillField | `string` | ✓ |  |  | 下钻维度 value 值 |

### DrillDownProps

类型：`object`，**必选**，默认值：`{}`

<description>功能描述：下钻菜单组件配置项</description>

| 参数       | 类型            | 必选 | 取值 | 默认值 | 功能描述   |
| ---------- | --------------- | ---- | ---- | ------ | ---------- |
| dataSet | [DataSet[]](#dataset) | ✓ | | | 下钻数据源配置 |
| className | `string` | | | | 透传样式名 |
| titleText | `string` | | | | 下钻完成后展示的个数，默认全部展示  |
| searchText | `string` | | | | 点击下钻后的回调 |
| clearButtonText | `string` | | | |  |
| drillFields | `string[]` | | | | 允许下钻的维度 |
| disabledFields | `string[]` | | | | 不允许下钻的维度|
| getDrillFields | `Function` | | | | 内部获取当前下钻维度的回调 |
| setDrillFields | `Function` | | | | 内部设置当前下钻维度的回调 |

#### DataSet

类型：`object`，**必选**，默认值：`{}`

<description>功能描述：下钻数据源配置</description>

| 参数       | 类型            | 必选 | 取值 | 默认值 | 功能描述   |
| ---------- | --------------- | ---- | ---- | ------ | ---------- |
| name | `string` | ✓ | | | 展示名字 |
| value | `string` | ✓ | | | 具体值 |
| type | `string` |  | `text` <br> `location` <br> `date`  |  | 维度类型, 不同类型对应 icon 不同 |
| `disabled` | boolean |  |  |  | 是否允许选择 |
| `icon` | React.ReactNode |  |  |  | 列表 item 的 icon |
