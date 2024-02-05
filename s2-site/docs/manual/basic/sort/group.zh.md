---
title: 组内排序
order: 1
tag: Updated
---

## 简介

`组内排序` 代表只影响一个分组内部的排序，例如下图中 `笔-价格` 选择 `组内升序` 时，`省份` 的排序方式不会更改，只会更改每个 `省份` 内部 `城市` 的顺序。

:::warning{title="注意"}
`行头/列头` 只存在单一状态，当前状态会覆盖前一状态，如上图所示，当对 `笔` 进行排序时，`纸张` 的排序状态消失，`行头 + 列头` 可同时存在自身状态。
:::

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*PuoGS7DQdV8AAAAAAAAAAAAADmJ7AQ/original" width="600" alt="group-sort" />

## 使用 `@antv/s2`

`@antv/s2` 提供组内排序的能力，可以自行实现 [Tooltip 排序菜单](/manual/basic/tooltip) 后，然后调用相关 [API](/api/basic-class/spreadsheet).

```ts
const meta = cell.getMeta()

// 升序
s2.groupSortByMethod('asc', meta)

// 降序
s2.groupSortByMethod('desc', meta)
```

## 使用 `@antv/s2-react`

`@antv/s2-react` 基于 `@antv/s2` 的 [基础排序能力](/manual/basic/sort/basic)，和 `antd` 提供了默认的组内排序功能，排序菜单通过 [Tooltip](/manual/basic/tooltip) 承载（开启 `tooltip` 即可），主要根据数值对 `行头/列头` 进行排序，[查看更多排序示例](/examples/analysis/sort/#group-sort)

使用 `@antv/s2-react` 的组件 `SheetComponent` 默认在数值头显示 `icon` ，点击后选择，有 `升序、降序、不排序` 三种方式，可在 `options` 中配置显示，如下：

```ts
const s2Options = {
  width: 600,
  height: 600,
  // 打开操作 icon（默认开启）
  showDefaultHeaderActionIcon: true,
  // 展示 tooltip（默认开启）
  tooltip: {
    operation: {
      // 开启组内排序 （默认开启）
      sort: true,
    },
  },
};
```

<Playground path="analysis/sort/demo/group-sort.tsx" rid='group-sort' height="200"></playground>
