---
title: Basic Concepts
order: 0
---

This article introduces the basic concepts of a pivot table.

## Introduction

In statistics, a pivot table is a table in a matrix format that displays the frequency distribution of multiple variables. It provides a basic picture of the interrelationships between two or more variables, which can help in discovering their interactions and assist in cross-exploratory analysis. It is one of the most frequently used charts in the field of business `BI` analysis today.

### Basic Concepts

- **Measure (Indicator)**: The numerical value itself, such as `price`, `quantity`, etc.
- **Dimension**: Can be understood as a perspective for analyzing data, such as `province`, `type`, etc.
- **Dimension Value**: The specific value corresponding to a dimension, such as `Chengdu`, `Hangzhou`, etc.

### Components

A pivot table consists of five parts: `Row Header`, `Column Header`, `Corner Header`, `Data`, and `Frame`.

As shown in the figure below:

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*7FRBQr_tE4YAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

## Row Header (rowHeader)

The structure of the row header is determined by [`s2DataConfig.fields.rows`](/en/api/general/s2-data-config) and is used for displaying row analysis dimensions. It also supports custom row header grouping. [Learn More](/en/manual/advanced/custom/custom-header#1-pivot-table).

The row header supports two display modes: [`Grid Mode`](/en/examples/basic/pivot/#grid) and [`Tree Mode`](/en/examples/basic/pivot/#tree). It also supports displaying [series numbers](/en/manual/basic/sheet-type/pivot-mode#series-number) and [freezing the row header](/en/manual/basic/sheet-type/pivot-mode#frozen-row-header-area).

For example, if the row header is configured with two fields, `province` and `city`:

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city']
  }
}
```

### Grid Mode

```ts
const s2Options = {
  hierarchyType: 'grid'
}
```

<img width="200" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*p71xTrX3YIEAAAAAAAAAAAAAARQnAQ" width="250"  alt="row" />

<br/>

[View Example](/en/examples/basic/pivot/#grid)

### Tree Mode

```ts
const s2Options = {
  hierarchyType: 'tree'
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*zYzLQ5rgzsoAAAAAAAAAAAAAARQnAQ" height="200"  alt="column" />

<br/>

[View Example](/en/examples/basic/pivot/#tree)

## Column Header (colHeader)

:::warning{title="Note"}
For a detail table, since there is only a column header, you only need to set the columns.
:::

The structure of the column header is determined by [`s2DataConfig.fields.columns`](/en/api/general/s2-data-config) and is used for displaying column analysis dimensions. It also supports custom column header grouping. [Learn More](/en/manual/advanced/custom/custom-header#2-detail-table)

For example, if the column header is configured with two fields, `type` and `sub_type`, it will be displayed as:

```ts
const s2DataConfig = {
  fields: {
    columns: ['type', 'sub_type']
  }
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_uMfQK9VHk4AAAAAAAAAAAAAARQnAQ" width="400"  alt="column" />

## Corner Header (cornerHeader)

The corner header is the top-left part of the table and plays an important role in the layout.

In `S2`, the layout is extended from the corner header to calculate the size and coordinates of the rows and columns. The corner header is also used to display the names of the row and column headers, such as `Province` and `City` in the example.

Additionally, `S2` provides custom extensions for scenarios that require a custom corner header. See [cornerCell](/en/examples/custom/custom-cell#corner-cell) and [cornerHeader](/en/examples/custom/custom-cell#corner-header) for details.

## Data (dataCell)

The data cell area is where the data is displayed at the intersection of the row and column dimension values. This is typically the measure value and is the core data presentation area for table analysis.

In the data cell area, we can display basic cross-tabulated data, use [conditional formatting](/en/examples/analysis/conditions#text) to aid analysis, show [derived indicators like year-over-year comparisons](/en/examples/react-component/sheet/#strategy), and customize the data cells using custom `Hooks`. For more, see [dataCell](/en/examples/custom/custom-cell#data-cell).

## Frame (frame)

The frame is the layout area that sits above the other four areas. It is used for spacing between areas, scrollbars, and the shadow effects of dividing lines. See the [reference example](/en/examples/case/comparison/#time-spend) for details.

## Cell

The `Corner Header`, `Row Header`, and `Column Header` are composed of multiple cells, which support [customization](/en/manual/advanced/custom/hook).

## Node

A Cell corresponds to a Node. The node represents the [metadata](/en/api/basic-class/node) of the cell (including what is outside the visible range), while the cell represents the instantiated [cell information](/en/api/basic-class/base-cell) within the current visible range.

## Facet

This refers to the current [visible rendering area](/en/api/basic-class/base-facet).

## Dataset

Internally, the table converts the `s2DataConfig` provided by the user into a [dataset](/en/api/basic-class/base-data-set) to facilitate data processing and rendering.
