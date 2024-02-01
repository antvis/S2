---
title: 滚动
order: 6
---

## 虚拟滚动

S2 基于 `Canvas` 渲染，也实现了虚拟滚动，即只渲染可视区域内的单元格，默认开启。[查看更多](https://www.yuque.com/antv/vo4vyz/srtq5q#mI1n7)

> 延迟 200 ms 效果

<img src="https://gw.alipayobjects.com/zos/antfincdn/3l%26fv9SHB/Kapture%2525202022-06-06%252520at%25252010.55.24.gif" alt="preview" width="600" />

## 自定义滚动速度

可配置 `scrollSpeedRatio` 控制滚动速率，分为 `水平` 和 `垂直` 两个方向，范围为 `0-1`, 默认为 `1`。 [查看示例](/examples/interaction/advanced#scroll-speed-ratio)

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

## 鼠标滚轮水平滚动

滑动滚轮垂直滚动，如果同时按住 `Shift` 即可水平滚动

## 修改滚动至边界行为

对于自身和父容器都存在滚动条时，浏览器默认的滚动行为是：非边界不触发父容器滚动，到达边界后，触发父容器滚动，同时还可以配置 [overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior) 改变默认行为。

S2 是虚拟滚动，但是也**模拟**了浏览器的滚动行为，可配置 `overscrollBehavior` 控制非边界滚动行为。[查看示例](/examples/interaction/advanced#overscroll-behavior)

```ts
const s2Options = {
  interaction: {
    overscrollBehavior: 'auto' // 'auto' | 'none' | 'contain';
    // overscrollBehavior: null  // 设为 null 则不做任何处理
  },
};
```

- `auto`: 和浏览器滚动行为一致

<img src="https://gw.alipayobjects.com/zos/antfincdn/C5cZoErPi/Kapture%2525202022-06-06%252520at%25252011.33.43.gif" alt="preview" width="600" />

- `contain`: 滚动至边界后，不会触发父容器滚动

<img src="https://gw.alipayobjects.com/zos/antfincdn/38KkNLcWR/Kapture%2525202022-06-06%252520at%25252011.31.55.gif" alt="preview" width="600" />

- `none`: 滚动至边界后，不会触发父容器滚动，同时禁用浏览器的**默认滚动行为**，比如：触发页面**下拉刷新**，**Mac 触控板横向滚动时触发返回**. [查看更多](https://css-tricks.com/almanac/properties/o/overscroll-behavior/)

<img src="https://gw.alipayobjects.com/zos/antfincdn/8pm8Gr0Qy/437b682d-edbd-4943-a9b7-808b6a3a8461.png" alt="preview" width="600" />

<img src="https://gw.alipayobjects.com/zos/antfincdn/JRAt1kb93/Kapture%2525202022-06-06%252520at%25252011.28.43.gif" alt="preview" width="600" />

**注意**: 当配置了 `overscrollBehavior`，会额外在 `body` 上添加对应的 `overscroll-behavior` 属性，以达到禁用浏览器默认滚动行为的目的

<img src="https://gw.alipayobjects.com/zos/antfincdn/POvOCUsoA/919c8477-7a05-4fbf-a026-6d7d86b3188e.png" alt="preview" width="600" />

<br/>

## 监听滚动事件

对于 `透视表`, 可滚动的区域分别是 `行头单元格` 和 `数值单元格`, 对于 `明细表`, 可滚动的区域只有 `数值单元格`, 可分别监听，也可以统一监听

<img src="https://gw.alipayobjects.com/zos/antfincdn/D9%24skF%24Bl/Kapture%2525202022-06-23%252520at%25252017.08.17.gif" alt="preview" width="600" />

`S2` 提供两种滚动事件：

- `S2Event.GLOBAL_SCROLL`: 单元格滚动，数值/行头单元格滚动时都会触发
- `S2Event.ROW_CELL_SCROLL`: 行头单元格滚动

同时：对于 `s2-react` 和 `s2-vue` 版本，也提供了事件的隐射，具体请查看 [API 文档](/docs/api/components/sheet-component)

需要注意的是：行头单元格只会在**固定行头时**才会显示滚动条，且只会有**水平滚动条**, 所以拿到的 `scrollY` 永远都是 `0`

```ts
import { S2Event } from '@antv/s2';

s2.on(S2Event.GLOBAL_SCROLL, (position) => {
  console.log('表格滚动', position) // { scrollX: 0, scrollY: 100 }
})

s2.on(S2Event.ROW_CELL_SCROLL, (position) => {
  console.log('行头单元格滚动', position) // { scrollX: 0, scrollY: 100 }
})
```

## 获取滚动状态

查看相关 [API](/api/basic-class/base-facet)

## 手动触发表格滚动

参考以下示例：

- [滚动至指定单元格](/examples/interaction/advanced/#scroll-to-cell)
- [循环滚动](/examples/interaction/advanced#scroll-loop)

<Playground path='interaction/advanced/demo/scroll-to-cell.ts' rid='scroll-to-cell' height='400'></playground>
