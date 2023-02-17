---
title: DrillDown
order: 2
---

## React Drilldown Components

```jsx
const s2Options = {
  width: 600,
  height: 480,
  hierarchyType: 'tree', // 树形结构
};

<SheetComponent
  options={s2Options}
  partDrillDown={PartDrillDown}
  sheetType="pivot"  // 透视模式
/>
```

​📊 Check out [the React version of the drilldown demo](/examples/react-component/drill-dwon#for-pivot)

## Vue drilldown component

The drill-down component can only be used in table and perspective mode.

```vue
const s2Options = {
  width: 600,
  height: 480,
  hierarchyType: 'tree',
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

​📊 Check out [the Vue version of the drilldown demo](https://codesandbox.io/s/vue-drilldown-demo-8p1lmv?file=/src/App.vue:6385-6396)

## public API

Function description: Configure dimension drill-down, currently only supports drill-down in the perspective mode tree structure, row header dimension drill-down

### Part Drill Down

Type: `object` , **optional** , default: `{}`

| parameter        | illustrate                                                                                                                                                                                                      | type                                        | Defaults | required | Remark                                        | Version                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------- | -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| drillConfig      | Drill down menu component configuration items                                                                                                                                                                   | [DrillDownProps](#drilldownprops)           | -        | ✓        |                                               |                                                                                             |
| drillItemsNum    | The number of displayed items after the drill-down is completed, and all are displayed by default                                                                                                               | `number`                                    | -1       |          |                                               |                                                                                             |
| fetchData        | Callback after clicking the drilldown                                                                                                                                                                           | [FetchCallBack](#fetchcallback)             | -        | ✓        |                                               |                                                                                             |
| clearDrillDown   | Clear the drill-down information. When the specified rowId is passed, clear the drill-down information corresponding to the rowId; if the parameter is an empty object {}, clear all the drill-down information | `{rowId: string;}`                          | -        |          | Only `React` components support this property |                                                                                             |
| displayCondition | Configure the display conditions of the drilldown `icon` , same as HeaderActionIcon                                                                                                                             | `(meta: Node, iconName: string) => boolean` | -        |          | Only `React` components support this property | `1.26.0` returns the `iconName` and presses a single icon to control the display and hiding |

Note: The `drillConfig` and `displayCondition` fields in PartDrillDown will affect the re-rendering of the drill-down mode, please note that use memo or state to control its variability.

#### FetchCallBack

```js
(meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>
```

Function description: Callback parameters after clicking the drilldown: [PartDrillDownInfo](#partdrilldowninfo)

##### PartDrillDownInfo

Type: `object` , **required** , default value: `{}`

Function description: Drill down data request parameter configuration

| parameter  | illustrate                       | type                                                                      | required | Defaults |
| ---------- | -------------------------------- | ------------------------------------------------------------------------- | -------- | -------- |
| drillData  | drill down data                  | <code class="language-text">Record&#x3C;string, string | number>[]</code> | ✓        |          |
| drillField | Drill down dimension value value | `string`                                                                  | ✓        |          |

#### DrillDownProps

Type: `object` , **required** , default value: `{}`

Function description: Drill down menu component configuration items

| parameter       | illustrate                                                                           | type                    | Defaults | required | Remark                                        |
| --------------- | ------------------------------------------------------------------------------------ | ----------------------- | -------- | -------- | --------------------------------------------- |
| dataSet         | Drill down to data source configuration                                              | [DataSet\[\]](#dataset) |          | ✓        |                                               |
| className       | Transparent style name                                                               | `string`                |          |          |                                               |
| titleText       | title                                                                                | `string`                |          |          |                                               |
| searchText      | Search Box Copywriting                                                               | `string`                |          |          |                                               |
| clearButtonText | reset button copy                                                                    | `string`                |          |          |                                               |
| disabledFields  | Dimensions that do not allow drill-down                                              | `string[]`              |          |          |                                               |
| getDrillFields  | Internally get the callback of the current drill-down dimension                      | `Function`              |          |          |                                               |
| setDrillFields  | Internally set the callback of the current drill-down dimension                      | `Function`              |          |          |                                               |
| extra           | Customize the inserted node, inserted between the search box and the drill-down menu | `ReactNode`             |          |          | Only `React` components support this property |
| drillFields     | Dimensions that allow drill-down                                                     | `string[]`              |          |          | Only `React` components support this property |

##### DataSet

Type: `object` , **required** , default value: `{}`

Function description: drill down data source configuration

| parameter | illustrate                                                    | type                           | Defaults | required |
| --------- | ------------------------------------------------------------- | ------------------------------ | -------- | -------- |
| name      | show name                                                     | `string`                       |          | ✓        |
| value     | specific value                                                | `string`                       |          | ✓        |
| type      | Dimension type, different types correspond to different icons | `text` \| `location` \| `date` |          |          |
| disabled  | Is it allowed to choose                                       | `boolean`                      |          |          |
| icon      | The icon of the list item                                     | `ReactNode`                    |          |          |
