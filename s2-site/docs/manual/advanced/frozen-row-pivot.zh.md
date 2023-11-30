---
title: 交叉模式冻结首行
order: 10
---

目前仅提供**冻结首行**能力，约束说明：首行不存在多行子节点。此外，分页场景暂不支持。首行整行冻结通过在 `s2Options` 中传入这些属性控制：

```ts
const s2Options = {
  // 是否开启冻结首行整行
  frozenFirstRowPivot: boolean; 
  // 平铺模式，需要开启行总计&位置置顶
  totals: {
    row: {
      showGrandTotals: true,
      reverseLayout: true,
    },
  },
}
```

效果如图：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ncdCT7NB2I0AAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ge0_S5iMB-wAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

<Playground path='interaction/advanced/demo/frozen-pivot-grid.ts' rid='container' height='300'></playground>
<Playground path='interaction/advanced/demo/frozen-pivot-tree.ts' rid='container' height='300'></playground>
