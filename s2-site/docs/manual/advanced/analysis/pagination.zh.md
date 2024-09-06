---
title: 分页
order: 11
tag: Updated
---

<Badge>@antv/s2-react</Badge> <Badge>@antv/s2-react-components</Badge> <Badge type="success">@antv/s2-vue</Badge>

<embed src="@/docs/common/pagination.zh.md"></embed>

### 在 React 中使用

:::info{title="提示"}

`@antv/s2-react` 提供 `usePagination` hook, 可以结合任意分页组件使用，如 [Ant Design Pagination](https://ant.design/components/pagination-cn/) 组件。

:::

```tsx
import React from 'react'
import { SheetComponent, usePagination } from '@antv/s2-react'
import { Pagination } from 'antd'

const s2Options = {
  pagination: {
    current: 1,
    pageSize: 4,
  }
}

function App() {
  const s2Ref = React.useRef()
  // 处理分页器和 S2 分页渲染的逻辑
  const pagination = usePagination(s2Ref.current);

  return (
    <>
      <SheetComponent options={s2Options} ref={s2Ref} />
      <Pagination
        size="small"
        defaultCurrent={1}
        showSizeChanger
        {...pagination}
      />
    </>
  )
}
```

<Playground path='react-component/pagination/demo/pivot.tsx' rid='container'></playground>

### 在 Vue 中使用

:::info{title="提示"}

`@antv/s2-vue` 使用的是 [Ant Design Vue](https://antdv.com/components/pagination) 分页组件，支持 [透传 API](https://antdv.com/components/pagination#API), 需要修改样式直接通过 CSS 覆盖即可。

:::

```tsx
import { SheetComponent } from '@antv/s2-vue'

const s2Options = {
  // https://antdv.com/components/pagination#API
  pagination: {}
}

<SheetComponent :options={s2Options} />

```

[Demo 地址](https://codesandbox.io/embed/nice-dijkstra-hzycy6?fontsize=14&hidenavigation=1&theme=dark)

#### API

```tsx
<SheetComponent showPagination />
```

| 参数 | 说明 | 类型 | 默认值 | 必选 |
|-----|-----|-----|-----|-----|
| showPagination   |   是否显示默认分页<br>（只有在 `options` 配置过 `pagination` 属性才会生效）   |  `boolean`   |   `{  onShowSizeChange?: (pageSize: number) => void, onChange?: (current: number) => void }` | `false`  |
