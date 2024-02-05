---
title: 基本概念
order: 0
tag: Updated
---

本文介绍透视表的基本概念。

## 简介

在统计学中，透视表是矩阵格式的一种表格，显示多变量频率分布。它们提供了两个变量（或者多个）之间的相互关系的基本画面，可以帮助发现它们之间的相互作用，帮助业务进行交叉探索分析，是目前商业 `BI` 分析领域中使用频率最高的图表之一。

### 基本概念

- **度量（指标**）：数值本身，比如 `价格`、`数量` 等。
- **维度**：可以理解为分析数据的角度，比如 `省份`、`类型` 等。
- **维值**：维度所对应具体的值，比如 `成都`、`杭州` 等。

### 构成

透视表由五部分组成，分别是 `行头`、`列头`、`角头`、`数据`、`框架`。

如下图所示：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*7FRBQr_tE4YAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

## 行头（rowHeader）

行头的结构是由 [`s2DataConfig.fields.rows`](/api/general/s2-data-config) 决定，用于行分析维度展示，同时支持自定义行头分组。[了解更多](/manual/advanced/custom/custom-header#1-%E9%80%8F%E8%A7%86%E8%A1%A8).

行头支持 [`平铺模式 (grid)`](examples/basic/pivot/#grid), [`树状模式 (tree)`](/examples/basic/pivot/#tree) 两种展示形态，同时支持 [行序号](/manual/basic/sheet-type/pivot-mode#%E5%BA%8F%E5%8F%B7) 的展示以及 [行头冻结](/manual/basic/sheet-type/pivot-mode#%E5%86%BB%E7%BB%93%E8%A1%8C%E5%A4%B4)。

比如行头数据配置 `province, city` 两个字段

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city']
  }
}
```

### 平铺模式

```ts
const s2Options = {
  hierarchyType: 'grid'
}
```

<img width="200" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*p71xTrX3YIEAAAAAAAAAAAAAARQnAQ" width="250"  alt="row" />

<br/>

[查看示例](/examples/basic/pivot/#grid)

### 树状模式

```ts
const s2Options = {
  hierarchyType: 'tree'
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*zYzLQ5rgzsoAAAAAAAAAAAAAARQnAQ" height="200"  alt="column" />

<br/>

[查看示例](/examples/basic/pivot/#tree)

## 列头（colHeader）

:::warning{title="注意"}
当为明细表时，由于只存在列头，所以仅需设置 columns。
:::

列头的结构是由 [`s2DataConfig.fields.columns`](/api/general/s2-data-config) 决定，用于列分析维度展示，同时支持自定义列头分组。[了解更多](/manual/advanced/custom/custom-header#2-%E6%98%8E%E7%BB%86%E8%A1%A8)

比如列头数据配置 `type, sub_type` 两个字段，展示为：

```ts
const s2DataConfig = {
  fields: {
    columns: ['type', 'sub_type']
  }
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_uMfQK9VHk4AAAAAAAAAAAAAARQnAQ" width="400"  alt="column" />

## 角头（cornerHeader）

角头指表格的左上角部分，在表的布局中起着重要的作用。

表的布局中，`S2` 是以角头作为基础进行扩展，计算出行、列的尺寸和坐标，同时角头也用于展示行头、列头名称，比如示例中的 `省份`、`城市`。

另外，`S2` 还提供了自定义扩展，用于需要自定义角头的场景，详见 [cornerCell](/examples/custom/custom-cell#corner-cell) 和 [cornerHeader](/examples/custom/custom-cell#corner-header)。

## 数据 (dataCell)

数据单元格是表格行列维度值交叉后产生的数据区域，通常情况下应该是度量值，是表数据分析最核心的数据呈现区域。

在数据单元格区域，我们可以展现基础的交叉数据，可以通过 [字段标记](/examples/analysis/conditions#text) 来辅助分析，也可以展现 [同环比等衍生指标](/examples/react-component/sheet/#strategy)，还可以通过自定义 `Hooks` 来实现数据单元格自定义，更多参考 [dataCell](/examples/custom/custom-cell#data-cell) 。

## 框架（frame）

框架布局区域，位于其他四个区域之上，用来做区域之间的间隔框架，或者滚动条，框架间隔线的阴影等逻辑，详见 [参考示例](/examples/case/comparison/#time-spend)。

## 单元格 (cell)

`角头`, `行头`, `列头` 由多个单元格组成，支持 [自定义](/manual/advanced/custom/hook).

## 节点 (node)

一个单元格 (cell), 对应一个节点 (node), 节点表示的是单元格的 [元信息](/api/basic-class/node)（包含可视范围外）, 单元格表示当前可视范围内，已实例化的 [单元格信息](/api/basic-class/base-cell)。

## 分面 (facet)

当前 [可视渲染区域](/api/basic-class/base-facet)

## 数据集 (dataset)

表格内部会把用户传入的 `s2DataConfig` 转换成 [数据集](/api/basic-class/base-data-set), 便于处理以及渲染数据。
