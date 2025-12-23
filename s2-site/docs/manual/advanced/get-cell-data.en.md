---
title: Get Cell Data
order: 9
tag: Updated
---

> **Before reading this chapter, please make sure you have read the basic tutorial, data flow processing, layout and other chapters**

In actual business scenarios, you will often encounter some scenarios where you need to obtain **cell data** , such as:

* Click on a row/column header cell to get all the data **in the current row/column**
* Listen to the mouse `click` `hover` event to obtain the current corresponding cell data
* To customize the `tooltip` content, it is necessary to render different operation items or display different prompt information according to the current cell information

The table of `S2` is drawn by `Canvas` , so there will only be one `dom` element, a set of data structures corresponding to all cells, which store the coordinates, text information, interaction status and other [information](/docs/api/basic-class/base-cell) of each cell

`S2` provides a series of [APIs](/docs/api/basic-class/spreadsheet) for obtaining data, some commonly used scenarios are introduced below

### Get the specified area cell

After the rendering is complete, access `s2.facet.getLayoutResult()` to get all [the cells in](/docs/api/basic-class/node) the current visible range. [see more](/docs/api/basic-class/base-facet)

```ts
await s2.render()

// ensure invoke after s2.render() completes
console.log(s2.facet.getLayoutResult())
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/sdbdaWuLk/c93a05a9-b849-4f3b-96b3-73f6c33aac88.png" width="600" alt="preview">

* `colLeafNodes` column header leaf nodes
* `colNodes` column head node
* `colsHierarchy` column header level information
* `rowLeafNodes` row header leaf nodes
* `rowNodes` row head node
* `rowsHierarchy` row header level information
* `getCellMeta` gets the execution cell information according to the row and column indexes

For numerical cells, due to the characteristics of virtual scrolling, it needs to be obtained dynamically. For more information, please refer to the [interaction API](/docs/api/basic-class/interaction)

```ts

// 当前可视范围内的数值单元格
s2.facet.getDataCells()
// 当前可视范围内未选中的数值单元格
s2.interaction.getPanelGroupAllUnSelectedDataCells()
```

### Listen to the click event to get the corresponding cell

Take clicking the row header cell as an example

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  // 根据 event.target 拿到表格内部当前坐标对应的单元格
  const cell = s2.getCell(event.target)
  // 获取当前单元格对应的信息
  const meta = cell.getMeta()
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24a%24HyJBIV/79abf381-a58a-460d-ad75-096c5484c780.png" width="600" alt="preview">

Of course, you can get the data in this way anywhere you can get the `event`

### Get the selected cell

In scenarios such as single selection, multi-selection, and swiping selection, the `S2Event.GLOBAL_SELECTED` event will be revealed after selection, and the selected cell can be obtained

```ts
s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
  console.log('选中的单元格', cells)
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/GO7xii%26LQ/13b44f81-271c-4771-b7b3-45789761eab2.png" width="600" alt="preview">

You can also call the [interactive method](/docs/manual/advanced/interaction/basic#%E8%B0%83%E7%94%A8%E4%BA%A4%E4%BA%92%E6%96%B9%E6%B3%95) to get it manually

```ts
s2.interaction.getAllCells() // 获取行/列/数值区域所有单元格
s2.interaction.getCells() // 获取所有激活的单元格 （包含不在可视范围内的）
s2.interaction.getActiveCells() // 获取所有激活的单元格 （不含不在可视范围内的）
s2.interaction.isSelectedState() // 是否是选中状态
```

### Get row/column data

When the table is initialized, the data configuration (s2DataConfig) declared by the user will be converted into the internally required data set (dataSet), please refer to the [data flow processing](/docs/manual/advanced/data-process/pivot) for details

The [instance](/docs/api/basic-class/base-data-set) of the dataset is mounted under the `s2.dataSet` namespace, you can access it to get what you need:

* raw data
* summary data
* multidimensional index data
* Formatted field name, field description
* get dimension value
* single cell data
* multiple cell data

Still take clicking on the row header cell as an example:

```ts
s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  // 首先拿到单元格当前信息
  const cell = s2.getCell(event.target)
  const meta = cell.getMeta()

  // 获取当前行数据
  const rowData = s2.dataSet.getCellMultiData(meta.query)
  // 获取当前行头单元格数据：
  const rowCellData = s2.dataSet.getCellData({ query: meta.query })
  // 获取当前行头维值
  const dimensionValues = s2.dataSet.getDimensionValues(meta.field)

  console.log('当前行数据：', rowData)
  console.log('当前行头单元格数据：', rowCellData)
  console.log('当前行头维值：', dimensionValues)
})
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/5KTuqpLdy/cf26a185-2a1d-41f3-9caf-aa9343529cd5.png" width="600" alt="preview">

### Get numeric cell data

```ts
s2.on(S2Event.DATA_CELL_CLICK, (event) => {
  // 首先拿到单元格当前信息
  const cell = s2.getCell(event.target)
  const meta = cell.getMeta()

  console.log(meta.data)
  /**
    {
    "number": 834,
    "province": "浙江省",
    "city": "舟山市",
    "type": "家具",
    "sub_type": "沙发",
    "$$extra$$": "number",
    "$$value$$": 834
  }
  */
})
```

### Get the corresponding numerical cell data of the row and column

As shown in the figure, for example, we want to obtain the number of office supplies and paper in Zhoushan City

<img src="https://gw.alipayobjects.com/zos/antfincdn/jHILwaZ50/d9af2488-add9-46ec-b0da-81fc4da2b7a1.png" width="600" alt="preview">

```ts
// 找到 "舟山市" 对应的行头单元格节点
const rowCellNode = s2.facet.getRowCellNodes().find((node) => node.id === 'root[&]浙江省[&]舟山市')
// 找到 "办公用品" 下 "纸张" 对应的 "数量"列头单元格节点
const colCellNode = s2.facet.getColCellNodes().find((node) => node.id === 'root[&]办公用品[&]纸张[&]number')

const data = s2.dataSet.getCellMultiData({...rowCellNode.query,...colCellNode.query})

  /**
  [
    {
      "number": 1634,
      "province": "浙江省",
      "city": "舟山市",
      "type": "办公用品",
      "sub_type": "纸张",
      "$$extra$$": "number",
      "$$value$$": 1634
    }
  ]
  */
```

### Get hidden column data

[View Hide Column Header Section](/docs/manual/advanced/interaction/hide-columns/#%E8%8E%B7%E5%8F%96%E9%9A%90%E8%97%8F%E5%88%97%E5%A4%B4%E6%95%B0%E6%8D%AE)
