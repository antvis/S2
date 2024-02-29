---
title: S2Options
order: 1
tag: Updated
---

表格参数配置

```ts
const s2Options = {
  width: 600,
  height: 400,
  hierarchyType: 'grid'
}
```

| 参数                        | 类型                                                                                                                                                                                                                         | 必选 | 默认值  | 功能描述                                                                                                                                  | 版本 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| width                       | `number`                                                                                                                                                                                                                     |      | `600`   | 表格宽度                                                                                                                                  |
| height                      | `number`                                                                                                                                                                                                                     |      | `480`   | 表格高度                                                                                                                                  |
| debug                       | `boolean`                                                                                                                                                                                                                    |      | `false` | 是否开启调试模式                                                                                                                          |
| hierarchyType               | `"grid" \| "tree"`                                                                                                                                                                                                           |      | `grid`  | 行头的展示方式，grid：平铺网格结构， tree： 树状结构。 支持 [自定义结构](/manual/advanced/custom/custom-header)                           |
| conditions                  | [Conditions](#conditions)                                                                                                                                                                                                    |      |         | 字段标记，条件格式配置                                                                                                                    |
| totals                      | [Totals](#totals)                                                                                                                                                                                                            |      |         | 小计总计配置                                                                                                                              |
| tooltip                     | [Tooltip](#tooltip)                                                                                                                                                                                                          |      |         | tooltip 配置                                                                                                                              |
| interaction                 | [Interaction](#interaction)                                                                                                                                                                                                  |      |         | 表格交互配置                                                                                                                              |
| pagination                  | [Pagination](#pagination)                                                                                                                                                                                                    |      |         | 分页配置                                                                                                                                  |
| frozen                      | [Frozen](#frozen)                                                                                                                                                                                                            |      |         | 行列头冻结配置                                                                                                                            |
| seriesNumber                | [SeriesNumber](#seriesnumber)                                                                                                                                                                                                |      |         | 序号列展示及自定义文字配置                                                                                                                |
| showDefaultHeaderActionIcon | `boolean`                                                                                                                                                                                                                    |      | `true`  | 是否展示默认行列头操作图标                                                                                                                |
| headerActionIcons           | [HeaderActionIcon](#headeractionicon)[]                                                                                                                                                                                      |      | `false` | 自定义行列头操作图标（需要将 `showDefaultHeaderActionIcon` 置为 `false`）                                                                 |
| customSVGIcons              | [CustomSVGIcon](#customsvgicon)[]                                                                                                                                                                                            |      | `false` | 自定义 svg 图标                                                                                                                           |
| style                       | [Style](#style)                                                                                                                                                                                                              |      |         | 单元格样式设置，比如布局类型，宽高，边距，是否隐藏数值列头等                                                                              |
| hd                   | `boolean`                                                                                                                                                                                                                    |      | `true`  | 是否开启高清屏适配，解决多屏切换，高清视网膜屏字体渲染模糊的问题。[查看更多](/manual/advanced/hd-adapter)                                 |
| mergedCellsInfo             | [MergedCellInfo](#mergedcellinfo)[][]                                                                                                                                                                                        |      |         | 合并单元格信息                                                                                                                            |
| placeholder                 | `string \| (meta: Record<string, any>) => string`                                                                                                                                                                            |      |         | 自定义单元格空数据占位符                                                                                                                        |
| cornerText                  | string                                                                                                                                                                                                                       |      |         | 自定义角头文本 （仅在树状模式有效）                                                                                                       |
| cornerExtraFieldText        | string                                                                                                                                                                                                                       |      | `数值`  | 自定义角头虚拟数值字段文本（"数值挂行头"时有效）                                                                                          |
| dataCell                    | [DataCellCallback](#datacellcallback)                                                                                                                                                                                        |      |         | 自定义单元格 cell                                                                                                                         |
| cornerCell                  | [CellCallback](#cellcallback)                                                                                                                                                                                                |      |         | 自定义 cornerCell                                                                                                                         |
| rowCell                     | [CellCallback](#cellcallback)                                                                                                                                                                                                |      |         | 自定义行头 cell                                                                                                                           |
| colCell                     | [CellCallback](#cellcallback)                                                                                                                                                                                                |      |         | 自定义列头 cell                                                                                                                           |
| mergedCell                  | [MergedCellCallback](#mergedcellcallback)                                                                                                                                                                                    |      |         | 自定义合并单元格                                                                                                                          |
| frame                       | [FrameCallback](#framecallback)                                                                                                                                                                                              |      |         | 自定义表格框架/边框                                                                                                                       |
| cornerHeader                | [CornerHeaderCallback](#cornerheadercallback)                                                                                                                                                                                |      |         | 自定义角头                                                                                                                                |
| layoutHierarchy             | [LayoutHierarchy](#layouthierarchy)                                                                                                                                                                                          |      |         | 自定义层级结构                                                                                                                            |
| layoutArrange               | [LayoutArrange](#layoutarrange)                                                                                                                                                                                              |      |         | 自定义排列顺序 （树状模式有效）                                                                                                           |
| layoutCoordinate            | [layoutCoordinate](#layoutcoordinate)                                                                                                                                                                                        |      |         | 自定义单元格节点坐标                                                                                                                      |
| layoutCellMeta              | [layoutCellMeta](#layoutcellmeta)                                                                                                                                                                                            |      |         | 自定义单元格元数据                                                                                                                        |
| layoutSeriesNumberNodes     | [LayoutSeriesNumberNodes](#layoutseriesnumbernodes)                                                                                                                                                                          |      |         | 自定义序号节点                                                                                                                            |
| dataSet                     | [DataSet](#dataset)                                                                                                                                                                                                          |      |         | 自定义数据集                                                                                                                              |
| facet                       | (spreadsheet: [SpreadSheet](/api/basic-class/spreadsheet)) => [BaseFacet](/api/basic-class/base-facet)                                                                                                                       |      |         | 自定义分面                                                                                                                                |
| transformCanvasConfig       | (renderer: [Renderer](https://g.antv.antgroup.com/api/canvas/options#renderer), spreadsheet: [SpreadSheet](/api/basic-class/spreadsheet)) => Partial<[CanvasConfig](https://g.antv.antgroup.com/api/canvas/options)> \| void |      | `-`     | 自定义 AntV/G 渲染引擎 [配置参数](https://g.antv.antgroup.com/api/canvas/options) & [插件注册](https://g.antv.antgroup.com/plugins/intro) |

<embed src="@/docs/common/series-number.zh.md"></embed>

<embed src="@/docs/common/frozen.zh.md"></embed>

<embed src="@/docs/common/interaction.zh.md"></embed>

<embed src="@/docs/common/totals.zh.md"></embed>

<embed src="@/docs/common/tooltip.zh.md"></embed>

<embed src="@/docs/common/custom-tooltip.zh.md"></embed>

<embed src="@/docs/common/pagination.zh.md"></embed>

<embed src="@/docs/common/style.zh.md"></embed>

## DataCellCallback

```js
DataCellCallback = (viewMeta: ViewMeta, s2: Spreadsheet) => G.Group;
```

功能描述：自定义数值单元格。[查看示例](/examples/custom/custom-cell#data-cell)

<embed src="@/docs/common/view-meta.zh.md"></embed>

## CellCallback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => G.Group;
```

功能描述：自定义单元格。[查看示例](/examples/custom/custom-cell#row-cell)

| 参数        | 说明                     | 类型                                             | 默认值 | 必选 |
| ----------- | ------------------------ | ------------------------------------------------ | ------ | ---- |
| node        | 当前渲染的 node 节点     | [Node](/docs/api/basic-class/node)               | -      | ✓    |
| spreadsheet | 表格实例                 | [SpreadSheet](/docs/api/basic-class/spreadsheet) | -      | ✓    |
| restOptions | 不定参数，传递额外的信息 | `unknown[]`                                      | -      |      |

## MergedCellCallback

```js
DataCellCallback = (s2: Spreadsheet, cells: S2CellType[],viewMeta: ViewMeta) => MergedCell;
```

功能描述：自定义合并单元格。[查看示例](/examples/custom/custom-cell/#custom-merged-cell)

<embed src="@/docs/common/view-meta.zh.md"></embed>

## CornerHeaderCallback

```js
CornerHeaderCallback = (parent: S2CellType, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => void;
```

功能描述：自定义角头。[查看示例](/examples/custom/custom-cell#corner-cell)

| 参数        | 说明                     | 类型                                             | 默认值 | 必选 |
| ----------- | ------------------------ | ------------------------------------------------ | ------ | ---- |
| parent      | 父级单元格               | [S2CellType](#s2celltype)                        | -      | ✓    |
| spreadsheet | 表格实例                 | [SpreadSheet](/docs/api/basic-class/spreadsheet) | -      | ✓    |
| restOptions | 不定参数，传递额外的信息 | `unknown[]`                                      | -      |      |

<embed src="@/docs/common/custom/layoutHierarchy.zh.md"></embed>

<embed src="@/docs/common/custom/layoutArrange.zh.md"></embed>

<embed src="@/docs/common/custom/layoutCoordinate.zh.md"></embed>

<embed src="@/docs/common/custom/layoutCellMeta.zh.md"></embed>

<embed src="@/docs/common/custom/layoutSeriesNumberNodes.zh.md"></embed>

<embed src="@/docs/common/custom/headerActionIcons.zh.md"></embed>

## HeaderActionIconProps

功能描述： 点击自定义操作 icon 后透视表返回的当前 icon 相关

| 参数     | 说明                   | 类型   | 默认值 | 必选 |
| -------- | ---------------------- | ------ | ------ | ---- |
| iconName | 当前点击的 icon 名称   | string | -      | ✓    |
| meta     | 当前 cell 的 meta 信息 | Node   | -      | ✓    |
| event    | 当前点击事件信息       | Event  | false  | ✓    |

<embed src="@/docs/common/custom/customSvgIcons.zh.md"></embed>

## DataItem

功能描述：基本数据格式

```ts
export enum MiniChartType {
  Line = 'line',
  Bar = 'bar',
  Bullet = 'bullet',
}

export interface MultiData {
  label?: string;
  values: SimpleData[][];
  originalValues?: SimpleData[][]
}

export type SimpleData = string | number;

export interface BaseChartData {
  type: MiniChartType;
  data: RawData[];
  encode?: {
    x: keyof RawData;
    y: keyof RawData;
  };
  [key: string]: unknown;
}

export interface BulletValue {
  type: MiniChartType.Bullet;
  measure: number | string;
  target: number | string;
  [key: string]: unknown;
}

export type MiniChartData = BaseChartData | BulletValue;

export interface MultiData<T = SimpleData[][] | MiniChartData> {
  values: T;
  originalValues?: T;
  label?: string;
  [key: string]: unknown;
}

export type SimpleData = string | number | null;

export type DataItem =
  | SimpleData
  | MultiData
  | Record<string, unknown>
  | undefined
  | null;

export type RawData = Record<string, DataItem>;

export type ExtraData = {
  [EXTRA_FIELD]: string;
  [VALUE_FIELD]: string | DataItem;
};

export type Data = RawData & ExtraData;
```

## LayoutResult

功能描述：基本数据格式。[查看文档](/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC%E8%8A%82%E7%82%B9)

| 参数              | 说明                                             | 类型                                 | 默认值 | 必选 |
| ----------------- | ------------------------------------------------ | ------------------------------------ | ------ | ---- |
| colNodes          | 列头节点，对应 ColCell （含可视范围外）          | [Node[]](/docs/api/basic-class/node) |        |      |
| colLeafNodes      | 列头叶子节点，对应 ColCell （含可视范围外）      | [Node[]](/docs/api/basic-class/node) |        |      |
| colsHierarchy     | 列头节点层级结构 （含可视范围外）                | [Hierarchy](#hierarchy)              |        |      |
| rowNodes          | 行头节点，对应 RowCell （含可视范围外）          | [Node[]](#node)                      |        |      |
| rowLeafNodes      | 行头叶子节点，对应 RowCell （含可视范围外）      | [Node[]](/docs/api/basic-class/node) |        |      |
| rowsHierarchy     | 行头节点层级结构 （含可视范围外）                | [Hierarchy](#hierarchy)              |        | ✓    |
| seriesNumberNodes | 序号节点，对应 SeriesNumberCell （含可视范围外） | [Node[]](/docs/api/basic-class/node) |        |      |
| cornerNodes       | 角头节点，对应 CornerCell （含可视范围外）       | [Node[]](/docs/api/basic-class/node) |        |      |

## DataSet

功能描述：自定义数据集。[查看示例](/examples/custom/custom-dataset/#custom-strategy-sheet-dataset)

```js
DataSet = (spreadsheet: SpreadSheet) => BaseDataSet;
```

## MergedCellInfo

<embed src="@/docs/common/merged-cell.zh.md"></embed>
