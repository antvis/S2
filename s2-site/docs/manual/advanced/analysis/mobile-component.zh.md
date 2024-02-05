---
title: 移动端表格组件
order: 10
tag: New
---

<Badge>@antv/s2-react</Badge>

为了满足移动端的使用场景，`@antv/s2-react` 中的分析组件进行了移动端的适配。帮助用户在移动端更加便利、高效的看数。

:::warning{title="注意"}

**移动端表组件**使用了 S2 提供的各种能力进行融合，所以建议在阅读本章前，请确保你已经阅读过以下章节：

- [基本概念](/zh/docs/manual/basic/base-concept)
- [表格形态](/zh/docs/manual/basic/sheet-type/pivot-mode)
- [tooltip](/zh/docs/manual/basic/tooltip)

:::

## 快速上手

```tsx
import React from 'react';
import { MobileSheet } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const App = () => {
  return (
    <MobileSheet dataCfg={s2DataConfig} />
  )
}
```

| PC 端       | Mobile 端         |
|--------------------------------------| --------------------------------- |
| <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*dIc6S47zmm4AAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*cf2uQYVVStQAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%;" /> |

移动端组件 `MobileSheet`, 将会被内置移动专用的 `options`，使表格更加紧凑，同时禁用了移动无法使用的交互操作。当然，您也可以通过外部 `options` 设置来覆盖原有的配置。

```ts
const DEFAULT_MOBILE_OPTIONS = {
  width: document.documentElement.clientWidth - 40,
  height: 380,
  style: {
    layoutWidthType: 'colAdaptive',
  },
  interaction: {
    hoverHighlight: false,
    hoverFocus: false,
    brushSelection: {
      dataCell: false,
      rowCell: false,
      colCell: false,
    },
    multiSelection: false,
    rangeSelection: false,
  },
  device: 'mobile',
};
```

## 移动端 Tooltip

我们修改了 `tooltip` 在移动端组件的交互操作。
但保留了原本 [Tooltip API](/zh/docs/api/basic-class/base-tooltip) 的使用方式，您只需要使用 `MobileSheet` 组件即可使用到移动端定制的 `tooltips`。

​📊 查看 [Tooltip 使用](/zh/docs/manual/basic/tooltip)

|  功能  | PC 端       | Mobile 端      |
| ------------- |---------------|----------------------------------------------|
| 排序功能      | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*SuBwToVzrYwAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4CgUTI8jOyYAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 340px; max-height: 100%; max-width: initial;" /> |
| 单元格信息展示 | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pu7ESbzNqXkAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;"/>  | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*gv-BQaGJTjEAAAAAAAAAAAAAARQnAQ" alt="PC"  style="width:340px; max-height: 100%; max-width: initial;"/>      |
| 指标信息展示   | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*MvUtT7j0BggAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*rF4USJO5nAkAAAAAAAAAAAAAARQnAQ" alt="PC" style="width:340px; max-height: 100%; max-width: initial;" />      |
| 汇总信息展示   | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*5rg6QrEmmeAAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*IUQqSrzxKXwAAAAAAAAAAAAAARQnAQ" alt="PC" style="width:340px; max-height: 100%; max-width: initial;" />      |
