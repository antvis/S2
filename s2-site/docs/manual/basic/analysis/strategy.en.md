---
title: Strategy Sheet
order: 9
---

In order to meet more analysis scenarios, S2 provides an out-of-the-box scenario table component - trend analysis table. With it, you can easily implement a scene table that displays multiple indicators in a cell.

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/detasbG55j/5f1c0072-0761-463c-ac44-2fe7b300d041.png" width="600" alt="preview">

As shown in the figure, the table form of this type of table is characterized by the ability to display multiple indicator data in the same data cell and column header cell, which is used for data indicators that need to pay attention to time trends, and to view year-on-year comparisons and other scenarios. Line headers can customize the hierarchical structure. Therefore, this component can be used directly when there is such an analysis requirement.

## Get started quickly

### [DataConfig](https://gw.alipayobjects.com/os/bmw-prod/3c2009ce-8c2a-451d-b29a-619a796c7903.json)

Click to view the trend analysis table options configuration

```js
const s2Options = {
  width: 600,
  height: 480,
  cornerText: '指标层级',
  hierarchyType: 'customTree',
  conditions: {
    text: [
      {
        field: 'number',
        mapping: (value, cellInfo) => {
          const { meta, colIndex } = cellInfo;
          if (
            colIndex === 0 ||
            !value ||
            !meta?.fieldValue
          ) {
            return {
              fill: '#000',
            };
          }
          return {
            fill: value > 0 ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
  },
  style: {
    cellCfg: {
      valuesCfg: {
        originalValueField: 'originalValues',
      },
    },
  },
};
```

```ts
import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import '@antv/s2-react/dist/style.min.css';

ReactDOM.render(
  <SheetComponent
    dataCfg={s2DataCfg}
    options={s2Options}
    sheetType="strategy"
  />,
  document.getElementById('container'),
);
```

<playground data-mdast="html" path="react-component/sheet/demo/strategy.tsx" rid="container"></playground>

## configuration explanation

### S2DataConfig configuration

Mainly use the two configuration items `S2DataConfig` `MultiData` and `CustomTreeItem`

### MultiData

object is **required** , *default: null*

Function description: used to support custom data cell rendering of multiple indicator types. Example: [Trend Analysis Table](/examples/react-component/sheet#strategy)

| Configuration item name | illustrate                                                      | type      | Defaults      | required |
| ----------------------- | --------------------------------------------------------------- | --------- | ------------- | -------- |
| values                  | The formatted data is directly displayed in dataCfg             | (string   | number)\[]\[] | ✓        |
| originalValues          | raw data, for raw data export                                   | (string   | number)\[]\[] |          |
| label                   | Used as a subtitle of a cell, displayed on a separate line      | `string`  |               |          |
| \[key: string]          | Other transparent fields for customized display of custom cells | `unknown` | \`\`          |          |

⚠️ Notes

* If it does not involve the original data copy and export class requirements, `originalValues` may not be provided
* The order of column header indicators corresponds to the display order of cell indicators

<embed data-mdast="html" src="@/docs/common/custom/customTreeItem.en.md"></embed>

### S2Options configuration

* Must specify `hierarchyType: 'customTree'`
* Coloring logic configuration can be configured in `options.conditions` , no need to specify the `field` parameter, the usage reference [field tag](/docs/manual/basic/conditions) currently only supports the text color channel

## Tooltips

The `Tooltip` of the trend analysis table uses the [customization capabilities](/docs/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E5%86%85%E5%AE%B9) provided by `S2` to [customize](https://github.com/antvis/S2/blob/f35ff01400384cd2f3d84705e9daf75fc11b0149/packages/s2-react/src/components/sheets/strategy-sheet/index.tsx#L105) the`行头 (row)` ,`列头 (col)` and`数值 (data)` , and can be imported separately in the `@antv/s2-react` package

| Configuration item name   | illustrate                             | type                            | Defaults                                                         | required |
| ------------------------- | -------------------------------------- | ------------------------------- | ---------------------------------------------------------------- | -------- |
| cell                      | current cell                           | `S2CellType`                    | ✓                                                                |          |
| defaultTooltipShowOptions | Default tooltip display configuration  | `TooltipShowOptions<ReactNode>` |                                                                  |          |
| label                     | title                                  | \`ReactNode                     | (cell: S2CellType, defaultLabel: ReactNode) => React.ReactNode\` |          |
| showOriginalValue         | Whether to display raw values (if any) | `boolean`                       | `false`                                                          |          |

```ts
import { StrategySheetRowTooltip, StrategySheetColTooltip, StrategySheetDataTooltip } from '@antv/s2-react'

const s2Options = {
  tooltip: {
    content: (cell) => <StrategySheetDataTooltip cell={cell} label={label}/>
  }
}
```

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/MCgZSZyEm/df084a59-407c-4a69-bc93-1f12eb01b019.png" width="600" alt="preview">

### custom title

By default, the name of the row header node is used as the title of the Tooltip, and the content can be customized through the `label`

```tsx
// 字符串
<StrategySheetDataTooltip cell={cell} label={"自定义标题"}/>

// 自定义组件
<StrategySheetDataTooltip cell={cell} label={(cell, defaultLabel) => `${defaultLabel}（自定义标题`} />
```

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/dosQkhLBp/fbe5a635-60ad-4e55-9a23-858842b977ac.png" width="600" alt="preview">

### show raw data

After `showOriginalValue` is turned on, it will read the `originalValues` data corresponding to the current Tooltip (if any), and display the original data together, that is,`展示值（原始值）`

```tsx
<StrategySheetDataTooltip cell={cell} showOriginalValue />
```

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/xe57%261A5E/9e0ae256-7823-498c-8d88-740ff30bff5a.png" width="600" alt="preview">

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

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/jOYhdqOr6/a43696e1-3cdb-49b7-9906-4053c3f7e65b.png" width="600" alt="preview">

## Configure the mini map

In the indicator trend analysis scenario, usually we want to see the global trend of the data. Trend analysis not only needs to include specific ups and downs, but it is also better to show the trend chart within a fixed period of time, or the completion status (progress) of indicators, so we provide the drawing of mini charts in the table. In order to reduce the dependence on external component libraries, we built a very lightweight mini library based on `@antv/g` drawing, which can draw bullet charts, line charts and histograms in cells with minimal performance overhead.

<playground data-mdast="html" path="react-component/sheet/demo/strategy-mini-chart.tsx" rid="container2"></playground>

The configuration is as follows:

<embed data-mdast="html" src="@/docs/common/mini-chart.en.md"></embed>

If you want to change the Mini graph style configuration, you can refer to the [theme configuration](/api/general/s2theme#minicharttheme)
