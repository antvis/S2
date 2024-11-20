---
title: S2Event
order: 4
---

Table event list, you can listen to the required events according to actual needs, and realize custom business. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/constant/events/basic.ts)

If you are using the `s2-react` or `s2-vue` table component, the event has been encapsulated, and no additional monitoring is required, just use its callback function. [details](/docs/api/components/sheet-component)

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  console.log('rowCellClick', event)
});
```

### Outfit

| name                | event name                         | describe                                                                                                                                                                                                                                                                |
| ------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| expand collapse     | `S2Event.ROW_CELL_COLLAPSED`       | Under the tree structure, row header cells expand/collapse                                                                                                                                                                                                              |
| expand/collapse all | `S2Event.ROW_CELL_ALL_COLLAPSED`   | Under the tree structure, all row header cells are expanded/collapsed                                                                                                                                                                                                   |
| click               | `S2Event.ROW_CELL_CLICK`           | row header cell click                                                                                                                                                                                                                                                   |
| double click        | `S2Event.ROW_CELL_DOUBLE_CLICK`    | Row header cell double click                                                                                                                                                                                                                                            |
| right click         | `S2Event.ROW_CELL_CONTEXT_MENU`    | Row header cell right click                                                                                                                                                                                                                                             |
| hover               | `S2Event.ROW_CELL_HOVER`           | row header cell hover                                                                                                                                                                                                                                                   |
| mouse down          | `S2Event.ROW_CELL_MOUSE_DOWN`      | row header cell mouse down                                                                                                                                                                                                                                              |
| mouse movement      | `S2Event.ROW_CELL_MOUSE_MOVE`      | Row header cell mouse movement                                                                                                                                                                                                                                          |
| mouse release       | `S2Event.ROW_CELL_MOUSE_UP`        | Row header cell mouse release                                                                                                                                                                                                                                           |
| scroll              | `S2Event.ROW_CELL_SCROLL`          | row header cell scrolling                                                                                                                                                                                                                                               |
| Outfit selection    | `S2Event.ROW_CELL_BRUSH_SELECTION` | Batch select the row header cells within the brushing range. During the brushing process, the brushing range prompt mask will be displayed. After the brushing is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables) |

### Header

| name                        | event name                         | describe                                                                                                                                                                                                                                                                        |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| click                       | `S2Event.COL_CELL_CLICK`           | Column header cell click                                                                                                                                                                                                                                                        |
| double click                | `S2Event.COL_CELL_DOUBLE_CLICK`    | Column header cell double click                                                                                                                                                                                                                                                 |
| right click                 | `S2Event.COL_CELL_CONTEXT_MENU`    | Right click on column header cell                                                                                                                                                                                                                                               |
| hover                       | `S2Event.COL_CELL_HOVER`           | Column header cell hover                                                                                                                                                                                                                                                        |
| mouse down                  | `S2Event.COL_CELL_MOUSE_DOWN`      | column header cell mouse down                                                                                                                                                                                                                                                   |
| mouse movement              | `S2Event.COL_CELL_MOUSE_MOVE`      | Column header cell mouse movement                                                                                                                                                                                                                                               |
| mouse release               | `S2Event.COL_CELL_MOUSE_UP`        | Column header cell mouse release                                                                                                                                                                                                                                                |
| Column head brush selection | `S2Event.COL_CELL_BRUSH_SELECTION` | Batch select the column header cells within the brushing range. During the brushing process, the brushing range prompt mask will be displayed. After the brushing is completed, a tooltip will pop up to display the brushed cell information (only pivot tables are supported) |

### value cell

| name           | event name                          | describe                    |
| -------------- | ----------------------------------- | --------------------------- |
| click          | `S2Event.DATA_CELL_CLICK`           | Value cell click            |
| double click   | `S2Event.DATA_CELL_DOUBLE_CLICK`    | Value cell double click     |
| right click    | `S2Event.DATA_CELL_CONTEXT_MENU`    | right click value cell      |
| hover          | `S2Event.DATA_CELL_HOVER`           | Value cell hover            |
| mouse down     | `S2Event.DATA_CELL_MOUSE_DOWN`      | value cell mouse click      |
| mouse movement | `S2Event.DATA_CELL_MOUSE_MOVE`      | Numeric cell mouse movement |
| mouse release  | `S2Event.DATA_CELL_MOUSE_UP`        | Value cell mouse release    |
| Swipe          | `S2Event.DATA_CELL_BRUSH_SELECTION` | Value cell selection        |

### Corner head

| name           | event name                         | describe                         |
| -------------- | ---------------------------------- | -------------------------------- |
| click          | `S2Event.CORNER_CELL_CLICK`        | Corner header cell click         |
| double click   | `S2Event.CORNER_CELL_DOUBLE_CLICK` | Corner cell double click         |
| right click    | `S2Event.CORNER_CELL_CONTEXT_MENU` | Corner cell right click          |
| hover          | `S2Event.CORNER_CELL_HOVER`        | corner header cell hover         |
| mouse down     | `S2Event.CORNER_CELL_MOUSE_DOWN`   | Corner cell mouse down           |
| mouse movement | `S2Event.CORNER_CELL_MOUSE_MOVE`   | Corner cell mouse movement       |
| mouse release  | `S2Event.CORNER_CELL_MOUSE_UP`     | Corner header cell mouse release |

### Width and height drag adjustment

| name                              | event name                           | describe                                                                                  |
| --------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| cell adjustment                   | `S2Event.LAYOUT_RESIZE`              | Cell width and height change                                                              |
| Ordinal column width changed      | `S2Event.LAYOUT_RESIZE_SERIES_WIDTH` | Ordinal column width changed                                                              |
| Mouse down when resizing a cell   | `S2Event.LAYOUT_RESIZE_MOUSE_DOWN`   | Adjust the cell size by pressing the mouse, currently only the row/column header is valid |
| Mouse movement when resizing cell | `S2Event.LAYOUT_RESIZE_MOUSE_MOVE`   | Adjust the cell size and move the mouse, currently only the row/column header is valid    |
| Mouse up when resizing a cell     | `S2Event.LAYOUT_RESIZE_MOUSE_UP`     | Adjust the cell size and release the mouse, currently only the row/column header is valid |
| Header width changes              | `S2Event.LAYOUT_RESIZE_ROW_WIDTH`    |                                                                                           |
| line head height change           | `S2Event.LAYOUT_RESIZE_ROW_HEIGHT`   |                                                                                           |
| Column header width changes       | `S2Event.LAYOUT_RESIZE_COL_WIDTH`    |                                                                                           |
| column header height change       | `S2Event.LAYOUT_RESIZE_COL_HEIGHT`   |                                                                                           |
| Tree structure width changes      | `S2Event.LAYOUT_RESIZE_TREE_WIDTH`   | Triggered when the cell width changes in tree mode                                        |

### layout

| name                           | event name                                   | describe                                                                                  |
| ------------------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Header layout complete         | `S2Event.LAYOUT_AFTER_HEADER_LAYOUT`         | Triggered after row header and column header layout is completed                          |
| Numerical cell layout complete | `S2Event.LAYOUT_AFTER_REAL_DATA_CELL_RENDER` | Triggered after the rendering of the value cell in the current visible range is completed |
| paging                         | `S2Event.LAYOUT_PAGINATION`                  | pagination event                                                                          |
| column header expansion        | `S2Event.COL_CELL_EXPANDED`                  | Triggered when the column header is expanded                                              |
| column header hidden           | `S2Event.COL_CELL_HIDDEN`                    | Triggered when the column header is hidden                                                |
| start rendering                | `S2Event.LAYOUT_BEFORE_RENDER`               | The event before starting render, that is, `s2.render()`                                  |
| rendering complete             | `S2Event.LAYOUT_AFTER_RENDER`                | The event that render is completed, that is, `s2.render()`                                |
| form destruction               | `S2Event.LAYOUT_DESTROY`                     | Triggered after the table is destroyed or calling `s2.destroy()`                          |

### global

| name             | event name                         | describe                                                                                    |
| ---------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| keyboard press   | `S2Event.GLOBAL_KEYBOARD_DOWN`     | keyboard press                                                                              |
| keyboard release | `S2Event.GLOBAL_KEYBOARD_UP`       | keyboard release                                                                            |
| copy             | `S2Event.GLOBAL_COPIED`            | Copy selected cells                                                                         |
| mouse release    | `S2Event.GLOBAL_MOUSE_UP`          | Chart area mouse release                                                                    |
| click            | `S2Event.GLOBAL_CLICK`             | Chart area click                                                                            |
| right click      | `S2Event.GLOBAL_CONTEXT_MENU`      | Right click on the chart area                                                               |
| selected         | `S2Event.GLOBAL_SELECTED`          | When selecting a cell, such as: brush selection, multiple selection, single selection       |
| hover            | `S2Event.GLOBAL_HOVER`             | mouse over cell                                                                             |
| reset            | `S2Event.GLOBAL_RESET`             | When clicking on an empty space, pressing the Esc key resets the interaction style          |
| link jump        | `S2Event.GLOBAL_LINK_FIELD_JUMP`   | When clicked row column header is edited as text of link field                              |
| icon click       | `S2Event.GLOBAL_ACTION_ICON_CLICK` | When the operation icon on the right side of the cell is clicked, for example: sort icon    |
| icon hover       | `S2Event.GLOBAL_ACTION_ICON_HOVER` | When hovering over the operation icon on the right side of the cell, for example: sort icon |
| scroll           | `S2Event.GLOBAL_SCROLL`            | Table scrolling (with values and row header cells)                                          |
