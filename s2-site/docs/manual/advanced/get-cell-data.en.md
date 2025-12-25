---
title: Getting Cell Data
order: 9

---

:::warning{title='Tip'}
Before reading this chapter, please ensure you have read the sections on [Basic Concepts](/manual/basic/base-concept), [Data Processing](/manual/advanced/data-process/pivot), and [Layout](/manual/advanced/layout/pivot).
:::

In real-world scenarios, you'll often need to retrieve **cell data**. Common use cases include:

- Clicking a row/column header to get all data for that **row/column**.
- Listening for mouse `click` or `hover` events to get data for the corresponding cell.
- Clicking a data cell to get its data or the data for the entire row.
- Customizing `tooltip` content based on the current cell's information.

S2 tables are rendered on a `Canvas`, which means there is only one `DOM` element. All cells are represented by a set of **data structures** that store information like coordinates, text, and interaction state for each cell. [Learn More](/api/basic-class/base-cell)

S2 provides a series of [APIs](/api/basic-class/spreadsheet) for data retrieval. Here are some common scenarios:

<Playground path="analysis/get-data/demo/get-cell-data.ts" rid='get-cell-data' height='300'></playground>

### Getting Cell Nodes in a Specific Area

After rendering, you can access `s2.facet.getLayoutResult()` to get all [cell nodes](/api/basic-class/node) (including those outside the visible area).

A Node corresponds to a Cell. When a node is within the visible area, it is instantiated as a Cell, which can be accessed via `node.belongsCell`.

```ts
await s2.render()

// Ensure this is called after s2.render()
console.log(s2.facet.getLayoutResult())
```

Or:

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.LAYOUT_AFTER_RENDER, () => {
  console.log(s2.facet.getLayoutResult())
})
```

:::info{title="You can retrieve the following information"}

- `cornerNodes`
- `seriesNumberNodes`
- `colLeafNodes`
- `colNodes`
- `colsHierarchy`
- `rowLeafNodes`
- `rowNodes`
- `rowsHierarchy`

:::

[Learn More](/api/basic-class/base-facet)

:::warning{title="Note"}
Due to virtual scrolling, you can only get the cells that are currently within the visible area.
:::

### Getting Row Header Cells

```ts
s2.facet.getRowCells()
s2.facet.getRowLeafCells()
```

### Getting Column Header Cells

```ts
s2.facet.getColCells()
s2.facet.getColLeafCells()
```

### Getting Corner Header Cells

```ts
s2.facet.getCornerCells()
```

### Getting Merged Cells

```ts
s2.facet.getMergedCells()
```

### Getting Series Number Cells

```ts
s2.facet.getSeriesNumberCells()
```

### Getting Data Cells

See more in the [Interaction API](/api/basic-class/interaction).

```ts
// Data cells currently in the visible area
s2.facet.getDataCells()
// Unselected data cells currently in the visible area
s2.interaction.getUnSelectedDataCells()
```

### Getting Header Cells (Series Number, Corner, Row, and Column)

```ts
s2.facet.getHeaderCells()
```

### Getting All Cells

```ts
s2.facet.getCells()
```

### Getting a Specific Cell by Field

```ts
s2.facet.getCellsByField(field)
```

### Getting a Specific Cell by ID

```ts
s2.facet.getCellById(id)
```

### Getting the Corresponding Cell from an Event

```ts
s2.getCell(event.target)
```

### Getting Metadata from a Cell

```ts
cell.getMeta()
```

### Getting the Corresponding Cell by Listening to a Click Event

Example with a row header cell click:

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  // Get the cell at the current coordinates from the event target
  const cell = s2.getCell(event.target)
  // Get the information for the current cell
  const meta = cell.getMeta()
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24a%24HyJBIV/79abf381-a58a-460d-ad75-096c5484c780.png" width="600" alt="preview"/>

Of course, you can get data this way anywhere you have access to an `event`.

### Getting Selected Cells

In scenarios like single selection, multi-selection, or brush selection, the `S2Event.GLOBAL_SELECTED` event is emitted, from which you can get the selected cells.

```ts
s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
  console.log('Selected cells', cells)
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/GO7xii%26LQ/13b44f81-271c-4771-b7b3-45789761eab2.png" width="600" alt="preview"/>

You can also call [interaction methods](/manual/advanced/interaction/basic#calling-the-api) manually:

```ts
// Get all active cells (including those not in the visible area)
s2.interaction.getCells();
// Get all active cells (excluding those not in the visible area)
s2.interaction.getActiveCells();
// Check if it's in a selected state
s2.interaction.isSelectedState();
// Check if it's in a brush-selected state
s2.interaction.isBrushSelectedState();
// Get the current interaction state
s2.interaction.getCurrentStateName();
// Get the cells that have been interacted with
s2.interaction.getInteractedCells();
// Get unselected cells
s2.interaction.getUnSelectedDataCells();
```

### Getting Single Cell Data

[View Example](/examples/analysis/get-data/#get-single-cell-data)

```ts | pure
import { EXTRA_FIELD } from '@antv/s2'

// Get detail cell data
s2.dataSet.getCellData({
  query: {
    province: 'Zhejiang',
    city: 'Hangzhou',
    type: 'Pen',
    [EXTRA_FIELD]: 'price',
  },
});

// Get subtotal data
s2.dataSet.getCellData({
  query: {
    province: 'Zhejiang',
    type: 'Pen',
    [EXTRA_FIELD]: 'price',
  },
  isTotals: true,
});
```

### Getting Multiple Cell Data

[View Example](/examples/analysis/get-data/#get-multi-cell-data)

```ts | pure
import { EXTRA_FIELD, QueryDataType } from '@antv/s2'

// Get all data under Zhejiang
s2.dataSet.getCellMultiData({
  query: {
    province: 'Zhejiang',
    [EXTRA_FIELD]: 'price',
  },
  queryType: QueryDataType.All,
});

// Get only detail data under Zhejiang
s2.dataSet.getCellMultiData({
  query: {
    province: 'Zhejiang',
    [EXTRA_FIELD]: 'price',
  },
  queryType: QueryDataType.DetailOnly,
});
```

### Getting Row/Column Data

When the table is initialized, the user-declared data configuration (`s2DataConfig`) is converted into an internal dataset (`dataSet`). For details, see [Data Processing](/manual/advanced/data-process/pivot).

The [dataset instance](/api/basic-class/base-data-set) is available at `s2.dataSet`, where you can access:

- Raw data
- Summarized data
- Multidimensional index data
- Formatted field names and descriptions
- Dimension values
- Single and multiple cell data

Example with a row header cell click:

```ts
s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  // First, get the current cell's information
  const cell = s2.getCell(event.target)
  const meta = cell.getMeta()

  // Get the data for the current row
  const rowData = s2.dataSet.getCellMultiData({ query: meta.query })
  // Get the data for the current row header cell
  const rowCellData = s2.dataSet.getCellData({ query: meta.query })
  // Get the dimension values for the current row header
  const dimensionValues = s2.dataSet.getDimensionValues(meta.field)

  console.log('Current row data:', rowData)
  console.log('Current row header cell data:', rowCellData)
  console.log('Current row header dimension values:', dimensionValues)
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/5KTuqpLdy/cf26a185-2a1d-41f3-9caf-aa9343529cd5.png" width="600" alt="preview"/>

### Getting Data on Data Cell Click

#### Pivot Table

```ts
s2.on(S2Event.DATA_CELL_CLICK, (event) => {
  // Get the current cell
  const cell = s2.getCell(event.target)
  // Get the metadata for the current cell
  const meta = cell.getMeta()
  // Get the data for the current row
  const rowData = s2.dataSet.getCellMultiData({ query: meta.rowQuery })
  // Get the data for the current column
  const colData = s2.dataSet.getCellMultiData({ query: meta.colQuery })

  console.log('Current column data:', colData)
  console.log('Current row data:', rowData)
  console.log('Current cell data:', meta.data)
  /**
    {
      "raw": {
        "number": 632,
        "province": "Zhejiang",
        "city": "Shaoxing",
        "type": "Furniture",
        "sub_type": "Sofa"
      },
      "extraField": "number"
    }
  */
})
```

#### Detail Table

```ts
s2.on(S2Event.DATA_CELL_CLICK, (event) => {
  // Get the current cell
  const cell = s2.getCell(event.target)
  // Get the metadata for the current cell
  const meta = cell.getMeta()
  // Get the data for the current row (one row corresponds to one data entry in a detail table)
  const rowData = s2.dataSet.getCellMultiData({
    // Equivalent to query: { rowIndex: meta.rowIndex }
    query: meta.rowQuery
  })[0]
  // Get the data for the current column
  const colData = s2.dataSet.getCellMultiData({
    // Equivalent to query: { colIndex: meta.colIndex }
    query: meta.colQuery
  })

  console.log('Current column data:', colData)
  console.log('Current row data:', rowData) // { province: 'Jilin', city: 'Changchun', type: 'Pen', price: 8 }
  console.log('Current cell data:', meta.data) // { city: 'Changchun' }
})
```

### Getting Data for Corresponding Row/Column Value Cells

For example, to get the quantity of office paper in Zhoushan city:

<img src="https://gw.alipayobjects.com/zos/antfincdn/jHILwaZ50/d9af2488-add9-46ec-b0da-81fc4da2b7a1.png" width="600" alt="preview" />

```ts
// Find the row header node for "Zhoushan"
const rowCellNode = s2.facet.getRowNodes().find((node) => node.id === 'root[&]Zhejiang[&]Zhoushan')
// Find the column header node for "Paper" under "Office Supplies"
const colCellNode = s2.facet.getColNodes().find((node) => node.id === 'root[&]Office Supplies[&]Paper[&]number')

const data = s2.dataSet.getCellMultiData({
  query: {
    ...rowCellNode.query,
    ...colCellNode.query
  }
})

// Or
const cellMeta = s2.facet.getCellMeta(
  rowCellNode?.rowIndex,
  colCellNode?.colIndex,
);

/**
  [{
    "raw": {
      "number": 1634,
      "province": "Zhejiang",
      "city": "Zhoushan",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    "extraField": "number"
  }]
*/
```

### Getting Value Cell Information by Row and Column Index

```ts
s2.facet.getCellMeta(rowIndex, colIndex)
```

### Getting Hidden Column Data

[See the Hide Column Headers section](/manual/advanced/interaction/hide-columns/#get-hidden-column-header-data).
