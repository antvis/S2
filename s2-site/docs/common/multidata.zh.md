---
title: MultiData
order: 0
---


### MultiData

object **必选**,_default：null_

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/zh/examples/react-component/sheet#strategy)

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| :------------- | :----------------- | :--------- | :----- | :--- |
| values           | 格式化后的数据，直接展示在dataCfg中 | `(string | number)[][]`   |  ✓   |
| originalValues | 原始数据，用于原始数据导出 | `(string | number)[][]`  |  |      |
| label        | 用作单元格小标题，单独占一行展示    | `string` |    |      |
| [key: string]       | 其他透传字段，用于自定义单元格的定制化展示       | `unknown` | ``   |      |
