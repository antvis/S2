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
      "name": "数量"
    },
    {
      "field": "province",
      "name": "省份"
    },
    {
      "field": "city",
      "name": "城市"
    },
    {
      "field": "type",
      "name": "类别"
    },
    {
      "field": "sub_type",
      "name": "子类别"
    }
  ],
  "data": [
    {
      "number": 7789,
      "province": "浙江省",
      "city": "杭州市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 2367,
      "province": "浙江省",
      "city": "绍兴市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 3877,
      "province": "浙江省",
      "city": "宁波市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 4342,
      "province": "浙江省",
      "city": "舟山市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 5343,
      "province": "浙江省",
      "city": "杭州市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 632,
      "province": "浙江省",
      "city": "绍兴市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 7234,
      "province": "浙江省",
      "city": "宁波市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 834,
      "province": "浙江省",
      "city": "舟山市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 945,
      "province": "浙江省",
      "city": "杭州市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 1304,
      "province": "浙江省",
      "city": "绍兴市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 1145,
      "province": "浙江省",
      "city": "宁波市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 1432,
      "province": "浙江省",
      "city": "舟山市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 1343,
      "province": "浙江省",
      "city": "杭州市",
      "type": "办公用品",
      "sub_type": "纸张"
    },
    {
      "number": 1354,
      "province": "浙江省",
      "city": "绍兴市",
      "type": "办公用品",
      "sub_type": "纸张"
    },
    {
      "number": 1523,
      "province": "浙江省",
      "city": "宁波市",
      "type": "办公用品",
      "sub_type": "纸张"
    },
    {
      "number": 1634,
      "province": "浙江省",
      "city": "舟山市",
      "type": "办公用品",
      "sub_type": "纸张"
    },
    {
      "number": 1723,
      "province": "四川省",
      "city": "成都市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 1822,
      "province": "四川省",
      "city": "绵阳市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 1943,
      "province": "四川省",
      "city": "南充市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 2330,
      "province": "四川省",
      "city": "乐山市",
      "type": "家具",
      "sub_type": "桌子"
    },
    {
      "number": 2451,
      "province": "四川省",
      "city": "成都市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 2244,
      "province": "四川省",
      "city": "绵阳市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 2333,
      "province": "四川省",
      "city": "南充市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 2445,
      "province": "四川省",
      "city": "乐山市",
      "type": "家具",
      "sub_type": "沙发"
    },
    {
      "number": 2335,
      "province": "四川省",
      "city": "成都市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 245,
      "province": "四川省",
      "city": "绵阳市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 2457,
      "province": "四川省",
      "city": "南充市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 2458,
      "province": "四川省",
      "city": "乐山市",
      "type": "办公用品",
      "sub_type": "笔"
    },
    {
      "number": 4004,
      "province": "四川省",
      "city": "成都市",
      "type": "办公用品",
      "sub_type": "纸张"
    },
    {
      "number": 3077,
      "province": "四川省",
      "city": "绵阳市",
      "type": "办公用品",
      "sub_type": "纸张"
    },
    {
      "number": 3551,
      "province": "四川省",
      "city": "南充市",
      "type": "办公用品",
      "sub_type": "纸张"
    },
    {
      "number": 352,
      "province": "四川省",
      "city": "乐山市",
      "type": "办公用品",
      "sub_type": "纸张"
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
        { colIndex: 1, rowIndex: 6, showText: true }, // 此单元格的 meta 信息将作为合并单元的 meta 信息
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

// 将单元格合并操作集成到未合并单元格的 tooltip 操作中
const dataCellTooltip = () => {
  button.innerText = '点击合并单元格';
  button.className = 'merge-cells-button';
  button.onclick = () => s2.interaction.mergeCells(); // 不传入 cellsInfo 时，默认使用当前选中所有的单元格信息
  return button;
}; // （按住 Cmd/ Ctrl 多选）

// 将取消单元格合并操作集成到合并单元格的 tooltip 操作中
const mergedCellsTooltip = (mergedCell) => {
  button.innerText = '取消合并单元格';
  button.className = 'merge-cells-button';
  button.onclick = () => s2.interaction.unmergeCell(mergedCell);
  return button;
};

// 监听 dataCell 的点击事件，自定义点击后的交互操作
s2.on(S2Event.DATA_CELL_CLICK, (event) => {
  s2.tooltip.show({
    position: { x: event.clientX, y: event.clientY },
    content: dataCellTooltip(),
  });
});

// 监听 mergedCell 的点击事件，自定义点击后的交互操作
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

<embed src="@/docs/common/merged-cell.en.md"></embed>

![Merge Cells](https://gw.alipayobjects.com/zos/antfincdn/kHAYfFaJA/ae92e636-6574-487b-8d78-57dcae21e1d4.png)

### mergeCells

a **function mergeCells(cellsInfo?: MergedCellInfo\[], hideData?: boolean): void**

Merge cell method

| parameter | illustrate                                                                                                                       | type               | Defaults | required |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- | -------- |
| cellsInfo | Specify the information of a merged cell, if not passed, the information of all currently selected cells will be used by default | `MergedCellInfo[]` | -        |          |
| hideData  | When hideData is true, merged cells do not display content.                                                                      | `boolean`          | false    |          |

### unmergeCells

a **function unmergeCell(removedCells: MergedCell): void**

Unmerge cell method

| parameter    | illustrate            | type         | Defaults | required |
| ------------ | --------------------- | ------------ | -------- | -------- |
| removedCells | Unmerged merged cells | `MergedCell` | -        |          |
