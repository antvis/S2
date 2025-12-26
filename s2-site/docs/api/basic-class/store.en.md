---
title: Store
order: 3
---

Function description: store some information. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/store/index.ts)

```ts
s2.store.get('key') // Get
s2.store.set('key', value) // Set
```

| parameter                | illustrate                                                          | type                                                             |
| ------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| scrollX                  | horizontal scroll offset                                            | `number`                                                         |
| scrollY                  | vertical scroll offset                                              | `number`                                                         |
| rowHeaderScrollX              | vertical header scroll offset                                       | `number`                                                         |
| sortParam                | Column header sorting configuration                                 | [SortParam](/en/api/components/sheet-component/#sortparams) |
| drillDownIdPathMap       | Drill down node id and corresponding generated path addressing path | `Map<string, number[][]>`                                     |
| drillDownNode            | current drill-down node                                             | [node](/en/api/basic-class/node)                            |
| drillItemsNum            | Control the number of drill-down data                               | `number`                                                      |
| interactionStateInfo     | Current Interaction Status Information                              | `number`                                                      |
| drillDownFieldInLevel    | Drill down to node level information                                | [PartDrillDownInfo\[\]](#partdrilldowninfo)                   |
| originalDataCfg          | Raw Data Configuration                                              | [S2DataConfig](/en/api/general/s2-data-config)                |
| panelBBox                | Visual area wrapping box model                                      | [BBox](/en/api/basic-class/spreadsheet/#bbox)               |
| activeResizeArea         | current resizing region group                                       | [Group](https://g.antv.antgroup.com/api/basic/group)              |
| valueRanges              | conditional format value range                                      | [ValueRanges](#valueranges)                                   |
| initColLeafNodes      | The column header leaf node when it is first rendered               | [Node\[\]](/en/api/basic-class/node)                        |
| hiddenColumnsDetail      | Hidden column header details                                        | [HiddenColumnsInfo\[\]](#hiddencolumnsinfo)                   |
| lastRenderedColumnFields | The column header configuration of the last render                  | `string[]`                                                    |
| resized                  | Whether to manually adjust the width and height                     | `boolean`                                                     |
| visibleActionIcons       | The icon cache displayed by hover                                   | `GuiIcon[]`                                                   |
| lastClickedCell          | last clicked cell                                                   | `S2CellType<ViewMeta>`                                        |
| initOverscrollBehavior   | initial scroll chain state                                          | `'auto' \| 'none' \| 'contain'`                               |
| sortMethodMap            | sort by                                                             | `Record<string, SortMethod>`                                  |
| \[key: string]           | Any other field                                                     | `unknown`                                                     |

## HiddenColumnsInfo

```ts
interface HiddenColumnsInfo {
  // Hidden nodes before the currently displayed sibling node
  hideColumnNodes: Node[];
  // Sibling node corresponding to the expand button of the currently hidden column
  displaySiblingNode: Node;
}
```

## PartDrillDownInfo

```ts
interface PartDrillDownInfo {
  // Drill down data
  drillData: RawData[];
  // Drill down field
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

<embed src="@/common/view-meta.en.md"></embed>
