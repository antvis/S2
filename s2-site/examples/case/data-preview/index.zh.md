---
title: 数据预览表格
order: 5
---

## 定义

数据预览表格主要侧重明细数据的展现和检索，可以进行排序、筛选、复制、搜索、冻结列、隐藏列等操作。通过 S2 的明细表，配合自定义组件以及行列格子的二次开发实现。

## 何时使用

在数据研发和自助取数产品中，通常需要对数仓查询结果做展示，并进行轻量级的数据检索和分析。

## 构成

### 搜索

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*FK1QRYsvkygAAAAAAAAAAAAAARQnAQ" alt="search" style="width: 200px; margin-bottom: 30px">

在这个场景中，我们实现了数据检索场景下最常用的搜索组件，支持关键词搜索，以及上一条/下一条结果的切换。在切换时，通过 S2 的 `facet.scrollWithAnimation` API，我们可以实现对特定格子的滚动到视图内并聚焦高亮的效果。

### 筛选 && 排序

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*E1sdT4gNRJsAAAAAAAAAAAAAARQnAQ" alt="sort" style="width: 200px; margin-bottom: 30px">

通过对列头 Cell `TableColCell` 的继承，我们实现了自定义的排序和筛选交互。同一个 icon 在排序和筛选被应用时，通过 icon 和 fill 颜色的组合，会切换为不同的形态。

无状态：

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*dL1FTpZicwoAAAAAAAAAAAAAARQnAQ" alt="none" style="width: 30px; margin-bottom: 5px">

排序：

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*9ODvR7m-2GUAAAAAAAAAAAAAARQnAQ" alt="sort" style="width: 30px; margin-bottom: 5px">

筛选：

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*wYgLSJ6f82gAAAAAAAAAAAAAARQnAQ" alt="filter" style="width: 30px; margin-bottom: 5px">

筛选 + 排序：

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*wsbaSLMQhtYAAAAAAAAAAAAAARQnAQ" alt="filterandsort" style="width: 30px; margin-bottom: 5px">

同时我们使用 antd 自定义了排序和筛选的 Modal。让用户可以同时设置筛选和排序。

### 复制

监听 S2 的 `S2Event.GLOBAL_COPIED` 或者 `onCopied` 事件，在用户复制成功时进行提示。

### 列隐藏

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*_1u8RoPgKnAAAAAAAAAAAAAAARQnAQ" alt="hiddencol" style="width: 200px; margin-bottom: 5px">

我们通过 antd 组件提供了批量隐藏列的快捷组件。

### Excel 风格表头

<img src="https://gw.alipayobjects.com/mdn/rms_28a65c/afts/img/A*8P0HRoTlaEsAAAAAAAAAAAAAARQnAQ" alt="corner-header" style="width: 100px; margin-bottom: 30px">

对于 Excel 用户，点击左上角表头可以全选所有数据。在这个场景中，我们继承 `TableCornerCell` 子类并覆写了 `drawTextShape` 方法，绘制了自定义角头。
