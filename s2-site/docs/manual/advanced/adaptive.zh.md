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
  s2.changeSize(width, height)
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
  s2.changeSize(width, height)
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

如果是使用 `@antv/s2-react` 的方式, 那么可通过配置 `adaptive` 和 `adaptiveRef` 参数实现。

| 参数            | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| adaptive        | 是否开启自适应        | `boolean`               | -      |      |
| adaptiveRef     | 表格的宽高，根据 `adaptiveRef` 绑定元素的宽高变化。 <br/>⚠️ 1. 只有当 `adaptive` 为 `true` 时，`adaptiveRef` 才生效。 <br/> 2. 不包含 `header` 和 `pagenation` 需要高度。 | `React.MutableRefObject<HTMLDivElement>` | -      |      |

// 配置 `adaptive` 和 `adaptiveRef` 后，表格会自适应 `adaptiveRef` 所绑定 `div` 的大小，并且会自动计算表格的宽高。

```tsx
import { SheetComponent } from '@antv/s2-react';

const adaptiveRef = useRef<HTMLDivElement>();

<div
  style={{
    width: 600,
    height: 400,
  }}
  ref={ adaptiveRef }
>
  <SheetComponent adaptive adaptiveRef={adaptiveRef} />
</div>
```

// 只配置 `adaptive`，表格会自适应父容器宽度，但无法自适应其高度。

```tsx
import { SheetComponent } from '@antv/s2-react';

<SheetComponent adaptive />
```
