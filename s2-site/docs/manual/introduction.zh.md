---
title: 简介
order: 0
redirect_from:
  - /zh/docs/manual
---


<div align="center">
<p>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2.svg" alt="version">
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

</div>

## ❓ 什么是 S2

[S2](https://github.com/antvis/s2) 是一个面向可视分析领域的数据驱动的表可视化引擎。"S" 取自于 "SpreadSheet" 的两个 "S"，"2" 代表了透视表中的行列两个维度。旨在提供美观、易用、高性能、易扩展的多维表格。

![demos](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

## ✨ 特性

1. 开箱即用：提供不同场景下开箱即用的 `react` 表组件及配套分析组件，只需要简单的配置即可轻松实现复杂场景。
2. 多维交叉分析： 告别单一分析维度，全面拥抱任意维度的自由组合分析。
3. 高性能：能支持全量百万数据下 `<4s` 渲染，也能通过局部下钻来实现秒级渲染。
4. 高扩展性：支持任意的自定义扩展（包括但不局限于布局，样式，交互，数据流等）。
5. 交互友好：支持丰富的交互形式（单选、圈选、行选、列选、冻结行头、宽高拖拽，自定义交互等）

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
      province: "浙江",
      city: "杭州",
      type: "笔",
      price: "1",
    },
    {
      province: "浙江",
      city: "杭州",
      type: "纸张",
      price: "2",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "笔",
      price: "17",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "纸张",
      price: "6",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "笔",
      price: "8",
    },
    {
      province: "吉林",
      city: "白山",
      type: "笔",
      price: "12",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "纸张",
      price: "3",
    },
    {
      province: "吉林",
      city: "白山",
      type: "纸张",
      price: "25",
    },
    {
      province: "浙江",
      city: "杭州",
      type: "笔",
      cost: "0.5",
    },
    {
      province: "浙江",
      city: "杭州",
      type: "纸张",
      cost: "20",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "笔",
      cost: "1.7",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "纸张",
      cost: "0.12",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "笔",
      cost: "10",
    },
    {
      province: "吉林",
      city: "白山",
      type: "笔",
      cost: "9",
    },
    {
      province: "吉林",
      city: "丹东",
      type: "纸张",
      cost: "3",
    },
    {
      province: "吉林",
      city: "白山",
      type: "纸张",
      cost: "1",
    }
  ]
};
```

</details>

### 2. 配置项准备

```ts
const s2Options = {
  width: 600,
  height: 600
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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*Ln3cTY_Rk1cAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

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
yarn core:watch
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

MIT@[AntV](https://github.com/antvis).
