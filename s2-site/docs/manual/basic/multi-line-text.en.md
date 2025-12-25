---
title: Multi-line Text
order: 10

---

:::warning{title="Note"}
Before reading this chapter, please ensure you have read the [Basic Concepts](/manual/basic/base-concept) and [Theme Configuration](/manual/basic/theme) chapters, and have some familiarity with the [AntV/G](https://g.antv.antgroup.com/) rendering engine.
:::

In `DOM`-based tables, we can use simple [CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow) like `text-overflow` to achieve features such as `automatic text wrapping` and `overflow hiding`. This is because the browser handles the calculations for us. In `Canvas`, however, features like `text overflow detection`, `line break coordinate calculation`, and `adaptive height for multi-line text` need to be implemented manually.

Thanks to the upgrade of the `AntV/G` rendering engine, `S2` now supports multi-line text rendering with simple configuration, including automatic line wrapping.

<Playground path="layout/multi-line-text/demo/pivot.ts" rid='pivot-multi-line-text' height="200"></playground>

## Usage

S2 has adapted to the [multi-line layout capabilities](https://g.antv.antgroup.com/api/basic/text#multi-line-layout) of `AntV/G`, allowing for adaptive cell height based on the text height. The following configurations are supported:

:::info{title="Tip"}

For detailed parameters, please refer to the `AntV/G` [official documentation](https://g.antv.antgroup.com/api/basic/text#multi-line-layout).

- `maxLines`: The maximum number of lines, a positive integer (can be set to `Infinity`). Text will be truncated if it exceeds this limit (default is `1`).
- `wordWrap`: Whether to enable automatic line wrapping (default is `false`).
- `textOverflow`:
  - 'clip': Truncates the text directly.
  - 'ellipsis': Uses '...' to indicate truncated text.
  - A custom string can also be used to indicate truncation.

:::

In S2, you can render multi-line text through the [Style](/api/general/s2-options#style) configuration. If the text wraps and its height is less than the cell height, the cell height will be adjusted automatically.

:::warning{title="Note"}
It is not recommended to wrap text in data cells that display `numbers`, as it can be ambiguous.
:::

```ts
const cellTextWordWrapStyle = {
  // Maximum number of lines, text will be truncated if it exceeds this
  maxLines: 2,
  // Whether to wrap text
  wordWrap: true,
  // Options can be found at: https://g.antv.antgroup.com/api/basic/text#textoverflow
  textOverflow: 'ellipsis',
};

const s2Options = {
  style: {
    seriesNumberCell: cellTextWordWrapStyle,
    colCell: cellTextWordWrapStyle,
    cornerCell: cellTextWordWrapStyle,
    rowCell: cellTextWordWrapStyle,
    // It is not recommended to wrap numerical values, as it can be ambiguous
    dataCell: cellTextWordWrapStyle,
  },
};
```

## Effect

### Pivot Table

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uMV6QYL-TcwAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="pivot" />

[View Example](/examples/layout/multi-line-text/#pivot)

### Detail Table

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*psedTKQWiWUAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="table" />

[View Example](/examples/layout/multi-line-text/#table)

## Line Breaks with `\n`

In addition to wrapping based on text length, S2 also supports line breaks using the newline character `\n`. [View Example](/examples/layout/multi-line-text/#line-break)

```json
{
  "province": "Zhejiang\nZhejiang",
  "city": "Hangzhou\nHangzhou\nHangzhou",
  "type": "Paper\nPaper\nPaper",
  "price": 2,
  "cost": 20,
}
```

Based on the data above, you can set the `maxLines` value according to the number of newline characters. If the text is dynamic, you can set `maxLines` to a **large number**, such as `99` or `Infinity`, to achieve adaptive height.

```ts
const s2Options = {
  style: {
    rowCell: {
      maxLines: Infinity,
    },
  },
};
```

<Playground path="layout/multi-line-text/demo/line-break.ts" rid='line-break' height="200"></playground>

## Height Priority

:::info{title="Tip"}

When automatic text wrapping is enabled, the cell height is adjusted based on the **actual height of the text** by default.

1. If you have configured a [custom cell height](/manual/advanced/custom/cell-size), the adaptive height will be disabled, and the custom height will take precedence.
2. By default, the cell height is calculated based on `maxLines`. When the height is [manually resized](/manual/advanced/interaction/resize) or a [custom cell height](/manual/advanced/custom/cell-size) is set, the maximum number of lines that can be displayed will be recalculated based on the current text line height to ensure proper display. This will **override** the default `maxLines` configuration.

:::

## Getting Cell Text Status

If you need to get specific states, such as `maximum text width`, `whether the text is wrapped`, or `whether the text is overflowing`, you can call the base cell methods after getting the [cell information](/manual/advanced/get-cell-data). For details, please [see the API](/api/basic-class/base-cell).

```ts
cell.getActualText()
cell.getOriginalText()
cell.isTextOverflowing()
```
