---
title: Performance
order: 6
---

## introduce

`S2` is a visual table rendering engine developed by the `AntV` team. It has low cost to get started, has rich interactive operations, provides excellent performance experience, and has highly flexible expansion capabilities.

`S2` can be used to implement detailed tables, pivot tables, and trend analysis tables, etc.

In order to better understand this article, before reading this article, I hope you are familiar with the use of `S2` and have a preliminary understanding of the [basic concepts](/docs/manual/basic/base-concept) .

## Performance Interpretation

Before studying the performance of `S2` , we first familiarize ourselves with its core rendering link, figure out which links may be time-consuming, and where to start optimization.

The rendering process of `S2` is to process the original data through the configuration information and convert it into a multi-dimensional array with row and column latitude as `path` . After that, change the auto-generated hierarchy via `hierarchy` . Then change the coordinate information of any row, column, or cell through `layout` . Finally, `layoutResult` determines the `dataCell` data information of the Cartesian intersection of rows and columns. As shown below:

![s2-data-process](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ZLfHQoNsLrYAAAAAAAAAAAAAARQnAQ)

After clarifying the core rendering link, we can find that the time-consuming links "occur in the three stages of data conversion", "hierarchical structure generation", and "cell information acquisition". Next, let's look at how S2 is optimized for performance.

## performance optimization

### data structure

The first step in the `S2` rendering process is to convert the user's detailed data into a two-dimensional array and a hierarchical data structure, which will be frequently queried and sorted in the table layout, so the design of the data structure is particularly important.

We know that there are generally three types of `Meta` structures for storing detailed data: flat arrays, graphs, and trees. The query frequency for table scenarios is very high, and the presentation form of the pivot table itself also expresses a tree structure, so we chose to build a tree. Structure to implement `Meta` .

In addition, we choose `Map` instead of `Object` to implement tree structure, which is more efficient for reading order and sorting, and is more friendly to the performance of deleting Key. The data structure is as follows:

```ts
// Meta
const rowsMeta: PivotMeta = {
  东北：{
    id: 0,
    children: {
      黑龙江：{
        id: 0,
        children: {},
      },
      辽宁：{
        id: 1,
        children: {},
      },
    },
  },
  华北：{
    id: 1,
    children: {
      山西：{
        id: 0,
        children: {},
      },
    },
  },
};
```

Through such a data structure, we have realized the front-end expression of the table row column tree structure. After we have the "shape", we need the "soul", which is the data.

In `S2` , `Pivot` exists i as the underlying perspective of data training and query, the purpose is to convert the original data (one-dimensional) into a multi-dimensional array. This multi-dimensional array is assembled by the `path` of row dimension and column dimension (the bottom layer is realized by `loadash.set` ), for example:

<img data-mdast="html" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_fRFSYS-Vi8AAAAAAAAAAAAAARQnAQ" width="700" alt="preview">

In the figure above, the row coordinates of the cell are: Zhejiang Province \[0] - Ningbo City \[0], and the column coordinates are: Furniture \[0] - Sofa \[1]. Therefore, the coordinates of the cell in the multidimensional array are \[0, 0, 0, 1]. When querying data, obtain the corresponding query path from the `Hierarchy` structure of the row and column, and then get the corresponding data. Therefore, querying data in `S2` is not to loop through the underlying data, but to generate a query array path and compare it with the hierarchical structure to obtain data.

```ts
// 原始数据通过转换
const data = [
  [ // 东北
    [ // 黑龙江
      [{ order_amt: 299.11, type: '办公用品', sub_type: '纸张' }],
      [{ order_amt: 2962.96, type: '家具产品', sub_type: '书架' }],
    ],
    [ // 辽宁
      [undefined, { order_amt: 177.67, type: '办公用品', sub_type: '夹子及其配件' }],
    ],
  ],
  [ // 华北
    [ // 山西
      [undefined, undefined, { order_amt: 651.45, type: '办公用品', sub_type: '容器，箱子' }],
    ],
  ],
];
```

In this way, by traversing the original data once to generate `Meta` and converted array data, the time complexity of querying data is O(n). The advantage of this scheme is that it has excellent performance and is the fastest scheme in theory. The time complexity O(n *m) is linear and depends on the number of rows and columns of detailed data* .

### Render on demand

For the cells of the table, the strategy of `S2` is to render the cells in the visible area (on-demand rendering), and dynamically add and delete cells after scrolling to achieve the best performance.

Through `scrollX` and `scrollY` , calculate the node index of the cell in the current visible window.

```ts
const indexes = this.calculateXYIndexes(scrollX, scrollY); // indexes 结果是当前可视视窗节点的坐标索引集合。
```

Compare the difference between the current visible window node index set and the last index set.

```ts
const { add, remove } = diffPanelIndexes(this.preCellIndexes, indexes); // add 和 remove 也是节点坐标索引集合
```

Render and delete the newly added and deleted nodes respectively.

```ts
each(add, (x, y) => renderCell(x, y));
each(remove, (x, y) => getCell(x, y).remove());
```

Through on-demand rendering, the rendering efficiency of `S2` is greatly improved, which is why we support million-level data rendering.

### cache design

For frequent reading of data, we have also made performance improvements, such as caching data reading results, caching font width calculations, etc.

```ts
/**
 * 查找字段信息
 */
public getFieldMeta = memoize((field: string, meta?: Meta[]): Meta => {
  return find(this.meta || meta, (m: Meta) => m.field === field);
});
```

In addition, `S2` also made some other optimizations to improve rendering efficiency, such as scrolling frame (to solve the problem of scrolling white screen), lazy rendering (to solve the problem of repeated rendering).

### future plan

Table data calculation and layout settings involve a lot of calculations. In the future, we will consider migrating frequent and complex calculations to `web worker` to ensure that the main thread is not blocked.

## performance comparison

### Table frame rendering time comparison

View the actual performance of `100w` pieces of data:

* [pivot table](/examples/case/performance-compare#pivot)
* [list](/examples/case/performance-compare#table)

<img data-mdast="html" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*NWRaS6ifrJYAAAAAAAAAAAAAARQnAQ" width="900" alt="preview">

> Remark:
>
> * Where the column header is the number of experiments and the total is the average rendering time.
> * `100w` scene orb and ReactPivot stuck, no data.

## Summarize

Judging from the comparative data, the elegant data structure design and rendering method give S2 an advantage in rendering, and the data of 500w can also be rendered normally under the limit test.
