---
title: Table adaptive
order: 9
---

The table is rendered according to the configured `width` and `height` by default:

```ts
const s2Options = {
  width: 600,
  height: 400,
}
```

It should be noted that the table is rendered based on `Canvas` , and the width and height of the configuration are actually setting the `width` and `height` of the `canvas` , which means that configurations such as `100%` , `80vw` , etc. will not take effect:

```ts
const s2Options = {
  width: '100%', // ❌
  height: '20vh',// ❌
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/WmM9%24SLfu/2396a53f-8946-497a-9e68-fd89f01077ff.png)

### window adaptive

If you want the table to fill the entire parent container, you can listen to the `resize` event of the window, or use [ResizeObserver to](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) monitor the container size change, and then update the table width and height:

```ts
import { PivotSheet } from '@antv/s2'
import { debounce } from 'lodash'

const s2 = new PivotSheet(...)

const debounceRender = debounce((width, height) => {
  s2.changeSheetSize(width, height)
  s2.render(false) // 不重新加载数据
}, 200)

new ResizeObserver(([entry] = []) => {
    const [size] = entry.borderBoxSize || [];
    debounceRender(size.inlineSize, size.blockSize)
}).observe(document.body); // 通过监听 document.body 来实现监听窗口大小变化
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/8kmgXX%267U/Kapture%2525202021-11-23%252520at%25252017.59.16.gif)

​📊 Check out the [window adaptive demo](/examples/layout/adaptive#window-adaptation)

### container adaptation

If the size of the container itself changes instead of the window, you can use [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) to get the real-time container size:

```ts
import { PivotSheet } from '@antv/s2'
import { debounce } from 'lodash'

const s2 = new PivotSheet(...)

const parent = /* 你的容器节点 */

const debounceRender = debounce((width, height) => {
  s2.changeSheetSize(width, height)
  s2.render(false) // 不重新加载数据
}, 200)

const resizeObserver = new ResizeObserver(([entry] = []) => {
  const [size] = entry.borderBoxSize || [];
  debounceRender(size.inlineSize, size.blockSize)
});

resizeObserver.observe(parent);

// 取消监听
// resizeObserver.unobserve(parent)
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/IFNNjZ862/Kapture%2525202021-11-23%252520at%25252019.07.37.gif)

​📊 View [container adaptive demo](/examples/layout/adaptive#container-adaptation)

### React components

If you use `@antv/s2-react` , you can configure the `adaptive` parameter to enable self-adaptation.

#### Adaptive parameter type

```ts
// `adaptive` 的类型 `Adaptive`
type Adaptive =
  | boolean
  | {
      width?: boolean;
      height?: boolean;
      getContainer?: () => HTMLElement;
    }
```

When configured as a `boolean` value:

* true: The container defaults to the inner `<div class=antv-s2-wrapper>` , only the width is adaptive, and the height is subject to the settings in options
* false: width and height are subject to the settings of options

```tsx
import { SheetComponent } from '@antv/s2-react';

<SheetComponent adaptive={true} />
<SheetComponent adaptive={false} />
```

It can also be configured to only enable adaptive width or height. The above configuration is equivalent to:

```tsx
import { SheetComponent } from '@antv/s2-react';

<SheetComponent adaptive={{ width: true, height: true }} />
<SheetComponent adaptive={{ width: false, height: false }} />
```

You can also customize the adaptive container:

```tsx
import { SheetComponent } from '@antv/s2-react';

const adaptiveRef = React.useRef<HTMLDivElement>();
const containerId = 'containerId';

<div
  id={containerId}
  :style="{
    width: 600,
    height: 400,
  }"
>
  <SheetComponent
    adaptive={{
      width: true,
      height: false,
      getContainer: () => adaptiveRef.current // 或者使用 document.getElementById(containerId)
    }}
  />
</div>
```

​📊 View [React component adaptive demo](/examples/layout/adaptive#react-adaptive)

### Vue components

If you use `@antv/s2-vue` , you can configure the `adaptive` parameter to enable self-adaptation. The type and usage of the `adaptive` parameter are basically the same as `@antv/s2-react` .

Can be configured as a `boolean` value:

```tsx
<template>
  <SheetComponent
    :dataCfg="your-dataCfg"
    :options="your-options"
    :adaptive="true"
  />
  <SheetComponent
    :dataCfg="your-dataCfg"
    :options="your-options"
    :adaptive="false"
  />
</template>
```

It can also be configured to only enable adaptive width or height. The above configuration is equivalent to:

```tsx
<template>
  <SheetComponent
    :dataCfg="your-dataCfg"
    :options="your-options"
    :adaptive="{ width: true, height: true }"
  />
  <SheetComponent
    :dataCfg="your-dataCfg"
    :options="your-options"
    :adaptive="{ width: false, height: false }"
  />
</template>
```

You can also customize the adaptive container:

```tsx
<script setup>
const adaptive = {
  width: true,
  height: true,
  getContainer: () => document.getElementById('containerId'),
};
</script>

<template>
  <div
    id="containerId"
    style="width:600px;height:400px"
  >
    <SheetComponent
      :dataCfg="your-dataCfg"
      :options="your-options"
      :adaptive="adaptive"
    />
  </div>
</template>
```

​📊 Check out the [Vue component adaptive demo](https://codesandbox.io/s/vue-adaptive-demo-4pptyy?file=/src/App.vue)
