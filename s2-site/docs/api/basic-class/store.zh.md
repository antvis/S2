---
title: Store
order: 3
---

功能描述：存储一些信息。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/common/store/index.ts)

```ts
this.spreadsheet.store.get('key') // 获取
this.spreadsheet.store.set('key', value) // 存储
```

| 参数 | 说明                                   | 类型 |
| --- | --- | --- |
| scrollX | 水平滚动偏移 | `number` |
| scrollX | 垂直滚动偏移 | `number` |
| hRowScrollX | 垂直行头滚动偏移 | `number` |
| sortParam | 列头排序配置 | [SortParam](#SortParam) |
| drillDownIdPathMap | 下钻节点 id 和对应生成的 path 寻址路径 | `Map<string, number[][]>` |
| drillDownNode | 当前下钻节点 | [Node](/zh/docs/api/base-class/node) |
| drillItemsNum | 下钻数据的个数控制 | `number` |
| interactionStateInfo | 当前交互状态信息 | `number` |
| drillDownFieldInLevel | 下钻节点层级信息 | [PartDrillDownInfo[]](#partdrilldowninfo) |
| originalDataCfg | 原始数据配置 | [S2DataConfig](/zh/docs/api/general/S2DataConfig)|
| panelBBox | 可视区域包裹盒模型 | [BBox](#BBox) |
| activeResizeArea | 当前调整大小区域 group | [Group](https://g.antv.vision/zh/docs/api/group) |
| valueRanges | ? | [ValueRanges](#ValueRanges) |
| initColumnLeafNodes | 初次渲染时的列头叶子节点 | [Node[]](/zh/docs/api/base-class/node)|
| hiddenColumnsDetail | 隐藏的列头详情 | [HiddenColumnsInfo[]](#hiddencolumnsinfo) |
| [key: string] | 其他任意字段 | `unknown` |

## HiddenColumnsInfo

```ts
interface HiddenColumnsInfo {
  // 当前显示的兄弟节点之前所隐藏的节点
  hideColumnNodes: Node[];
  // 当前隐藏列所对应展示展开按钮的兄弟节点
  displaySiblingNode: Node;
}
```

## PartDrillDownInfo

```ts
interface PartDrillDownInfo {
  // 下钻数据
  drillData: Record<string, string | number>[];
  // 下钻字段
  drillField: string;
}
```
