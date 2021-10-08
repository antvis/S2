---
title: SpreadSheet
order: 7
---

## SpreadSheet

功能描述：表格实例。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/sheet-type/spread-sheet.ts)

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- | --- |
| dom | `string | HTMLElement` |  |  |  | 挂载的容器节点 |
| theme | [S2Theme](/zh/docs/api/general/S2Theme) |  |  |  | 主题配置 |
| store | [Store](#store) |  |  |  | 存储的一些信息 |
| dom | `string | HTMLElement` |  |  |  | 挂载的容器节点 |
| dataCfg | [S2DataConfig](/zh/docs/api/general/S2DataConfig) |  |  |  | 数据配置 |
| options | [S2Options](/zh/docs/api/general/S2Options) |  |  |  | 表格配置 |
| dataSet | [BaseDataSet](#BaseDataSet) |  |  |  | 表格数据集 （字段，数据，排序） |
| facet | [BaseFacet](#BaseFacet) |  |  |  | 当前可视渲染区域 |
| tooltip | [BaseTooltip](#BaseTooltip) |  |  |  | tooltip |
| container | [Canvas](https://g.antv.vision/zh/docs/api/canvas) |  |  |  | g-canvas 实例 |
| backgroundGroup | [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 背景颜色区域 group |
| foregroundGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 背景颜色区域 group |
| panelGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 可视范围单元格区域 group |
| panelScrollGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 可视范围单元格滚动区域 group |
| frozenRowGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 行头冻结区域 group |
| frozenColGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 列头冻结区域 group |
| frozenTrailingRowGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 行头底部冻结区域 group |
| frozenTrailingColGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 列头底部冻结区域 group |
| frozenTopGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 顶部冻结区域 group |
| frozenBottomGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 底部冻结区域 group |
| interaction |  [Interaction](#interaction) |  |  |  | 交互 |
| hdAdapter | [HdAdapter](https://github.com/antvis/S2/blob/master/packages/s2-core/src/ui/hd-adapter/index.ts) |  |  |  | 高清适配 |
| on | `(event: name, listener: () => void) => void` |  |  |  | 事件订阅 |
| emit | `(event: name, ...args: any[]) => void` |  |  |  | 事件发布 |
| getDataSet | `(options: S2Options) => BaseDataSet` |  |  |  | 获取数据集 |
| isPivotMode | `() => boolean` |  |  |  | 是否是透视表 |
| isHierarchyTreeType | `() => boolean` |  |  |  | 是否是树状结构 |
| isScrollContainsRowHeader | `() => boolean` |  |  |  | 是否是包含行头的滚动 |
| isFreezeRowHeader | `() => boolean` |  |  |  | 是否是冻结行头状态 |
| isTableMode | `() => boolean` |  |  |  | 是否是明细表 |
| isValueInCols | `() => boolean` |  |  |  | 是否是数值置于行头 |
| clearDrillDownData | `(rowNodeId?: string) => void` |  |  |  | 清除下钻数据 |
| showTooltip | `(showOptions: TooltipShowOptions) => void` |  |  |  | 显示 tooltip |
| showTooltipWithInfo | `(event: CanvasEvent | MouseEvent, data: TooltipData[], options?: TooltipOptions) => void` |  |  |  | 显示 tooltip, 并且展示一些默认信息 |
| hideTooltip | `() => void` |  |  |  | 隐藏 tooltip |
| destroyTooltip | `() => void` |  |  |  | 销毁 tooltip |
| registerIcons | `() => void` |  |  |  | 注册 自定义 svg 图标 (根据 `options.customSVGIcons`) |
| setDataCfg | `(dataCfg: S2DataConfig) => void` |  |  |  | 更新数据配置 |
| setOptions | `(dataCfg: S2Options) => void` |  |  |  | 更新表格配置 |
| render | `(reloadData: boolean) => void` |  |  |  | 重新渲染表格, 如果 reloadData = true, 则会重新计算数据 |
| destroy | `() => void` |  |  |  | 销毁表格 |
| setThemeCfg | `(themeCfg: ThemeCfg) => void` |  |  |  | 更新主题配置 |
| updatePagination | `(pagination: Pagination) => void` |  |  |  | 更新分页 |
| getContentHeight | `() => number` |  |  |  | 获取当前表格实际内容高度 |
| changeSize | `(width: number, height: number) => void` |  |  |  | 修改表格画布大小，不用重新加载数据 |
| isColAdaptive | `(width: number, height: number) => void` |  |  |  | 是否是自适应单元格 |
| getRowNodes | `(level: number) => Node[]` |  |  |  | 获取行头节点 |
| getColumnNodes | `(level: number) => Node[]` |  |  |  | 获取列节点 |
| updateScrollOffset | `(config: OffsetConfig) => void` |  |  |  | 更新滚动偏移 |
| getCell | `(target: EventTarget) => S2CellType` |  |  |  | 根据 event.target 获取当前 单元格 |
| getCellType | `(target: EventTarget) => CellTypes` |  |  |  | 根据 event.target 获取当前 单元格 |
| getTotalsConfig | `(dimension: string) => Total` |  |  |  | 获取总计小计配置 |
| getInitColumnNodes | `() => Node[]` |  |  |  | 获取初次渲染的列头信息 (比如: 隐藏列头前) |
| hideColumns | `(fields: string[]) => Total` |  |  |  | 隐藏列头 |

### Store

功能描述：存储一些信息

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
| drillDownIdPathMap | `Map<string, number[][]>` |  |  |  | 下钻节点id和对应生成的 path寻址路径 |
| drillDownNode | `Node` |  |  |  | 当前下钻节点 |
| drillItemsNum | `number` |  |  |  | 下钻数据的个数控制 |
| interactionStateInfo | `number` |  |  |  | 当前交互状态信息 |
| drillDownFieldInLevel | `PartDrillDownInfo[]` |  |  |  | 下钻节点层级信息 |
| originalDataCfg | [S2DataConfig](/zh/docs/api/general/S2DataConfig)|  |  |  | 原始数据配置 |
| drillDownMeta | `Record<string, any>` |  |  |  | 下钻元数据 |
| panelBBox | `BBox` |  |  |  | 可视区域包裹盒模型 |
| activeResizeArea | [Group](https://g.antv.vision/zh/docs/api/group) |  |  |  | 当前调整大小区域 group |
| valueRanges | `ValueRanges` |  |  |  | ? |
| initColumnNodes | `Node[]` |  |  |  | 初次渲染时的列头节点 |
| hiddenColumnsDetail | `HiddenColumnsInfo[]` |  |  |  | 隐藏的列头详情 |
| [key: string] | `unknown` |  |  |  | 其他任意字段 |

### S2MountContainer

```ts
type S2MountContainer = string | HTMLElement;
```

### OffsetConfig

功能描述：滚动偏移配置

```ts
interface OffsetConfig {
  offsetX?: {
    value: number | undefined;
    animate?: boolean;
  };
  offsetY?: {
    value: number | undefined;
    animate?: boolean;
  };
}
```

### CellTypes

功能描述：单元格类型

```ts
export enum CellTypes {
  DATA_CELL = 'dataCell',  // 数值单元格
  HEADER_CELL = 'headerCell', // 行列头单元格
  ROW_CELL = 'rowCell', // 行头单元格
  COL_CELL = 'colCell', // 列头单元格
  CORNER_CELL = 'cornerCell', // 角头单元格
  MERGED_CELLS = 'mergedCells', // 合并后的单元格
}
```

### BBox

功能描述：盒模型

```ts
type BBox = {
    x: number;
    y: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
};
```
