---
title: Packages
order: 5
---

:::info{title="提示"}

创建 `S2` 表格有三种方式，基础类版本 `@antv/s2` 和 基于 `@antv/s2` 封装的 `React` 和 `Vue3` 版本：

1. 基础版本 `@antv/s2`: 基于 `Canvas` 和 [AntV/G 6.0](https://g.antv.antgroup.com) 开发，提供基本的表格展示/交互等能力。

版本依赖：无

2. React 版本 `@antv/s2-react`: 基于 `React 18`, 和 `@antv/s2` 封装，兼容 `React 16/17` 版本，同时提供配套的 [分析组件 (`@antv/s2-react-components`)](/manual/advanced/analysis/introduction).

版本依赖：

```json
"peerDependencies": {
  "@antv/s2": "^2.0.0",
  "react": ">=16.9.0",
  "react-dom": ">=16.9.0"
}
```

3. Vue 版本 `@antv/s2-vue`: 基于 `Vue3`, `@antv/s2` , `ant-design-vue@3.x` 封装。<Badge type="error">停止维护</Badge>

版本依赖：

```json
"peerDependencies": {
  "@antv/s2": "^2.0.0",
  "ant-design-vue": "^3.2.0",
  "vue": ">=3.x"
}
```

**也就是说** `@antv/s2` 和**框架无关**，无任何**额外依赖**, 你可以在 `Vue`, `Angular` 等任意框架中使用。
:::

| 包名  | 稳定版  | 包大小  | 下载量    |
| -------- | ------ | --------- | ------ |
| [@antv/s2](https://github.com/antvis/S2/tree/next/packages/s2-core)        | ![latest](https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm)  | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/index.min.js?label=gzip%20size&compression=gzip)       | ![download](https://img.shields.io/npm/dm/@antv/s2.svg?logo=npm)       |
| [@antv/s2-react](https://github.com/antvis/S2/tree/next/packages/s2-react) | ![latest](https://img.shields.io/npm/v/@antv/s2-react/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react@latest/dist/index.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react.svg?logo=npm) |
| [@antv/s2-react-components](https://github.com/antvis/S2/tree/next/packages/s2-react-components) | ![latest](https://img.shields.io/npm/v/@antv/s2-react-components/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react-components@latest/dist/index.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react-components.svg?logo=npm) |
| [@antv/s2-vue](https://github.com/antvis/S2/tree/next/packages/s2-vue)（停止维护）| ![latest](https://img.shields.io/npm/v/@antv/s2-vue/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-vue@latest/dist/index.min.js?label=gzip%20size&compression=gzip)   | ![download](https://img.shields.io/npm/dm/@antv/s2-vue.svg?logo=npm)   |

:::info{title='如何获取新版本发布通知？'}

- 订阅：[https://github.com/antvis/S2/releases.atom](https://github.com/antvis/S2/releases.atom) 来获得新版本发布的通知。
- `Watch` [S2 代码仓库](https://github.com/antvis/S2), 选择 `Custom - Releases` 来获取消息推送。

![preview](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*NKYFSKFV_scAAAAAAAAAAAAADmJ7AQ/original)
