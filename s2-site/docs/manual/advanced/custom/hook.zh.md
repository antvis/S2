---
title: 自定义 Hook
order: 1
tag: Updated
---

S2 默认提供丰富的功能配置，除此之外，也提供丰富的 [`自定义 Hook`](/api/general/s2-options) 允许开发者重写表格的所有元素，你可以根据产品需要对某些元素进行自定义，比如角头、列头、行头、单元格、行头顺序、单元格位置、单元格宽高、图标、数据集、分面、序号等。如果需要，完全可以重写一个属于你的透视表或明细表！

## layoutArrange

可手动设置行、列顺序，适用于局部调整，非规则调整。比如指定某行在行首、指定某列在列尾。[查看示例](/examples/custom/custom-layout#custom-layout-arrange)

## layoutCoordinate

用于改变行、列叶子节点的坐标（x、y）。[查看示例](/examples/custom/custom-layout#custom-coordinate)

## layoutCellMeta

动态改变单元格的元数据，修订某些单元格的数值。[查看示例](/examples/custom/custom-layout#custom-layout-cell-meta)

## layoutHierarchy

手动控制行列结构的增加、删除的特殊场景。[查看示例](/examples/custom/custom-layout#custom-layout-hierarchy)

## layoutSeriesNumberNodes

自定义序号列节点，比如如将序号 1,2,3 转换成 a,b,c [查看示例](/examples/custom/custom-cell/#series-number-cell)

## facet

自定义分面。[查看示例](/examples/custom/custom-layout#custom-facet)

## placeholder

自定义单元格占位符，比如展示加密数据，空数据占位符。[查看示例](/examples/custom/custom-cell/#data-cell-placeholder)

## headerActionIcons

设置行头，列头，角头的图标，比如字段的趋势弹窗，字段的下钻，筛选等。查看 [文档](/manual/advanced/custom/custom-icon) 和 [示例](/examples/custom/custom-icon#custom-header-action-icon)

## customSVGIcons

自定义图标，当 `S2` 提供的图标不满足需求时，开发者可以自己定义图标，用于透视表上的图标展示。查看 [文档](/manual/advanced/custom/custom-icon#customsvgicon) 和 [示例](/examples/custom/custom-icon/#custom-svg-icon)

## dataCell

改变数据单元格的默认实现，`透视表` 需要继承自 [DataCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/data-cell.ts)，`明细表` 需要继承自 [TableDataCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-data-cell.ts), 重写某些方法，比如字体样式、背景样式等。[查看示例](/examples/custom/custom-cell#data-cell)

## rowCell

改变行头单元格的默认实现，需要继承自 [RowCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/row-cell.ts)，重写某些方法，比如字体样式、背景样式等。[查看示例](/examples/custom/custom-cell#row-cell)

## colCell

改变列头单元格的默认实现，`透视表` 需要继承自 [ColCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/col-cell.ts)，`明细表` 需要继承自 [TableColCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-col-cell.ts), 重写某些方法，比如字体样式、背景样式等。[查看示例](/examples/custom/custom-cell#col-cell)

## cornerCell

改变角头单元格的默认实现，`透视表` 需要继承自 [CornerCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/corner-cell.ts)，`明细表` 需要继承自 [TableCornerCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-corner-cell.ts), 重写某些方法，比如字体样式、背景样式等。[查看示例](/examples/custom/custom-cell#corner-cell)

## seriesNumberCell

改变序号单元格的默认实现，`透视表` 需要继承自 [SeriesNumberCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/series-number-cell.ts)，`明细表` 需要继承自 [TableSeriesNumberCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-series-number-cell.ts), 重写某些方法，比如字体样式、背景样式等。[查看示例](/examples/custom/custom-cell#series-number-cell)

## mergedCell

改变合并单元格的默认实现，需要继承自 [MergedCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/merged-cell.ts), 重写某些方法，比如字体样式、背景样式等。[查看示例](/examples/custom/custom-cell/#custom-merged-cell)

## cornerHeader

改变角头的默认实现，需要继承自 [Group](https://g.antv.antgroup.com/api/basic/group)，重写某些方法，比如渲染内容更换等。[查看示例](/examples/custom/custom-cell#corner-cell)

## frame

修改框架的默认实现，比如修改分割线、阴影、滚动条等。[查看示例](/examples/case/comparison#measure-comparison)

## dataset

自定义数据集，比如数据的展示方式，取数逻辑等。[查看示例](/examples/custom/custom-dataset/#custom-strategy-sheet-dataset)

## style

自定义单元格宽高，比如给特定某一行/列设置宽高，精确到某一类维度或维值，又或者所有单元格。查看 [文档](/manual/advanced/custom/cell-size) 和 [示例](/examples/layout/custom/#custom-pivot-size)

## tooltip

自定义单元格提示信息，比如展示数据对应行列维值，汇总信息等。[查看示例](/examples/react-component/tooltip/#custom-content-base)
