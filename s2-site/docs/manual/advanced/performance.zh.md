---
title: 性能介绍
order: 6
---

## 介绍

`S2` 是 `AntV` 团队开发的可视化表格渲染引擎，上手成本低，具有丰富的交互操作，提供极佳的性能体验，具备高度灵活的扩展能力。

`S2` 可以用于实现明细表，也可以实现透视表，还可以实现趋势分析表等。

为了更好的理解本文，在阅读本文前，希望你能熟悉 `S2` 的使用，对 [基本概念](/zh/docs/manual/basic/base-concept) 有初步认知。

## 性能解读

在研究 `S2` 的性能之前，我们先熟悉其核心渲染链路，弄清楚哪些环节可能会耗时，优化从何做起。

`S2` 的渲染流程是，通过配置信息将原始数据处理，转换为以 行、列 纬度值为 `path` 的多维数组。在此之后，通过 `hierarchy` 来改变自动生成的层级结构。然后通过 `layout` 更改任意行、列、单元格的坐标信息。最后由 `layoutResult` 来确定行、列的笛卡尔交集的 `dataCell` 数据信息。如下图所示：

![s2-data-process](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ZLfHQoNsLrYAAAAAAAAAAAAAARQnAQ)

明确核心渲染链路后，我们就可以发现，耗时环节「发生在数据转换」、「层级结构生成」、「单元格信息获取」三个阶段。接下来，我们看看 S2 如何性能优化。

## 性能优化

### 数据结构

`S2` 渲染流程的第一步，就是把用户的明细数据转换为二维数组和具有层级的数据结构，在表格布局中会频繁的查询和排序，因此数据结构的设计显得尤为重要。

我们知道，存储明细数据的 `Meta` 结构一般有三种：扁平数组、图、树，对于表场景查询频率非常高，透视表本身的展现形式也表达了一种树形结构，因此我们选择了构建树形结构来实现 `Meta`。

另外，我们选择 `Map` 而不是 `Object` 实现树形结构，对于读取顺序和排序效率更高，对于删除 Key 的性能更友好。数据结构如下：

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

通过这样的数据结构，我们就实现了表格行列树结构的前端表达。「形」有了后，我们就需要「魂」，也就是数据。

在 `S2` 中，`Pivot` 作为数据训练和查询的底层透视存在 i，目的是将原始数据（一维）转为多维数组。这个多维数组是将行维度、列维度的 `path` 来组装的（底层是通过 `loadash.set` 实现），举个例子：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_fRFSYS-Vi8AAAAAAAAAAAAAARQnAQ" width="700" alt="preview" />

上图中，单元格的行坐标为：浙江省 [0] - 宁波市 [0]，列坐标为：家具 [0]-沙发 [1]。因此单元格在多维数组中坐标为 [0, 0, 0, 1]，查询数据时从行列的 `Hierarchy` 层级结构中获取对应的查询路径，即可拿到对应的数据。因此在 `S2` 中查询数据不是循环遍历底层数据，而是生成查询数组路径与层级结构对比，从而获取数据。

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

这样，通过遍历一次原始数据，生成 `Meta` 和转换后的数组数据，查询数据时间复杂度是 O(n)。此方案的优点是性能优异，理论上最快方案，时间复杂度 O(n*m) 是线性的根据明细数据的行数*列数决定。

### 按需渲染

对于表格的单元格，`S2` 的策略是渲染可视区域内的单元格（按需渲染），滚动后动态新增和删除单元格，达到性能最佳。

通过 `scrollX` 和 `scrollY`，计算当前可视视窗中的单元格的节点索引。

```ts
const indexes = this.calculateXYIndexes(scrollX, scrollY); // indexes 结果是当前可视视窗节点的坐标索引集合。
```

对比当前可视视窗节点索引集合和上次索引集合的差值。

```ts
const { add, remove } = diffPanelIndexes(this.preCellIndexes, indexes); // add 和 remove 也是节点坐标索引集合
```

针对新增和删除的节点分别进行渲染和删除。

```ts
each(add, (x, y) => renderCell(x, y));
each(remove, (x, y) => getCell(x, y).remove());
```

通过按需渲染，极大的提高了 `S2` 的渲染效率，这也是为什么我们支持百万级别数据渲染的原因。

### 缓存设计

对于数据的频繁读取，我们也做了性能提升，比如缓存数据读取结果、缓存字体宽度计算等。

```ts
/**
 * 查找字段信息
 */
public getFieldMeta = memoize((field: string, meta?: Meta[]): Meta => {
  return find(this.meta || meta, (m: Meta) => m.field === field);
});
```

另外，`S2` 还做了其他的一些优化来提升渲染效率，比如滚动合帧（解决滚动白屏问题）、懒渲染（解决多次重复渲染问题）。

### 未来规划

表格数据计算和布局设置涉及到大量的计算，未来我们会考虑把频繁复杂计算迁移到 `web worker` 中，保障主线程不被阻塞。

## 性能对比

### 表框架渲染时间对比

查看 `100w` 条数据实际性能表现：

- [透视表](/zh/examples/case/performance-compare#pivot)
- [明细表](/zh/examples/case/performance-compare#table)

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*NWRaS6ifrJYAAAAAAAAAAAAAARQnAQ" width="900" alt="preview"  />

> 备注：
>
> - 其中列头是实验次数，总计是平均渲染时间。
> - `100w` 场景 orb 和 ReactPivot 卡死，无数据。

## 总结

从对比数据来看，优雅的数据结构设计和渲染方式使得 S2 在渲染上有着优势，极限测试下 500w 的数据也能正常渲染。
