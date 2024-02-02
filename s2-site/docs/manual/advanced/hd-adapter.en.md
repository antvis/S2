---
title: HD Adapter
order: 7
---

S2 is based on `Canvas` rendering. In the actual development of business scenarios, we found that the following usage scenarios will lead to **blurred table rendering**

1. Switch back and forth between devices with different `DPR` : such as a mac (retina screen), an external monitor (ordinary 2k screen), and move the browser to the external device to view
2. Use the `mac` touchpad to zoom the page: double-finger zoom, to zoom in on the display, instead of the traditional `cmd` + `+` , `cmd` + `-` to zoom the browser window size

HD adaptation is enabled by default and can be manually disabled

```ts
const s2Options = {
  hd: false
}
```

First look at the comparison chart before and after opening

Turn off HD adaptation

<img src="https://gw.alipayobjects.com/zos/antfincdn/mc5rt%24aNB/128c0063-67a5-4d06-a5a5-fe5f341fa94e.png" width="600" alt="preview">

Turn on HD adaptation

<img src="https://gw.alipayobjects.com/zos/antfincdn/TtuUHO%26Pb/d32dc287-af59-4b1c-ba7d-17dacd4ffa24.png" width="600" alt="preview">

## Switch between different DPR devices

For this scenario, we use [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to monitor DPR changes and update the size of the `canvas` to achieve high-definition effects

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

## Mac touchpad pinch to zoom

Different from the browser's zoom in and zoom out, ordinary `resize` events cannot be triggered

![preview](https://gw.alipayobjects.com/zos/antfincdn/gBRpqwZkj/a14f1e5a-540e-4bb8-a6a4-2ff693542296.png)

```ts
// 触控板双指缩放 无法触发
window.addEventListener('resize', ...)
```

Ordinary browser window zoom in and out

![preview](https://gw.alipayobjects.com/zos/antfincdn/%24vCHFUDnZ/Kapture%2525202021-10-19%252520at%25252014.24.19.gif)

touchpad pinch zoom

![preview](https://gw.alipayobjects.com/zos/antfincdn/ZDSjxFBGd/Kapture%2525202021-10-19%252520at%25252014.27.00.gif)

So what if it is solved? The answer is to use the [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport) , `VisualViewport` can be used as a pinch zoom monitor on the mobile terminal, and it is also applicable to the `mac 触控板`

```ts
window.viewport?.visualViewport?.addEventListener(
&nbsp;&nbsp;'resize',
&nbsp;&nbsp;this.renderByZoomScale,
);

const&nbsp;renderByZoomScale&nbsp;=&nbsp;debounce((e)&nbsp;=>&nbsp;{
&nbsp;&nbsp;//&nbsp;拿到缩放比&nbsp;更新容器大小
&nbsp;&nbsp;const&nbsp;ratio&nbsp;=&nbsp;Math.max(e.target.scale,&nbsp;window.devicePixelRatio);
&nbsp;&nbsp;if&nbsp;(ratio&nbsp;>&nbsp;1)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;{&nbsp;width,&nbsp;height&nbsp;}&nbsp;=&nbsp;s2Options
&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;newWidth&nbsp;=&nbsp;Math.floor(width&nbsp;*&nbsp;ratio);
&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;newHeight&nbsp;=&nbsp;Math.floor(height&nbsp;*&nbsp;ratio);

&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;内部的更新容器大小方法
&nbsp;&nbsp;&nbsp;&nbsp;changeSheetSize(newWidth,&nbsp;newHeight);
&nbsp;&nbsp;}
},&nbsp;350);
```

Turn off HD adaptation

![preview](https://gw.alipayobjects.com/zos/antfincdn/vHvA02Vj0/Kapture%2525202021-10-19%252520at%25252014.38.53.gif)

Turn on HD adaptation

![preview](https://gw.alipayobjects.com/zos/antfincdn/Q1782WWQ3/Kapture%2525202021-10-19%252520at%25252014.36.05.gif)

[full code](https://github.com/antvis/S2/blob/next/packages/s2-core/src/ui/hd-adapter/index.ts)

## Custom Device Pixel Ratio

By default, the table is rendered using the current pixel ratio of the device, that is, `window.devicePixelRatio` . If you think the initial rendering is blurry, you can manually specify the table to render at 2 times the device pixel ratio

```ts
const s2Options = {
  devicePixelRatio: 2
}
```
