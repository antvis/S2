---
title: Scroll
order: 6
---

#### virtual scroll

S2 is based on `Canvas` rendering, and also realizes virtual scrolling, that is, only cells in the visible area are rendered, which is enabled by default. [see more](https://www.yuque.com/antv/vo4vyz/srtq5q#mI1n7)

> 200 ms delay effect

<img src="https://gw.alipayobjects.com/zos/antfincdn/3l%26fv9SHB/Kapture%2525202022-06-06%252520at%25252010.55.24.gif" alt="preview" width="600">

#### custom scroll speed

The `scrollSpeedRatio` can be configured to control the scroll rate, which is divided into two directions:`水平`and`垂直`. The range is `0-1` , and the default is `1` . [View specific examples](/examples/interaction/advanced#scroll-speed-ratio)

```ts
const s2Options = {
  interaction: {
    scrollSpeedRatio: {
      vertical: 0.3, // 垂直
      horizontal: 1, // 水平
    },
  },
};
```

#### mouse wheel scrolling horizontally

Swipe the scroll wheel to scroll vertically, if you hold `Shift` at the same time, you can scroll horizontally

#### Modify scroll to bounds behavior

When there are scroll bars in both itself and the parent container, the browser's default scrolling behavior is: non-border does not trigger the parent container to scroll, and when the border is reached, the parent container is triggered to scroll, and you can also configure [overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior) to change the default behavior.

S2 is a virtual scroll, but it also **simulates** the scrolling behavior of the browser, and the `overscrollBehavior` can be configured to control the non-boundary scrolling behavior. [view example](/examples/interaction/advanced#overscroll-behavior)

```ts
const s2Options = {
  interaction: {
    overscrollBehavior: 'auto' // 'auto' | 'none' | 'contain';
    overscrollBehavior: null  // 设为 null 则不做任何处理
  },
};
```

* `auto` : Same as browser scrolling behavior

<img src="https://gw.alipayobjects.com/zos/antfincdn/C5cZoErPi/Kapture%2525202022-06-06%252520at%25252011.33.43.gif" alt="preview" width="600">

* `contain` : After scrolling to the border, the parent container will not be triggered to scroll

<img src="https://gw.alipayobjects.com/zos/antfincdn/38KkNLcWR/Kapture%2525202022-06-06%252520at%25252011.31.55.gif" alt="preview" width="600">

* `none` : After scrolling to the boundary, the parent container will not be triggered to scroll, and the **default scrolling behavior** of the browser will be disabled, such as triggering page **pull-down to refresh** , **and triggering return when the Mac touchpad scrolls horizontally** . [See more](https://css-tricks.com/almanac/properties/o/overscroll-behavior/)

<img src="https://gw.alipayobjects.com/zos/antfincdn/8pm8Gr0Qy/437b682d-edbd-4943-a9b7-808b6a3a8461.png" alt="preview" width="600">

<img src="https://gw.alipayobjects.com/zos/antfincdn/JRAt1kb93/Kapture%2525202022-06-06%252520at%25252011.28.43.gif" alt="preview" width="600">

**Note** : When `overscrollBehavior` is configured, the corresponding `overscroll-behavior` attribute will be additionally added to the `body` to achieve the purpose of disabling the browser's default scrolling behavior

<img src="https://gw.alipayobjects.com/zos/antfincdn/POvOCUsoA/919c8477-7a05-4fbf-a026-6d7d86b3188e.png" alt="preview" width="600">

<br>

#### Listen for scrolling events

For the`透视表`, the scrollable area is`行头单元格`and the`数值单元格`respectively; for the`明细表`, the scrollable area is only the`数值单元格`, which can be monitored separately or collectively

<img src="https://gw.alipayobjects.com/zos/antfincdn/D9%24skF%24Bl/Kapture%2525202022-06-23%252520at%25252017.08.17.gif" alt="preview" width="600">

`S2` provides two kinds of scrolling events:

* `S2Event.GLOBAL_SCROLL` : Cell scrolling, triggers when the value/row header cell scrolls
* `S2Event.ROW_CELL_SCROLL` : row header cell scrolling

At the same time: For the `s2-react` and `s2-vue` versions, event mapping is also provided, please refer to the [API documentation](/docs/api/components/sheet-component) for details

It should be noted that the row header cell will only display the scroll bar **when the row header is fixed** , and there will only be a **horizontal scroll bar** , so the `scrollY` will always be `0`

```ts
import { S2Event } from '@antv/s2';

s2.on(S2Event.GLOBAL_SCROLL, (position) => {
  console.log('表格滚动', position) // { scrollX: 0, scrollY: 100 }
})

s2.on(S2Event.ROW_CELL_SCROLL, (position) => {
  console.log('行头单元格滚动', position) // { scrollX: 0, scrollY: 100 }
})
```

#### Manually trigger table scrolling

Consider the following examples:

* [Scroll to the specified cell](/examples/interaction/advanced/#scroll-to-cell)
* [cycle scrolling](/examples/interaction/advanced#scroll-loop)
