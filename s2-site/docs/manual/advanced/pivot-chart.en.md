---
title: Pivot Composite Chart
order: 13
tag: Experimental
---

:::warning{title='Tip'}
Before reading this chapter, please ensure you are familiar with S2, the [`AntV/G`](https://g.antv.antgroup.com/) rendering engine, and the related content of [`AntV/G2`](https://g2.antv.antgroup.com/).
:::

A Pivot Composite Chart is a data visualization technique that uses a pivot table structure to further visualize data.

## Why Use a Pivot Composite Chart?

The data analysis capabilities of pivot tables are undoubtedly powerful. Taking `@antv/s2` as an example, combined with the ability of conditional formatting, it can create pivot table displays with a certain degree of visualization:
<br/>
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*WfLOT4ovkVcAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
<br/>
However, in terms of pure data visualization, there is still a gap compared to conventional charts. The Pivot Composite Chart is a product of wanting the best of both worlds. Based on the Cartesian structure of a pivot table, it possesses strong dimensional splitting capabilities while also having the visual expression of a chart in specific subdivided dimensions, as shown below:
<br/>
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*0h10SLUsCQgAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
<br/>

## Differences in Form from a Pivot Table

In a Pivot Composite Chart, the numerical area of a pivot table is transformed into a coordinate axis. The dimensional splitting on the other side only goes down to the second-to-last level, with the final dimension also being displayed as a coordinate axis. The coordinate axis of the column headers is always at the bottom, which is consistent with the common usage of coordinate axes in charts.

<br/>
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*DAldRoSCfGoAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
<br/>

Compared to a regular crosstab, a Pivot Composite Chart requires the configuration of coordinate axes in addition to row, column, and corner headers:

1. **Vertical Axis (`axisRowHeader`)**: Used to draw the vertical coordinate axis.
2. **Horizontal Axis (`axisColumnHeader`)**: Used to draw the horizontal coordinate axis.
3. **Intersection (`axisCornerHeader`)**: Similar to a corner header, used to draw the intersection area of the vertical and horizontal axes.

## Quick Start

### Install G2

:::warning{title="This feature depends on version `5.x` of G2. Please ensure you are using the correct version."}

```bash
pnpm add @antv/g2
```

:::

### Use PivotChartSheet

The Pivot Composite Chart is an extended feature of `@antv/s2`. All modules are imported from `@antv/s2/extends`:

```ts
import { PivotChartSheet } from '@antv/s2/extends';

async function bootstrap() {
  const container = document.getElementById('container');

  // Regular pivot table data is sufficient: https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json
  const s2 = new PivotChartSheet(container, dataCfg, s2Options);
  await s2.render(); // Returns a Promise
}

bootstrap();
```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart.ts" rid='pivot-chart' height='300'></playground>

### Switch Coordinate Systems

The two most commonly used coordinate systems in data visualization are the Cartesian and polar coordinate systems, both of which are two-dimensional:

1. **Cartesian coordinate system**: Also known as the rectangular coordinate system, it consists of two mutually perpendicular axes.
2. **Polar coordinate system**: Consists of a pole and a polar axis. Any point in the coordinate system can be represented by a polar radius and an angle (counterclockwise).

In a Pivot Composite Chart, you can switch between them in `s2Options`:

```ts
const s2Options = {
  chart: {
    // Switch to polar coordinates
    coordinate: 'polar',
    // Use the pie chart G2 spec
    dataCellSpec: {
      type: 'interval',
      transform: [{ type: 'stackY' }],
      coordinate: { type: 'theta', outerRadius: 0.8 },
    },
  },
}
```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart-polar.ts" rid='pivot-chart-polar' height='300'></playground>

In a Cartesian coordinate system layout, special `axisRowHeader` and `axisColumnHeader` are added to the row and column headers to draw the coordinate system. In a polar coordinate system layout, there is only one coordinate axis, and the row or column headers will only have either `axisRowHeader` or `axisColumnHeader`, depending on whether the data is placed in the column headers. It will display simple dimension information (text) and will be indistinguishable from regular row and column headers, without showing a coordinate system scale.

[View API documentation](/en/api/pivot-chart).

## Customization

The Pivot Composite Chart only provides the outer pivot frame. The specific G2 chart to be drawn is up to the user (a bar chart is drawn by default).

### Custom Spec

The Pivot Composite Chart exposes `dataCellSpec`, `axisRowCellSpec`, and `axisColCellSpec` to customize the G2 spec configuration for each area:

```ts
const s2Options = {
  chart: {
    dataCellSpec: {},
    axisRowCellSpec: {},
    axisColCellSpec: {},
  },
};
```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart-spec.ts" rid='pivot-chart-spec' height='300'></playground>

### Custom Cell

If you want to do more than just change the spec, the Pivot Composite Chart also exposes `AxisRowCell`, `AxisColCell`, `AxisCornerCell`, and `PivotChartDataCell` to fully customize the cells in each area:

```ts
import type { S2Options } from '@antv/s2';
import { AxisColCell, AxisRowCell, PivotChartDataCell } from '@antv/s2/extends';

class CustomDataCell extends PivotChartDataCell {}

class CustomRowCell extends AxisRowCell {}

class CustomColCell extends AxisColCell {}

const s2Options: S2Options = {
  dataCell: (viewMeta, spreadsheet) =>
    new CustomDataCell(viewMeta, spreadsheet),
  axisRowCell: (node, s2, headConfig) => {
    return new CustomRowCell(node, s2, headConfig);
  },
  axisColCell: (node, s2, headConfig) => {
    return new CustomColCell(node, s2, headConfig);
  },
};
```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart-cell.ts" rid='pivot-chart-cell' height='300'></playground>

## Limitations

As a special form of table, the Pivot Composite Chart is not currently compatible with all the display forms of a regular pivot table. It has the following limitations:

1. Only tiled mode is supported; [tree mode](/en/examples/basic/pivot/#tree) is not supported.
2. [Custom row and column headers](/en/examples/layout/custom-header-group/#custom-pivot-row-header) are not supported.
3. [Custom order of measure dimension levels](/en/examples/custom/custom-layout/#custom-value-order) is not supported.
