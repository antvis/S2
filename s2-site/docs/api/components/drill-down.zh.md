---
title: 维度下钻
order: 2
---

:::warning{title="注意"}
维度下钻功能需要满足以下两个前置条件：

- `透视表`: 即 `sheetType="pivot"`
- `树状模式`: 即 `hierarchyType="tree"`

:::

## React 下钻组件 <Badge>@antv/s2-react</Badge>

[​查看示例](/examples/react-component/drill-dwon#for-pivot)

```jsx
const s2Options = {
  width: 600,
  height: 480,
  hierarchyType: 'tree'
};

<SheetComponent
  options={s2Options}
  partDrillDown={PartDrillDown}
  sheetType="pivot"
/>
```

## Vue 下钻组件 <Badge type="success">@antv/s2-vue</Badge>

[查看示例](https://codesandbox.io/s/vue-drilldown-demo-8p1lmv?file=/src/App.vue:6385-6396)

```tsx
const s2Options = {
  width: 600,
  height: 480,
  hierarchyType: 'tree'
};

<template>
  <SheetComponent
    ref="s2"
    :sheetType="pivot"
    :partDrillDown="partDrillDown"
    :options="s2Options"
  />
</template>
```

## 公共 API

<description>功能描述：配置维度下钻，当前仅支持透视模式的树形结构下，行头维度下钻</description>

### PartDrillDown

类型：`object`，**可选**，默认值：`{}`

| 参数 | 说明 | 类型 | 默认值 | 必选 | 备注                | 版本 |
| --- | --- | --- | --- | --- |-------------------| --- |
| drillConfig | 下钻菜单组件配置项 | [DrillDownProps](#drilldownprops) | - | ✓ |     | |
| drillItemsNum | 下钻完成后展示的个数，默认全部展示 | `number` | -1 |  |                   | |
| fetchData | 点击下钻后的回调 | [FetchCallBack](#fetchcallback) | - | ✓ |                   | |
| clearDrillDown | 清除下钻信息，当有指定的 rowId 传递时清除对应 rowId 的下钻信息；如果参数是 空对象 {}，则清空所有的下钻信息 | `{rowId: string;}` | - |  | 仅 `React` 组件支持此属性 | |
| displayCondition | 配置下钻 `icon` 的展示条件， 同 HeaderActionIcon | `(meta: Node, iconName: string) => boolean` | - |  | 仅 `React` 组件支持此属性 | `1.26.0` 回传 `iconName` 并按单个 icon 控制显隐 |

注意：PartDrillDown 中 `drillConfig`、`displayCondition` 字段会影响下钻模式的重渲，请注意使用 memo 或 state 控制其可变性。

#### FetchCallBack

```js
(meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>
```

功能描述：点击下钻后的回调参数：[PartDrillDownInfo](#partdrilldowninfo)

##### PartDrillDownInfo

<description>功能描述：下钻数据请求参数配置</description>

| 参数 | 说明 | 类型 | 必选 | 默认值 |
| --- | --- | --- | --- | --- |
| drillData | 下钻的数据 | <code class="language-text">Record<string, string \| number>[] </code> | ✓ |  |
| drillField | 下钻维度 value 值 | `string` | ✓ |  |

#### DrillDownProps

<description>功能描述：下钻菜单组件配置项</description>

| 参数 | 说明                                    | 类型 | 默认值 | 必选 | 备注 |
| --- |---------------------------------------| --- | --- | --- | ---  |
| dataSet | 下钻数据源配置                               | [DataSet[]](#dataset) |  | ✓ |  |
| className | 透传样式名                                 | `string` |  |  |  |
| titleText | 标题                                    | `string` |  |  |  |
| searchText | 搜索框文案                                 | `string` |  |  |  |
| clearButtonText | 重置按钮文案                                | `string` |  |  |  |
| disabledFields | 不允许下钻的维度                              | `string[]` |  |  |  |
| getDrillFields | 内部获取当前下钻维度的回调                         | `Function` |  |  |  |
| setDrillFields | 内部设置当前下钻维度的回调                         | `Function` |  |  |  |
| extra | 自定义插入的节点，插入在搜索框和下钻菜单中间 | `ReactNode` |  |  | 仅 `React` 组件支持此属性 |
| drillFields | 允许下钻的维度      | `string[]` |  |  | 仅 `React` 组件支持此属性  |

##### DataSet

<description>功能描述：下钻数据源配置</description>

| 参数 | 说明 | 类型 | 默认值 | 必选 |
| --- | --- | --- | --- | --- |
| name | 展示名字 | `string` |  | ✓ |
| value | 具体值 | `string` |  | ✓ |
| type | 维度类型，不同类型对应 icon 不同 | `text` \| `location` \| `date` |  |  |
| disabled | 是否允许选择 | `boolean` |  |  |
| icon | 列表 item 的 icon | `ReactNode` |  |  |
