---
title: 合并单元格
order: 4
---

在表格中将两个或多个连续的单元格合并为一个单元格。用户可根据业务要求，在看数或展示时实现分类分析。

![mergeCellGif](https://gw.alipayobjects.com/zos/antfincdn/ouXuK7MMt/Kapture%2525202022-04-19%252520at%25252019.31.02.gif)

## 快速上手

<details>
<summary>点击查看数据</summary>

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

</details>

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

await s2.render();
```

## demo 演示

- 合并操作：Cmd/Ctrl + 单选操作，选择多个连续单元格通过 tooltip 进行合并
- 取消合并操作：点击合并单元格，通过 tooltip 取消合并

<Playground path='interaction/advanced/demo/merge-cell.ts' rid='container' height='400'></playground>

## 配置和方法说明

### MergedCellInfo

<embed src="@/docs/common/merged-cell.zh.md"></embed>

![合并单元格](https://gw.alipayobjects.com/zos/antfincdn/kHAYfFaJA/ae92e636-6574-487b-8d78-57dcae21e1d4.png)

### mergeCells

<description> **function mergeCells(cellsInfo?: MergedCellInfo[], hideData?: boolean): void** </description>

合并单元格方法

| 参数            | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| cellsInfo       | 指定一个合并单元格的信息，未传则默认使用当前选中所有的单元格信息 | `MergedCellInfo[]`   | -      |      |
| hideData        | hideData 为 true 时，合并单元格不显示内容。 | `boolean` | false     |      |

### unmergeCells

<description> a **function unmergeCell(removedCells: MergedCell): void**</description>

取消合并单元格方法

| 参数           | 说明                 | 类型                   | 默认值 | 必选 |
| ---------------| ------------------ | ---------------------- | ------ | ---- |
| removedCells   | 被取消合并的合并单元格  | `MergedCell`          | -      |      |
