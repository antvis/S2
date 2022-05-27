---
title: 自定义行列排列顺序
order: 1
---

## LayoutArrange

```js
LayoutArrange = (spreadsheet: SpreadSheet, parent: Node, field: string, fieldValues: string[]) => string[];
```

功能描述：自定义顺序

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| spreadsheet | [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| node | [Node](/zh/docs/api/basic-class/node) | ✓ |  |   当前渲染的 node 节点 |
| field | `string` | ✓ |  |   当前的字段名 |
| fieldValues | `string[]` | ✓ |  |   当前字段值 |
