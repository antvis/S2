---
title: High-Definition Adaptation
order: 7
---

S2 is rendered using `Canvas`. In real-world development, we've found that the following scenarios can cause the **table to appear blurry**:

1. **Switching between devices with different `DPR` values**: For example, moving the browser from a MacBook (with a Retina display) to an external monitor (a standard 2k screen).
2. **Using pinch-to-zoom on a laptop trackpad**: Zooming in with a two-finger gesture, rather than the traditional `Cmd` + `+` or `Cmd` + `-` to resize the browser window.

High-definition adaptation is enabled by default but can be manually disabled.

```ts
const s2Options = {
  hd: false
}
```

## Comparison

With HD adaptation disabled:

<img src="https://gw.alipayobjects.com/zos/antfincdn/mc5rt%24aNB/128c0063-67a5-4d06-a5a5-fe5f341fa94e.png" width="800" alt="disable" />

With HD adaptation enabled:

<img src="https://gw.alipayobjects.com/zos/antfincdn/TtuUHO%26Pb/d32dc287-af59-4b1c-ba7d-17dacd4ffa24.png" width="800" alt="enable" />

## Switching Between Devices with Different DPRs

For this scenario, we use [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to listen for changes in the DPR and update the `canvas` size accordingly to maintain high-definition quality.

```ts
const { width, height } = s2Options;
const devicePixelRatioMedia = window.matchMedia(
  `(resolution: ${window.devicePixelRatio}dppx)`,
);

devicePixelRatioMedia.addEventListener('change', renderByDevicePixelRatio);

const renderByDevicePixelRatio = (ratio = window.devicePixelRatio) => {
  const newWidth = Math.floor(width * ratio);
  const newHeight = Math.floor(height * ratio);

  // Internal method to update the sheet size
  changeSheetSize(newWidth, newHeight);
};
```

## Pinch-to-Zoom on Laptop Trackpads

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*rmOLTLaWtGMAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

Unlike browser zooming, a standard `resize` event is not triggered by this action.

![preview](https://gw.alipayobjects.com/zos/antfincdn/gBRpqwZkj/a14f1e5a-540e-4bb8-a6a4-2ff693542296.png)

```ts
// Pinch-to-zoom on a trackpad does not trigger this
window.addEventListener('resize', ...)
```

Standard browser window zoom:

![preview](https://gw.alipayobjects.com/zos/antfincdn/%24vCHFUDnZ/Kapture%2525202021-10-19%252520at%25252014.24.19.gif)

Trackpad pinch-to-zoom:

![preview](https://gw.alipayobjects.com/zos/antfincdn/ZDSjxFBGd/Kapture%2525202021-10-19%252520at%25252014.27.00.gif)

So, how do we solve this? The answer is to use the [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport). `VisualViewport` can be used to listen for pinch-to-zoom on mobile devices, and it works for `Mac trackpads` as well.

```ts
window.visualViewport?.addEventListener(
  'resize',
  this.renderByZoomScale,
);

const renderByZoomScale = debounce((e) => {
  // Get the zoom ratio and update the container size
  const ratio = Math.max(e.target.scale, window.devicePixelRatio);
  if (ratio > 1) {
    const { width, height } = s2Options;
    const newWidth = Math.floor(width * ratio);
    const newHeight = Math.floor(height * ratio);

    // Internal method to update the sheet size
    changeSheetSize(newWidth, newHeight);
  }
}, 350);
```

With HD adaptation disabled:

![preview](https://gw.alipayobjects.com/zos/antfincdn/vHvA02Vj0/Kapture%2525202021-10-19%252520at%25252014.38.53.gif)

With HD adaptation enabled:

![preview](https://gw.alipayobjects.com/zos/antfincdn/Q1782WWQ3/Kapture%2525202021-10-19%252520at%25252014.36.05.gif)

[Full Code](https://github.com/antvis/S2/blob/next/packages/s2-core/src/ui/hd-adapter/index.ts)

## Custom Device Pixel Ratio

By default, the table renders using the device's current pixel ratio, i.e., `window.devicePixelRatio`. If you find the initial rendering to be blurry, you can manually specify a higher device pixel ratio, such as `2`, by passing it to the underlying [G rendering engine](/en/manual/advanced/g-plugins) via `transformCanvasConfig`.

```ts
const s2Options = {
  transformCanvasConfig() {
    return {
      devicePixelRatio: 2
    }
  }
}
```
