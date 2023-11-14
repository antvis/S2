---
title: 交叉模式冻结首行
order: 10
---

目前仅提供**首行整行**冻结能力，主要包括以下场景：

- 场景一：树状模式，首行整行冻结。开启行序号未开启行总计场景不支持；
- 场景二：平铺模式，数值置于列头，开启行总计&位置置顶

以上两种场景，开启分页场景下暂不支持。首行整行冻结通过在 `s2Options` 中传入这些属性控制：

```ts
const s2Options = {
  // 是否开启冻结首行整行
  frozenEntireHeadRowPivot: boolean; 
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
