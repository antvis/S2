---
title: Pagination
order: 12
---

## Introduction

S2 provides built-in paging capability. It is essentially front-end pagination, click on the next page to scroll to the
corresponding row.

### Get started quickly

First, you need to configure the `pagination` attribute in `s2Options`

<embed src="@/docs/common/pagination.en.md"></embed>

<img src="https://gw.alipayobjects.com/zos/antfincdn/LVw2QOvjgW/b1563a7b-4070-4d61-a18b-6558e2c5b27b.png" width="600" alt="preview">

If you develop based on `@antv/s2-core` , you need to **introduce** or **implement paging components** yourself.
The `core` layer only provides paging capabilities. Refer to the example

* [React](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/pagination/index.tsx)
* [Vue 3.0](https://github.com/antvis/S2/blob/next/packages/s2-vue/src/components/pagination/index.vue)

If you develop based on `@antv/s2-react` or `@antv/s2-vue` , you only need to configure pagination-related configuration
items to use it out of the box.

### SpreadsheetProps

```tsx
<SheetComponent showPagination/>
```

| Parameter | Description | Type | Default | Required |
|-----|-----|-----|-----|-----|
| showPagination | Whether to display the default pagination<br> (only if the `pagination` attribute is configured in `options`, it will take effect) | `boolean` | `{ <br>onShowSizeChange?: (pageSize: number) => void,<br> >onChange?: (current: number) => void <br>}` | `false` |

📢 It should be noted that in the @antv/s2-react version, the type of `showPagination` is:

```ts
type ShowPagination =
  | boolean
  | {
      onShowSizeChange?: (current: number, pageSize: number) => void,
      onChange?: (current: number, pageSize: number) => void
    }
```

### React version

> The [Ant Design](https://ant.design/components/pagination-cn/) Pagination paging component is used, which
> supports [transparent transmission API](https://ant.design/components/pagination-cn/#API) . If you need to modify the
> style, you can directly override it through CSS.

```tsx
const s2Options = {
  // https://ant.design/components/pagination-cn/#API
  pagination: {}
}

<SheetComponent options={ s2Options }/>
```

<Playground path="react-component/pagination/demo/pivot.tsx" rid="container"></Playground>

### Vue version 3.0

> The [Ant Design Vue](https://antdv.com/components/pagination) paging component is used, which
> supports [transparent transmission API](https://antdv.com/components/pagination#API) . If you need to modify the
> style,
> you can directly override it through CSS.

```tsx
const s2Options = {
  // https://antdv.com/components/pagination#API
  pagination: {}
}

< SheetComponent options={ s2Options }/>
```

[demo address](https://codesandbox.io/embed/nice-dijkstra-hzycy6?fontsize=14\&hidenavigation=1\&theme=dark)
