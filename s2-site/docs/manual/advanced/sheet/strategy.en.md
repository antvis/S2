---
title: Strategy Sheet
order: 9
tag: Updated
---

In order to meet more analysis scenarios, S2 provides an out-of-the-box scenario table component - trend analysis table. With it, you can easily implement a scene table that displays multiple indicators in a cell.

<img src="https://gw.alipayobjects.com/zos/antfincdn/detasbG55j/5f1c0072-0761-463c-ac44-2fe7b300d041.png" width="600" alt="preview">

As shown in the figure, the table form of this type of table is characterized by the ability to display multiple indicator data in the **same data cell** and **column header cell** , which is used for **data indicators that need to pay attention to time trends** , and to **view year-on-** year comparisons and other scenarios. Line headers can [customize the hierarchical structure](/zh/docs/manual/advanced/custom/custom-tree) . Therefore, this component can be used directly when there is such an analysis requirement.

## premise

The trend analysis table component uses various capabilities provided by S2 for integration, so it is recommended that you have read the following chapters before reading this chapter:

* [basic concept](/zh/docs/manual/basic/base-concept)
* [field tag](/zh/docs/manual/basic/conditions/)
* [Customize row and column headers](/zh/docs/manual/advanced/custom/custom-tree)

## Get started quickly

### s2DataConfig

[check the details](https://gw.alipayobjects.com/os/bmw-prod/3c2009ce-8c2a-451d-b29a-619a796c7903.json)

#### s2Options

<details><summary>check the details</summary><pre> <code class="language-js">const&#x26;nbsp;s2Options&#x26;nbsp;=&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;width:&#x26;nbsp;600,
&#x26;nbsp;&#x26;nbsp;height:&#x26;nbsp;480,
&#x26;nbsp;&#x26;nbsp;//&#x26;nbsp; 角头文本
&#x26;nbsp;&#x26;nbsp;cornerText:&#x26;nbsp;'指标层级',
&#x26;nbsp;&#x26;nbsp;//&#x26;nbsp; 条件格式
&#x26;nbsp;&#x26;nbsp;conditions:&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;//&#x26;nbsp; 同环比数值映射规则
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;text:&#x26;nbsp;[
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;field:&#x26;nbsp;'number',
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;mapping:&#x26;nbsp;(value,&#x26;nbsp;cellInfo)&#x26;nbsp;=>&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;{&#x26;nbsp;meta,&#x26;nbsp;colIndex&#x26;nbsp;}&#x26;nbsp;=&#x26;nbsp;cellInfo;
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;if&#x26;nbsp;(
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;colIndex&#x26;nbsp;===&#x26;nbsp;0&#x26;nbsp;||
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;!value&#x26;nbsp;||
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;!meta?.fieldValue
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;)&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;return&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;fill:&#x26;nbsp;'#000',
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;};
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;}
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;return&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;fill:&#x26;nbsp;value&#x26;nbsp;>&#x26;nbsp;0&#x26;nbsp;?&#x26;nbsp;'#FF4D4F'&#x26;nbsp;:&#x26;nbsp;'#29A294',
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;};
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;],
&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;style:&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;dataCell:&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;valuesCfg:&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;//&#x26;nbsp; 原始数据字段，用于原始数据导出和&#x26;nbsp;tooltip&#x26;nbsp; 展示
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;originalValueField:&#x26;nbsp;'originalValues',
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;},
};
</code></pre></details>

```ts
import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import '@antv/s2-react/dist/style.min.css';

ReactDOM.render(
  <SheetComponent
    sheetType="strategy"
    dataCfg={s2DataConfig}
    options={s2Options}
  />,
  document.getElementById('container'),
);
```

<Playground path="react-component/sheet/demo/strategy.tsx" rid="container"></Playground>

## configuration explanation

### S2DataConfig configuration

* Data source: [MultiData](/zh/docs/api/general/S2DataConfig#multidata) configuration item, one cell corresponds to multiple pieces of data, divided into raw data and formatted data

```ts
const data = {
  "measure-a": {
    values: ["1", "2"],
    originalValues: [1, 2]
  }
}
```

* Row Header Hierarchy: [Custom Hierarchy](/zh/docs/manual/advanced/custom/custom-tree)

```ts
const fields = {
  rows: [
    {
      key: 'a-1',
      title: '节点 1',
      children: []
    }
  ]
}
```

* Virtual column: When there are year-on-year indicators in the trend analysis table, the name of the corresponding year-on-year indicator will be displayed through virtual columns. At this time, the table will display two-level column headers

```ts
import { EXTRA_COLUMN_FIELD } from '@antv/s2'

const fields = {
  columns: ['date', EXTRA_COLUMN_FIELD]
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/SsDx1wGE%24/119a04f5-daac-43ca-9773-c8a66547280c.png" width="600" alt="preview">

Virtual examples are the same as ordinary fields, you can customize the formatting

```ts
const s2DataConfig = {
  meta: [
    // 日期列头 格式化
    {
      field: 'date',
      name: '时间',
      formatter: (value) => `${value}年`,
    },
    // 同环比名称（虚拟列头） 格式化
    {
      field: EXTRA_COLUMN_FIELD,
      formatter: (value, data, meta) => {
        console.log(data, meta);
        return meta?.colIndex === 0 ? '自定义标题' : value;
      },
    },
  ],
};
```

**⚠️ Notes:**

* If it does not involve the original data copy export class requirements, `originalValues` can not be declared
* When there is only a single indicator (that is, there is no comparison with the ring), the virtual column ( `EXTRA_COLUMN_FIELD` ) may not be configured
* The order of column header indicators corresponds to the display order of cell indicators

### S2Options configuration

* The trend analysis table will force the row header layout to a tree mode, that is, `hierarchyType: 'tree'`
* The corner header text can be customized through `options.cornerText`
* Coloring logic configuration can be configured in `options.conditions` , no need to specify the `field` parameter, the usage reference [field tag](/zh/docs/manual/basic/conditions) currently only supports the text color channel

<embed src="@/docs/common/custom/customTreeNode.en.md"></embed>

## Tooltips

The `Tooltip` of the trend analysis table uses the [customization capabilities](/docs/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E5%86%85%E5%AE%B9) provided by `S2` to [customize](https://github.com/antvis/S2/blob/f35ff01400384cd2f3d84705e9daf75fc11b0149/packages/s2-react/src/components/sheets/strategy-sheet/index.tsx#L105) the`行头 (row)` ,`列头 (col)` and`数值 (data)` , and can be imported separately in the `@antv/s2-react` package

| Configuration item name   | illustrate                             | type                            | Defaults                                                   | required |
| ------------------------- | -------------------------------------- | ------------------------------- | ---------------------------------------------------------- | -------- |
| cell                      | current cell                           | `S2CellType`                    | ✓                                                          |          |
| defaultTooltipShowOptions | Default tooltip display configuration  | `TooltipShowOptions<ReactNode>` |                                                            |          |
| label                     | title                                  | \`ReactNode                     | (cell: S2CellType, defaultLabel: ReactNode) => ReactNode\` |          |
| showOriginalValue         | Whether to display raw values (if any) | `boolean`                       | `false`                                                    |          |

```tsx
import { StrategySheetRowTooltip, StrategySheetColTooltip, StrategySheetDataTooltip } from '@antv/s2-react'

const s2Options = {
  tooltip: {
    content: (cell) => <StrategySheetDataTooltip cell={cell} label={label}/>
  }
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/MCgZSZyEm/df084a59-407c-4a69-bc93-1f12eb01b019.png" width="600" alt="preview">

### custom title

By default, the name of the row header node is used as the title of the Tooltip, and the content can be customized through the `label`

```tsx
// 字符串
<StrategySheetDataTooltip cell={cell} label={"自定义标题"}/>

// 自定义组件
<StrategySheetDataTooltip cell={cell} label={(cell, defaultLabel) => `${defaultLabel}（自定义标题`} />
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/dosQkhLBp/fbe5a635-60ad-4e55-9a23-858842b977ac.png" width="600" alt="preview">

### show raw data

After `showOriginalValue` is turned on, it will read the `originalValues` data corresponding to the current Tooltip (if any), and display the original data together, that is,`展示值（原始值）`

```tsx
<StrategySheetDataTooltip cell={cell} showOriginalValue />
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/xe57%261A5E/9e0ae256-7823-498c-8d88-740ff30bff5a.png" width="600" alt="preview">

### Rendering the same loop than additional nodes

You can use `renderDerivedValue` to customize the value of the same ring ratio, such as replacing it with the original value

* `currentValue` : current value
* `originalValue` : the original value
* `cell` : the cell information corresponding to the current Tooltip

```tsx
<StrategySheetDataTooltip
  cell={cell}
  renderDerivedValue={(currentValue, originalValue, cell) => <span>({originalValue})</span> }
/>
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/jOYhdqOr6/a43696e1-3cdb-49b7-9906-4053c3f7e65b.png" width="600" alt="preview">

## Configure the mini map

In the indicator trend analysis scenario, usually we want to see the global trend of the data. Trend analysis not only needs to include specific ups and downs, but it is also better to show the trend chart within a fixed period of time, or the completion status (progress) of indicators, so we provide the drawing of mini charts in the table. In order to reduce the dependence on external component libraries, we built a very lightweight mini library based on `@antv/g` drawing, which can draw bullet charts, line charts and histograms in cells with minimal performance overhead.

<Playground path="react-component/sheet/demo/strategy-mini-chart.tsx" rid="container2"></Playground>

The configuration is as follows:

<embed src="@/docs/common/mini-chart.en.md"></embed>

If you want to change the Mini graph style configuration, you can refer to the [theme configuration]('/zh/api/general/s2theme#minicharttheme')
