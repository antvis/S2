---
title: S2 2.0 升级指南
order: 9
tag: New
---

本文档将帮助你从 S2 `1.x` 版本升级到 S2 `2.x` 版本。

## 🏠 官网地址变化

:::warning{title="注意"}
原官网 <https://s2.antv.vision> 和 <https://antv-s2.gitee.io> 不再维护和使用，请访问最新的网址，以确保您看到的不是过时的文档。
:::

- 原 `v1` 官网迁移至 <https://s2-v1.antv.antgroup.com>.
- 原 <https://s2.antv.antgroup.com> 将作为 `v2` 默认官网。

## 🏷️ npm dist-tag 变化

> 什么是 [dist-tag](https://docs.npmjs.com/adding-dist-tags-to-packages/) ?

[`S2 2.0`](https://s2.antv.antgroup.com) 正式版已发布，现在 `npm` 的 [`latest` dist-tag](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag) 默认对应 `2.x` 版本，即：

- ~~`@antv/s2@latest` => `@antv/s2@1.x.x`~~

- `@antv/s2@latest` => `@antv/s2@2.x.x`

:::warning{title="注意"}
**如通过此类未指定具体版本的方式安装，请注意不要意外安装到 `2.0` 新版本。**
:::

## ⏰ 已停止维护的包和版本

- `1.x` 版本现已停止维护，不再继续更新，不再修复 bug，不再支持新特性。
- `@antv/s2-vue` 现已停止维护，由于精力投入有限，出于维护成本，包下载量等因素综合考虑，从 `2.0.0` 正式版后不再继续更新，请基于 `@antv/s2` 自行封装，或 fork 仓库进行二次开发社区版本。

请根据 [升级指南](/manual/migration-v2) 尽快升级到 `2.x` 版本。

## 🛺 从 2.0.0-next.x 到 2.0.0 正式版

如果你使用的是内测版本 `2.0.0-next.x`, 升级到 `2.0` 正式版时额外需要注意以下几点不兼容改动：

- [构建产物调整](#-构建产物调整)
- [移除 Ant Design 组件库依赖](#移除-ant-design-组件库依赖)
- [Tooltip 操作项默认菜单组件移除](#tooltip-操作项默认菜单组件移除)

## 📦 安装

<embed src="@/docs/common/install.zh.md"></embed>

<embed src="@/docs/common/packages.zh.md"></embed>

## ⭐ 新增功能

官网目录标记为 <Badge type="success">New</Badge> 和 <Badge>Updated</Badge> 则表示新增功能，也可以查看官方语雀博客 [S2 2.0 表格看数新纪元](https://www.yuque.com/antv/blog/1122_7_s2).

## 📦 构建产物调整

- `ESModule/CommonJS`

所有包的 `ESModule (esm)` 和 `CommonJS (lib)` 构建产物从 `Bundle` 调整为 `Bundless`, 其所依赖的子模块会被直接拷贝输出，不再做编译，以便于更好的支持代码 `tree shaking`, 减少包体积。

- `UMD`

所有包的 `UMD (dist)` 构建产物依然为 `Bundle` 单文件，**文件名**和**全局变量名**有所调整：

| 包名  | 文件名（修改前） | 文件名（修改后） |
| -------- | ------ | --------- |
| `@antv/s2` | `dist/index.min.js` `dist/style.min.css` | `dist/s2.min.css` `dist/s2.min.css` |
| `@antv/s2-react` | `dist/index.min.js` `dist/style.min.css` | `dist/s2-react.min.css` `dist/s2-react.min.css` |
| `@antv/s2-vue` | `dist/index.min.js` `dist/style.min.css` | `dist/s2-vue.min.css` `dist/s2-vue.min.css` |

| 包名  | 全局变量名（修改前） | 全局变量名（修改后） |
| -------- | ------ | --------- |
| `@antv/s2` | `S2` | `S2` |
| `@antv/s2-react` | `S2-React` | `S2React` |
| `@antv/s2-vue` | `S2-Vue` | `S2Vue` |

## 📣 不兼容的变化

### 基础包 (s2) <Badge>@antv/s2</Badge>

#### 底层渲染引擎升级为 `AntV/G 6.0`

表格绘制引擎升级到 [`G 6.0`](https://g.antv.antgroup.com/) 大版本，和 [`AntV` 其他技术栈](https://antv.antgroup.com/) 保持同步，渲染方式升级为**异步**。

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

```tsx | pure
const s2Options = {
  transformCanvasConfig(renderer) {
    renderer.setConfig({ enableDirtyCheck: true })
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
+   dataCell: {},
  }
}
```

2. 废弃 `widthByFieldValue`, 新增 `widthByField`.
3. 行列宽高支持动态配置。

```diff
export interface BaseCellStyle {
  width?: number | (node) => number;
- height?: number;
+ height?: number | (node) => number;
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

3. API 方式调用的配置变更

`enterable` 属性移除，`showSingleTips` 变更为 `onlyShowCellText`, `onlyMenu` 变更为 `onlyShowOperator`

```diff
s2.showTooltip({
  options: {
-   enterable: true,
-   showSingleTips: true,
+   onlyShowCellText: true,
-   onlyMenu: true,
+   onlyShowOperator: true
  },
});
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

2. 废弃 `copyData`, 新增 `asyncGetAllData`, `asyncGetAllPlainData`, `asyncGetAllHtmlData` 等 API, 支持异步获取数据。

```diff
- const data = copyData(spreadsheet, '\t', false)

+ const data = await asyncGetAllData({
+   sheetInstance: s2,
+   split: '\t',
+   formatOptions: false,
+   async: true,
});
```

3. `copyToClipboard` 第二个参数含义 从 `sync` 变更为 `async`.

```diff
- const data = copyToClipboard(data: string, sync: boolean)
+ const data = copyToClipboard(data: Copyable | string, async: boolean)
```

4. 复制默认开启。
5. 复制导出默认异步。

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

#### customSVGIcons 配置调整

`svg` 调整为 `src`, 保持 API 统一。

```diff | pure
const s2Options = {
  customSVGIcons: [
    {
      name: 'CustomIcon',
-     svg: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
+     src: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ]
}
```

#### 树状结构配置和回调事件调整

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

4. 行头单元格折叠展开事件划分到 `RowCell`

移除 `LAYOUT_AFTER_COLLAPSE_ROWS`

```diff
- S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL
+ S2Event.ROW_CELL_ALL_COLLAPSED

- S2Event.LAYOUT_COLLAPSE_ROWS
- S2Event.LAYOUT_AFTER_COLLAPSE_ROWS
+ S2Event.ROW_CELL_COLLAPSED
```

#### 树状结构 icon 折叠展开状态同步

现在行头节点的 icon 展开/收起，会同步更新角头 icon（全部展开/收起）的状态。

#### 行列冻结配置

透视表和明细表的行列冻结配置统一收拢到 `frozen`。

在透视表中，`frozenFirstRow` 使用 `rowCount: 1` 替代。在明细表多级列头冻结时，在 `1.x` 中是以最最顶层节点为准，而在 `2.x` 是以叶子节点的数量为准。

```diff
const s2Options = {
-  frozenRowHeader: true,
-  frozenFirstRow: true,
-  frozenRowCount: 1;
-  frozenColCount: 1;
-  frozenTrailingRowCount: 1;
-  frozenTrailingColCount: 1;

+  frozen: {
+    rowHeader: true,
+    rowCount: 1;
+    colCount: 1;
+    trailingRowCount: 1;
+    trailingColCount: 1;
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

#### 字段标记

文本字段标记能力和 [文本主题配置](/api/general/s2-theme#texttheme) 保持一致，支持字体大小，透明度，对齐方式等配置。

```diff
const s2Options = {
  conditions: {
    text: [
      {
        field: 'city',
        mapping() {
          return {
            fill: '#DB6BCF',
+           fontSize: 16,
+           opacity: 0.8,
+           textAlign: 'right',
          };
        },
      },
    ]
  },
}
```

具体请查看 [字段标记](/manual/basic/conditions) 相关文档和 [文本标记示例](/examples/analysis/conditions#text)。

#### 序号配置变更

序号相关配置统一收拢在 `seriesNumber`.

```diff
const s2Options = {
- showSeriesNumber: true,
- seriesNumberText: '序号'

+ seriesNumber: {
+   enable: true,
+   text: '序号'
+ }
}
```

#### 单元格宽高拖拽逻辑变更

1. 在 `1.x` 中，宽高调整对**所有单元格**生效，`2.x` 新增 `rowResizeType/colResizeType` 选择对 `当前 (current)`, `选中 (selected)`, 还是 `所有 (all)` 单元格生效。

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

1. 静态属性 `layoutResult` 废弃，使用 `s2.facet.getLayoutResult()` 动态获取，现在包含 `角头节点 (cornerNodes)` 和 `序号节点 (seriesNumberNodes)`。

```diff
- s2.facet.layoutResult
+ s2.facet.getLayoutResult()
```

2. `getCellMeta` 从 `layoutResult` 中移除，移动到 `facet` 层级，现在 `layoutResult` 只包含布局节点。

```diff
- s2.facet.layoutResult.getCellMeta(rowIndex, colIndex)
+ s2.facet.getCellMeta(rowIndex, colIndex)
```

3. 布局结构 `layoutResult` 新增 `角头节点 (cornerNodes)` 和 `序号节点 (seriesNumberNodes)`.

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

4. 透视表和明细表的数值单元格元数据格式统一，现在 `cellMeta` 中都包含 `query/rowQuery/colQuery`.

透视表：

```diff
{
  rowQuery: {
    "province": "浙江省",
    "city": "宁波市"
  },
  colQuery: {
    "sub_type": "沙发",
    "type": "家具",
    "$$extra$$": "number"
  },
+ query: {
+   "province": "浙江省",
+   "city": "宁波市",
+   "sub_type": "沙发",
+   "type": "家具",
+   "$$extra$$": "number"
+  }
}
```

明细表：

```diff
{
+  rowQuery: {
+    "rowIndex": 1,
+  },
+  colQuery: {
+    "colIndex": 2,
+  },
+  query: {
+    "rowIndex": 1,
+    "colIndex": 2
+  }
}
```

5. 原 `s2.getContentHeight()` 废弃，移动到 `s2.facet.getContentHeight()` 中。

```diff
- s2.getContentHeight()
+ s2.facet.getContentHeight()
+ s2.facet.getContentWidth()
```

6. 获取布局节点相关 API，移动至 `s2.facet` 命名空间下。并新增丰富的 [语法糖](/api/basic-class/base-facet).

```diff
- s2.getRowNodes()
- s2.getRowLeafNodes()
- s2.getColumnLeafNodes()
- s2.getColumnNodes()

+ s2.facet.getRowNodes()
+ s2.facet.getRowLeafNodes()
+ s2.facet.getColLeafNodes()
+ s2.facet.getColNodes()
```

具体请查看 [获取单元格数据](/manual/advanced/get-cell-data) 和 [BaseFacet](/api/basic-class/base-facet) 相关文档。

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
+   rebuildHiddenColumnsDetail: false,
+ });
```

`reBuildDataSet` 重命名为 `rebuildDataSet`:
`reBuildHiddenColumnsDetail` 重命名为 `rebuildHiddenColumnsDetail`:

```diff
s2.render({
-  reBuildDataSet: false,
+  rebuildDataSet: false,
-  reBuildHiddenColumnsDetail: false,
+  rebuildHiddenColumnsDetail: false,
});
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
-     subLabel: '小计'
-     totalsGroupDimensions: [],
-     reverseSubLayout: true,

+     calcGrandTotals: {}.
+     reverseGrandTotalsLayout: true,
+     grandTotalsLabel: '总计',
+     subTotalsLabel: '小计',
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

对于多个 `values` 的数据，现在期望一个数据项中就包含所有的 `values` 信息。

```js
{
  fields: {
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

#### S2DataConfig.totalData 配置移除

`totalData` 和 `data` 合并，不再需要 `totalData` 配置。

```diff
{
-  data: [...],
-  totalData: [...],

+  data: [...data, ...totalData],
}
```

#### 透视表数值单元格元数据数据结构变更

`this.meta.data` 数据结构变更：

```diff
{
-  "number": 7789,
-  "province": "浙江省",
-  "city": "杭州市",
-  "type": "家具",
-  "sub_type": "桌子",

+  "extraField": "number",
+    "raw": {
+    "number": 7789,
+    "province": "浙江省",
+    "city": "杭州市",
+    "type": "家具",
+    "sub_type": "桌子"
+ },
+  "$$extra$$": "number",
+  "$$value$$": 7789,
+  "$$origin$$": {
+    "number": 7789,
+    "province": "浙江省",
+    "city": "杭州市",
+    "type": "家具",
+    "sub_type": "桌子"
+  }
}
```

具体请查看 [CellData](/api/basic-class/cell-data) 相关文档。

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

#### 全选 API 逻辑调整

在 `1.x`, 全选本质上是高亮，只有样式更新，并不是真的选中，在 `2.x` 中切换为正确的语义，并且能获取到选中的单元格。

```diff
s2.interaction.selectAll()
- s2.interaction.getActiveCells() // []
+ s2.interaction.getActiveCells() // [CellA, CellB]
```

#### 选中单元格 API 调整

`selectHeaderCell` 变更为 `changeCell`, 支持所有类型单元格的选中。同时支持 `选中 (selectCell)` 和 `高亮 (highlightCell)` 等语法糖。

```diff
- s2.interaction.selectHeaderCell(selectHeaderCellInfo: SelectHeaderCellInfo)
+ s2.interaction.changeCell(options: ChangeCellOptions)

+ s2.interaction.selectCell(cell: S2CellType)
+ s2.interaction.highlightCell(cell: S2CellType)
```

同时支持 `animate （是否展示滚动动画` 和 `skipScrollEvent （是否触发滚动事件）` 配置。

```ts | pure
s2.interaction.selectCell(cell, {
  animate: true,
  skipScrollEvent: true
})
```

具体请查看 [高亮/选中单元格](/manual/advanced/interaction/highlight-and-select-cell) 相关文档。

#### 滚动 API 调整

滚动 API `s2.updateScrollOffset` 移除，统一至 `s2.interaction` 命名空间下。同时支持 `scrollToCell` 和 `scrollToTop` 等语法糖。

```diff
- s2.updateScrollOffset(offsetConfig: ScrollOffsetConfig)
+ s2.interaction.scrollTo(offsetConfig: ScrollOffsetConfig)
```

同时支持 `skipScrollEvent（是否触发滚动事件）` 配置。

```diff
s2.interaction.scrollTo({
+  skipScrollEvent: false
})
```

具体请查看 [滚动](/manual/advanced/interaction/scroll) 相关文档。

##### 配置预处理 API 变更

```diff
- import { getSafetyOptions, getSafetyDataConfig } from '@antv/s2'
+ import { setupOptions, setupDataConfig } from '@antv/s2'
```

#### 空数据占位符配置变更

除了支持配置单元格的空数据占位符，现在支持配置明细表的 [空数据状态](/examples/custom/custom-cell/#empty-placeholder)，类似于 [Ant Design 的 Empty 组件](https://ant-design.antgroup.com/components/empty-cn) 的空状态效果，配置独立为 `cell` 和 `empty` 两个配置项，以区分两种状态。

```diff
const s2Options = {
- placeholder: "-",
+ placeholder: {
+   cell: '-'
+ }
}
```

```diff
const s2Options = {
+ placeholder: {
+   empty: {
+     icon: 'Empty',
+     description: '暂无数据'
+   }
+ }
}
```

具体请查看 [自定义空数据占位符](/examples/custom/custom-cell/#empty-placeholder) 和 [自定义单元格空数据占位符](/examples/custom/custom-cell/#data-cell-placeholder) 示例。

#### 内部常量重命名

```diff
- import { ROOT_ID, ID_SEPARATOR } from '@antv/s2'
+ import { ROOT_NODE_ID, NODE_ID_SEPARATOR } from '@antv/s2'
```

如有消费请注意修改，具体请查看 [源代码定义](https://github.com/antvis/S2/tree/next/packages/s2-core/src/common/constant).

#### 自定义数值单元格参数变更

增加第二个参数 `spreadsheet`, 和其他单元格保持一致。

```diff
const s2Options = {
   width: 600,
-  dataCell: (viewMeta) => {
-    return new CustomDataCell(viewMeta, viewMeta.spreadsheet);
-  }
+  dataCell: (viewMeta, spreadsheet) => {
+    return new CustomDataCell(viewMeta, spreadsheet);
+  }
}
```

#### 链接跳转逻辑和参数变更

1. 现在链接跳转支持对 **列头** 标记，且明细表同时对 `列头` 和 `数值` 生效（可自定义规则）。
2. 回调参数 `key` 调整为 `field`, `cellData` 调整为 `meta`.

```diff
s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
-  const { key, cellData, record } = data;
+  const { field, meta, record } = data;
});
```

具体请查看 [链接跳转](/manual/advanced/interaction/link-jump) 相关文档。

#### 行列维值为空时 ID 生成规则变更

在 `1.x` 中由于会将维值转为字符串，如果维值为空 (null), 会转换成 `"null"`, 导致无法获取原始维值，`2.x` 版本中会对该情况增加特殊标识，便于识别 `null` 的情况，正确识别原始维值，以及空值占位符逻辑。

```diff
{
-  id: 'root[&]null',
-  value: 'null'

+  id: 'root[&]$$null$$',
+  value: null
}

```

#### 数值单元格获取数值范围区间方式变更

```diff
- dataCell.valueRangeByField
+ dataCell.getValueRange()
```

#### 分割线主题配置默认值变更

分割线的 `颜色` 和 `透明度` 在没有默认值的情况下，默认和所在区域对应的单元格边框保持一致。

```diff
splitLine: {
-  horizontalBorderColor: basicColors[12],
-  horizontalBorderColorOpacity: 0.2,
-  verticalBorderColor: basicColors[12],
-  verticalBorderColorOpacity: 0.25,
}
```

#### 单元格默认 padding 变更

`paddingTop` 和 `paddingBottom` 调整为 `8px`.

```diff
{
-  top: 4,
+  top: 8,
-  bottom: 4,
+  bottom: 8
}
```

### 组件层 (s2-react) <Badge>@antv/s2-react</Badge>

#### 移除 Ant Design 组件库依赖

:::info
`2.0` 正式版本中移除了 `antd` 的依赖，组件内部更轻量，不再受项目 `antd` 的版本限制，升级更平滑，推荐自行组合使用。
:::

##### 表头组件移除

`header` 属性移除，相关配置 (`switcher`, `export`, `advancedSort`) 等对应的组件迁移至 `@antv/s2-react-components` 中，可以**单独按需引入**。

```diff
<SheetComponent
-  header={{
-    title: "",
-    description: "",
-    switcher: { open: true },
-    export: { open: true },
-    advancedSort: { open: true },
-  }}
/>
```

##### 组件内部的 ConfigProvider 移除

`SheetComponent` 不再包裹 antd 的 `<ConfigProvider />` 全局配置组件，可以自行在外层嵌套 `<ConfigProvider />` 组件，避免不同 `antd` 版本的兼容性问题。

```diff
import { ConfigProvider } from 'antd'

<SheetComponent>
-  <ConfigProvider />
</SheetComponent>

+ <ConfigProvider>
+  <SheetComponent />
+ </ConfigProvider>
```

##### 组件内部的 Spin 组件移除

```diff
import { Spin } from 'antd'

<SheetComponent>
-  <Spin />
</SheetComponent>

+ <Spin>
+  <SheetComponent />
+ </Spin>
```

`1.x` 的 `<SheetComponent />` 内部会包裹 antd 的 `<Spin />` 组件。现已移除，不再有 `loading` 效果，新增 `onLoading`, 可以自行在外层嵌套相关组件，组合使用。

**通常来说，onLoading 的效果感知不强，推荐根据业务侧 API 请求状态，控制 `loading` 效果**。

```tsx | pure
import { Spin } from 'antd'

function App() {
  const [loading, setLoading] = React.useState(false)

  return (
    <Spin spinning={loading}>
      <SheetComponent onLoading={setLoading} />
    </Spin>
  )
}
```

##### 分页组件移除

1. `showPagination` 属性移除。

```diff
- <SheetComponent showPagination />
```

1. 提供 `pagination` 属性，表格内部封装了 S2 的内部分页更新逻辑，可以配合任意分页组件使用，如 antd 的 `<Pagination />`。

```tsx | pure
import { Pagination } from 'antd';

function App() {
  return (
    <SheetComponent options={s2Options}>
      {({ pagination }) => (
        // 结合任意分页器使用：如 antd 的 Pagination 组件
        <Pagination
          size="small"
          showTotal={(total) => `共计 ${total} 条`}
          {...pagination}
        />
      )}
    </SheetComponent>
  )
}
```

##### 高级排序组件迁移

```diff
- import { AdvancedSort } from '@antv/s2-react';
+ import { AdvancedSort } from '@antv/s2-react-components';
```

1. 配置变更

`sheet` 变更为 `sheetInstance`

```diff
- <AdvancedSort sheet={s2} />
+ <AdvancedSort sheetInstance={s2} />
```

具体请查看 [高级排序](/manual/advanced/analysis/advanced) 相关文档。

##### 维度切换组件迁移

```diff
- import { Switcher } from '@antv/s2-react';
+ import { Switcher } from '@antv/s2-react-components';
```

1. 配置变更

新增 `icon` 配置，`title` 含义变更，现在不再用做自定义入口，使用 `children` 代替。

```diff
- <Switcher title={<Button>切换维度</Button>} />

+ <Switcher title="切换维度" icon={<SwapOutlined/>} />
+ <Switcher>
+   <Button>切换维度</Button>
+ </Switcher>
```

具体请查看 [维度切换](/manual/advanced/analysis/switcher) 相关文档。

##### 导出组件迁移

```diff
- import { Export } from '@antv/s2-react';
+ import { Export } from '@antv/s2-react-components';
```

1. 配置变更

```diff
- <Export syncCopy={true} sheet={s2} />
+ <Export async={false} sheetInstance={s2} />
```

`icon` 属性移除，支持自定义 children.

```diff
- <Export icon={<MoreOutlined/> } />
+ <Export><Button type="text"><MoreOutlined /></Button></Export>
```

2. `复制原始数据` 和 `复制格式化数据` 现在会同时将 `text/plain` 和 `text/html` 的数据写入到剪贴板。
3. 新增 `onCopySuccess/onCopyError`, `onDownloadSuccess/onDownloadError` API, 移除 `successText/errorText`, 操作时默认不再显示 `message` 提示。

```diff
<Export
-  successText="操作成功"
-  errorText="操作成功"
+  onCopySuccess={(data) => {
+    console.log('copy success:', data);
+  }}
+  onCopyError={(error) => {
+    console.log('copy failed:', error);
+  }}
+  onDownloadSuccess={(data) => {
+    console.log('download success', data);
+  }}
+  onDownloadError={(error) => {
+    console.log('download failed:', error);
+  }}
/>
```

1. 新增 `StrategyExport` 组件，适用于趋势分析表的数据复制和导出，使用方式和 `Export` 相同。

```ts
import { StrategyExport } from '@antv/s2-react-components';
```

具体请查看 [导出](/manual/advanced/analysis/export) 相关文档。

##### 维度下钻组件迁移

```diff
- import { DrillDown } from '@antv/s2-react';
+ import { DrillDown } from '@antv/s2-react-components';
```

1. 配置调整。

```diff
- <DrillDown titleText="下钻" clearButtonText="清除" />
+ <DrillDown title="下钻" clearText="清除" />
```

2. 在表格组件中使用时，需要通过 `render` 属性传入 `DrillDown` 配置面板。

```diff
+ import { DrillDown } from '@antv/s2-react-components';

function App() {
  return (
    <SheetComponent
      sheetType="pivot"
      options={s2Options}
      partDrillDown={{
+       render: (props) => <DrillDown {...props} />,
      }}
    />
  )
}
```

具体请查看 [维度下钻](/manual/advanced/analysis/drill-down) 相关文档。

##### 编辑表输入框组件替换

antd 的 `Input.TextArea` 组件替换为 原生的 `textarea`.

```diff
+ <Input.TextArea />
- <textarea />
```

##### Tooltip 操作项默认菜单组件移除

1. 内部**排序菜单**和**操作项**依赖的 antd [Menu 组件](https://ant-design.antgroup.com/components/menu-cn#api) 移除，现在需要通过 `render` 显式声明 UI 组件，最终效果相同，默认提供菜单配置 (props) , 可以根据项目中实际使用的 `antd@v4` 或 `antd@v5` 不同版本，对使用方式进行调整。

```tsx | pure
import { Menu } from 'antd'

const s2Options = {
  tooltip: {
    operation: {
      menu: {
        render: (props) => {
          return <Menu {...props} />;
        },
      }
    }
  }
}
```

2. 配置和 API 参数调整

菜单项调整到 `menu` 下

```diff
const s2Options = {
  tooltip: {
    operation: {
-     onClick: (cell) => {},
-     menus: [
-       {
-         key: 'custom-a',
-         text: '操作 1',
-         icon: 'Trend',
-         onClick: (cell) => {},
-         visible: (cell) => true,
-         children: [],
-       }
-     ],

+     menu: {
+       onClick: (info, cell) => {},
+       items: [
+         {
+           key: 'custom-a',
+           label: '操作 1',
+           icon: 'Trend',
+           onClick: (info, cell) => {},
+           visible: (info, cell) => true,
+           children: [],
+         }
+       ],
+     },
    },
  },
};

<SheetComponent options={s2Options} />
```

同时，通过 API 方式调用时，`defaultSelectedKeys` 变更为 `selectedKeys`。

```diff
s2.showTooltip({
  options: {
    operator: {
      menu: {
-       defaultSelectedKeys: ['key-1'],
+       selectedKeys: ['key-1'],
      },
    },
  },
});
```

具体请查看 [Tooltip](/manual/basic/tooltip) 和 [组内排序](/manual/basic/sort/group) 相关文档。

#### 支持 React 18

:::info{title="提示"}
React 19 已发布 [RC 版本](https://react.dev/blog/2024/04/25/react-19), 后续兼容视情况而定。
:::

`@antv/s2-react` 的 `2.x` 版本适配了 `React 18`, 并兼容 `React 16 和 17`.

#### Ant Design 多版本共存 （不推荐）

由于 `antd@4.x` 已经 [停止维护](https://ant-design.antgroup.com/docs/blog/v4-ood-cn), 分析组件 `@antv/s2-react-components` 默认基于 `antd@5.x` 开发，虽然使用的都是基础组件，但是是否完全兼容 `antv@4.x` 取决于两个版本的差异性。

对于项目使用的是 `antd@4.x`, 或者所依赖的其他库间接依赖 `antd@4.x`, 由于种种历史原因无法升级到 `antd@5.x` 的情况，可以通过 [多版本共存](https://ant-design.antgroup.com/docs/react/migration-v5-cn#%E5%A4%9A%E7%89%88%E6%9C%AC%E5%85%B1%E5%AD%98) 的方式来临时过渡。

```json
// $ npm install --save antd-v5@npm:antd@5
{
  "antd": "4.x",
  "antd-v5": "npm:antd@5"
}
```

通过 webpack 内置插件 [`NormalModuleReplacementPlugin`](https://webpack.js.org/plugins/normal-module-replacement-plugin/) 或者 `自定义 webpack 插件` 的方式指定 `@antv/s2-react-components` 使用 `antd-v5`, 无需做任何修改，项目中其他依赖将继续使用 `antd@4.x`.

:::warning{title="注意"}
其他打包工具 （如 `Vite`) 或者基于 `webpack` 封装的库或框架（如 `father`, `umi`) 同理，请自行搜索，这里不再赘述。
需要注意的是：这种方式为临时过渡解决方案，从长远来看，**[Ant Design v4 版本已于 2023 年年底停止维护](https://ant-design.antgroup.com/docs/blog/v4-ood-cn)，建议尽快升级至 `antd@5.x`.**
:::

自定义 webpack 插件参考：

```ts
class AntdV5AliasPlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap("AntdV5AliasPlugin", (nmf) => {
      nmf.hooks.beforeResolve.tapAsync("AntdV5AliasPlugin", (resolveData, callback) => {
        if (resolveData.contextInfo?.issuer?.includes('node_modules/@antv/s2-react-components')) {
          // 匹配："antd" 和 "antd/es/locale/xxx"
          if (/antd(\/*)?/.test(resolveData.request)) {
            // 替换为："antd-v5" 和 "antd-v5/es/locale/xxx"
            resolveData.request = resolveData.request.replace(/antd(\/*)?/,'antd-v5$1')
          }
        }

        callback();
      });
    });
  }
}
```

#### 行头单元格折叠展开事件划分到 `RowCell`

`onCollapseRowsAll`, `onLayoutAfterCollapseRows` 更名为 `onRowCellAllCollapsed`, `onRowCellCollapsed`

```diff
- <SheetComponent options={s2Options} onCollapseRowsAll={} />
+ <SheetComponent options={s2Options} onRowCellAllCollapsed={} />

- <SheetComponent options={s2Options} onLayoutAfterCollapseRows={} />
+ <SheetComponent options={s2Options} onRowCellCollapsed={} />

```

#### `onSheetUpdate` 更名为 `onUpdate`, 并新增 `onUpdateAfterRender`

- `onUpdate`: 组件层表格更新事件，当 `数据 (S2DataConfig)` 或 `配置 (S2Options)` 更新时触发。
- `onUpdateAfterRender`: 组件层表格更新事件，当 `数据 (S2DataConfig)` 或 `配置 (S2Options)` 更新时，并且在重渲染 `s2.render()` 完成后触发。

```diff
- <SheetComponent onSheetUpdate={} />
+ <SheetComponent onUpdate={} onUpdateAfterRender={} />
```

#### onUpdate 类型优化，不再强制要求返回渲染参数

`2.x` 版本中，`onUpdate` 如未指定渲染参数，则使用默认的 `renderOptions`.

```diff
<SheetComponent
  onUpdate={(renderOptions) => {
-   return renderOptions
  }}
/>
```

#### SheetComponentsProps 类型调整

```diff
- interface SheetComponentsProps {}
+ interface SheetComponentProps {}
```

### 组件层 (s2-vue) <Badge type="success">@antv/s2-vue</Badge> <Badge type="error">停止维护</Badge>

:::warning{title="注意"}
`@antv/s2-vue` 现已停止维护，由于精力投入有限，出于维护成本，包下载量等因素综合考虑，从 `2.0.0` 正式版后不再继续更新，请基于 `@antv/s2` 自行封装，或 fork 仓库进行二次开发社区版本。
:::

## ✍️ API 调整

具体请查看标记为 <Badge type="success">New</Badge> 和 <Badge>Updated</Badge> 的 [`API 文档`](/api)

## 🙋 遇到问题

更多新特性和改动请阅读文档，如果您在升级过程中遇到了问题，请到 [GitHub issues](https://github.com/antvis/S2/issues) 或者 [GitHub Discussions](https://github.com/antvis/S2/discussions) 进行反馈。我们会尽快响应和改进这篇文档。
