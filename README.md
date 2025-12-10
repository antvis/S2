<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18" alt="language" /> 简体中文 | [English](./README.en-US.md)

<h1 align="center">S2</h1>

<div align="center">

开箱即用的多维可视分析表格。

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

S2 是 AntV 在多维交叉分析表格领域的解决方案，完全基于数据驱动的方式。通过提供底层能力库，基础组件，业务场景组件以及自由扩展的能力，让开发者基于自身场景自由选择，既能开箱即用，又能自由发挥。

<p align="center">
  <a href="https://s2.antv.antgroup.com/zh">简介</a> •
  <a href="https://s2.antv.antgroup.com/manual/getting-started">快速开始</a> •
  <a href="https://s2.antv.antgroup.com/zh/examples">图表示例</a> •
  <a href="https://s2.antv.antgroup.com/playground">在线体验</a>
</p>

![homepage](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

## ✨ 特性

- **多维交叉分析**：告别单一分析维度，全面拥抱任意维度的自由组合分析。
- **高性能**：能支持全量百万数据下 `<8s` 渲染，也能通过局部下钻来实现秒级渲染。
- **高扩展性**：支持任意的自定义扩展（包括但不局限于布局，样式，交互，数据 hook 流等）。
- **开箱即用**：提供不同分析场景下开箱即用的 `React`, `Vue3` 版本表组件及配套分析组件，只需要简单的配置即可轻松实现复杂场景的表渲染。
- **可交互**：支持丰富的交互形式（单选、圈选、行选、列选、冻结行头、宽高拖拽，自定义交互等）

## 🔨 快速开始

可以通过 NPM、Yarn 或者 pnpm 等包管理器来安装。

```bash
npm install @antv/s2 --save
```

```bash
yarn add @antv/s2
```

```bash
pnpm add @antv/s2
```

安装成功之后，准备一个用于渲染的 DOM 容器，然后通过 import 导入对应的 S2 API 对象。

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';

async function bootstrap() {
  const container = document.getElementById('container');

  const s2DataConfig = await fetch('https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json')
    .then(r => r.json())

  const s2 = new PivotSheet(container, s2DataConfig, {
    width: 600,
    height: 300,
  });

  await s2.render();
}

bootstrap()
```

![result](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*fod3RoX8iRwAAAAAAAAAAAAAemJ7AQ/fmt.avif)

## 📦 版本

| 包名  | 稳定版  | 包大小  | 下载量    |
| -------- | ------ | --------- | ------ |
| [@antv/s2](https://github.com/antvis/S2/tree/next/packages/s2-core)        | ![latest](https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm)  | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/s2.min.js?label=gzip%20size&compression=gzip)       | ![download](https://img.shields.io/npm/dm/@antv/s2.svg?logo=npm)       |
| [@antv/s2-react](https://github.com/antvis/S2/tree/next/packages/s2-react) | ![latest](https://img.shields.io/npm/v/@antv/s2-react/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react@latest/dist/s2-react.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react.svg?logo=npm) |
| [@antv/s2-react-components](https://github.com/antvis/S2/tree/next/packages/s2-react-components) | ![latest](https://img.shields.io/npm/v/@antv/s2-react-components/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react-components@latest/dist/s2-react-components.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react-components.svg?logo=npm) |
| [@antv/s2-vue](https://github.com/antvis/S2/tree/next/packages/s2-vue)（停止维护）| ![latest](https://img.shields.io/npm/v/@antv/s2-vue/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-vue@latest/dist/s2-vue.min.js?label=gzip%20size&compression=gzip)   | ![download](https://img.shields.io/npm/dm/@antv/s2-vue.svg?logo=npm)   |

## 🖥️ 兼容环境

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari |
| --- |  --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions |

`@antv/s2-react` 和 `@antv/s2-vue` 见官方 [React JavaScript 环境要求](https://zh-hans.reactjs.org/docs/javascript-environment-requirements.html) 和 [Vite 浏览器兼容性](https://cn.vitejs.dev/guide/build.html#browser-compatibility)

## 🙋‍♂️ 问题反馈

如果你遇到了问题，或者对 [Issues](https://github.com/antvis/S2/issues) 和 [Discussions](https://github.com/antvis/S2/discussions) 列表的问题感兴趣，**可以直接认领并尝试修复**，帮助 S2 变得更好，期待在 [贡献者列表](https://github.com/antvis/S2/graphs/contributors) 里看见你的头像。

请严格按照模版 [提交 Issue](https://github.com/antvis/S2/issues/new/choose) 或在 [Discussions](https://github.com/antvis/S2/discussions) 提问，在这之前强烈建议阅读 [《⚠️ 提 Issue 前必读》](https://github.com/antvis/S2/issues/1904)

## 🤝 参与贡献 & ⌨️ 本地开发

S2 非常需要你的共建，请阅读 [贡献指南](https://s2.antv.antgroup.com/manual/contribution) 后提交 PR.

## 👁️ 项目洞察

![Alt](https://repobeats.axiom.co/api/embed/ebb7eecb994dc0e3980044aefe43eb81302e3632.svg "Repobeats analytics image")

## 👬 贡献者们

![https://github.com/antvis/s2/graphs/contributors](https://contrib.rocks/image?repo=antvis/s2)

## 📄 License

MIT@[AntV](https://github.com/antvis)
