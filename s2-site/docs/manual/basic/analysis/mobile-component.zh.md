---
title: 移动端组件 
order: 10 
---

为了满足移动端的使用场景，`s2-react` 中的分析组件进行了移动的适配。帮助用户在移动端更加便利、高效的看数。

## 前提

移动端表组件使用了 S2 提供的各种能力进行融合，所以建议在阅读本章前，请确保你已经阅读过以下章节：

- [基本概念](/zh/docs/manual/basic/base-concept)
- [表格形态](/zh/docs/manual/basic/sheet-type/pivot-mode)
- [tooltip](/zh/docs/manual/basic/tooltip)

## 移动端表格

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { MobileSheet } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const container = document.getElementById('container');

ReactDOM.render(
  <MobileSheet
    dataCfg={s2DataConfig}
  />,
  document.getElementById('container'),
);

```

| PC                                                                                                                                                    | Mobile                                                       |
|-------------------------------------------------------------------------------------------------------------------------------------------------------| ------------------------------------------------------------ |
| <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*dIc6S47zmm4AAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*cf2uQYVVStQAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%;" /> |

移动端组件 `MobileSheet`, 将会被内置移动专用的 `options`，使表格更加紧凑，同时禁用了移动无法使用的交互操作。当然，您也可以通过外部 `options` 设置来覆盖原有的配置。

```ts
const mobileWidth = document.documentElement.clientWidth;
export const DEFAULT_MOBILE_OPTIONS: Readonly<S2Options> = {
  width: mobileWidth - 40,
  height: 380,
  style: {
    layoutWidthType: LayoutWidthTypes.ColAdaptive,
  },
  interaction: {
    hoverHighlight: false,
    hoverFocus: false,
    brushSelection: {
      data: false,
      row: false,
      col: false,
    },
    multiSelection: false,
    rangeSelection: false,
  },
  device: DeviceType.MOBILE,
};
```

> 配置可能实时变更，您可以通过获取 `DEFAULT_MOBILE_OPTIONS` 来查看，当前版本的 `options` 配置。

## 移动端 Tooltips

我们修改了 `tooltips` 在移动端组件的交互操作。
但保留了原本 [Tooltip API](/zh/docs/api/basic-class/base-tooltip) 的使用方式，您只需要使用 `MobileSheet` 组件即可使用到移动端定制的 `tooltips`。

​📊 查看 [Tooltip 使用](/zh/docs/manual/basic/tooltip)

|               | PC                                                                                                                                                                       | Mobile                                                                                                                                                                   |
| ------------- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 排序功能      | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*SuBwToVzrYwAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4CgUTI8jOyYAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 340px; max-height: 100%; max-width: initial;" /> |
| 单元格信息展示 | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pu7ESbzNqXkAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;"/>  | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*gv-BQaGJTjEAAAAAAAAAAAAAARQnAQ" alt="PC"  style="width:340px; max-height: 100%; max-width: initial;"/>      |
| 指标信息展示   | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*MvUtT7j0BggAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*rF4USJO5nAkAAAAAAAAAAAAAARQnAQ" alt="PC" style="width:340px; max-height: 100%; max-width: initial;" />      |
| 汇总信息展示   | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*5rg6QrEmmeAAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;" /> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*IUQqSrzxKXwAAAAAAAAAAAAAARQnAQ" alt="PC" style="width:340px; max-height: 100%; max-width: initial;" />      |
