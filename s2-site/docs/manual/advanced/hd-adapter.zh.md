---
title: 高清适配
order: 7
tag: Updated
---

S2 基于 `Canvas` 渲染，在实际的业务场景开发中，我们发现有以下使用场景会导致 **表格渲染模糊**

1. **不同 `DPR` 的设备之间来回切换**：比如一台 MacBook（视网膜屏）, 外接一台显示器 （普通 2k 屏）, 将浏览器移到外接设备查看。
2. **使用 `笔记本触控板` 对页面进行双指捏合缩放**：使用双指缩放，来放大显示，而不是传统的 `cmd` + `+`, `cmd` + `-` 缩放浏览器窗口大小。

高清适配默认开启，可以手动关闭

```ts
const s2Options = {
  hd: false
}
```

## 效果对比

关闭高清适配

<img src="https://gw.alipayobjects.com/zos/antfincdn/mc5rt%24aNB/128c0063-67a5-4d06-a5a5-fe5f341fa94e.png" width="800" alt="disable" />

开启高清适配

<img src="https://gw.alipayobjects.com/zos/antfincdn/TtuUHO%26Pb/d32dc287-af59-4b1c-ba7d-17dacd4ffa24.png" width="800" alt="enable" />

## 不同 DPR 设备间切换

对于这种场景，我们使用 [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) 来监听 DPR 的变化，更新 `canvas` 的尺寸，从而达到高清的效果

```ts
const { width, height } = s2Options
const devicePixelRatioMedia = window.matchMedia(
  `(resolution: ${window.devicePixelRatio}dppx)`,
);

devicePixelRatioMedia.addEventListener('change', renderByDevicePixelRatio)

const renderByDevicePixelRatio = (ratio = window.devicePixelRatio) => {
  const newWidth = Math.floor(width * ratio);
  const newHeight = Math.floor(height * ratio);

  // 内部的更新容器大小方法
  changeSheetSize(newWidth, newHeight);
};
```

## 笔记本触控板双指缩放

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*rmOLTLaWtGMAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

区别于浏览器的放大缩小，普通的 `resize` 事件是无法触发的

![preview](https://gw.alipayobjects.com/zos/antfincdn/gBRpqwZkj/a14f1e5a-540e-4bb8-a6a4-2ff693542296.png)

```ts
// 触控板双指缩放 无法触发
window.addEventListener('resize', ...)
```

普通浏览器窗口放大缩小

![preview](https://gw.alipayobjects.com/zos/antfincdn/%24vCHFUDnZ/Kapture%2525202021-10-19%252520at%25252014.24.19.gif)

触控板双指缩放

![preview](https://gw.alipayobjects.com/zos/antfincdn/ZDSjxFBGd/Kapture%2525202021-10-19%252520at%25252014.27.00.gif)

那么如果解决呢？答案就是 使用 [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), `VisualViewport` 可以被用做移动端的双指缩放监听，同样适用于 `mac 触控板`

```ts
window.viewport?.visualViewport?.addEventListener(
  'resize',
  this.renderByZoomScale,
);

const renderByZoomScale = debounce((e) => {
  // 拿到缩放比 更新容器大小
  const ratio = Math.max(e.target.scale, window.devicePixelRatio);
  if (ratio > 1) {
    const { width, height } = s2Options
    const newWidth = Math.floor(width * ratio);
    const newHeight = Math.floor(height * ratio);

    // 内部的更新容器大小方法
    changeSheetSize(newWidth, newHeight);
  }
}, 350);
```

关闭高清适配

![preview](https://gw.alipayobjects.com/zos/antfincdn/vHvA02Vj0/Kapture%2525202021-10-19%252520at%25252014.38.53.gif)

开启高清适配

![preview](https://gw.alipayobjects.com/zos/antfincdn/Q1782WWQ3/Kapture%2525202021-10-19%252520at%25252014.36.05.gif)

[完整代码](https://github.com/antvis/S2/blob/next/packages/s2-core/src/ui/hd-adapter/index.ts)

## 自定义设备像素比

表格默认使用设备当前像素比渲染，也就是 `window.devicePixelRatio`, 如果你觉得初始渲染就很模糊，可以手动指定表格按照 2 倍设备像素比来渲染，通过 `transformCanvasConfig` 透传给底层的 [G 绘制引擎](/manual/advanced/g-plugins)

```ts
const s2Options = {
  transformCanvasConfig() {
    return {
      devicePixelRatio: 2
    }
  }
}
```
