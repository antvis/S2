---
title: Performance
order: 3
tag: Updated
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

Take the following pivot table as an example: ![pivot sheet](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*8FDiR45m_tsAAAAAAAAAAAAAARQnAQ)

```ts
const dataCfg={
  fields:{
    rows: ["province", "city"],
    columns: ["type","sub_type"],
    values: ["number"]
  },
  data:[
    {
      number: 7789,
      province: "浙江省",
      city: "杭州市",
      type: "家具",
      sub_type: "桌子"
    },{
      number: 2367,
      province: "浙江省",
      city: "绍兴市",
      type: "家具",
      sub_type: "桌子"
    },
  //...
  ]
}
```

### data structure

The first step in the `S2` rendering process is to convert the user's detailed data into a two-dimensional array and a hierarchical data structure, which will be frequently queried and sorted in the table layout, so the design of the data structure is particularly important.

We know that there are generally three types of `Meta` structures for storing detailed data: flat arrays, graphs, and trees. For table scenarios, the query frequency is very high, and the presentation form of the pivot table itself also expresses a tree structure, so we chose to build a tree structure to realize `Meta` .

In addition, we choose `Map` instead of `Object` to implement the tree structure, which is more efficient for reading order and sorting, and more friendly for the performance of deleting Key. For the specific type definition of `Map` , please refer [to PivotMeta](https://github.com/antvis/S2/blob/c76203072a78dbf6656a70bc1c5487e6b1d9f009/packages/s2-core/src/data-set/interface.ts#L7-L15) . The data structure is as follows:

```ts
// Meta
const rowsMeta: PivotMeta = {
  浙江省：{
    level: 1,
    childField:"city",
    children: {
      浙江市：{
        level: 1,
        children: {},
      },
      绍兴市：{
        level: 2,
        children: {},
      },
      //...
    },
  },
  四川省：{
    level: 2,
    childField:"city",
    children: {
      成都市：{
        level: 1,
        children: {},
      },
      绵阳市：{
        level: 2,
        children: {},
      },
      //...
    },
  },
};
```

Through such a data structure, we have realized the front-end expression of the table row column tree structure. After we have the "shape", we need the "soul", which is the data.

In `S2` , we need to convert the one-dimensional data `data` passed in by the user into a multidimensional array `indexesData` through internal data training. This multi-dimensional array is assembled by the `path` of row dimension and column dimension (the bottom layer is realized by `lodash.set` ), for example:

![path](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*GyJCTq-gw-sAAAAAAAAAAAAAARQnAQ)

In the figure above, the coordinates corresponding to the purple cells are:

* Row coordinates: Zhejiang Province\[1] - Hangzhou City\[1]
* Column coordinates: Furniture\[1] - Sofa\[2].

Therefore, the coordinates of the cell in the multidimensional array are `[1, 1, 1, 2]` (bit 0 of each level of the multidimensional array is dedicated for totals and subtotals, and the serial numbers of detailed data start from 1). `indexesData` like:

```ts
// 转换后的数据结构，
[
  null,
  // 浙江省
  [
    null,
    // 杭州市
    [
      null,
      // 家具
      [
        null,
        {
          "number": 7789,
          "province": "浙江省",
          "city": "杭州市",
          "type": "家具",
          "sub_type": "桌子"
        },
        {
          "number": 5343,
          "province": "浙江省",
          "city": "杭州市",
          "type": "家具",
          "sub_type": "沙发"
        }
      ],
      // 办公用户
    ]
    // 其他城市
  ],
  // 四川省
  [/*...*/]
]
```

When querying data, first obtain the corresponding query path from the `Meta` hierarchy of rows and columns, and then get the corresponding data in the multidimensional array `indexesData` according to the query path.

Therefore, querying data in `S2` is not traversing the underlying data, and obtaining data based on the hierarchical structure and query array path. After traversing the original data for the first time and generating the necessary `Meta` and multidimensional array information, the time complexity of querying data is **O(n)** . The advantage of this scheme is its excellent performance.

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

The detailed performance comparison data is as follows: ![performance](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*G1ITQJTTa4YAAAAAAAAAAAAAARQnAQ)

> Remark:
>
> * Where the column header is the number of experiments and the total is the average rendering time.
> * `100w` scene orb and ReactPivot stuck, no data.

## Summarize

Judging from the comparative data, the elegant data structure design and rendering method give S2 an advantage in rendering, and the data of 500w can also be rendered normally under the limit test.
