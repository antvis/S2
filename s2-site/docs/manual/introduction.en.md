---
title: Introduction
order: 0
redirect_from:
 - /en/docs/manual
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

## ❓ What is S2

[S2](https://github.com/antvis/s2) It is a data-driven table visualization engine for the visual analysis field. "S" is taken from the two "S"s of "SpreadSheet", and "2" represents the two dimensions of row and column in the pivot table. Designed to provide beautiful, easy-to-use, high-performance, and easily extensible multidimensional tables.

![demos](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

## ✨ Features

1. Out-of-the-box: Provides out-of-the-box use in different scenarios`React`,`Vue3` Table components and supporting analysis components can easily implement complex scenarios with simple configuration.
2. Multidimensional cross analysis: Say goodbye to a single analysis dimension, and fully embrace the free combination analysis of any dimension.
3. High performance: can support full millions of data`<4s` Rendering can also achieve second-level rendering through local drill-down.
4. High extensibility: support any custom extension (including but not limited to layout, style, interaction, data flow, etc.).
5. Friendly interaction: support rich interactive forms (single selection, circle selection, row selection, column selection, frozen row header, width and height drag and drop, custom interaction, etc.)

## 📦 Install

```bash
npm install @antv/s2
```

## 🔨 use

### 1. Data Preparation

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
      city: "长春",
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
      city: "长春",
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
      city: "长春",
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
      city: "长春",
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

### 2. Configuration item preparation

```ts
const s2Options = {
  width: 600,
  height: 600
}
```

### 3. Rendering

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.render();
```

### 4. Results

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*Ln3cTY_Rk1cAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

## 📦 version

<embed src="@/docs/common/packages.en.md"></embed>

## 👤 Author

[**@AntV**](https://github.com/orgs/antvis/people)

## 🤝 Contribute

```bash
git clone git@github.com:antvis/S2.git

cd S2

# install dependencies
yarn # or yarn bootstrap

# debug s2-core
yarn core:start

# debug s2-react
yarn react:playground

# debug s2-vue
yarn vue:playground

# unit test
yarn test

# Visually debug unit tests
yarn core:start

# Bale
yarn build

# Code style and type checking
yarn lint

# Start the official website locally
yarn site:bootstrap
yarn site:start
```

## 📧 Contact us

<img style="width: 300px; height: auto" alt="S2" src="https://gw.alipayobjects.com/zos/antfincdn/2zjO70QLdp/7939a108-930c-42a9-a0d3-fbfdc2cc44cf.jpg"></a>

## 👬 Contributors

![https://github.com/antvis/s2/graphs/contributors](https://contrib.rocks/image?repo=antvis/s2)

## 📄 License

MIT@[AntV](https://github.com/antvis).
