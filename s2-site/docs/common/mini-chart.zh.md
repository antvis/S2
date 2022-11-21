---
title: mini 图
order: 6
---

#### renderMiniChart

在单元格内绘制 mini 图（支持 折线图、子弹图、柱状图）

```ts
 renderMiniChart = (cell: S2CellType, data?: BaseChartData | BulletValue) => void;
```

#### BaseChartData

折线图、柱状图数据配置项，数据格式参考 `g2`

| 参数 | 说明 | 类型 | 必选  | 默认值 |
| --- | ---- | --- | ---- | ------ |
| type  | mini 图类型 | `string` (line/bar) |    ✓   |    |
| encode  | 编码方式, 声明 x 位置通道或 y 位置通道绑定的对应的列数据| `{x: string; y: string}` |  ✓   |    |
| data  | 原始数据  | [Data[]](#data) |    |   ✓   |
| [key: string]  | 其他透传字段，用于自定义单元格的定制化展示   | `unknown` |   |  |

#### BulletValue

子弹图数据配置项

| 参数 | 说明 | 类型 | 必选  | 默认值 |
| --- | ---- | --- | ---- | ------ |
| type  | mini 图类型 | `string` (bullet) |    ✓   |  bullet  |
| measure  | 当前指标 | `number/string` |  ✓   |    |
| target  | 目标值 | `number/string` |  ✓   |    |
| [key: string]  | 其他透传字段，用于自定义单元格的定制化展示   | `unknown` |   |  |
