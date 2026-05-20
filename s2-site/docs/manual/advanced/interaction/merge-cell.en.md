---
title: Merge Cell
order: 4
---

Merges two or more consecutive cells into one in a table. According to business requirements, users can realize classification analysis when viewing data or displaying.

![mergeCellGif](https://gw.alipayobjects.com/zos/antfincdn/ouXuK7MMt/Kapture%2525202022-04-19%252520at%25252019.31.02.gif)

## Get started quickly

Click to view data

```json
{
  "meta": [
    {
      "field": "number",
      "name": "Quantity"
    },
    {
      "field": "province",
      "name": "Province"
    },
    {
      "field": "city",
      "name": "City"
    },
    {
      "field": "type",
      "name": "Type"
    },
    {
      "field": "sub_type",
      "name": "Sub-Type"
    }
  ],
  "data": [
    {
      "number": 7789,
      "province": "Zhejiang Province",
      "city": "Hangzhou City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 2367,
      "province": "Zhejiang Province",
      "city": "Shaoxing City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 3877,
      "province": "Zhejiang Province",
      "city": "Ningbo City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 4342,
      "province": "Zhejiang Province",
      "city": "Zhoushan City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 5343,
      "province": "Zhejiang Province",
      "city": "Hangzhou City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 632,
      "province": "Zhejiang Province",
      "city": "Shaoxing City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 7234,
      "province": "Zhejiang Province",
      "city": "Ningbo City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 834,
      "province": "Zhejiang Province",
      "city": "Zhoushan City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 945,
      "province": "Zhejiang Province",
      "city": "Hangzhou City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 1304,
      "province": "Zhejiang Province",
      "city": "Shaoxing City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 1145,
      "province": "Zhejiang Province",
      "city": "Ningbo City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 1432,
      "province": "Zhejiang Province",
      "city": "Zhoushan City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 1343,
      "province": "Zhejiang Province",
      "city": "Hangzhou City",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    {
      "number": 1354,
      "province": "Zhejiang Province",
      "city": "Shaoxing City",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    {
      "number": 1523,
      "province": "Zhejiang Province",
      "city": "Ningbo City",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    {
      "number": 1634,
      "province": "Zhejiang Province",
      "city": "Zhoushan City",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    {
      "number": 1723,
      "province": "Sichuan Province",
      "city": "Chengdu City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 1822,
      "province": "Sichuan Province",
      "city": "Mianyang City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 1943,
      "province": "Sichuan Province",
      "city": "Nanchong City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 2330,
      "province": "Sichuan Province",
      "city": "Leshan City",
      "type": "Furniture",
      "sub_type": "Table"
    },
    {
      "number": 2451,
      "province": "Sichuan Province",
      "city": "Chengdu City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 2244,
      "province": "Sichuan Province",
      "city": "Mianyang City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 2333,
      "province": "Sichuan Province",
      "city": "Nanchong City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 2445,
      "province": "Sichuan Province",
      "city": "Leshan City",
      "type": "Furniture",
      "sub_type": "Sofa"
    },
    {
      "number": 2335,
      "province": "Sichuan Province",
      "city": "Chengdu City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 245,
      "province": "Sichuan Province",
      "city": "Mianyang City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 2457,
      "province": "Sichuan Province",
      "city": "Nanchong City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 2458,
      "province": "Sichuan Province",
      "city": "Leshan City",
      "type": "Office Supplies",
      "sub_type": "Pen"
    },
    {
      "number": 4004,
      "province": "Sichuan Province",
      "city": "Chengdu City",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    {
      "number": 3077,
      "province": "Sichuan Province",
      "city": "Mianyang City",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    {
      "number": 3551,
      "province": "Sichuan Province",
      "city": "Nanchong City",
      "type": "Office Supplies",
      "sub_type": "Paper"
    },
    {
      "number": 352,
      "province": "Sichuan Province",
      "city": "Leshan City",
      "type": "Office Supplies",
      "sub_type": "Paper"
}
  ]
}
```

```tsx
import { S2Event } from '@antv/s2';

const s2DataConfig = {
  fields: {
    rows: [ 'province', 'city' ],
    columns: [ 'type', 'sub_type' ],
    values: [ 'number' ],
  },
  data,
  meta
};

const s2Options = {
    width: 600,
    height: 400,
    seriesNumber: {
      enable: true
    },
    tooltip: {
      content: TooltipContent,
    },
    // 表格渲染后，会展示一个合并单元格
    mergedCellsInfo: [
      [
        { colIndex: 1, rowIndex: 6, showText: true }, // The meta info of this cell will be used as the merged cell's meta info
        { colIndex: 1, rowIndex: 7 },
        { colIndex: 2, rowIndex: 6 },
        { colIndex: 2, rowIndex: 7 },
        { colIndex: 3, rowIndex: 6 },
        { colIndex: 3, rowIndex: 7 },
      ]
    ]
  }
;
const s2 = new PivotSheet(container, s2DataConfig, s2Options);

// Integrate the cell merging operation into the tooltip operation of the unmerged cell
const dataCellTooltip = () => {
  button.innerText = 'Click to merge cells';
  button.className = 'merge-cells-button';
  button.onclick = () => s2.interaction.mergeCells(); // If cellsInfo is not passed, use current selected cells info by default
  return button;
}; // (Hold Cmd/Ctrl to multi-select)

// Integrate the unmerge cell operation into the tooltip operation of the merged cell
const mergedCellsTooltip = (mergedCell) => {
  button.innerText = 'Unmerge cells';
  button.className = 'merge-cells-button';
  button.onclick = () => s2.interaction.unmergeCell(mergedCell);
  return button;
};

// Listen to dataCell click event, customize interaction after click
s2.on(S2Event.DATA_CELL_CLICK, (event) => {
  s2.tooltip.show({
    position: { x: event.clientX, y: event.clientY },
    content: dataCellTooltip(),
  });
});

// Listen to mergedCell click event, customize interaction after click
s2.on(S2Event.MERGED_CELLS_CLICK, (event) => {
  const cell = s2.getCell(event.target);
  s2.tooltip.show({
    position: { x: event.clientX, y: event.clientY },
    content: mergedCellsTooltip(cell),
  });
});

s2.render();
```

## demo demo

* Merge operation: Cmd/Ctrl + single selection operation, select multiple continuous cells to merge through tooltip
* Cancel the merge operation: click the merged cell and cancel the merge through the tooltip

<Playground path="interaction/advanced/demo/merge-cell.ts" rid="container" height="400"></Playground>

## Configuration and Method Description

### MergedCellInfo

<embed src="@/common/merged-cell.en.md"></embed>

![Merge Cells](https://gw.alipayobjects.com/zos/antfincdn/kHAYfFaJA/ae92e636-6574-487b-8d78-57dcae21e1d4.png)

### mergeCells

a **function mergeCells(cellsInfo?: MergedCellInfo\[], hideData?: boolean): void**

Merge cell method

| parameter | Description                                                                                                                       | type               | Defaults | required |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- | -------- |
| cellsInfo | Specify the information of a merged cell, if not passed, the information of all currently selected cells will be used by default | `MergedCellInfo[]` | -        |          |
| hideData  | When hideData is true, merged cells do not display content.                                                                      | `boolean`          | false    |          |

### unmergeCells

a **function unmergeCell(removedCells: MergedCell): void**

Unmerge cell method

| parameter    | Description           | type         | Defaults | required |
| ------------ | --------------------- | ------------ | -------- | -------- |
| removedCells | Unmerged merged cells | `MergedCell` | -        |          |
