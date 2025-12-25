---
title: Highlight/Select Cells
order: 8

---

:::warning{title="Note"}
Before reading this chapter, please make sure you have read the chapters on [Basic Interaction](/en/manual/advanced/interaction/basic) and [Getting Cell Data](/en/manual/advanced/get-cell-data), and have some understanding of the [Layout Process](/en/manual/extended-reading/layout/pivot).
:::

We can trigger `highlighting` and `selection` of table cells by hovering and clicking. In some specific scenarios, if you want to trigger them actively, you can use the built-in [Interaction API](/en/api/basic-class/interaction).

<Playground path='interaction/basic/demo/event.ts' rid='event' height='400'></playground>

## Highlighting Cells

The highlighting effect is consistent with the default [Theme Configuration](/en/manual/advanced/interaction/basic#adjusting-interaction-theme), and the internal state is `"hover"`.

```ts | pure
const targetCell = s2.facet.getRowCell()[0]
s2.interaction.highlightCell(targetCell)

s2.interaction.getCurrentStateName() // "hover"
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*_VKpTrqsBQIAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

### Highlighting Child Nodes

Sets a group of cells corresponding to child nodes to the highlighted state.

```ts | pure
const targetNodes = s2.facet.getRowNodes()

s2.interaction.highlightNodes(targetNodes)
s2.interaction.highlightNodes(targetNodes, 'hover')
s2.interaction.highlightNodes(targetNodes, 'selected')
```

## Selecting Cells

The selection effect is consistent with the default [Theme Configuration](/en/manual/advanced/interaction/basic#adjusting-interaction-theme), and the internal state is `"selected"`.

```ts | pure
const targetCell = s2.facet.getRowCell()[0]
s2.interaction.selectCell(targetCell)

s2.interaction.getCurrentStateName() // "selected"
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A6AkR4u1Xr0AAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

### Select All

All cells will be updated to the selected style, and the internal state is `"allSelected"`.

```ts | pure
s2.interaction.selectAll()

s2.interaction.getCurrentStateName() // "allSelected"
```

### Getting Selected Data

For details, please see [Getting Cell Data - Selected Cells](/en/manual/advanced/get-cell-data#getting-selected-cells).

## Changing Cell State

Essentially, `highlightCell` and `selectCell` are syntactic sugar implemented based on `changeCell`. So you can also use `changeCell` directly to achieve more fine-grained state updates, such as the built-in row and column header selection in S2, which is also implemented based on this API.

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

By default, it will scroll to the visible range, which can be disabled by `scrollIntoView`.

You can also use `changeState` to directly update the state of the specified cell.

```ts | pure
import { InteractionStateName, getCellMeta } from '@antv/s2'

const targetCell = s2.facet.getRowCell()[0]

// Select
s2.interaction.changeState({
  cells: [getCellMeta(targetCell)],
  stateName: InteractionStateName.SELECTED,
});

// Deselect
s2.interaction.changeState({
  cells: [],
  stateName: InteractionStateName.UNSELECTED,
});
```

## Updating Cells

Each [Cell Instance](/en/api/basic-class/base-cell) has an `update` method. Calling it can redraw the cell, thus achieving manual updates.

```ts | pure
const targetCell = s2.facet.getRowCell()[0]

targetCell.update()
```

## Disabling Scroll Animation

When selecting or highlighting a cell, it will automatically scroll. You can disable the animation by setting `animate: false`.

```ts | pure
s2.interaction.selectCell(targetCell, {
  animate: false
})
```

## Triggering Scroll Events

Automatic scrolling does not trigger the internal scroll event by default, which is `S2Event.GLOBAL_SCROLL`. You can disable this behavior by setting `skipScrollEvent: false`.

```ts | pure
s2.interaction.selectCell(targetCell, {
  skipScrollEvent: false
})
```
