---
title: mini 图
order: 6
---

功能描述：在单元格内绘制 `mini` 图（支持 折线图、子弹图、柱状图）. 查看 [文档](/manual/advanced/custom/custom-chart#1-%E7%BB%98%E5%88%B6-mini-%E5%9B%BE%E8%A1%A8) 和 [示例](/zh/examples/custom/custom-cell/#mini-chart)

#### BaseChartData

功能描述：内置折线图、柱状图数据配置项，数据格式参考 [`G2`](https://g2.antv.antgroup.com/manual/core/api)

| 参数 | 说明 | 类型 | 必选  | 默认值 |
| --- | ---- | --- | ---- | ------ |
| type  | mini 图类型 | `line \| bar` |    ✓   |    |
| encode  | 编码方式，声明 x 位置通道或 y 位置通道绑定的对应的列数据| `{x: string; y: string}` |  ✓   |    |
| data  | 原始数据  | [Data[]](#data) |    |   ✓   |
| [key: string]  | 其他透传字段，用于自定义单元格的定制化展示   | `unknown` |   |  |

#### BulletValue

功能描述：内置子弹图数据配置项

| 参数 | 说明 | 类型 | 必选  | 默认值 |
| --- | ---- | --- | ---- | ------ |
| type  | mini 图类型 | `bullet` |    ✓   |  `bullet`  |
| measure  | 当前指标 | `number \| string` |  ✓   |    |
| target  | 目标值 | `number \| string` |  ✓   |    |
| [key: string]  | 其他透传字段，用于自定义单元格的定制化展示   | `unknown` |   |  |
