---
title: SpreadSheet
order: 1
---

功能描述：表格实例相关属性和方法。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/sheet-type/spread-sheet.ts)

| 参数 | 类型 | 默认值 | 功能描述 |
| --- | --- | --- | --- |
| dom | `string | HTMLElement` |   | 挂载的容器节点 |
| theme | [S2Theme](/zh/docs/api/general/S2Theme) |    | 主题配置 |
| store | [Store](/zh/docs/api/basic-class/store) |    | 存储的一些信息 |
| dataCfg | [S2DataConfig](/zh/docs/api/general/S2DataConfig) |   | 数据配置 |
| options | [S2Options](/zh/docs/api/general/S2Options) |   | 表格配置 |
| dataSet | [BaseDataSet](/zh/docs/api/basic-class/base-data-set) |   | 表格数据集 （字段，数据，排序） |
| facet | [BaseFacet](/zh/docs/api/basic-class/base-facet) |  | 当前可视渲染区域 |
| tooltip | [BaseTooltip](/zh/docs/api/basic-class/base-tooltip) |   | tooltip |
| container | [Canvas](https://g.antv.vision/zh/docs/api/canvas) |   | g-canvas 实例 |
| backgroundGroup | [Group](https://g.antv.vision/zh/docs/api/group) |   | 背景颜色区域 group |
| foregroundGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |   | 背景颜色区域 group |
| panelGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |    | 可视范围单元格区域 group |
| panelScrollGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |    | 可视范围单元格滚动区域 group |
| frozenRowGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  | 行头冻结区域 group |
| frozenColGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |    | 列头冻结区域 group |
| frozenTrailingRowGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |    | 行头底部冻结区域 group |
| frozenTrailingColGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |    | 列头底部冻结区域 group |
| frozenTopGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |   | 顶部冻结区域 group |
| frozenBottomGroup |  [Group](https://g.antv.vision/zh/docs/api/group) |  | 底部冻结区域 group |
| interaction |  [Interaction](/zh/docs/api/basic-class/interaction) |   | 交互 |
| hdAdapter | [HdAdapter](https://github.com/antvis/S2/blob/master/packages/s2-core/src/ui/hd-adapter/index.ts) |  | 高清适配 |
| on | `(event: name, listener: () => void) => void` |    | 事件订阅 |
| emit | `(event: name, ...args: any[]) => void` |   | 事件发布 |
| getDataSet | `(options: S2Options) => BaseDataSet` |    | 获取数据集 |
| isPivotMode | `() => boolean` |  | 是否是透视表 |
| isHierarchyTreeType | `() => boolean` |  | 是否是树状结构 |
| isScrollContainsRowHeader | `() => boolean` |  | 是否是包含行头的滚动 |
| isFreezeRowHeader | `() => boolean` | | 是否是冻结行头状态 |
| isTableMode | `() => boolean` |  | 是否是明细表 |
| isValueInCols | `() => boolean` |   | 是否是数值置于行头 |
| clearDrillDownData | `(rowNodeId?: string) => void` |   | 清除下钻数据 |
| showTooltip | `(showOptions: TooltipShowOptions) => void` |    | 显示 tooltip |
| showTooltipWithInfo | `(event: CanvasEvent | MouseEvent, data: TooltipData[], options?: TooltipOptions) => void` |  |  显示 tooltip, 并且展示一些默认信息 |
| hideTooltip | `() => void` |   | 隐藏 tooltip |
| destroyTooltip | `() => void` |  | 销毁 tooltip |
| registerIcons | `() => void` |    | 注册 自定义 svg 图标 （根据 `options.customSVGIcons`) |
| setDataCfg | `(dataCfg: S2DataConfig) => void` |   | 更新数据配置 |
| setOptions | `(dataCfg: S2Options) => void` |    | 更新表格配置 |
| render | `(reloadData: boolean) => void` |   | 重新渲染表格，如果 reloadData = true, 则会重新计算数据 |
| destroy | `() => void` |   | 销毁表格 |
| setThemeCfg | `(themeCfg: ThemeCfg) => void` |  | 更新主题配置 |
| updatePagination | `(pagination: Pagination) => void` |   | 更新分页 |
| getContentHeight | `() => number` |   | 获取当前表格实际内容高度 |
| changeSize | `(width: number, height: number) => void` |    | 修改表格画布大小，不用重新加载数据 |
| isColAdaptive | `(width: number, height: number) => void` |   | 是否是自适应单元格 |
| getRowNodes | `(level: number) => Node[]` |    | 获取行头节点 |
| getColumnNodes | `(level: number) => Node[]` |   | 获取列节点 |
| updateScrollOffset | `(config: OffsetConfig) => void` |    | 更新滚动偏移 |
| getCell | `(target: EventTarget) => S2CellType` |  | 根据 event.target 获取当前 单元格 |
| getCellType | `(target: EventTarget) => CellTypes` |   | 根据 event.target 获取当前 单元格类型 |
| getTotalsConfig | `(dimension: string) => Total` |   | 获取总计小计配置 |
| getInitColumnNodes | `() => Node[]` |    | 获取初次渲染的列头信息 （比如：隐藏列头前） |
| hideColumns | `(fields: string[]) => Total` |   | 隐藏列头 |

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
