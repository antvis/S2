---
title: 组内排序
order: 0
---

## 简介

根据 `数值升/降序` 对 `行头/列头` 进行排序

`组内排序` 代表只影响一个分组内部的排序，例如下图中 `笔-价格` 选择 `组内升序` 时，`province` 的排序方式不会更改，只会更改每个 `province` 内部 `city` 的顺序

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*SszqS7EGaXkAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

`行头/列头` 只存在单一状态，当前状态会覆盖前一状态，如上图所示，当对 `笔` 进行排序时，`纸张` 的排序状态消失，`行头+列头` 可同时存在自身状态

## 使用

使用 `s2-react` 的组件 `SheetComponent` 默认在数值头显示 `icon` ，点击后选择，有 `升序、降序、不排序` 三种方式，可在 `options` 中配置显示，如下：

```ts
const s2Options = {
  width: 600,
  height: 600,
  showDefaultHeaderActionIcon: true, // 默认为打开，可设置为false关闭
};
```
