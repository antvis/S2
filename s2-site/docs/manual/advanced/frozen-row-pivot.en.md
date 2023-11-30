---
title: 交叉模式冻结首行
order: 10
---

Currently, only the ability to freeze the first row is provided. Constraints are as follows: the first row does not have multiple rows of child nodes. Additionally, pagination scenarios are not supported at the moment. Freezing the entire first row can be controlled by passing these properties in s2Options:

```ts
const s2Options = {
  frozenFirstRowPivot: boolean; 
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
