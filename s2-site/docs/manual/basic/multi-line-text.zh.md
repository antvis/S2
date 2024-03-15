---
title: 多行文本
order: 10
tag: New
---

:::warning{title="注意"}
请确保已经阅读了 [基础教程](/manual/basic/base-concept) 和 [主题配置](/manual/basic/theme) 等章节，并对 [AntV/G](https://g.antv.antgroup.com/) 渲染引擎有所了解。
:::

在基于 `DOM` 的 表格中，我们可以写一些简单的 [CSS 属性](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow), 就可以实现文本的`自动换行`, `溢出隐藏`等特性，因为浏览器已经帮我们计算好了，而在 `Canvas` 中，`文本是否溢出`, `文字换行坐标计算`, `多行文本高度自适应` 等特性都需要自行实现。

得益于 `AntV/G` 5.0 渲染引擎的升级，`S2 2.0` 现在只需要简单的配置即可支持多行文本的渲染，支持自动换行。

<Playground path="layout/multi-line-text/demo/pivot.ts" rid='pivot-multi-line-text' height="200"></playground>

## 使用

S2 内部适配了 `AntV/G 5.0` 的 [多行布局能力](https://g.antv.antgroup.com/api/basic/text#%E5%A4%9A%E8%A1%8C%E5%B8%83%E5%B1%80), 可以根据文本高度自适应单元格高度，并支持如下配置：

:::info{title="提示"}

具体参数请跳转 `AntV/G` [官网查看](https://g.antv.antgroup.com/api/basic/text#%E5%A4%9A%E8%A1%8C%E5%B8%83%E5%B1%80).

- `maxLines`: 最大行数，一个具体的整数，文本超出后将被截断 （默认值为 `1`)。
- `wordWrap`: 是否开启自动折行，（默认值为 `false`).
- `textOverflow`:
  - 'clip': 直接截断文本。
  - 'ellipsis': 使用 ... 表示被截断的文本。
  - 自定义字符串，使用它表示被截断的文本。

:::

在 S2 中，通过 [Style](/api/general/s2-options#style) 即可实现渲染多行文本，当文本自动换行后，如果小于单元格高度，则会自动调整。

:::warning{title="注意"}
数据单元格 (dataCell) 如果展示的是 `数字` 则不建议换行，容易产生歧义。
:::

```ts
const cellTextWordWrapStyle = {
  // 最大行数，文本超出后将被截断
  maxLines: 2,
  // 文本是否换行
  wordWrap: true,
  // 可选项见：https://g.antv.antgroup.com/api/basic/text#textoverflow
  textOverflow: 'ellipsis',
};

const s2Options = {
  style: {
    seriesNumberCell: cellTextWordWrapStyle,
    colCell: cellTextWordWrapStyle,
    cornerCell: cellTextWordWrapStyle,
    rowCell: cellTextWordWrapStyle,
    // 数值不建议换行，容易产生歧义
    dataCell: cellTextWordWrapStyle,
  },
};

```

## 效果

### 透视表

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uMV6QYL-TcwAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="pivot" />

[查看示例](/examples/layout/multi-line-text/#pivot)

### 明细表

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*psedTKQWiWUAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="table" />

[查看示例](/examples/layout/multi-line-text/#table)

## 获取单元格文本状态

如果想获取一些特定状态，如 `文本最大宽度`, `文本是否换行`, `文本是否溢出`, 可以在拿到 [单元格信息后](/manual/advanced/get-cell-data) 后，调用单元格基类的方法，具体请 [查看 API](/api/basic-class/base-cell)。

```ts
cell.getActualText()
cell.getOriginalText()
cell.isTextOverflowing()
```
