---
title: 表格自适应
order: 9
---

<Badge>@antv/s2</Badge> <Badge>@antv/s2-react</Badge> <Badge type="success">@antv/s2-vue</Badge>

S2 默认根据配置的 `width` 和 `height` 进行渲染：

```ts
const s2Options = {
  width: 600,
  height: 400,
}
```

:::warning{title="注意"}
表格基于 `Canvas` 渲染，配置的宽高其实就是设置 `<canvas/>` 的 `width` 和 `height`, 也就是意味着 `100%`, `80vw` 之类的配置是**不生效的**：

```ts
const s2Options = {
  width: '100%', // ❌
  height: '20vh',// ❌
}
```

:::

![preview](https://gw.alipayobjects.com/zos/antfincdn/WmM9%24SLfu/2396a53f-8946-497a-9e68-fd89f01077ff.png)

### 窗口自适应

如果想让表格撑满整个父容器，可以监听窗口的 `resize` 事件，或使用 [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 监听容器大小变化，然后更新表格宽高

<Playground path="layout/adaptive/demo/window-adaptation.ts" rid='window-adaptation' height='300'></playground>

```ts
import { PivotSheet } from '@antv/s2'
import { debounce } from 'lodash'

const s2 = new PivotSheet(...)

const debounceRender = debounce(async (width, height) => {
  s2.changeSheetSize(width, height)
  await s2.render(false) // 不重新加载数据
}, 200)

const resizeObserver = new ResizeObserver(([entry] = []) => {
  const [size] = entry.borderBoxSize || [];
  debounceRender(size.inlineSize, size.blockSize)
})

// 通过监听 document.body 来实现监听窗口大小变化
resizeObserver.observe(document.body);

```

![preview](https://gw.alipayobjects.com/zos/antfincdn/8kmgXX%267U/Kapture%2525202021-11-23%252520at%25252017.59.16.gif)

​📊 查看 [窗口自适应 demo](/examples/layout/adaptive#window-adaptation)

### 容器自适应

如果是容器本身大小发生改变，而不是窗口，那么可以使用 [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 获取到实时的容器大小

<Playground path="layout/adaptive/demo/container-adaptation.ts" rid='container-adaptation' height='300'></playground>

```ts
import { PivotSheet } from '@antv/s2'
import { debounce } from 'lodash'

const s2 = new PivotSheet(...)

const parent = /* 你的容器节点 */

const debounceRender = debounce(async (width, height) => {
  s2.changeSheetSize(width, height)
  await s2.render(false) // 不重新加载数据
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

​📊 查看 [容器自适应 demo](/examples/layout/adaptive#container-adaptation)

### React 组件

如果是使用 `@antv/s2-react` 的方式，可以配置 `adaptive` 参数开启自适应。

<Playground path="layout/adaptive/demo/react-adaptive.ts" rid='react-adaptive' height='300'></playground>

#### Adaptive 参数类型

```ts
type Adaptive =
  | boolean
  | {
      width?: boolean;
      height?: boolean;
      getContainer?: () => HTMLElement;
    }
```

配置为 `boolean` 值时：

* true: 容器默认为内部的 `<div class=antv-s2-wrapper>`, 只有宽度自适应，高度以 options 设置的为准
* false: 宽高都以 options 设置的为准

```tsx
import { SheetComponent } from '@antv/s2-react';

<SheetComponent adaptive={true} />
<SheetComponent adaptive={false} />
```

也可以配置只对宽度或高度开启自适应，上面的配置等同于：

```tsx
import { SheetComponent } from '@antv/s2-react';

<SheetComponent adaptive={{ width: true, height: true }} />
<SheetComponent adaptive={{ width: false, height: false }} />
```

还可以自定义自适应的容器：

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

​📊 查看 [React 组件自适应 demo](/examples/layout/adaptive#react-adaptive)

### Vue 组件

如果是使用 `@antv/s2-vue` 的方式，可以配置 `adaptive` 参数开启自适应，`adaptive`参数的类型和使用方法与`@antv/s2-react`基本一致。

可以配置为 `boolean` 值：

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

也可以配置只对宽度或高度开启自适应，上面的配置等同于：

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

还可以自定义自适应的容器：

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

​📊 查看 [Vue 组件自适应 demo](https://codesandbox.io/s/vue-adaptive-demo-4pptyy?file=/src/App.vue)
