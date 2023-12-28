---
title: 自定义 Hook
order: 1
---

自定义 `Hook` 允许开发者重写表格的所有元素，你可以根据产品需要对某些元素进行自定义，比如角头、列头、行头、单元格、行头顺序、单元格位置等。如果需要，完全可以重写一个属于你的透视表！

## layoutArrange

可手动设置行、列顺序，适用于局部调整，非规则调整。比如指定某行在行首、指定某列在列尾。[例子](/examples/custom/custom-layout#custom-layout-arrange)。

## layoutCoordinate

用于改变行、列叶子节点的尺寸（长、宽）和坐标（x、y），比如改变行高、列宽等。[例子](/examples/custom/custom-layout#custom-coordinate)。

## layoutDataPosition

动态改变数据的定位，修订某些格子的数值。[例子](/examples/custom/custom-layout#custom-data-position)。

## layoutHierarchy

手动控制行列结构的增加、删除的特殊场景。[例子](/examples/custom/custom-layout#custom-layout-hierarchy)。

## headerActionIcons

设置行头或者列头的行动点图标，比如字段的趋势弹窗，字段的下钻等。[例子](/examples/custom/custom-icon#custom-header-action-icon)。

## customSVGIcons

自定义图标，当 `S2` 提供的图标不满足需求时，开发者可以自己定义图标，用于透视表上的图标展示。[例子](/examples/custom/custom-icon/#custom-svg-icon)

## dataCell

改变数据单元格的默认实现，需要继承自 [dataCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/data-cell.ts)，覆盖某些方法，比如字体样式、背景样式等。[例子](/examples/custom/custom-cell#data-cell)

## rowCell

改变行头单元格的默认实现，需要继承自 [rowCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/row-cell.ts)，覆盖某些方法，比如字体样式、背景样式等。[例子](/examples/custom/custom-cell#row-cell)

## colCell

改变列头单元格的默认实现，需要继承自 [colCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/col-cell.ts)，覆盖某些方法，比如字体样式、背景样式等。[例子](/examples/custom/custom-cell#col-cell)

## cornerCell

改变角头单元格的默认实现，需要继承自 [cornerCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/corner-cell.ts)，覆盖某些方法，比如字体样式、背景样式等。[例子](/examples/custom/custom-cell#corner-cell)

## seriesNumberCell

改变序号单元格的默认实现，需要继承自 [seriesNumberCell](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/series-number-cell.ts)，覆盖某些方法，比如字体样式、背景样式等。[例子](/examples/custom/custom-cell#series-number-cell)

## cornerHeader

改变角头的默认实现，需要继承自 [Group](https://g.antv.antgroup.com/docs/api/group)，覆盖某些方法，比如渲染内容更换等。[例子](/examples/custom/custom-cell#corner-cell)

## frame

修改框架的默认实现，比如修改分割线、阴影、滚动条等。[例子](/examples/case/comparison#measure-comparison)
