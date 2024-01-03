---
title: Mobile Component
order: 10
tag: New
---

In order to meet the usage scenarios of the mobile terminal, the analysis component in `s2-react` has been adapted for mobile. Help users view data more conveniently and efficiently on the mobile terminal.

## premise

The mobile table component uses various capabilities provided by S2 for integration, so it is recommended that you have read the following chapters before reading this chapter:

* [basic concept](/zh/docs/manual/basic/base-concept)
* [form form](/zh/docs/manual/basic/sheet-type/pivot-mode)
* [tooltip](/zh/docs/manual/basic/tooltip)

## mobile form

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

| PC                                                                                                                                                                     | Mobile                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*dIc6S47zmm4AAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;"> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*cf2uQYVVStQAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%;"> |

The mobile component `MobileSheet` will have built-in mobile-specific `options` to make the form more compact and disable interactive operations that cannot be used on mobile. Of course, you can also override the original configuration through external `options` settings.

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
      dataCell: false,
      rowCell: false,
      colCell: false,
    },
    multiSelection: false,
    rangeSelection: false,
  },
  device: DeviceType.MOBILE,
};
```

> The configuration may change in real time, you can view the `options` configuration of the current version by getting `DEFAULT_MOBILE_OPTIONS` .

## Mobile Tooltips

We modified the interactive operation of `tooltips` on mobile components. However, the original [Tooltip API](/zh/docs/api/basic-class/base-tooltip) is retained, you only need to use the `MobileSheet` component to use the customized `tooltips` on the mobile side.

​📊 View [Tooltip usage](/zh/docs/manual/basic/tooltip)

|                               | PC                                                                                                                                                                     | Mobile                                                                                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sort function                 | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*SuBwToVzrYwAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;"> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4CgUTI8jOyYAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 340px; max-height: 100%; max-width: initial;"> |
| Cell information display      | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pu7ESbzNqXkAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;"> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*gv-BQaGJTjEAAAAAAAAAAAAAARQnAQ" alt="PC" style="width:340px; max-height: 100%; max-width: initial;">  |
| Indicator information display | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*MvUtT7j0BggAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;"> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*rF4USJO5nAkAAAAAAAAAAAAAARQnAQ" alt="PC" style="width:340px; max-height: 100%; max-width: initial;">  |
| Summary information display   | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*5rg6QrEmmeAAAAAAAAAAAAAAARQnAQ" alt="PC" style="width: 400px; max-height: 100%; max-width: initial;"> | <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*IUQqSrzxKXwAAAAAAAAAAAAAARQnAQ" alt="PC" style="width:340px; max-height: 100%; max-width: initial;">  |
