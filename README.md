<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](./README.en-US.md)

<h1 align="center">S2</h1>

<div align="center">

数据驱动的多维分析表格。

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" title="npm">
    <img src="https://img.shields.io/npm/dm/@antv/s2.svg" alt="npm"/>
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2/latest.svg" alt="version">
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2/beta.svg" alt="version">
  </a>
   <a href="https://github.com/antvis/S2/actions/workflows/test.yml" target="_blank">
    <img src="https://github.com/antvis/S2/actions/workflows/test.yml/badge.svg" alt="ci test status"/>
  </a>
  <a href="https://codecov.io/gh/antvis/S2" target="_blank">
    <img src="https://codecov.io/gh/antvis/S2/branch/master/graph/badge.svg" alt="Coverage"/>
  </a>
  <a href="https://github.com/antvis/S2/releases" target="_blank">
    <img src="https://img.shields.io/github/release-date/antvis/S2" alt="release-date"/>
  </a>
</p>

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img alt="npm bundle size" src="https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/index.min.js?label=gzip%20size&compression=gzip" alt="bundle size"/>
  </a>
  <a href="https://github.com/antvis/S2/discussions" target="_blank">
    <img src="https://img.shields.io/badge/discussions-on%20github-blue" alt="Discussions"/>
  </a>
  <a href="https://github.com/actions-cool/issues-helper" target="_blank">
    <img src="https://img.shields.io/badge/using-issues--helper-blueviolet" alt="issues-helper"/>
  </a>
  <a href="https://github.com/antvis/S2/blob/master/LICENSE" target="_blank" target="_blank">
    <img alt="License: MIT@AntV" src="https://img.shields.io/badge/License-MIT@AntV-yellow.svg" alt="license"/>
  </a>
</p>

</div>

S2 是 AntV 在多维交叉分析表格领域的解决方案，完全基于数据驱动的方式。通过提供底层能力库，基础组件，业务场景组件以及自由扩展的能力，让开发者基于自身场景自由选择，既能开箱即用，又能自由发挥。

## 🏠 官网

![homepage](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

* [主页](https://antv-s2.gitee.io)
* [Demo 示例](https://antv-s2.gitee.io/zh/examples/gallery)

## ✨ 特性

1. 多维交叉分析： 告别单一分析维度，全面拥抱任意维度的自由组合分析。
2. 高性能：能支持全量百万数据下 `<8s` 渲染，也能通过局部下钻来实现秒级渲染。
3. 高扩展性：支持任意的自定义扩展（包括但不局限于布局，样式，交互，数据 hook 流等）。
4. 开箱即用：提供不同分析场景下开箱即用的 react 表组件及配套分析组件，只需要简单的配置即可轻松实现复杂场景的表渲染。
5. 可交互：支持丰富的交互形式（单选、圈选、行选、列选、冻结行头、宽高拖拽，自定义交互等）

## 📦 安装

```bash
$ npm install @antv/s2
# yarn add @antv/s2
```

## 🔨 使用

### 1. 数据准备

<details>
  <summary> s2DataConfig</summary>

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
  },
  data: [
     {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: '1',
    },
    {
      province: '浙江',
      city: '杭州',
      type: '纸张',
      price: '2',
    },
    {
      province: '浙江',
      city: '舟山',
      type: '笔',
      price: '17',
    },
    {
      province: '浙江',
      city: '舟山',
      type: '纸张',
      price: '0.5',
    },
    {
      province: '吉林',
      city: '丹东',
      type: '笔',
      price: '8',
    },
    {
      province: '吉林',
      city: '白山',
      type: '笔',
      price: '9',
    },
    {
      province: '吉林',
      city: '丹东',
      type: ' 纸张',
      price: '3',
    },
    {
      province: '吉林',
      city: '白山',
      type: '纸张',
      price: '1',
    },
  ],
};
```

</details>

### 2. 配置项准备

```ts
const s2Options = {
  width: 600,
  height: 600,
}
```

### 3. 渲染

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2Options)

s2.render()
```

### 4. 结果

![result](https://gw.alipayobjects.com/zos/antfincdn/vCukbtVNvl/616f7ef1-e626-4225-99f8-dc8f6ca630dd.png)

### 📦 Packages

| Package  | Latest  |  Beta | Alpha | Size | Download |
|---|---|---|---| --- | --- |
| [@antv/s2](https://github.com/antvis/S2/tree/master/packages/s2-core)  | ![latest](https://img.shields.io/npm/v/@antv/s2/latest.svg)  |  ![beta](https://img.shields.io/npm/v/@antv/s2/beta.svg) | ![alpha](https://img.shields.io/npm/v/@antv/s2/alpha.svg) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/index.min.js?label=gzip%20size&compression=gzip)  | ![download](https://img.shields.io/npm/dm/@antv/s2.svg) |
| [@antv/s2-react](https://github.com/antvis/S2/tree/master/packages/s2-react)  | ![latest](https://img.shields.io/npm/v/@antv/s2-react/latest.svg)  |  ![beta](https://img.shields.io/npm/v/@antv/s2-react/beta.svg) | ![alpha](https://img.shields.io/npm/v/@antv/s2-react/alpha.svg) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react@latest/dist/index.min.js?label=gzip%20size&compression=gzip)  | ![download](https://img.shields.io/npm/dm/@antv/s2-react.svg) |

## 👤 Author

[**@AntV**](https://github.com/orgs/antvis/people)

## 🤝 参与贡献

```bash
git clone git@github.com:antvis/S2.git

cd S2

# 安装依赖
yarn # 或者 yarn bootstrap

# 调试 s2-core
yarn core:start

# 调试 s2-react
yarn react:playground

# 单元测试
yarn test

# 打包
yarn build

# 代码风格和类型检测
yarn lint

# 本地启动官网
yarn site:bootstrap
yarn site:start
```

## 📧 联系我们

<img style="width: 300px; height: auto" alt="S2" src="https://gw.alipayobjects.com/zos/antfincdn/2zjO70QLdp/7939a108-930c-42a9-a0d3-fbfdc2cc44cf.jpg"></a>

## 👬 Contributors

![https://github.com/antvis/s2/graphs/contributors](https://contrib.rocks/image?repo=antvis/s2)

## 📄 License

MIT@[AntV](https://github.com/antvis)
