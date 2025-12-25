---
title: Pivot Chart Extended S2Options
order: 4

---

Description: Extended S2Options configuration for the Pivot Chart. See [documentation](/en/manual/advanced/pivot-chart) and [examples](/en/examples/custom/custom-shape-and-chart#pivot-chart)

| Parameter      | Description                           | Type                                                | Default | Required |
| -------------- | ------------------------------------- | --------------------------------------------------- | ------- | -------- |
| chart          | Chart configuration                   | [Chart](#chart)                                     |         |          |
| axisRowCell    | Custom vertical axis cell             | [CellCallback](/en/api/general/s2-options#cellcallback) |         |          |
| axisColCell    | Custom horizontal axis cell           | [CellCallback](/en/api/general/s2-options#cellcallback) |         |          |
| axisCornerCell | Custom axis intersection corner cell  | [CellCallback](/en/api/general/s2-options#cellcallback) |         |          |

### Chart

Description: G2 configuration for the Pivot Chart.

| Parameter       | Description                   | Type            | Default                                 | Required |
| --------------- | ----------------------------- | --------------- | --------------------------------------- | -------- |
| coordinate      | Chart coordinate system       | `'cartesian' \| 'polar'` |     `'cartesian'`                      |          |
| dataCellSpec    | Custom [G2 spec](https://g2.antv.antgroup.com/manual/api) for data cells | `G2Spec \| ((cell: PivotChartDataCell) => G2Spec)` |      |  |
| axisRowCellSpec | Custom [G2 axis component spec](https://g2.antv.antgroup.com/manual/component/axis) for vertical axis cells | `[AxisComponent](AxisComponent) \| ((cell: AxisRowCell) => AxisComponent)` |      |  |
| axisColSpec     | Custom [G2 axis component spec](https://g2.antv.antgroup.com/manual/component/axis) for horizontal axis cells | `AxisComponent \| ((cell: AxisColCell) => AxisComponent)` |      |  |
