---
title: 高亮/选中单元格
order: 8
tag: New
---

通过鼠标悬停 (hover) 和点击 (click) 可以触发表格单元格的 `高亮` 和 `选中`，在一些特定场景下，如果希望主动触发，可以通过内置的 [交互 API](/api/basic-class/interaction) 来实现。

<Playground path='interaction/basic/demo/event.ts' rid='event' height='400'></playground>

## 高亮单元格

高亮的效果和默认的 [主题配置](/manual/advanced/interaction/basic#%E8%B0%83%E6%95%B4%E4%BA%A4%E4%BA%92%E4%B8%BB%E9%A2%98) 一致。

```ts
const targetCell = s2.facet.getRowCell()[0]
s2.interaction.highlightCell(targetCell)
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*_VKpTrqsBQIAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

## 选中单元格

选中的效果和默认的 [主题配置](/manual/advanced/interaction/basic#%E8%B0%83%E6%95%B4%E4%BA%A4%E4%BA%92%E4%B8%BB%E9%A2%98) 一致。

```ts
const targetCell = s2.facet.getRowCell()[0]
s2.interaction.selectCell(targetCell)
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A6AkR4u1Xr0AAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

## 改变单元格状态

本质上 `highlightCell` 和 `selectCell` 内部都是基于 `changeCell` 实现的语法糖，所以你也可以直接使用 `changeCell` 实现更细致的状态更新。

```ts
s2.interaction.changeCell({
  cell: rowCell,
  stateName: InteractionStateName.SELECTED,
  isMultiSelection: false,
  scrollIntoView: false,
})
```

也可以直接使用 `changeState` 直接更新指定单元格的状态

```ts
import { getCellMeta } from '@antv/s2'

// 选中
s2.interaction.changeState({
  cells: [getCellMeta(rowCell)],
  stateName: InteractionStateName.SELECTED,
});

// 取消选中
s2.interaction.changeState({
  cells: [],
  stateName: InteractionStateName.UNSELECTED,
});
```

## 更新单元格

每一个 [单元格实例](/api/basic-class/base-cell) 都有一个 `update` 方法，调用它可以进行重绘，从而实现单元格的更新。

```ts
const targetCell = s2.facet.getRowCell()[0]

targetCell.update()
```
