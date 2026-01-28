<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18" alt="language" />  English | [简体中文](./README.zh-CN.md)

<h1 align="center">S2</h1>

<div align="center">

A practical visualization library for tabular analysis.

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" title="npm">
    <img src="https://img.shields.io/npm/dm/@antv/s2.svg" alt="npm"/>
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img src="https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm" alt="latest version">
  </a>
  <a href="https://github.com/antvis/S2/actions/workflows/test-s2.yml" target="_blank">
    <img src="https://github.com/antvis/S2/actions/workflows/test-s2.yml/badge.svg" alt="ci test status"/>
  </a>
  <a href="https://codecov.io/gh/antvis/S2" target="_blank">
    <img src="https://codecov.io/gh/antvis/S2/branch/next/graph/badge.svg" alt="test coverage"/>
  </a>
  <a href="https://github.com/antvis/S2/releases" target="_blank">
    <img src="https://img.shields.io/github/release-date/antvis/S2" alt="release date"/>
  </a>
</p>

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img src="https://img.badgesize.io/https:/unpkg.com/@antv/s2/dist/s2.min.js?label=gzip%20size&compression=gzip" alt="npm bundle size" />
  </a>
  <a href="https://github.com/antvis/S2/discussions" target="_blank">
    <img src="https://img.shields.io/badge/discussions-on%20github-blue" alt="GitHub discussions"/>
  </a>
  <a href="https://github.com/actions-cool/issues-helper" target="_blank">
    <img src="https://img.shields.io/badge/using-issues--helper-blueviolet" alt="issues helper"/>
  </a>
  <a href="https://github.com/antvis/S2/blob/next/LICENSE" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT@AntV-yellow.svg" alt="License: MIT@AntV" />
  </a>
  <a href="https://github.com/antvis/S2/graphs/contributors" target="_blank">
    <img src="https://img.shields.io/github/contributors/antvis/S2" alt="contributors"/>
  <a/>
  <a href="https://github.com/antvis/S2/issues?q=is%3Aissue+sort%3Aupdated-desc+is%3Aclosed" >
    <img src="https://img.shields.io/github/issues-closed/antvis/S2" alt="issues closed"/>
  <a/>
  <a href="https://github.com/antvis/S2/pulls" target="_blank">
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="pr welcome"/>
  <a/>
  <a href="https://deepwiki.com/antvis/S2"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>
</div>

S2 is a pure data-driven multi-dimensional cross-analysis table solution. It provides a core library, basic components, and business scenario components. With its high extensibility, developers can flexibly build complex table reports out of the box.

<p align="center">
  <a href="https://s2.antv.antgroup.com/en">Homepage</a> •
  <a href="https://s2.antv.antgroup.com/en/manual/getting-started">Getting Started</a> •
  <a href="https://s2.antv.antgroup.com/en/examples">Examples</a> •
  <a href="https://s2.antv.antgroup.com/en/playground">Live DEMO</a>
</p>

![homepage](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

## ✨ Features

- **Multi-dimensional cross-analysis**: Say goodbye to rigid analysis dimensions and embrace free combination of any dimensions.
- **High performance**: Supports rendering millions of data points in under 8 seconds, and achieves sub-second rendering for drill-downs.
- **High extensibility**: Supports custom extensions for layout, interaction, style, and data processing.
- **Out of the box**: Provides production-ready `React` and `Vue 3` components for various analysis scenarios. Simple configuration is all you need.
- **Rich interactions**: Supports various interactions like selection (single, multi, range), freezing, resizing, and custom interactive behaviors.

## 🔨 Getting Started

**Install via package manager:**

```bash
npm install @antv/s2 --save
```

```bash
yarn add @antv/s2
```

```bash
pnpm add @antv/s2
```

After installation, prepare a DOM container for rendering and import the corresponding S2 API object.

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';

async function bootstrap() {
  const container = document.getElementById('container');

  const s2DataConfig = await fetch('https://assets.antv.antgroup.com/s2/en-data-config.json')
    .then(r => r.json())

  const s2 = new PivotSheet(container, s2DataConfig, {
    width: 600,
    height: 400,
  });

  await s2.render();
}

bootstrap()
```

![result](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZWVLQJKecnkAAAAAQdAAAAgAemJ7AQ/fmt.avif)

## 📦 Packages

| Package  | Latest  | Size   | Download     |
| -------- | ------ | ----------  | ------ |
| [@antv/s2](https://github.com/antvis/S2/tree/next/packages/s2-core)        | ![latest](https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm)  | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/s2.min.js?label=gzip%20size&compression=gzip)       | ![download](https://img.shields.io/npm/dm/@antv/s2.svg?logo=npm)       |
| [@antv/s2-react](https://github.com/antvis/S2/tree/next/packages/s2-react) | ![latest](https://img.shields.io/npm/v/@antv/s2-react/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react@latest/dist/s2-react.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react.svg?logo=npm) |
| [@antv/s2-react-components](https://github.com/antvis/S2/tree/next/packages/s2-react-components) | ![latest](https://img.shields.io/npm/v/@antv/s2-react-components/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react-components@latest/dist/s2-react-components.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react-components.svg?logo=npm) |
| [@antv/s2-ssr](https://github.com/antvis/S2/tree/next/packages/s2-ssr) | ![latest](https://img.shields.io/npm/v/@antv/s2-ssr/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-ssr@latest/dist/s2-ssr.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-ssr.svg?logo=npm) |
| [@antv/s2-vue](https://github.com/antvis/S2/tree/next/packages/s2-vue)     | ![latest](https://img.shields.io/npm/v/@antv/s2-vue/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-vue@latest/dist/s2-vue.min.js?label=gzip%20size&compression=gzip)   | ![download](https://img.shields.io/npm/dm/@antv/s2-vue.svg?logo=npm)   |

## 🖥️ Browser Compatibility

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari |
| --- |  --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions |

For `@antv/s2-react` and `@antv/s2-vue`, please refer to [React JavaScript environment requirements](https://reactjs.org/docs/javascript-environment-requirements.html) and [Vite browser compatibility](https://vitejs.dev/guide/build.html#browser-compatibility).

## 👤 Author

[**@AntV**](https://github.com/orgs/antvis/people)

## 🤝 Contributing

Contributions, issues and feature requests are welcome.
Feel free to check [issues](https://github.com/antvis/S2/issues) page if you want to contribute.

> S2 uses pnpm as the package manager

```bash
git clone git@github.com:antvis/S2.git

cd S2

pnpm install # or pnpm bootstrap

# build all
pnpm build

# debug s2-core
pnpm core:start

# debug s2-react
pnpm react:playground

# debug s2-vue
pnpm vue:playground

# unit test
pnpm test

# check the code style and the type definition
pnpm lint

# start the website
pnpm site:start
```

## 👁️ Insight

![Alt](https://repobeats.axiom.co/api/embed/ebb7eecb994dc0e3980044aefe43eb81302e3632.svg "Repobeats analytics image")

## 👬 Contributors

![https://github.com/antvis/s2/graphs/contributors](https://contrib.rocks/image?repo=antvis/s2)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=antvis/S2&type=date&legend=top-left)](https://www.star-history.com/#antvis/S2&type=date&legend=top-left)

## 📄 License

MIT@[AntV](https://github.com/antvis).
