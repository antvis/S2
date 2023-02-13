---
title: mini Chart
order: 6
---

#### renderMiniChart

Draw mini charts in cells (support line charts, bullet charts, histograms). [View examples](/examples/react-component/sheet/#strategy-mini-chart)

```ts
 renderMiniChart = (cell: S2CellType, data?: BaseChartData | BulletValue) => void;
```

#### BaseChartData

Line chart, histogram data configuration items, data format refer to `g2`

| parameter      | illustrate                                                                                                   | type                     | required | Defaults |
| -------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------ | -------- | -------- |
| type           | mini-chart type                                                                                              | `line \| bar`            | ✓        |          |
| encode         | Encoding method, declare the corresponding column data bound to the x position channel or y position channel | `{x: string; y: string}` | ✓        |          |
| data           | Raw data                                                                                                     | [Data\[\]](#data)        |          | ✓        |
| \[key: string] | Other transparent fields for customized display of custom cells                                              | `unknown`                |          |          |

#### BulletValue

Bullet chart data configuration items

| parameter      | illustrate                                                      | type               | required | Defaults |
| -------------- | --------------------------------------------------------------- | ------------------ | -------- | -------- |
| type           | mini-chart type                                                 | `bullet`           | ✓        | `bullet` |
| measure        | current indicator                                               | `number \| string` | ✓        |          |
| target         | target value                                                    | `number \| string` | ✓        |          |
| \[key: string] | Other transparent fields for customized display of custom cells | `unknown`          |          |          |
