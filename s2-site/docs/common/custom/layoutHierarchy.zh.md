---
title: 自定义层级结构
order: 2
---

## LayoutHierarchy

```js
LayoutHierarchy = (spreadsheet: SpreadSheet, node: Node) => LayoutHierarchyReturnType;
```

功能描述：自定义层级结构

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| spreadsheet | [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| node | [Node](/zh/docs/api/basic-class/node) | ✓ |  |   当前渲染的 node 节点 |

```ts
interface LayoutHierarchyReturnType {
  push?: Node[];
  unshift?: Node[];
  delete?: boolean;
}
```
