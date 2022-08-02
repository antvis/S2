---
title: 分页
order: 11
---

## 简介

S2 内置提供了分页能力。本质上是前端分页，点击下一页滚动到对应行。

### 快速上手

首先需要在 `S2Options` 中配置 `pagination` 属性

`markdown:docs/common/pagination.zh.md`

<img src="https://gw.alipayobjects.com/zos/antfincdn/LVw2QOvjgW/b1563a7b-4070-4d61-a18b-6558e2c5b27b.png" width="600"  alt="preview" />

如果基于 `@antv/s2-core` 开发，需要自行引入或实现分页组件，`core` 层仅提供分页能力，参考示例

* [React](https://github.com/antvis/S2/blob/master/packages/s2-react/src/components/pagination/index.tsx)
* [Vue 3.0](https://github.com/antvis/S2/blob/master/packages/s2-vue/src/components/pagination/index.vue)

如果基于 `@antv/s2-react` 或  `@antv/s2-vue` 开发，则只需配置分页相关配置项即可开箱即用。

### SpreadsheetProps

| 参数 | 说明 | 类型 | 默认值 | 必选 |
| :-- | :-- | :-- | :-- | :-: | --- | --- | --- |
| showPagination | 是否显示默认分页<br>（只有在 `options` 配置过 `pagination` 属性才会生效） | `boolean` \| \{ <br>onShowSizeChange?: (pageSize: number) => void,<br>onChange?: (current: number) => void <br>} | `false` |  |

### React 版

> 使用的是 [Ant Design](https://ant.design/components/pagination-cn/) 分页组件，透传 `onChange` 和 `onShowSizeChange` 回调。需要修改样式直接写 CSS 覆盖即可。

<playground path='react-component/pagination/demo/pivot.tsx' rid='container'></playground>

### Vue 3.0 版

> 使用的是 [Ant Design Vue](https://antdv.com/components/pagination) 分页组件，透传 `change` 和 `showSizeChange` 回调。需要修改样式直接写 CSS 覆盖即可。

[Demo 地址](https://codesandbox.io/embed/nice-dijkstra-hzycy6?fontsize=14&hidenavigation=1&theme=dark)
