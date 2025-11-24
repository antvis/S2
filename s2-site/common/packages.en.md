---
title: Packages
order: 5
---

:::info{title="Note"}

There are three ways to create an `S2` table: the basic version `@antv/s2` and the `React` and `Vue3` versions wrapped based on `@antv/s2`:

1. Basic version `@antv/s2`: Developed based on `Canvas` and [AntV/G 6.0](https://g.antv.antgroup.com), providing basic table display/interaction capabilities.

Dependencies: None

2. React version `@antv/s2-react`: Wrapped based on `React 18` and `@antv/s2`, compatible with `React 16/17` versions, and provides supporting [analysis components (`@antv/s2-react-components`)](/manual/advanced/analysis/introduction).

Dependencies:

```json
"peerDependencies": {
  "@antv/s2": "^2.0.0",
  "react": ">=16.9.0",
  "react-dom": ">=16.9.0"
}
```

3. Vue version `@antv/s2-vue`: Wrapped based on `Vue3`, `@antv/s2`, and `ant-design-vue@3.x`. <Badge type="error">Maintenance Discontinued</Badge>

Dependencies:

```json
"peerDependencies": {
  "@antv/s2": "^2.0.0",
  "ant-design-vue": "^3.2.0",
  "vue": ">=3.x"
}
```

**In other words**, `@antv/s2` is **framework-agnostic** with **no additional dependencies**. You can use it in any framework like `Vue`, `Angular`, etc.
:::

| Package Name | Stable Version | Package Size | Downloads |
| -------- | ------ | --------- | ------ |
| [@antv/s2](https://github.com/antvis/S2/tree/next/packages/s2-core) | ![latest](https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/s2.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2.svg?logo=npm) |
| [@antv/s2-react](https://github.com/antvis/S2/tree/next/packages/s2-react) | ![latest](https://img.shields.io/npm/v/@antv/s2-react/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react@latest/dist/s2-react.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react.svg?logo=npm) |
| [@antv/s2-react-components](https://github.com/antvis/S2/tree/next/packages/s2-react-components) | ![latest](https://img.shields.io/npm/v/@antv/s2-react-components/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react-components@latest/dist/s2-react-components.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react-components.svg?logo=npm) |
| [@antv/s2-vue](https://github.com/antvis/S2/tree/next/packages/s2-vue) (Discontinued) | ![latest](https://img.shields.io/npm/v/@antv/s2-vue/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-vue@latest/dist/s2-vue.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-vue.svg?logo=npm) |

:::info{title='How to get notifications for new version releases?'}

- Subscribe to: [https://github.com/antvis/S2/releases.atom](https://github.com/antvis/S2/releases.atom) to receive notifications of new version releases.
- `Watch` the [S2 repository](https://github.com/antvis/S2), select `Custom - Releases` to receive push notifications.

![preview](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*NKYFSKFV_scAAAAAAAAAAAAADmJ7AQ/original)
:::
