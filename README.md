<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](./README.en-US.md)

<h1 align="center">[WIP]S2</h1>

<div align="center">

数据驱动的多维分析表格。

🚧 激情建设中。.. 详见 [Roadmap for S2](https://github.com/antvis/S2/discussions/258)

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2.svg" alt="version">
  </a>
   <a href="https://github.com/antvis/S2/actions/workflows/test.yml" target="_blank">
    <img src="https://github.com/antvis/S2/actions/workflows/test.yml/badge.svg" alt="ci test status"/>
  </a>
  <a href="https://codecov.io/gh/antvis/S2" target="_blank">
    <img src="https://codecov.io/gh/antvis/S2/branch/master/graph/badge.svg" alt="Coverage"/>
  </a>
  <a href="https://david-dm.org/antvis/s2" target="_blank">
    <img src="https://status.david-dm.org/gh/antvis/S2.svg" alt="dependencies"/>
  </a>
  <a href="https://david-dm.org/antvis/S2?type=dev" title="devDependencies status"><img src="https://david-dm.org/antvis/S2/dev-status.svg" alt="devDependencies"/></a>
  <a href="#" target="_blank" target="_blank">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@antv/s2?style=flat-square" alt="bundle size"/>
  </a>
  <a href="#" target="_blank" target="_blank">
    <img alt="License: MIT@AntV" src="https://img.shields.io/badge/License-MIT@AntV-yellow.svg" alt="license"/>
  </a>
</p>

</div>

S2 是 AntV 在多维交叉分析表格领域的解决方案，完全基于数据驱动的方式。通过提供底层能力库，基础组件，业务场景组件以及自由扩展的能力，让开发者基于自身场景自由选择，既能开箱即用，又能自由发挥。

<!-- ### 🏠 [Homepage](https://s2.antv.vision) -->

## ✨ 特性

1. 多维交叉分析： 告别单一分析维度，全面拥抱任意维度的自由组合分析。
2. 高性能：能支持全量百万数据下 `<8s` 渲染，也能通过局部下钻来实现秒级渲染。
3. 高扩展性：支持任意的自定义扩展（包括但不局限于布局，样式，交互，数据 hook 流等）。
4. 开箱即用：提供不同分析场景下开箱即用的 react 表组件及配套分析组件，只需要简单的配置即可轻松实现复杂场景的表渲染。
5. 可交互：支持丰富的交互形式（单选、圈选、行选、列选、冻结行头、宽高拖拽，自定义交互等）

## 📦 安装

```bash
npm install @antv/s2
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
const s2options = {
  width: 800,
  height: 600,
}
```

### 3. 渲染

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css'

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2options)

s2.render()
```

### 4. 结果

![result](https://gw.alipayobjects.com/zos/antfincdn/vCukbtVNvl/616f7ef1-e626-4225-99f8-dc8f6ca630dd.png)

## Author

👤 [**@AntV**](https://github.com/orgs/antvis/people)

## 🤝 参与贡献

```bash
git clone git@github.com:antvis/S2.git

cd s2

yarn

yarn core:start
```

## 📄 License

MIT@[AntV](https://github.com/antvis).
