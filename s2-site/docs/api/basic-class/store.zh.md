---
title: Store
order: 3
---

功能描述：存储一些信息. [详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/common/store/index.ts)

```ts
this.spreadsheet.store.get('key') // 获取
this.spreadsheet.store.set('key', value) // 存储
```

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- | --- |
| scrollX | `number` |  |  |  | 水平滚动偏移 |
| scrollX | `number` |  |  |  | 垂直滚动偏移 |
| hRowScrollX | `number` |  |  |  | 垂直行头滚动偏移 |
| sortParam | [SortParam](#SortParam) |  |  |  | 列头排序配置 |
| lastReachedBorderId | `{rowId: string, colId: string}` |  |  |  | ? |
| drillDownIdPathMap | `Map<string, number[][]>` |  |  |  | 下钻节点 id 和对应生成的 path 寻址路径 |
| drillDownNode | [Node](/zh/docs/api/base-class/node) |  |  |  | 当前下钻节点 |
| drillItemsNum | `number` |  |  |  | 下钻数据的个数控制 |
| interactionStateInfo | `number` |  |  |  | 当前交互状态信息 |
| drillDownFieldInLevel | [PartDrillDownInfo[]](#partdrilldowninfo) |  |  |  | 下钻节点层级信息 |
| originalDataCfg | [S2DataConfig](/zh/docs/api/general/S2DataConfig)|  |  |  | 原始数据配置 |
| drillDownMeta | `Record<string, any>` |  |  |  | 下钻元数据 |
| panelBBox | [BBox](#BBox) |  |  |  | 可视区域包裹盒模型 |
| activeResizeArea | [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 当前调整大小区域 group |
| valueRanges | [ValueRanges](#ValueRanges) |  |  |  | ? |
| initColumnNodes | [Node[]](/zh/docs/api/base-class/node)|  |  |  | 初次渲染时的列头节点 |
| hiddenColumnsDetail | [HiddenColumnsInfo[]](#hiddencolumnsinfo) |  |  |  | 隐藏的列头详情 |
| [key: string] | `unknown` |  |  |  | 其他任意字段 |

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
