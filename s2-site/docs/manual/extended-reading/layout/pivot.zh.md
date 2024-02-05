---
title: 透视表
order: 1
---

本文会介绍透视表的布局过程，让读者更直接了解 `S2` 内部布局逻辑。

主要流程：

![s2-data-process](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*TFcyS6P0IPsAAAAAAAAAAAAADmJ7AQ/original)

![facet](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5ctFS7NPhsoAAAAAAAAAAAAADmJ7AQ/original)

在数据处理完成后，就会进入布局阶段，主要分为布局生成，和实时渲染。布局生成后会重复使用，直到配置信息发生改变为止；表格会根据用户的交互信息做实时渲染。

以下图透视表为例：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Wd1xTZoHhWwAAAAAAAAAAAAADmJ7AQ/original" alt="透视表"/>

> 以下的代码都是伪代码，只是为了说明关键步骤，布局处理逻辑大部分都在 [facet](https://github.com/antvis/S2/tree/next/packages/s2-core/src/facet) 文件夹中。

## 布局生成

### initLayers

生成各种各样的 layerGroup 信息，包括 `backgroundGroup`，`foregroundGroup`， `panelGroup`，`panelScrollGroup` 和各类冻结 `frozenGroup` 等等。

### buildHierarchy & layoutCoordinates

生成行头，列头层级节点信息，并且计算好每个单元格的尺寸信息。可以通过 S2 实例中 `facet.getLayoutResult()` 获取各种节点信息：

![layoutResult](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*coR0S65SKy4AAAAAAAAAAAAADmJ7AQ/original)

### buildBBox

生成 PanelBBox 和 CornerBBox 结构，这两个BBox 主要用于后续用作角头，行列头，数据单元格区域的尺寸标识，和 clip 裁切
![bbox](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*coR0S65SKy4AAAAAAAAAAAAADmJ7AQ/original)

### bindEvents

绑定鼠标滚轮事件，分页事件等。

## 实时渲染

### adjustScrollOffset

将表格的滚动数据调整到合理的范围了，比如表格宽度突然发生变小，原本的滚动条已经滚动到100%的状态的前提下，需要根据当前的宽度重新调整，否则会出现偏移过多，出现空白的情况。

### renderHeaders & renderScrollBars & renderBackground

渲染行头、列头、角头，滚动条，背景色等等。

### dynamicRenderDataCell

对于表格的单元格，在大量数据的情况下，全量单元格会非常多，所以 `S2` 的策略是渲染可视区域内的单元格（按需渲染），滚动后动态新增和删除单元格，达到性能最佳。

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

### 行列冻结

行列冻结相关的处理都被抽象到 `FrozenFacet` 中处理，会重新基础的实时渲染链路，增加对各类冻结 `frozenGroup` 的绘制步骤。

被冻结的行列，在布局上会有特殊处理。简单的说，冻结行列格子的定位是固定的。其中：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*tZkOSqYWVFQAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

+ 冻结行（frozenRow) 在 y 轴上冻结
+ 冻结尾部行（frozenTrailingRow) 在 y 轴上冻结，并且 y 坐标从表格可视区底部开始逆向计算布局。
+ 冻结列（frozenCol) 在 x 轴上冻结
+ 冻结尾部列（frozenTrailingCol) 在 x 轴上冻结，并且 x 坐标从表格可视区最右侧开始逆向计算布局。
