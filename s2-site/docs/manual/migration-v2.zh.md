---
title: S2 2.0 升级指南
order: 9
tag: New
---

本文档将帮助你从 S2 `1.x` 版本升级到 S2 `2.x` 版本。

## 🏠 官网地址变化

:::warning{title="注意"}
原官网 <https://s2.antv.vision> 和 <https://antv-s2.gitee.io> 不再维护和使用，请使用最新的文档，确保您看到的不是过时的文档。
:::

- 原 `v1` 官网迁移至 <https://s2-v1.antv.antgroup.com>.
- 原 <https://s2.antv.antgroup.com> 将作为 `v2` 默认官网。

## 🏷️ npm dist-tag 变化

> 什么是 [dist-tag](https://docs.npmjs.com/adding-dist-tags-to-packages/) ?

:::warning{title="注意"}

`S2 2.0` 版本目前处于**内测阶段**, 部分 API 可能会根据合理性随时改动。

`npm` 的 [`dist-tag`](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag) 对应关系如下：

- `@antv/s2@next` 对应 `2.x` 版本。
- `@antv/s2@latest` 对应 `1.x` 版本。

:::

## 📅 正式版本发布时间

目前 `next` 版本会持续内测一段时间，<https://s2.antv.antgroup.com> 会作为相应的文档网站。

在此期间，会持续根据用户的反馈进行 Bug fix 和代码调整，在 `@antv/s2@next` 版本稳定后，会发布正式版本，`latest` 将默认指向 `2.x` 版本，去除 `next` 标识。

## 🗓️ v1 版本维护期

目前 `v1` 版本会继续维护，针对 `BUG` 发布 `Patch` 版本修复，但不再接收新的 `Feature Request` 和 `Feature Pull Request`，欢迎 `Bug Fix Pull Request`, 截止日期为 `2024 年` 年底。

## 📦 安装

```bash
# 基础版本
$ npm install @antv/s2@next --save

# React 版本
$ npm install @antv/s2-react@next antd @ant-design/icons --save

# Vue3 版本
$ npm install @antv/s2-vue@next ant-design-vue@3.x --save
```

| Package  | Version | Size   | Download     |
| - | - | - | - |
| [@antv/s2](https://github.com/antvis/S2/tree/next/packages/s2-core) |  ![next](https://img.shields.io/npm/v/@antv/s2/next.svg)  | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2@next/dist/index.min.js?label=gzip%20size&compression=gzip)       | ![download](https://img.shields.io/npm/dm/@antv/s2.svg)       |
| [@antv/s2-react](https://github.com/antvis/S2/tree/next/packages/s2-react) | ![next](https://img.shields.io/npm/v/@antv/s2-react/next.svg)| ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react@next/dist/index.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react.svg) |
| [@antv/s2-vue](https://github.com/antvis/S2/tree/next/packages/s2-vue) | ![next](https://img.shields.io/npm/v/@antv/s2-vue/next.svg) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-vue@next/dist/index.min.js?label=gzip%20size&compression=gzip)   | ![download](https://img.shields.io/npm/dm/@antv/s2-vue.svg)   |

## ⭐ 新增功能

官网目录标记为 <Badge type="success">New</Badge> 和 <Badge>Updated</Badge> 则表示新增功能，也可以查看官方语雀博客 [S2 2.0 表格看数新纪元](https://www.yuque.com/antv/blog/1122_7_s2).

## 📣 不兼容的变化

### 基础包 <Badge>@antv/s2</Badge>

#### 底层渲染引擎升级为 `AntV/G 5.0`

表格绘制引擎升级到 [`G 5.0`](https://g.antv.antgroup.com/) 大版本，和 [`AntV` 其他技术栈](https://antv.antgroup.com/) 保持同步，渲染方式升级为**异步**。

```diff
- s2.render()
+ await s2.render()
```

如果在你的业务场景中，有使用 `G` 的一些自定义 `shape`, 如自定义矩形，图片等场景，或者其他能力，请注意替换，具体请查看 G 的 [官网文档](https://g.antv.antgroup.com/api/basic/image).

```diff
+ import { Image } from '@antv/g';

+ this.appendChild(new Image({ style: {} }))

- this.addShape('image', { attrs: {} });
```

其他 [图形](https://g.antv.antgroup.com/api/basic/concept) 同理，不再过多赘述。

#### S2 和 G 的配置分离

在 `1.x` 中，我们会将 `S2Options` 中的 `supportsCSSTransform` 和 `devicePixelRatio` 等属性透传给 `G`.

在 `2.x` 中：

- 移除 `devicePixelRatio` 和 `supportsCSSTransform (supportCSSTransform)`.
- 新增 `transformCanvasConfig` 支持透传 `G` 的配置，以及注册插件，具体请查阅 [注册 AntV/G 插件](/manual/advanced/g-plugins) 相关文档。

```tsx
const s2Options = {
  transformCanvasConfig(renderer) {
    renderer.registerPlugin(new PluginA11y({ enableExtractingText: true }));

    return {
      supportsCSSTransform: true,
      devicePixelRatio: 2
    };
  },
}
```

#### 自定义宽高配置调整

1. `rowCfg/colCfg/cellCfg` 调整为 `rowCell/colCell/dataCell`.

```diff
const s2Options = {
  style: {
-   rowCfg: {},
-   colCfg: {},
-   cellCfg: {},

+   rowCell: {},
+   colCell: {},
+   cellCell: {},
  }
}
```

2. 废弃 `widthByFieldValue`, 新增 `widthByField`.
3. 行列宽高支持动态配置。

```diff
export interface ColCfg {
  width?: CellCustomWidth;
- height?: number;
+ height?: number | (cell) => number;
- widthByFieldValue?: Record<string, number>;
+ widthByField?: Record<string, number>;
  heightByField?: Record<string, number>;
}
```

4. 现在 `widthByField` 和 `heightByField` 同时支持维度 `id` 和 维度 `field`.

具体请查看 [自定义单元格宽高](/manual/advanced/custom/cell-size) 相关文档。

#### Tooltip 配置调整

1. `row/col/data/corner` 调整为 `rowCell/colCell/dataCell/cornerCell`.

```diff
const s2Options = {
  tooltip: {
-   row: {},
-   col: {},
-   data: {},
-   corner: {},

+   rowCell: {},
+   colCell: {},
+   dataCell: {},
+   cornerCell: {},
  }
}
```

2. `showTooltip` 和 `renderTooltip` 调整为 `enable` 和 `render`.

```diff
const s2Options = {
  tooltip: {
-   showTooltip: true,
-   renderTooltip: () => new CustomTooltip(),

+   enable: true,
+   render: () => new CustomTooltip(),
  }
}
```

具体请查看 [Tooltip](/manual/basic/tooltip) 相关文档。

#### 复制导出调整

1. 配置收拢到 `interaction.copy` 下，新增 `customTransformer` 自定义转换器。

```diff
const s2Options = {
  interaction: {
-   enableCopy: true,
-   copyWithHeader: true,
-   copyWithFormat: true

+   copy: {
+     enable: true,
+     withHeader: true,
+     withFormat: true,
+     customTransformer: () => {}
+   },
  }
}
```

2. 废弃 `copyData`, 新增 `asyncGetAllPlainData`, 支持异步获取数据。

```diff
- const data = copyData(spreadsheet, '\t', false)

+ const data = await asyncGetAllPlainData({
+  sheetInstance: s2,
+  split: '\t',
+  formatOptions: false,
});
```

3. 复制默认开启。

具体请查看 [复制与导出](/manual/advanced/interaction/copy) 相关文档。

#### 刷选配置调整

1. `row/col/data` 调整为 `rowCell/colCell/dataCell`。

```diff
const s2Options = {
  interaction: {
-   brushSelection: {
-     row: false,
-     col: false,
-     data: true,
-   },

+   brushSelection: {
+     rowCell: true,
+     colCell: true,
+     dataCell: true,
+   }
  }
}
```

2. 所有单元格默认开启刷选。

具体请查看 [基础交互](/manual/advanced/interaction/basic) 相关文档。

#### headerActionIcons 配置调整

`iconsNames` 调整为 `icons`, 废弃 `action`, 新增 `onClick` 和 `onHover`.

```diff
const s2Options = {
  headerActionIcons: [
    {
-      iconNames: ['SortDown'],
-      action: () => {}

+      icons: ['SortDown'],
+      onClick: () => {}
+      onHover: () => {}
    },
  ],
}
```

现在支持配置 `position (icon 相对文本的位置）` 和 `fill （颜色配置）`, 并且支持给单个 icon 配置独立的 `displayCondition` 和 `defaultHide`.

```diff
const s2Options = {
  headerActionIcons: [
    {
+     icons: [{
+       name: 'SortDown',
+       position: 'right',
+       fill: '#000',
+       displayCondition: () => {},
+       defaultHide: () => {},
+     }]
    },
  ],
}
```

具体请查看 [自定义 Icon](/manual/advanced/custom/custom-icon) 相关文档。

#### 树状结构配置调整

1. 行头折叠展开配置调整

废弃 `rowExpandDepth/collapsedRows/hierarchyCollapse`, 使用更表意的 `expandDepth/collapseFields/collapseAll` 代替。

```diff
const s2Options = {
  hierarchyType: 'tree',
  style: {
-   rowExpandDepth: 0,
-   collapsedRows: {},
-   hierarchyCollapse: true,

+   rowCell: {
+     expandDepth: 0,
+     collapseFields: {},
+     collapseAll: true
    }
  },
}
```

2. 树状结构下行头宽度配置调整

废弃 `treeRowsWidth`, 使用 `rowCell.width` 代替。

```diff
const s2Options = {
  hierarchyType: 'tree',
  style: {
-   treeRowsWidth: 200
+   rowCell: {
+     width: 200,
+   }
  },
}
```

3. `customTree` 和 `customTreeItems` 已废弃。

原本自定义树状结构的方式已废弃，现在自定义结构同时支持 `平铺` 和 `树状` 两种模式。

```diff
const s2Options = {
-  hierarchyType: 'customTree',
+  hierarchyType: 'tree',
}

const s2DataConfig = {
  fields: {
-    customTreeItems: [
-      {
-        key: 'custom-node-1',
-        title: '自定义节点 A',
-        description: '自定义节点 A 描述',
-        children: []
-      }

+    rows: [
+      {
+        field: 'custom-node-1',
+        title: '自定义节点 A',
+        description: '自定义节点 A 描述',
+        children: []
+      }
    ]
  }
}
```

具体请查看 [自定义行列头分组](/manual/advanced/custom/custom-header) 相关文档。

#### 行列冻结配置调整

透视表和明细表的行列冻结配置统一收拢到 `frozen`.

```diff
const s2Options = {
-  frozenRowHeader: true,
-  frozenFirstRow: true,
-  frozenRowCount: true;
-  frozenColCount: true;
-  frozenTrailingRowCount: true;
-  frozenTrailingColCount: true;

+  frozen: {
+    rowHeader: true,
+    firstRow: true,
+    rowCount: true;
+    colCount: true;
+    trailingRowCount: true;
+    trailingColCount: true;
+  }
}
```

#### 透视表冻结行头配置变更

`rowHeader` 现在支持传递 `number` , 如果为数值则表示开启冻结行头，并自定义行头最大冻结宽度 (0 - 1)。

```diff
const s2Options = {
  frozen: {
-   rowHeader: true,
+   rowHeader: true,
+   rowHeader: 0.5,
  }
}
```

#### 高清适配配置调整

```diff
const s2Options = {
-  hdAdapter: true,
+  hd: true,
}
```

#### 序号配置变更

序号相关配置统一收拢在 `seriesNumber`.

```diff
const s2Options = {
- showSeriesNumber: true,
- seriesNumberText: '序号';

+ seriesNumber: {
+   enable: true;
+   text: '序号';
+ }
}
```

#### 单元格宽高拖拽逻辑变更

1. 在 `1.x` 中，宽高调整对**所有单元格**生效，`2.x` 新增 `rowResizeType/colResizeType` 选择对当前还是所有单元格生效。

```diff
const s2Options = {
  interaction: {
    resize: {
+     rowResizeType: 'current', // 'all' | 'selected'
+     colResizeType: 'current'  // 'all' | 'selected'
    }
  }
}
```

2. 默认调整只对当前单元格生效。
3. 宽高调整后现在不再重置选中状态，仅关闭 tooltip 提示。
4. 现在支持多选后，进行批量调整。

具体请查看 [行列宽高调整](/manual/advanced/interaction/resize) 相关文档。

#### Facet 变更

1. 静态属性 `layoutResult` 废弃，使用 `s2.facet.getLayoutResult()` 动态获取。

```diff
- s2.facet.layoutResult
+ s2.facet.getLayoutResult()
```

2. `getCellMeta` 从 `layoutResult` 中移除，移动到 `facet` 层级，现在 `layoutResult` 只包含布局节点。

```diff
- s2.facet.layoutResult.getCellMeta(rowIndex, colIndex)
+ s2.facet.getCellMeta(rowIndex, colIndex)
```

3. 布局结构 `layoutResult` 新增 `角头节点 (cornerNodes)` 和 `序号节点 (seriesNumberNodes)`

```diff
export interface LayoutResult {
  colNodes: Node[];
  colLeafNodes: Node[];
  colsHierarchy: Hierarchy;
  rowNodes: Node[];
  rowsHierarchy: Hierarchy;
  rowLeafNodes: Node[];
- getCellMeta: (rowIndex: number, colIndex: number) => ViewMeta
+ seriesNumberNodes?: Node[];
+ cornerNodes?: Node[];
}
```

具体请查看 [获取单元格数据](/manual/advanced/get-cell-data) 相关文档。

#### 渲染参数变更

render 函数的参数从 `boolean` 扩展为 `boolean | object`, 当为 `boolean` 时，等价与 `{ reloadData: boolean }`

```diff
- s2.render(true)
- s2.render(false)
- s2.render(false, { reBuildHiddenColumnsDetail: false })

+ s2.render({ reloadData: true }) // 等价于 s2.render(true)
+ s2.render({ reloadData: false }) // 等价于 s2.render(false)
+ s2.render({
+   reloadData: false,
+   reBuildHiddenColumnsDetail: false,
+ });
```

#### 小计总计配置参数变更

总计配置统一增加 `grandTotals` 和 `subTotals` 前缀，避免歧义。

```diff
const s2Options = {
  totals: {
    row: {
-     calcTotals: {}.
-     reverseLayout: true,
-     label: '总计'
-     totalsGroupDimensions: [],
-     reverseSubLayout: true,

+     calcGrandTotals: {}.
+     reverseGrandTotalsLayout: true,
+     grandTotalsLabel: '总计'
+     grandTotalsGroupDimensions: [],
+     reverseSubTotalsLayout: true
    };
  }
}
```

#### 绘制自定义文本 API 变更

绘制多列文本 `drawObjectText` 函数更名为 `drawCustomContent`.

```diff
- import { drawObjectText } from '@antv/s2'
+ import { drawCustomContent } from '@antv/s2'
```

#### 数据集处理逻辑变更

对于多个 `values` 的数据，S2 期望一个数据项中就包含所有的 `values` 信息。

```js
{
  fields:{
    rows: ["province", "city"],
    columns: ["type", "subType"],
    values: ["number1", "number2"],
 }
}

```

```diff
- [
-   {
-     province: '辽宁省',
-     city: '达州市',
-     type: '桌子',
-     subType: '家具',
-     number1: 3482.28,
-   },
-   {
-     province: '辽宁省',
-     city: '达州市',
-     type: '桌子',
-     subType: '家具',
-     number2: 34,
-   },
- ];

+ [
+   {
+     province: '辽宁省',
+     city: '达州市',
+     type: '桌子',
+     subType: '家具',
+     number1: 3482.28,
+     number2: 34,
+   },
+ ];

```

#### 数据集查询逻辑变更

1. 查询字段从 `string` 变更为 `CustomTreeNode | string`.

```diff
- s2.dataSet.getField(field: string)
- s2.dataSet.getFieldMeta(field: string)
- s2.dataSet.getFieldName(field: string)
- s2.dataSet.getFieldFormatter(field: string)

+ s2.dataSet.getField(field: CustomTreeNode | string)
+ s2.dataSet.getFieldMeta(field: CustomTreeNode | string)
+ s2.dataSet.getFieldName(field: CustomTreeNode | string)
+ s2.dataSet.getFieldFormatter(field: CustomTreeNode | string)
```

2. 获取单元格数据 API 的参数统一。

```diff
- s2.dataSet.getCellData(params: CellDataParams)
+ s2.dataSet.getCellData(params: GetCellDataParams)

- s2.dataSet.getMultiData(query: DateType, params: MultiDataParams)
- s2.dataSet.getMultiData(query: DataType, isTotals?: boolean, isRow?: boolean, drillDownFields?: string[], includeTotalData:boolean)
+ s2.dataSet.getCellMultiData(params: GetCellMultiDataParams)
```

具体请查看 [获取单元格数据](/manual/advanced/get-cell-data) 相关文档。

#### 单元格刷选选中状态变更

`1.x` 中，行列头刷选选中状态为 `brushSelected`, 数值单元格的刷选选中状态为 `selected`, `2.x` 中做了进一步统一和区分：

```diff
s2.interaction.getState()

// 行头
- stateName: "brushSelected"
+ stateName: "rowCellBrushSelected"

// 列头
- stateName: "brushSelected"
+ stateName: "colCellBrushSelected"

// 数值
- stateName: "selected"
+ stateName: "dataCellBrushSelected"
```

### 组件层 <Badge>@antv/s2-react</Badge>

#### 支持 React 18 和 Ant Design 5.0

`@antv/s2-react` 的 `2.x` 版本适配了 `React 18`, 并兼容 `React 16 和 17`, 分析组件升级到了 `antd@v5`.

#### 表头组件配置调整

`exportCfg/advancedSortCfg/switcherCfg` 调整为 `export/advancedSort/switcher`.

```diff
const header = {
-  exportCfg: {},
-  advancedSortCfg: {},
-  switcherCfg: {},

+  export: {},
+  advancedSort: {},
+  switcher: {},
};

<SheetComponent header={header} />
```

具体请查看 [表头](/manual/advanced/analysis/header) 相关文档。

#### Tooltip 菜单项配置调整

菜单项调整到 `menu` 下，和 Ant Design [Menu 组件 API](https://ant-design.antgroup.com/components/menu-cn#api) 保持一致，同时支持透传 props.

```diff
 const s2Options = {
  tooltip: {
    operation: {
      onClick: (info, cell) => {},
-     menus: [
-       {
-         key: 'custom-a',
-         text: '操作 1',
-         icon: 'Trend',
-         onClick: (info, cell) => {},
-         children: [],
-       }
-     ],

+     menu: {
+       mode: 'vertical',
+       onClick: (info, cell) => {},
+       items: [
+         {
+           key: 'custom-a',
+           label: '操作 1',
+           icon: 'Trend',
+           onClick: (info, cell) => {},
+           children: [],
+         }
+       ],
+     },
    },
  },
};

<SheetComponent options={s2Options} />
```

具体请查看 [Tooltip](/manual/basic/tooltip) 相关文档。

## ✍️ API 调整

具体请查看标记为 <Badge type="success">New</Badge> 和 <Badge>Updated</Badge> 的 [`API 文档`](/api)

## 🙋 遇到问题

更多新特性和改动请阅读文档，如果您在升级过程中遇到了问题，请到 [GitHub issues](https://github.com/antvis/S2/issues/2454) 或者 [GitHub Discussions](https://github.com/antvis/S2/discussions/1933) 进行反馈。我们会尽快响应和改进这篇文档。
