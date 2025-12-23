---
title: Conditional Formatting
order: 4

---

In data visualization and analysis, conditional formatting is a common feature that allows users to visually emphasize key information in the data. S2 is a data visualization library that supports flexible conditional formatting features:

* Text formatting
* Background formatting
* Interval (bar chart) formatting
* Icon formatting

The image below visually demonstrates the four types of conditional formatting:

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*-lr0QJRCxkEAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

**Data cells fully support all 4 types of conditional formatting, while header cells (corner, row, and column) only support text, background, and icon formatting (bar charts are not applicable to header cells).**

## Quick Start

The `S2` conditional formatting feature is configured through the [`Conditions`](/api/general/s2-options#conditions) property in `s2Options`.

```ts
const s2Options = {
  width: 600,
  height: 600,
  // Configure conditional formatting through conditions
  conditions: {
    text: [
      {
        // Dimension field, supports regex, e.g., /^price+$/
        field: "price",
        mapping(fieldValue, data) {
          return {
            // fill is the only mandatory field for text formatting, used to specify the text color
            fill: "#5B8FF9",
          };
        },
      },
    ],
  },
};
```

## Configuration Explanation

The [Conditions property](/api/general/s2-options#conditions) can be configured with four different fields, corresponding to the four types of formatting.

* `text`, `background`, `interval`, and `icon` are all arrays that inherit from the [Condition](/api/general/s2-options#condition) type.
  * They each contain `field` and `mapping` properties.
  * If a field ID matches multiple formatting rules in the same scope, **the last rule will be applied**.
* `icon` is slightly different, being an array of the [IconCondition](/api/general/s2-options#iconcondition) type.
  * It includes an additional `position` field to specify the icon's position relative to the text (either to the left or right).

### field

`field` is used to specify which fields the formatting should be applied to. Its value range varies depending on the table type:

* For a pivot table, `field` can be a value or regex matching `rows`, `columns`, or `values`, and it applies to row headers, column headers, corner headers, and data cells.
* For a detail table, `field` can be a value or regex matching `columns`, and it applies to data cells.

<table
  style="width: 100%; outline: none; border-collapse: collapse;"
>
  <tbody>
    <tr style="height: 33px;" >
      <td style="text-align: center;width:74px;">
        Pivot Table
      </td>
    <td>
       <Playground path="analysis/conditions/demo/text.ts" rid='pivot-text' height='300'></playground>
    </td>
    </tr>
    <tr>
      <td style="text-align: center;width:74px;">
        Detail Table
      </td>
      <td>
        <Playground path="analysis/conditions/demo/table-text.ts" rid='table-text' height='300'></playground>
      </td>
    </tr>
  </tbody>
</table>

### ​mapping

The `mapping` function is a key part of this feature. It's a callback function for handling the formatting. If `mapping` returns a nullish value, no formatting will be applied to that cell.

```ts
export type ConditionMapping<T = unknown> = (
  fieldValue: number | string,
  data: RawData,
  cell?: S2CellType,
) => ConditionMappingResult<T>;
```

`mapping` receives three arguments:

* `fieldValue`: The value of the current cell.
* `data`: For a data cell, this is the corresponding data object. For a header cell, this is the [Node](/api/basic-class/node) information.
* `cell`: The instance of the current cell. If the first two arguments are not enough for your needs, you can use this to get any other data you want.

The return type `ConditionMappingResult<T>` varies for different formatting types, mainly in the generic `T`. S2 provides complete type hints.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*wgC1QoXRWkAAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="Type hint" />

> You can also refer to [condition.ts](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/interface/condition.ts) for the specific type definitions.

🎨 For detailed configuration of conditional formatting, refer to the [Conditions API](/api/general/s2-options#conditions) documentation.

## Features

### Custom Icon Position

By setting the `position` property in the `icon` formatting, you can place the icon to the left or right of the text.

```ts
const s2Options = {
  conditions: {
    icon: [
      {
        field: 'number',
        position: 'left',
        mapping() {
          return {
            icon: 'CellUp',
            fill: '#2498D1',
          };
        },
      },
    ],
  },
}
```

The icon for the `price` field is on the right, and the icon for the `cost` field is on the left:

<Playground path="analysis/conditions/demo/icon.ts" rid='icon' height="200"></playground>

When custom header action icons are also present, the condition icon is strongly associated with the cell value, so it is placed adjacent to the text:

* `[header action icons] [condition icon] [text]`
* `[text] [condition icon] [header action icons]`

<Playground path="analysis/conditions/demo/icon-with-action.ts" rid='icon-with-action' height="200"></playground>

> For more details on custom icons, see the [Custom Icon](/manual/advanced/custom/custom-icon) chapter.

### Custom Bar Chart Range

By explicitly setting `isCompare` to `true` in the return value of the `mapping` function for `interval` formatting, and specifying `maxValue` and `minValue`, you can customize the range of the bar chart.

:::info{title="Tip"}
If `isCompare` is `false` or not returned, the `maxValue` and `minValue` will default to the **maximum and minimum values** of that field across all chart data.
:::

You can also use `cell.getValueRange()` to get the default min/max range and dynamically decide whether to customize it.

```ts
const s2Options = {
  conditions: {
    interval: [
      {
        field: 'number',
        mapping(value, data, cell) {
          const defaultValueRange = cell.getValueRange();

          console.log('Default min/max value range:', defaultValueRange);

          return {
            fill: '#80BFFF',
            // Customize the bar chart range
            isCompare: true,
            maxValue: 8000,
            minValue: 300,
            fieldValue: Number(value) > 7900 ? 10 : value,
          };
        },
      },
    ],
  }
}
```

Conditional formatting defaults to using the current cell's value for drawing. However, for bar charts, since you can customize the range, you might also need to process the current value based on that range. You can use `fieldValue` in the return value of the `mapping` function to specify a new value for drawing.

The `price` field uses a custom range, while the `cost` field uses the default:

<Playground path="analysis/conditions/demo/interval.ts" rid='interval'></playground>

### Bidirectional Bar Chart

When the bar chart's range includes both positive and negative values, you can use the `fill` property in the `mapping` function's return value to create a bidirectional bar chart with different colors for positive and negative values:

```ts
const s2Options = {
  conditions: {
    interval: [
      {
        field: 'number',
        mapping(value) {
          return {
            fill: value >= 0 ? '#80BFFF' : '#F4664A',
          };
        },
      },
    ],
  }
}
```

<Playground path="analysis/conditions/demo/bidirectional-interval.ts" rid='bidirectional'></playground>

📊 [See more conditional formatting examples](/examples/analysis/conditions#bidirectional-interval).

### Gradient Bar Chart

`S2` uses the [AntV/G](https://g.antv.antgroup.com/guide/getting-started) rendering engine for its underlying graphics. Thanks to its powerful drawing capabilities, the `fill` field is not limited to just colors; it can also be used with [gradients](https://g.antv.antgroup.com/api/css/gradient), [patterns](https://g.antv.antgroup.com/api/css/pattern), etc.

```ts
const s2Options = {
  conditions: {
    interval: [
      {
        field: 'number',
        mapping(fieldValue) {
          const maxValue = 7789;
          const minValue = 352;
          const range = (fieldValue - minValue) / (maxValue - minValue);

          const color = getGradient(range, '#95F0FF', '#3A9DBF');

          return {
            fill: `l(0) 0:#95F0FF 1:${color}`,
            isCompare: true,
            maxValue,
          };
        },
      },
    ],
  }
}
```

The `price` field uses a gradient color:

<Playground path="analysis/conditions/demo/gradient-interval.ts" rid='gradient'></playground>

📊 [See more conditional formatting examples](/examples/analysis/conditions#gradient-interval).

### Enable Intelligent Text Color Inversion

You can enable this by setting `intelligentReverseTextColor` to `true` in the return value of the `mapping` function for `background` formatting.
When the background color is dark and the text color does not meet the [AA level](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) of the WCAG 2.0 guidelines, the text color will automatically change to white. When the background is light, the text color defaults to black.
Priority: `intelligentReverseTextColor` of `background condition` < `fill` of `text condition`.

```ts
const s2Options = {
  conditions: {
    background: [
      {
        field: 'number',
        mapping() {
          return {
            // fill is the only mandatory field for background formatting, used to specify the background color
            fill: '#000',
            intelligentReverseTextColor: true,
          };
        },
      },
    ],
  }
}
```

<Playground path="analysis/conditions/demo/intelligent-background.ts" rid='intelligent-reverse-text-color'></playground>

### Differentiating Between Corner, Row, and Column Headers

In pivot table mode, if the `field` for conditional formatting is a row or column header dimension, the corresponding corner header cell will also be formatted. You can differentiate between them using the three arguments of the `mapping` function:

<Playground path="analysis/conditions/demo/distinguish-cell.ts" rid='distinguish-cell'></playground>

📊 [See more conditional formatting examples](/examples/analysis/conditions#intelligent-background).
