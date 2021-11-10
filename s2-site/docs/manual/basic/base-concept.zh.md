---
title: 基本概念
order: 0
---
交叉表的基本概念

## 简介

在统计学中，交叉表是矩阵格式的一种表格，显示多变量频率分布。它们提供了两个变量（或者多个）之间的相互关系的基本画面，可以帮助发现它们之间的相互作用，帮助业务进行交叉探索分析，是目前商业 `BI` 分析领域中使用频率最高的图表之一。

### 基本概念

- 度量（指标）：数值本身，比如价格、数量等。
- 维度：可以理解为分析数据的角度，比如省份、类型等。

### 构成

交叉表由四部分组成，分别是行头、列头、角头、数据单元格、框架 如下图所示：

![s2](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*nzcERYjsPZoAAAAAAAAAAAAAARQnAQ)

## 行头（rowHeader）

行头的结构是由 `dataCfg.fields.rows` 决定，通常情况下是用于行分析维度展示。

比如行头数据配置为 `rows: ['province', 'city']`，在平铺模式下展示为：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*Ezh7RY41R90AAAAAAAAAAAAAARQnAQ" width = "250"  alt="row" />

在树状模式下展示为：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*Nj2lQaDPmN0AAAAAAAAAAAAAARQnAQ" height = "200"  alt="column" />

## 列头（colHeader）

列头的结构是由 `dataCfg.fields.columns` 决定，通常情况下是用于列分析维度展示。

比如行头数据配置为 `columns: ['type', 'sub_type']`，展示为：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*GNirRr5HANUAAAAAAAAAAAAAARQnAQ" width = "400"  alt="column" />

> 注意，当 `sheetType: 'table'` 时，需且仅需设置 columns。

## 角头（cornerHeader）

角头是左上角部分，在表的布局中起到至关重要的作用。

表的布局中，`S2` 是以角头作为基础进行扩展，计算出行、列的尺寸和坐标。

角头也用于展示行头名称，比如示例中的 `省份`、`城市`。

另外，`S2` 还提供了自定义扩展，用于需要自定义角头的场景，详见 [cornerCell](待补充） 和 [cornerHeader]（待补充)。

## 数据单元格 (dataCell)

数据单元格是表格行列维度值交叉后产生的数据区域，通常情况下应该是度量值，是用于表数据分析最核心的数据呈现区域。

在数据单元格区域，我们可以展现基础的交叉数据，可以通过 [条件格式](待补充) 来辅助分析，也可以展现同环比等衍生指标，还可以通过自定义 `Hooks` 来实现数据单元格自定义，更多参考 [dataCell](待补充) 。

## 框架（frame）

框架布局区域，位于其他四个区域之上，用来做区域之间的间隔框架，或者滚动条，框架间隔线的阴影等逻辑。
