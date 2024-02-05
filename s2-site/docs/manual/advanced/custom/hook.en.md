---
title: Customize Hook
order: 1
tag: Updated
---

Custom `Hook` allows developers to rewrite all elements of the table, and you can customize certain elements according to product needs, such as corner headers, column headers, row headers, cells, row header order, cell position, etc. If necessary, you can completely rewrite a pivot table that belongs to you!

## layoutArrange

The order of rows and columns can be set manually, which is suitable for local adjustment and irregular adjustment. For example, specify a row at the beginning of the row, and specify a column at the end of the column. [example](/examples/custom/custom-layout#custom-layout-arrange) .

## layoutCoordinate

It is used to change the size (length, width) and coordinates (x, y) of row and column leaf nodes, such as changing row height and column width, etc. [example](/examples/custom/custom-layout#custom-coordinate) .

## layoutCellMeta

Dynamically change the positioning of data and revise the value of some grids. [example](/examples/custom/custom-layout#custom-layout-cell-meta) .

## layout Hierarchy

Special scenarios for manually controlling the addition and deletion of row and column structures. [example](/examples/custom/custom-layout#custom-layout-hierarchy) .

## headerActionIcons

Set the action point icon of the row header or column header, such as the trend pop-up window of the field, the drill-down of the field, etc. [example](/examples/custom/custom-icon#custom-header-action-icon) .

## customSVGIcons

Custom icons. When the icons provided by `S2` do not meet the requirements, developers can define their own icons for the icon display on the pivot table. [example](/examples/custom/custom-icon/#custom-svg-icon)

## dataCell

To change the default implementation of data cells, you need to inherit from [dataCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/data-cell.ts) and override some methods, such as font style, background style, etc. [example](/examples/custom/custom-cell#data-cell)

## rowCell

To change the default implementation of row header cells, you need to inherit from [rowCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/row-cell.ts) and override some methods, such as font style, background style, etc. [example](/examples/custom/custom-cell#row-cell)

## colCell

To change the default implementation of column header cells, you need to inherit from [colCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/col-cell.ts) and override some methods, such as font style, background style, etc. [example](/examples/custom/custom-cell#col-cell)

## cornerCell

To change the default implementation of corner cells, you need to inherit from [cornerCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/corner-cell.ts) and override some methods, such as font style, background style, etc. [example](/examples/custom/custom-cell#corner-cell)

## cornerHeader

To change the default implementation of corner headers, you need to inherit from [Group](https://g.antv.vision/zh/docs/api/group) and override certain methods, such as rendering content replacement. [example](/examples/custom/custom-cell#corner-cell)

## frame

Modify the default implementation of the framework, such as modifying dividing lines, shadows, scroll bars, etc. [example](/examples/case/comparison#measure-comparison)
