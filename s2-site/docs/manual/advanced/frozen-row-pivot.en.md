---
title: 交叉模式冻结首行
order: 10
---

Currently, only the ability to freeze the first row as a whole is provided, mainly for the following scenarios:

- Scenario 1: Tree mode with the first row frozen. Enabling row numbering without enabling row totals is not supported.
- Scenario 2: Tile mode with values in the column header, enabling row totals and top positioning.

For both of these scenarios, pagination is not supported. The freezing of the first row can be controlled by passing these properties in the s2Options:

```ts
const s2Options = {
  frozenEntireHeadRowPivot: boolean; 
  totals: {
    row: {
      showGrandTotals: true,
      reverseLayout: true,
    },
  },
}
```

picture & demo：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ncdCT7NB2I0AAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ge0_S5iMB-wAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

<Playground path='interaction/advanced/demo/frozen-pivot-grid.ts' rid='container' height='300'></playground>
<Playground path='interaction/advanced/demo/frozen-pivot-tree.ts' rid='container' height='300'></playground>
