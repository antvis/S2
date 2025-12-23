---
title: Group Sort
order: 1
tag: Updated
---

## Introduction

Sort`行头/列头`according to`数值升/降序`order. [See more sorting examples](https://s2.antv.antgroup.com/examples#category-sort)

`组内排序`a group means that it only affects the sorting within a group. For example, when`笔-价格`selects`组内升序`the figure below, the sorting method of`省份`will not change, only the order of`城市`within each`省份`will be changed.

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*SszqS7EGaXkAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

There is only a single state for`行头/列头`, and the current state will overwrite the previous state. As shown in the figure above, when the`笔`is sorted, the sorting state of the`纸张`disappears, and`行头+列头`can have their own status at the same time.

## use

The component `SheetComponent` that uses `s2-react` displays the `icon` in the value head by default, click to select, there are three ways of`升序、降序、不排序`, and the display can be configured in `options` , as follows:

```ts
const s2Options = {
  width: 600,
  height: 600,
  showDefaultHeaderActionIcon: true, // 默认为打开，可设置为 false 关闭
};
```
