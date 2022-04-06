---
title: SpreadSheet
order: 1
---

功能描述：表格实例相关属性和方法。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/sheet-type/spread-sheet.ts)

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| dom | 挂载的容器节点 | `string` \| `HTMLElement` |
| theme | 主题配置 | [S2Theme](/zh/docs/api/general/S2Theme) |
| store | 存储的一些信息 | [Store](/zh/docs/api/basic-class/store) |
| dataCfg | 数据配置 | [S2DataConfig](/zh/docs/api/general/S2DataConfig) |
| options | 表格配置 | [S2Options](/zh/docs/api/general/S2Options) |
| dataSet | 表格数据集 （字段，数据，排序） | [BaseDataSet](/zh/docs/api/basic-class/base-data-set) |
| facet | 当前可视渲染区域 | [BaseFacet](/zh/docs/api/basic-class/base-facet) |
| tooltip | tooltip | [BaseTooltip](/zh/docs/api/basic-class/base-tooltip) |
| container | g-canvas 实例 | [Canvas](https://g.antv.vision/zh/docs/api/canvas) |
| backgroundGroup | 背景颜色区域 group | [Group](https://g.antv.vision/zh/docs/api/group) |
| foregroundGroup | 背景颜色区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| panelGroup | 可视范围单元格区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| panelScrollGroup | 可视范围单元格滚动区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| frozenRowGroup | 行头冻结区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| frozenColGroup | 列头冻结区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| frozenTrailingRowGroup | 行头底部冻结区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| frozenTrailingColGroup | 列头底部冻结区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| frozenTopGroup | 顶部冻结区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| frozenBottomGroup | 底部冻结区域 group |  [Group](https://g.antv.vision/zh/docs/api/group) |
| interaction | 交互 |  [Interaction](/zh/docs/api/basic-class/interaction) |
| hdAdapter | 高清适配 | [HdAdapter](https://github.com/antvis/S2/blob/master/packages/s2-core/src/ui/hd-adapter/index.ts) |
| on | 事件订阅 | (event: [S2Event](/zh/docs/manual/advanced/interaction/basic), listener: () => void) => void |
| emit | 事件发布 | (event: [S2Event](/zh/docs/manual/advanced/interaction/basic), ...args: any[]) => void |
| getDataSet | 获取数据集 | (options: [S2Options](/zh/docs/api/general/S2Options)) => [BaseDataSet](/zh/docs/api/basic-class/base-data-set) |
| isPivotMode | 是否是透视表 | `() => boolean` |
| isHierarchyTreeType | 是否是树状结构 | `() => boolean` |
| isScrollContainsRowHeader | 是否是包含行头的滚动 | `() => boolean` |
| isFrozenRowHeader | 是否是冻结行头状态 | `() => boolean` |
| isTableMode | 是否是明细表 | `() => boolean` |
| isValueInCols | 是否是数值置于行头 | `() => boolean` |
| clearDrillDownData | 清除下钻数据 | `(rowNodeId?: string) => void` |
| showTooltip | 显示 tooltip | (showOptions: [TooltipShowOptions](/zh/docs/api/common/custom-tooltip)) => void |
| showTooltipWithInfo |  显示 tooltip, 并且展示一些默认信息 | (event: `CanvasEvent | MouseEvent`, data: [TooltipData[]](/zh/docs/api/common/custom-tooltip), options?: [TooltipOptions](/zh/docs/api/common/custom-tooltip)) => void |
| hideTooltip | 隐藏 tooltip | `() => void` |
| destroyTooltip | 销毁 tooltip | `() => void` |
| registerIcons | 注册 自定义 svg 图标 （根据 `options.customSVGIcons`) | `() => void` |
| setDataCfg | 更新数据配置 | (dataCfg: [S2DataConfig](/zh/docs/api/general/S2DataConfig) ) => void |
| setOptions | 更新表格配置 | (options: [S2Options](/zh/docs/api/general/S2Options)) => void |
| render | 重新渲染表格，如果 reloadData = true, 则会重新计算数据 | `(reloadData: boolean) => void` |
| destroy | 销毁表格 | `() => void` |
| setThemeCfg | 更新主题配置 | (themeCfg: [ThemeCfg](/zh/docs/api/general/S2Theme)) => void |
| updatePagination | 更新分页 | (pagination: [Pagination](/zh/docs/api/general/S2Options#pagination)) => void |
| getContentHeight | 获取当前表格实际内容高度 | `() => number` |
| changeSheetSize （别名：changeSize) | 修改表格画布大小，不用重新加载数据 | `(width?: number, height?: number) => void` |
| getLayoutWidthType | 获取单元格宽度布局类型（LayoutWidthType: `adaptive（自适应）` \| `colAdaptive（列自适应）` \| `compact（紧凑）`） | () => `LayoutWidthType`|
| getRowNodes | 获取行头节点 | (level: number) => [Node[]](/zh/docs/api/basic-class/node/) |
| getColumnNodes | 获取列头节点 | (level: number) => [Node[]](/zh/docs/api/basic-class/node/) |
| updateScrollOffset | 更新滚动偏移 | (config: [OffsetConfig](#offsetconfig)) => void |
| getCell | 根据 event.target 获取当前 单元格 | (target: [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target)) => [S2CellType](/zh/docs/api/basic-class/base-cell#s2celltype) |
| getCellType | 根据 event.target 获取当前 单元格类型 | (target: [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target)) => [CellTypes](/zh/docs/api/basic-class/base-cell#celltypes) |
| getTotalsConfig | 获取总计小计配置 | (dimension: string) => [Total](/zh/docs/api/general/S2Options#totals) |
| getInitColumnLeafNodes | 获取初次渲染的列头叶子节点 （比如：隐藏列头前） | () => [Node[]](/zh/docs/api/basic-class/node/) |

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
  MERGED_CELL = 'mergedCell', // 合并后的单元格
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

### S2Constructor

功能描述：透视表内部构造参数

```ts
type S2MountContainer = string | HTMLElement;

type S2Constructor = [S2MountContainer, S2DataConfig, S2Options];
```
