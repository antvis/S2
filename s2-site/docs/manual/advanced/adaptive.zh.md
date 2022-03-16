---
title: 表格自适应
order: 9
---

表格默认根据配置的 `width` 和 `height` 渲染

```ts
const s2Options = {
  width: 600,
  height: 400,
}
```

需要注意的是，表格基于 `canvas` 渲染，配置的宽高其实就是设置 `canvas` 的 `width` 和 `height`, 也就是意味着 `100%`, `80vw` 之类的配置是不生效的

```ts
const s2Options = {
  width: '100%', // ❌
  height: '20vh',// ❌
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/WmM9%24SLfu/2396a53f-8946-497a-9e68-fd89f01077ff.png)

### 窗口自适应

如果想让表格撑满整个父容器，可以监听 窗口的 `resize` 事件，或使用 [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 监听容器大小变化，然后更新表格宽高

```ts
import { PivotSheet } from '@antv/s2'
import { debounce } from 'lodash'

const s2 = new PivotSheet(...)

const debounceRender = debounce((width, height) => {
  s2.changeSheetSize(width, height)
  s2.render(false) // 不重新加载数据
}, 200)

window.addEventListener('resize', () => {
  const parent = /* 你的容器节点 */
  const { width, height } = parent.getBoundingClientRect()
  debounceRender(width, height)
})
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/8kmgXX%267U/Kapture%2525202021-11-23%252520at%25252017.59.16.gif)

### 容器自适应

如果是容器本身大小发生改变，而不是窗口，那么可以使用 [ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 获取到实时的容器大小

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

### React 组件

如果是使用 `@antv/s2-react` 的方式，可以配置 `adaptive` 参数开启自适应。

### Adaptive

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

配置为 `boolean` 值时:

true: 容器默认为内部的 container, 只有宽度自适应，高度以 options 设置的为准。
false: 宽高都以 options 设置的为准。

```tsx
import { SheetComponent } from '@antv/s2-react';

<SheetComponent adaptive={true} />
<SheetComponent adaptive={false} />
```

也可以配置只对宽度或高度开启自适应，上面的配置等同于

```tsx
import { SheetComponent } from '@antv/s2-react';

<SheetComponent adaptive={{ width: true, height: true }} />
<SheetComponent adaptive={{ width: false, height: false }} />
```

还可以自定义自适应的容器

```tsx
import { SheetComponent } from '@antv/s2-react';

const adaptiveRef = React.useRef<HTMLDivElement>();
const containerId = 'containerId';

<div
  id={containerId}
  style={{
    width: 600,
    height: 400,
  }}
  ref={ adaptiveRef }
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
