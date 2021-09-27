---
title: 基础
order: 4
---

S2 支持四种类型的字段标记。根据业务语义设置不同的渲染逻辑，可以实现重点数据的标记，便于分析。
​
四种字段标记类型分别是：

1. 文本 (text) 字段标记
2. 背景 (background) 字段标记
3. 柱状图 (interval) 字段标记
4. 图标 (icon) 字段标记

下图是对四种字段标记的直观展示：

![preview](https://gw.alipayobjects.com/zos/antfincdn/M0ot%26E%26TZ/7f4e10d8-386a-46a6-a184-3656b2b66b17.png)

## API

详细字段标记配置参见 [API 文档](/zh/docs/api/general/conditions)。

## 快速上手

### 显示字段部分条件格式

当某个数据格调用`mapping`后不返回任何值时，则不会在该数据格上应用条件格式。

#### ​

> 仅在价格大于或等于 5 的数据格显示背景色

​📊 查看更多示例。
🎨 面积图详细的配置参考 API 文档。

### 自定义柱状图

对于柱状图条件格式，有两种处理模式：

1. 自定义模式，即显式指定`mapping`返回值中的 `isCompare`属性值为`true`，并指定`maxValue`和`minValue`的值。此时柱状图的范围以这两个值为准
1. 默认模式，即`mapping`返回值中的 `isCompare`属性值为`false` 或者不返回该属性。此时`maxValue`和`minValue`会以所有数据中该字段 (`field`) 的最大最小值为准

> 价格字段采用默认模式
> 价格（环比）字段采用自定义默认，其中 `maxValue` 为 15， `minValue` 为 5

### 自定义图标位置

图标条件格式和其他三种稍有不同，它的类型是 [IconCondition](https://yuque.antfin.com/spreadsheet/klxp4m/fz272x#fwDPf)。多了一个`position`配置用于指定图标在文本的左侧还是右侧。
​

> 价格字段设置图标在文字右侧
> 价格（环比）字段设置图标在文字左侧
