---
title: 透视组合图拓展 S2Options
order: 4
tag: New
---

功能描述：透视组合图对 S2Options 配置的拓展。查看 [文档](/manual/advanced/pivot-chart) 和 [示例](/examples/custom/custom-shape-and-chart#pivot-chart)

| 参数           | 说明                    | 类型                                                | 默认值 | 必选 |
| -------------- | ----------------------- | --------------------------------------------------- | ------ | ---- |
| chart          | 图形配置                | [Chart](#chart)                                     |        |      |
| axisRowCell    | 自定义竖轴单元格 cell   | [CellCallback](/api/general/s2-options#cellcallback) |        |      |
| axisColCell    | 自定义横轴单元格 cell   | [CellCallback](/api/general/s2-options#cellcallback) |        |      |
| axisCornerCell | 自定义交叉轴单元格 cell | [CellCallback](/api/general/s2-options#cellcallback) |        |      |

### Chart

功能描述：透视组合图 g2 配置。

| 参数         | 说明                   | 类型            | 默认值                                  | 必选 |
| ------------ | ---------------------- | --------------- | --------------------------------------- | ---- |
| coordinate   | 图形坐标系               | `'cartesian' \| 'polar'` |     `'cartesian'`                                  |      |
| dataCellSpec | 数据单元格自定义的 [g2 spec](https://g2.antv.antgroup.com/manual/core/api) | `G2Spec \| ((cell: PivotChartDataCell) => G2Spec)` |      |  |
| axisRowCellSpec | 竖轴单元格自定义的 [g2 axis component spec](https://g2.antv.antgroup.com/spec/component/axis) | `[AxisComponent](AxisComponent) \| ((cell: AxisRowCell) => AxisComponent)` |      |  |
| axisColSpec | 横轴单元格自定义的 [g2 axis component spec](https://g2.antv.antgroup.com/spec/component/axis) | `AxisComponent \| ((cell: AxisColCell) => AxisComponent)` |      |  |
