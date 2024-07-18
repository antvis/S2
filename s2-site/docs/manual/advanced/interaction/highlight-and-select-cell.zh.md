---
title: 高亮/选中单元格
order: 8
tag: New
---

:::warning{title="注意"}
阅读本章前，请确保已经阅读了 [基础交互](/manual/advanced/interaction/basic) 和 [获取单元格数据](/manual/advanced/get-cell-data) 等章节，并对 [布局流程](/manual/extended-reading/layout/pivot) 有所了解。
:::

我们通过鼠标悬停 (hover) 和点击 (click) 可以触发表格单元格的 `高亮` 和 `选中`，在一些特定场景下，如果希望主动触发，可以通过内置的 [交互 API](/api/basic-class/interaction) 来实现。

<Playground path='interaction/basic/demo/event.ts' rid='event' height='400'></playground>

## 高亮单元格

高亮的效果和默认的 [主题配置](/manual/advanced/interaction/basic#%E8%B0%83%E6%95%B4%E4%BA%A4%E4%BA%92%E4%B8%BB%E9%A2%98) 一致，内部状态为 `"hover"`

```ts | pure
const targetCell = s2.facet.getRowCell()[0]
s2.interaction.highlightCell(targetCell)

s2.interaction.getCurrentStateName() // "hover"
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*_VKpTrqsBQIAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

### 高亮子节点

将一组子节点对应的单元格设置为高亮状态。

```ts | pure
const targetNodes = s2.facet.getRowNodes()

s2.interaction.highlightNodes(targetNodes)
```

## 选中单元格

选中的效果和默认的 [主题配置](/manual/advanced/interaction/basic#%E8%B0%83%E6%95%B4%E4%BA%A4%E4%BA%92%E4%B8%BB%E9%A2%98) 一致，内部状态为 `"selected"`

```ts | pure
const targetCell = s2.facet.getRowCell()[0]
s2.interaction.selectCell(targetCell)

s2.interaction.getCurrentStateName() // "selected"
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A6AkR4u1Xr0AAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

### 全选

全部的单元格都会被更新为选中的样式，内部状态为 `"allSelected"`

```ts | pure
s2.interaction.selectAll()

s2.interaction.getCurrentStateName() // "allSelected"
```

### 获取选中数据

具体请查看 [获取单元格数据 - 选中单元格](/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E9%80%89%E4%B8%AD%E7%9A%84%E5%8D%95%E5%85%83%E6%A0%BC)

## 改变单元格状态

本质上 `highlightCell` 和 `selectCell` 内部都是基于 `changeCell` 实现的语法糖，所以你也可以直接使用 `changeCell` 实现更细致的状态更新，如 S2 内置的行列头选中也是基于该 API 实现。

```ts | pure
import { InteractionStateName } from '@antv/s2'

const targetCell = s2.facet.getRowCell()[0]

s2.interaction.changeCell({
  cell: targetCell,
  stateName: InteractionStateName.SELECTED,
  isMultiSelection: false,
  scrollIntoView: false,
})
```

默认会滚动至可视范围内，可以通过 `scrollIntoView` 禁用。

也可以直接使用 `changeState` 直接更新指定单元格的状态

```ts | pure
import { InteractionStateName, getCellMeta } from '@antv/s2'

const targetCell = s2.facet.getRowCell()[0]

// 选中
s2.interaction.changeState({
  cells: [getCellMeta(targetCell)],
  stateName: InteractionStateName.SELECTED,
});

// 取消选中
s2.interaction.changeState({
  cells: [],
  stateName: InteractionStateName.UNSELECTED,
});
```

## 更新单元格

每一个 [单元格实例](/api/basic-class/base-cell) 都有一个 `update` 方法，调用它可以进行重绘，从而实现单元格的手动更新。

```ts | pure
const targetCell = s2.facet.getRowCell()[0]

targetCell.update()
```

## 关闭滚动动画

当选中或高亮单元格时，会自动滚动，可以通过 `animate: false` 关闭动画。

```ts | pure
s2.interaction.selectCell(targetCell, {
  animate: false
})
```

## 触发滚动事件

自动滚动时，默认不会触发内部滚动事件，即 `S2Event.GLOBAL_SCROLL`,  可以通过 `skipScrollEvent: false` 禁用。

```ts | pure
s2.interaction.selectCell(targetCell, {
  skipScrollEvent: false
})
```
