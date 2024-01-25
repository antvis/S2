---
title: cell callback
order: 7
---

## CellCallback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => G.Group;
```

功能描述：自定义单元格

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | ---  | --- | --- |
| node | [Node](#node) | ✓ |    | 当前渲染的 node 节点 |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓ |    | 表格实例 |
| restOptions | `unknown[]` |  |    | 不定参数，传递额外的信息 |
