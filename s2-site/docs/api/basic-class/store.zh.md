---
title: Store
order: 3
---

功能描述：存储一些信息。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/store/index.ts)

```ts
s2.store.get('key') // 获取
s2.store.set('key', value) // 存储
```

| 参数 | 说明                                   | 类型 |
| --- | --- | --- |
| scrollX | 水平滚动偏移 | `number` |
| scrollY | 垂直滚动偏移 | `number` |
| rowHeaderScrollX | 行头水平滚动偏移 | `number` |
| sortParam | 列头排序配置 | [SortParam](/docs/api/components/sheet-component/#sortparams) |
| drillDownIdPathMap | 下钻节点 id 和对应生成的 path 寻址路径 | `Map<string, number[][]>` |
| drillDownNode | 当前下钻节点 | [Node](/docs/api/basic-class/node) |
| drillItemsNum | 下钻数据的个数控制 | `number` |
| interactionStateInfo | 当前交互状态信息 | `number` |
| drillDownFieldInLevel | 下钻节点层级信息 | [PartDrillDownInfo[]](#partdrilldowninfo) |
| originalDataCfg | 原始数据配置 | [S2DataConfig](/docs/api/general/S2DataConfig)|
| panelBBox | 可视区域包裹盒模型 | [BBox](/docs/api/basic-class/base-bbox) |
| activeResizeArea | 当前调整大小区域 group | [Group](https://g.antv.antgroup.com/api/basic/group) |
| valueRanges | 条件格式值区间 | [ValueRanges](#valueranges) |
| initColLeafNodes | 初次渲染时的列头叶子节点 | [Node[]](/docs/api/basic-class/node)|
| hiddenColumnsDetail | 隐藏的列头详情 | [HiddenColumnsInfo[]](#hiddencolumnsinfo) |
| lastRenderedColumnFields | 上一次渲染的列头配置 | `string[]` |
| resized | 是否手动调整过宽高 | `boolean` |
| visibleActionIcons | hover 显示的 icon 缓存 | `GuiIcon[]` |
| lastClickedCell | 上一次点击的单元格 | `S2CellType<ViewMeta>` |
| initOverscrollBehavior | 初始滚动链状态 | `'auto' \| 'none' \| 'contain'` |
| sortMethodMap | 排序方式 | `Record<string, SortMethod>` |
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
  drillData: RawData[];
  // 下钻字段
  drillField: string;
}
```

## ValueRanges

```ts
export interface ValueRange {
  minValue?: number;
  maxValue?: number;
}

export type ValueRanges = Record<string, ValueRange>;
```

<embed src="@/docs/common/view-meta.zh.md"></embed>
