---
title: 明细表
order: 2
---

本文会介绍明细表的布局过程，让读者更直接了解 `S2` 内部布局逻辑。

在解析布局过程中，以下图明细表为例：

<img alt="pivot-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*PmpvRrcBEbMAAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

## 基础概念

明细表是一种基础表格，没有交叉透视分析的能力，因此明细表主要包括 **列头**和**内容区** 两部分。和透视表不同的是，明细表没有行头、角头区域。

<img alt="s2-table-group" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*5q2TQJjNy2cAAAAAAAAAAAAAARQnAQ" width="800" alt="preview">

明细表的[列头布局算法](/docs/manual/advanced/layout/pivot#%E5%B1%82%E7%BA%A7%E7%BB%93%E6%9E%84)、内容区域的[按需渲染](/docs/manual/advanced/layout/pivot#按需渲染)和透视表保持一致，在此不再赘述。

## 序列号

序列号列是 S2 为了方便用户使用，自动根据数据生成的一列，用于展示序列号。这列本质上和内容区没有区别。但在样式层面可以通过 `theme.rowCell` 进行单独个性化配置。
