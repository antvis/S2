---
title: SpreadSheet
order: 1
tag: Updated
---

功能描述：表格实例相关属性和方法。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/sheet-type/spread-sheet.ts)

```ts
const s2 = new PivotSheet()

s2.isPivotMode()
```

| 参数 | 说明                                                                                                                     | 类型 | 版本 |
| --- |------------------------------------------------------------------------------------------------------------------------| --- |----|
| dom | 挂载的容器节点                                                                                                                | `string` \| `HTMLElement`   |  |
| theme | 主题配置                                                                                                                   | [S2Theme](/docs/api/general/S2Theme) |    |
| store | 存储的一些信息                                                                                                                | [Store](/docs/api/basic-class/store) |    |
| dataCfg | 数据配置                                                                                                                   | [S2DataConfig](/docs/api/general/S2DataConfig) |    |
| options | 表格配置                                                                                                                   | [S2Options](/docs/api/general/S2Options) |    |
| dataSet | 表格数据集 （字段，数据，排序）                                                                                                       | [BaseDataSet](/docs/api/basic-class/base-data-set) |    |
| facet | 当前可视渲染区域                                                                                                               | [BaseFacet](/docs/api/basic-class/base-facet) |    |
| tooltip | 提示信息                                                                                                                | [BaseTooltip](/docs/api/basic-class/base-tooltip) |    |
| container | g-canvas 实例                                                                                                            | [Canvas](https://g.antv.antgroup.com/api/renderer/canvas) |    |
| interaction | 交互                                                                                                                     |  [Interaction](/zh/docs/api/basic-class/interaction) |    |
| hd | 开启高清适配                                                                                                                   | [HdAdapter](https://github.com/antvis/S2/blob/next/packages/s2-core/src/ui/hd-adapter/index.ts) |    |
| on | 事件订阅                                                                                                                   | (event: [S2Event](/docs/manual/advanced/interaction/basic), listener: () => void) => void |    |
| emit | 事件发布                                                                                                                   | (event: [S2Event](/docs/manual/advanced/interaction/basic), ...args: any[]) => void |    |
| getDataSet | 获取数据集                                                                                                                  | (options: [S2Options](/docs/api/general/S2Options)) => [BaseDataSet](/docs/api/basic-class/base-data-set) |    |
| isPivotMode | 是否是透视表                                                                                                                 | `() => boolean` |    |
| isHierarchyTreeType | 是否是树状结构                                                                                                                | `() => boolean` |    |
| isFrozenRowHeader | 是否是冻结行头状态                                                                                                              | `() => boolean` |    |
| isTableMode | 是否是明细表                                                                                                                 | `() => boolean` |    |
| isValueInCols | 是否是数值置于行头                                                                                                              | `() => boolean` |    |
| clearDrillDownData | 清除下钻数据                                                                                                                 | `(rowNodeId?: string) => void` |    |
| showTooltip | 显示 tooltip   （别名 `tooltip.show`)                                                                                                         | (showOptions: [TooltipShowOptions](/docs/api/common/custom-tooltip)) => void |    |
| showTooltipWithInfo | 显示 tooltip, 并且展示一些默认信息    | (event: `CanvasEvent \| MouseEvent`, data: [TooltipData[]](/docs/api/common/custom-tooltip), options?: [TooltipOptions](/docs/api/common/custom-tooltip)) => void |
| hideTooltip | 隐藏 tooltip （别名：`tooltip.hide`)                                                                                                           | `() => void` |    |
| destroyTooltip | 销毁 tooltip     （别名 `tooltip.destroy`)                                                                                                      | `() => void` |    |
| registerIcons | 注册 自定义 svg 图标 （根据 `options.customSVGIcons`)                                                                            | `() => void` |    |
| setDataCfg | 更新表格数据                                                                                                                 | `<T extends boolean = false>(dataCfg: T extends true ?` [`S2DataConfig`](/docs/api/general/S2DataConfig) `: Partial<`[`S2DataConfig`](/docs/api/general/S2DataConfig)`>, reset?: T) => void` | `reset` 参数需在 `@antv/s2^1.34.0`版本使用  |
| setOptions | 更新表格配置                                                                                                                 | (options: [S2Options](/docs/api/general/S2Options), reset?: boolean) => void |  `reset` 参数需在 `@antv/s2^1.34.0`版本使用  |
| resetDataCfg | 重置表格数据                                                                                                                 | () => void | |
| resetOptions | 重置表格配置                                                                                                                 | () => void |   |
| render | 重新渲染表格，如果 `reloadData` = true, 则会重新计算数据，`reBuildDataSet` = true, 重新构建数据集，`reBuildHiddenColumnsDetail` = true 重新构建隐藏列信息 | `(reloadData?: boolean \| { reloadData?: boolean, reBuildDataSet?: boolean; reBuildHiddenColumnsDetail?: boolean }) => Promise<void>` |    |
| destroy | 销毁表格                                                                                                                   | `() => void` |    |
| setThemeCfg | 更新主题配置 （含主题 schema, 色板，主题名）                                                                                            | (themeCfg: [ThemeCfg](/docs/api/general/S2Theme/#themecfg)) => void |    |
| setTheme | 更新主题 （只包含主题 scheme)                                                                                                    | (theme: [S2Theme](/docs/api/general/S2Theme/#s2theme)) => void |    |
| getTheme | 获取主题 （只包含主题 scheme)                                                                                                    | ( ) => [S2Theme](/docs/api/general/S2Theme/#s2theme) |    |
| getThemeName | 获取主题名                                                                                                    | ( ) => `default \| colorful \| gray \| dark` |    |
| updatePagination | 更新分页                                                                                                                   | (pagination: [Pagination](/docs/api/general/S2Options#pagination)) => void |    |
| getContentHeight | 获取当前表格实际内容高度                                                                                                           | `() => number` |    |
| changeSheetSize  | 修改表格画布大小，不用重新加载数据                                                                                                      | `(width?: number, height?: number) => void` |    |
| getLayoutWidthType | 获取单元格宽度布局类型（LayoutWidthType: `adaptive（自适应）` \| `colAdaptive（列自适应）` \| `compact（紧凑）`） | () => `LayoutWidthType`|    |
| updateScrollOffset | 更新滚动偏移                                                                                                                 | (config: [OffsetConfig](#offsetconfig)) => void |    |
| getCell | 根据 event.target 获取当前 单元格                                                                                               | (target: [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target)) => [S2CellType](/docs/api/basic-class/base-cell#s2celltype) |    |
| getCellType | 根据 event.target 获取当前 单元格类型                                                                                             | (target: [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target)) => [CellType](/docs/api/basic-class/base-cell#celltypes) |    |
| getTotalsConfig | 获取总计小计配置                                                                                                               | (dimension: string) => [Total](/docs/api/general/S2Options#totals) |    |
| getCanvasElement | 获取表格对应的 `<canvas/>` HTML 元素                                                                                            | () => [HTMLCanvasElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement) |    |
| getCanvas | 获取 G Canvas 实例                                                                                           | () => [Canvas](https://g.antv.antgroup.com/api/renderer/canvas) |    |
| getCanvasConfig | 获取 G Canvas 配置                                                                                           | () => Partial<[CanvasConfig](https://g.antv.antgroup.com/api/canvas/options)> |    |
| updateSortMethodMap | 更新存储在 store 中的节点排序方式 map, replace 为是否覆盖上一次的值                                                                           | (nodeId: string, sortMethod: string, replace?: boolean) => void |    |
| getMenuDefaultSelectedKeys | 获取 tooltip 中选中的菜单项 key 值 | `(nodeId: string) => string[]` |    |
| measureText | 获取文本在画布中的测量信息  | (text: `string`, font: [TextTheme](/docs/api/general/S2Theme#texttheme)) => [TextMetrics](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics) \| `null` |    |
| measureTextWidth | 获取文本在画布中的测量宽度   | (text: `string`, font: [TextTheme](/docs/api/general/S2Theme#texttheme)) => `number` \| `null` |    |
| measureTextHeight |  获取文本在画布中的测量高度 | (text:`string`, font: [TextTheme](/docs/api/general/S2Theme#texttheme)) => `number` \| `null` |    |
| groupSortByMethod | 组内排序（透视表有效）  | (sortMethod: `'asc' \| 'desc'`, meta: [Node](/docs/api/basic-class/node)) => void  |    |

### S2MountContainer

```ts
type S2MountContainer = string | HTMLElement;
```

### OffsetConfig

功能描述：滚动偏移配置

```ts
interface OffsetConfig {
  rowHeaderOffsetX?: {
    value: number | undefined;
    animate?: boolean;
  };
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

### CellType

功能描述：单元格类型

```ts
export enum CellType {
  DATA_CELL = 'dataCell',  // 数值单元格
  ROW_CELL = 'rowCell', // 行头单元格
  COL_CELL = 'colCell', // 列头单元格
  CORNER_CELL = 'cornerCell', // 角头单元格
  MERGED_CELL = 'mergedCell', // 合并后的单元格
}
```

### BBox

功能描述：盒模型。[详情](/docs/api/basic-class/base-bbox)

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
