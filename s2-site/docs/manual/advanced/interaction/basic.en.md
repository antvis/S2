---
title: Basic Interaction
order: 0
---

## Interactive type

The common interaction of the form is mainly through the keyboard and mouse

* mouse click
* mouseover (hover)
* Keyboard press/up (keydown / keyup)
* ...

Through these events, permutations and combinations, to achieve commonly used interactions, take `brush selection` as an example, it consists of three events

* `mousedown` => `mousemove` => `mouseup`

## built-in interaction

| name                                                       | event name                                                    | describe                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| radio                                                      | `S2Event.GLOBAL_SELECTED`                                     | Click a cell, a tooltip will pop up to display the information of the corresponding cell, click again to cancel the selection                                                                                                                                                      |
| multiple choice                                            | `S2Event.GLOBAL_SELECTED`                                     | After single-selecting cells, hold down the `Command / Ctrl` key to continue single-selecting                                                                                                                                                                                      |
| Row/column header shortcut multiple selection              | `S2Event.GLOBAL_SELECTED`                                     | Click the row/column header, select all the cells of the corresponding row/column header (including those not in the visible range), click again to cancel the selection                                                                                                           |
| Manually adjust the width and height of row/column headers | `S2Event.LAYOUT_RESIZE`                                       | Hover the mouse over the edge of the row/column header cell, an indicator bar and a cursor will appear, hold down the left mouse button and drag to adjust the width and height                                                                                                    |
| Brush Selection                                              | `S2Event.DATA_CELL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED` | Batch select the numerical cells within the brushing range. During the brushing process, the brushing range prompt mask will be displayed. After the brushing is completed, a tooltip will pop up to display the information and quantity of the brushed cells.                    |
| Row Header Selection                                       | `S2Event.ROW_CELL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED`  | Batch select the row header cells within the brushing range. During the brushing process, the brushing range prompt mask will be displayed. After the brushing is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables)            |
| Column head brush selection                                | `S2Event.COL_CELL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED`  | Batch select the column header cells within the brushing range. During the brushing process, the brushing range prompt mask will be displayed. After the brushing is completed, a tooltip will pop up to display the brushed cell information (only pivot tables are supported)    |
| Interval shortcut multiple selection                       | `S2Event.GLOBAL_SELECTED`                                     | Select a single cell (start), then hold down `Shift` to select a cell again (end), and select all cells in the two cell intervals                                                                                                                                                  |
| hover                                                      | `S2Event.GLOBAL_HOVER`                                        | When the mouse hovers, the corresponding cell is highlighted. If it is a numerical cell, the [Row/Column linkage highlighting](/en/manual/advanced/interaction/basic#%E8%A1%8C%E5%88%97%E8%81%94%E5%8A%A8%E9%AB%98%E4%BA%AE) by default. You can set `hoverHighlight: false` to turn it off |
| copy                                                       | `S2Event.GLOBAL_COPIED`                                       | Copy selected cell data                                                                                                                                                                                                                                                            |
| hide column header                                         | `S2Event.COL_CELL_EXPANDED` `S2Event.COL_CELL_HIDDEN`         | Hide/expand column headers                                                                                                                                                                                                                                                         |
| link jump                                                  | `S2Event.GLOBAL_LINK_FIELD_JUMP`                              | Row header/column header link jump                                                                                                                                                                                                                                                 |
| reset                                                      | `S2Event.GLOBAL_RESET`                                        | Click again, click on an empty space, or press `Esc` to deselect a cell                                                                                                                                                                                                            |
| move highlighted cell                                      | `S2Event.GLOBAL_SELECTED`                                     | After clicking the value cell, use the keyboard arrow keys to move the currently highlighted cell                                                                                                                                                                                  |

## interaction event

[View full event list](/en/api/general/s2-event)

* `global:xx` : global chart events
* `layout:xx` : layout change event
* `cell:xx` : Cell-level events, the entire table is divided into different cell types, you can monitor specific cells for events to achieve custom requirements

```ts
import { ColCell, DataCell, PivotSheet, RowCell, S2Event } from '@antv/s2';

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.on(S2Event.DATA_CELL_BRUSH_SELECTION, (cells: DataCell[]) => {
  // This event is enabled by default. Configure options: { interaction: { brushSelection : { dataCell: true } } } to enable data cell brush selection
  console.log('Brushed cells', cells)
})

s2.on(S2Event.ROW_BRUSH_SELECTION, (cells: RowCell[]) => {
  // This event is disabled by default. Configure options: { interaction: { brushSelection : { rowCell: true } } } to enable row header cell brush selection
  console.log('Brushed row header cells:', cells)
})

s2.on(S2Event.COL_BRUSH_SELECTION, (cells: ColCell[]) => {
  // This event is disabled by default. Configure options: { interaction: { brushSelection : { colCell: true } } } to enable column header cell brush selection
  console.log('Brushed column header cells:', cells)
})

s2.on(S2Event.COL_CELL_HOVER, (event) => {
  ...
})

s2.on(S2Event.GLOBAL_KEYBOARD_DOWN, (event) => {
  ...
})
```

If you are using `@antv/s2-react` or `@antv/s2-vue` , you can get the [S2 table instance](/en/manual/advanced/get-instance/) and listen to the required events, **which is exactly the same as** `@antv/s2` .

```ts
import { S2Event, SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react';

function App() {
  const s2Ref = React.useRef<SpreadSheet>();

  const onSheetMounted = () => {
    s2Ref.current?.on(S2Event.DATA_CELL_CLICK, (event) => {
      console.log('onDataCellClick: ', event)
    })
  }

  return <SheetComponent ref={s2Ref} onMounted={onSheetMounted}/>
}
```

At the same time, `React` and `Vue3` versions provide event mapping, and you can also use `onDataCellClick` and `@dataCellClick` methods that are more in line with your habits ( [see all APIs](/en/api/components/sheet-component) )

> React

```tsx
import { SheetComponent } from '@antv/s2-react';

const onDataCellClick = () => {}

<SheetComponent onDataCellClick={onDataCellClick} />
```

> Vue

```tsx
import { SheetComponent } from '@antv/s2-vue';

const onDataCellClick = () => {}

<SheetComponent @dataCellClick={onDataCellClick} />
```

For global chart events, the bottom layer is implemented through the browser's [EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) API. If you need to configure its third optional parameter, you can pass it through `eventListenerOptions` to control whether the event is triggered from the `bubbling phase` or the `capturing phase`, or only Trigger once and so on.

```ts
const s2Options = {
  interaction: {
    eventListenerOptions: {
      capture: true,
    }
  }
}

// Equivalent to
window.addEventListener('mouseup', () => {}, {
  capture: true,
})

window.addEventListener('mouseup', () => {}, true)
```

## Interaction related configuration

[View specific API configuration details](/en/api/basic-class/interaction#interaction)

```ts
const s2Options = {
  interaction: {
    ...
  }
}
```

## built-in interaction

> How to modify the interaction default style? Please check the [theme configuration](/en/manual/basic/theme) chapter

### Single Selection Highlight

<img src="https://gw.alipayobjects.com/zos/antfincdn/0lw2grIHZN/click.gif" width="600" alt="preview">

After selecting a cell, if you need to gray out the unselected cells and emphasize the data that needs attention, it is disabled by default, and you can configure `selectedCellsSpotlight` to enable it:

```ts
const s2Options = {
  interaction: {
    selectedCellsSpotlight: true, // default false
  }
};
```

### Row and column linkage highlighting

When the mouse hovers, highlight the current cell and the corresponding row and column header cells to form a "cross highlight" effect, and view the data more intuitively. It is enabled by default and can be configured to `hoverHighlight` :

<img src="https://gw.alipayobjects.com/zos/antfincdn/l23NpRrPmF/hover.gif" alt="preview" width="600">

```ts
const s2Options = {
  interaction: {
    hoverHighlight: false // default true
  }
};
```

### Row and column headers are highlighted after single selection

When the mouse selects a cell or brushes a selected cell, the row and column head cell corresponding to the current cell is highlighted, which is convenient for quickly locating the row and column of the cell. Disabled by default, you can configure `selectedCellHighlight` to enable:

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*bqsoRpdz8mgAAAAAAAAAAAAAARQnAQ" alt="preview" width="600">

```ts
// The type of selectedCellHighlight is boolean | { rowHeader: boolean, colHeader: boolean, rowCells: boolean, colCells: boolean }
// When selectedCellHighlight is boolean
const s2Options = {
  interaction: {
    selectedCellHighlight: true // default is false
  }
};

// You can also configure the highlighting of header and cells in selectedCellHighlight separately
const s2Options = {
  interaction: {
    selectedCellHighlight: {
      rowHeader: true,  // Highlight row header when cell is selected
      colHeader: true,  // Highlight column header when cells are selected
      currentRow: false,  // Highlight the current row when a cell is selected
      currentCol: false,  // Highlight the current column when a cell is selected
    },
  },
};
```

### hover focus

After the mouse hovers over the current cell for more than `800ms` , it will keep the current highlight, display the `tooltip` , and focus on the current data. It is enabled by default. You can configure `hoverFocus` to turn it off, and you can also configure `hoverFocus.duration` to change the time interval for the `tooltip` to appear. If you want the tooltip to appear immediately after hover, you can set the `duration` to 0;

> If you implement a custom interaction, such as displaying a tooltip after hover, it is recommended to turn off this function, so as not to accidentally close the tooltip after hovering

<img src="https://gw.alipayobjects.com/zos/antfincdn/46WvUNsfP/Kapture%2525202022-05-17%252520at%25252018.18.12.gif" alt="preview" width="600">

```ts
const s2Options = {
  interaction: {
    hoverFocus: false // default true
  }
};
```

### Brush Selection Highlight

Circle selection highlighting is also called brush selection. During the brush selection process, the pre-selected cells will be prompted and a translucent brush selection mask will be displayed. It is enabled by default and can be configured to `brushSelection` :

#### Data cell brush selection

<img src="https://gw.alipayobjects.com/zos/antfincdn/WBFq3TzTY9/multi-select.gif" alt="preview" width="600">

```ts
const s2Options = {
  interaction: {
    brushSelection: false // default true
  }
};
```

#### Row header cell brush selection

<img src="https://gw.alipayobjects.com/zos/antfincdn/1M9vUtedn/hangtoushuaxuan.gif" alt="preview" width="600">

```ts
const s2Options = {
  interaction: {
    brushSelection:  {
        rowCell: true // default false
    }
  }
};
```

#### Column header cell brush selection

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24DEZUiWFW/lietoushuaxuan.gif" alt="preview" width="600">

```ts
const s2Options = {
  interaction: {
    brushSelection:  {
        colCell: true // default false
    }
  }
};
```

### Shortcut Key Multiple Selection

(Command/Ctrl) + click: Single multi-selection overlay, click the selected cell or row or column again to unselect it, it is enabled by default, and `multiSelection` can be configured to disable:

<img src="https://gw.alipayobjects.com/zos/antfincdn/XYZaL1w%24M/Kapture%2525202022-04-15%252520at%25252011.45.55.gif" width="600" alt="preview">

Shift + click: range selection (similar to brush selection), enabled by default, and can be configured to `rangeSelection` :

<img src="https://gw.alipayobjects.com/zos/antfincdn/RcIcQc7O2/Kapture%2525202022-04-15%252520at%25252011.52.52.gif" width="600" alt="preview">

```ts
const s2Options = {
  interaction: {
    multiSelection: false, // default true
    rangeSelection: false // default true
  }
};
```

### Move Highlighted Cell

After clicking the value cell, use the keyboard arrow keys to move the current highlighted cell, which is enabled by default, and can be configured to disable `selectedCellMove` :

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*w2M7Q7PzS3gAAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

```ts
const s2Options = {
  interaction: {
    selectedCellMove: false // default true
  }
};
```

### hide column header

<img src="https://gw.alipayobjects.com/zos/antfincdn/0TMss8KAY/Kapture%2525202022-02-11%252520at%25252017.52.53.gif" alt="preview" width="600">

Both pivot tables and detailed tables are supported. After clicking the column header of a leaf node, the hide column header button will be displayed. After clicking hide, a display button and a hidden prompt line will be displayed in the adjacent sibling cell, just click the mouse Expand, you can configure `hiddenColumns` to achieve `Default Hidden` and `Interactive Hidden`. See [details](/en/manual/advanced/interaction/hide-columns/) or [specific examples](/en/examples/interaction/advanced#pivot-hide-columns)

```ts
const s2DataConfig = {
  fields: {
    columns: ['fieldA', 'fieldB']
  }
}

const s2Options = {
  interaction: {
    // Default hidden
    hiddenColumns: ['fieldA']
  },
  // Disable manual hide
  tooltip: {
    operation: {
      hiddenColumns: false
    }
  }
};
```

### Row and column width and height adjustment

<img src="https://gw.alipayobjects.com/zos/antfincdn/F6l3SoxBCx/resize.gif" alt="preview" width="600">

S2 provides three layout methods ( [preview](/en/examples/layout/basic#compact) ) by default: `Column Equal Width Layout` `Row & Column Equal Width Layout` and `Compact Layout`, and you can also drag and drop the row/column header to adjust dynamically

You can configure `resize` to control the width and height of the cells that need to be enabled to adjust the hot zone range, which is divided into three parts: corner header, row header, and column header. The default is to enable all of them. You can quickly turn on or off all `resize` by setting `boolean` type values, and you can also configure hotspots in each area to turn on or off by object type. [View specific examples](/en/examples/interaction/advanced#resize-active)

```ts
const s2Options = {
  interaction: {
    resize: true
  },
};

// Equivalent to
// const s2Options = {
//   interaction: {
//     resize: {
//       rowCellVertical:true,
//       cornerCellHorizontal:true,
//       colCellHorizontal:true,
//       colCellVertical:true
//     }
//   },
// };
```

You can also configure `resize.visible` and `resize.disable` properties, which are used to control the display of the `resize` hotspot and customize the drag-and-drop verification logic respectively. [View specific examples](/en/examples/interaction/advanced#resize-disable)

<img src="https://gw.alipayobjects.com/zos/antfincdn/64tnK5%263K/Kapture%2525202022-07-19%252520at%25252015.40.15.gif" alt="preview" width="600">

> Example: Cell width is not allowed to be reduced

```ts
const s2Options = {
  interaction: {
    resize: {
      disable: (resizeInfo) => resizeInfo.resizedWidth <= resizeInfo.width;
    }
  },
};
```

> Example: Only the first 4 cells display the resize hotspot

```ts
const s2Options = {
  interaction: {
    resize: {
      enable: (cell) => {
        const meta = cell.getMeta();
        return meta.colIndex < 3
      }
    }
  },
};
```

### Merge Cells

<img src="https://gw.alipayobjects.com/zos/antfincdn/ouXuK7MMt/Kapture%2525202022-04-19%252520at%25252019.31.02.gif" alt="preview" width="600">

View [details](/en/manual/advanced/interaction/merge-cell) or [specific examples](/en/examples/interaction/advanced#merge-cell)

### link jump

<img src="https://gw.alipayobjects.com/zos/antfincdn/W0bikxI2pn/link-pivot.gif" alt="preview" width="600">

View [details](/en/manual/advanced/cell-render/link-jump) or [specific examples](/en/examples/interaction/advanced#pivot-link-jump)

### scroll

view [details](/en/manual/advanced/interaction/scroll)

### reset interaction

<img src="https://gw.alipayobjects.com/zos/antfincdn/pTs1QZPz4/Kapture%2525202022-04-19%252520at%25252019.24.56.gif" alt="preview" width="600">

Cases where reset interactions are supported:

* Click on non-table space
* Press `Esc` key
* Click again after selecting the cell

Corresponding event: `GLOBAL_RESET`

```ts
s2.on(S2Event.GLOBAL_RESET, () => {
  console.log('Reset')
})
```

Configurable `autoResetSheetStyle` to turn off reset interaction. [View specific examples](/en/examples/interaction/advanced#auto-reset-sheet-style)

```ts
const s2Options = {
  interaction: {
    autoResetSheetStyle: false
  }
};
```

## call the API

`S2` has built-in some interaction-related `API` , which are uniformly mounted under the `s2.interaction` namespace. You can call them to achieve your effects after getting the [SpreadSheet instance](/en/api/basic-class/spreadsheet) , such as `Select All Cells`, `Get Column Header Cells` and other common methods , please refer to the [Interaction instance class](/en/api/basic-class/interaction) for details

```ts
const s2 = new PivotSheet()
s2.interaction.selectAll()
```

Interested in the principles behind the interaction implementation? Welcome to [the article "Canvas Table Interaction You Don't Know"](https://www.yuque.com/antv/vo4vyz/bvzbaz)
