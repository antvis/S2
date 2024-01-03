---
title: 多行文本
order: 10
tag: New
---

:::warning{title="注意"}
请确保已经阅读了 [基础教程](/manual/basic/base-concept) 和 [主题配置](/manual/basic/theme) 等章节。
:::

基于 `DOM` 的 表格中，我们可以写一些简单的 [CSS 属性](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow), 就可以实现文本的自动换行，溢出隐藏，因为浏览器已经帮我们计算好了，而在 `Canvas` 中，`文本是否溢出`, `文字换行坐标计算`, `多行文本高度自适应` 等特性都需要自行实现。

得益于 `AntV/G` 5.0 渲染引擎的升级，`S2 2.0` 现在只需要简单的配置即可支持多行文本的渲染，支持自动换行。

<Playground path="layout/custom/demo/multi-line-text.ts" rid='multi-line-text' height="200"></playground>

## 使用

S2 内部适配了 `AntV/G 5.0` 的 [多行布局能力](https://g.antv.antgroup.com/api/basic/text#%E5%A4%9A%E8%A1%8C%E5%B8%83%E5%B1%80), 支持如下配置：

:::info{title="提示"}

具体参数请跳转 `AntV/G` [官网查看](https://g.antv.antgroup.com/api/basic/text#%E5%A4%9A%E8%A1%8C%E5%B8%83%E5%B1%80).

- `maxLines`: 最大行数，文本超出后将被截断。
- `wordWrap`: 是否开启自动折行，默认值为 false,
- `wordWrapWidth`: 开启自动折行后，超出该宽度则换行。
- `textOverflow`:
  - 'clip' 直接截断文本
  - 'ellipsis' 使用 ... 表示被截断的文本
  - 自定义字符串，使用它表示被截断的文本
:::

在 S2 中，通过 [配置主题](/manual/basic/theme) 即可实现多行文本，当文本自动换行后，如小于单元格高度，则会自动调整。

:::warning{title="注意"}
数值单元格 (dataCell) 不建议换行，容易产生歧义。
:::

```ts
const cellTheme = {
  text: {
    // 最大行数，文本超出后将被截断
    maxLines: 2,
    // 文本是否换行
    wordWrap: true,
    // 可选项见：https://g.antv.antgroup.com/api/basic/text#textoverflow
    textOverflow: 'ellipsis',
  },
  bolderText: {
    maxLines: 2,
  },
  measureText: {
    maxLines: 2,
  },
};

s2.setTheme({
  seriesNumberCell: cellTheme,
  colCell: cellTheme,
  cornerCell: cellTheme,
  rowCell: cellTheme,
  // dataCell: cellTheme,
});

```

## 效果

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uMV6QYL-TcwAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="预览"/>

## 获取单元格文本状态

如果想获取一些特定状态，如 `文本最大宽度`, `文本是否换行`, `文本是否溢出`, 可以在拿到 [单元格信息后](/manual/advanced/get-cell-data) 后，调用单元格基类的方法，具体请 [查看 API](/api/basic-class/base-cell)。

```ts
cell.getActualText()
cell.getOriginalText()
cell.isTextOverflowing()
```
