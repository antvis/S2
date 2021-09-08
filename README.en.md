<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18">  [简体中文](./README.md) ｜
English

<h1 align="center">@antv/s2</h1>

<div align="center">

Data-driven multi-dimensional analysis table.

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2.svg">
  </a>
  <a href="https://codecov.io/gh/@antv/s2" target="_blank">
    <img src="https://codecov.io/gh/@antv/s2/branch/master/graph/badge.svg" />
  </a>
  <a href="https://david-dm.org/@antv/s2" target="_blank">
    <img src="https://david-dm.org/@antv/s2/status.svg"/>
  </a>
  <a href="#" target="_blank" target="_blank">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@antv/s2?style=flat-square"/>
  </a>
  <a href="#" target="_blank" target="_blank">
    <img alt="License: MIT@AntV" src="https://img.shields.io/badge/License-MIT@AntV-yellow.svg" />
  </a>
  <a href="https://github.com/antvis/S2/actions" target="_blank">
    <img src="https://github.com/antvis/S2/workflows/CI/badge.svg" />
  </a>
</p>

</div>

S2 is a solution in multi-dimensional cross-analysis tables, which provides data-driven analysis table components and analysis components.
 It fills up the vacancy in this field in the industry. By providing the core library, essential components,
demo components and free expansion capabilities allow developers to choose freely based on their real cases, which can be used out of the box and can be used freely.



<!-- ### 🏠 [Homepage](https://s2.antv.vision) -->

## ✨ Features
1. Multi-dimensional cross-analysis: Say goodbye to a single analysis dimension and fully embrace the free combination analysis of any dimension.
2. High performance: It can support rendering in less than 8s under the total amount of millions of data and achieve second-level rendering through partial drilling.
3. High scalability: Support any custom extensions (including but not limited to layout, style, interaction, data hook flow, etc.).
4. Out of the box: Provide out-of-the-box react table components and supporting analysis components in different analysis scenarios. You only need a simple configuration to realize the table rendering of complex scenes quickly.
5. High interaction: support rich interaction forms (single selection, circle selection, row selection, column selection, freeze line header, width and height dragging, custom interaction, etc.)

##  📦 Installation

```bash
$ npm install @antv/s2
```

## 🔨 Getting Started

### 1. Data Preparation

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
  },
  meta: [
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '商品类型',
    },
    {
      field: 'price',
      name: '价格',
    },
  ],
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

### 2.  Options Preparation

```ts
const s2options = {
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  mode: 'pivot',
  valueInCols: true,
}
```

### 3. Component Rendering

```html
<div id="container"></div>
```

```ts
import { SpreadSheet } from '@antv/s2';

const container = document.getElementById('container');

const s2 = new SpreadSheet(container, s2DataCfg, s2options)

s2.render()
```

### 4. 结果

![result](https://gw.alipayobjects.com/zos/antfincdn/rPTyWU7Ibr/4c7260b6-dd7b-43e7-bbdd-f27f33ed0faa.png)


## Author

👤 [**@AntV**](https://github.com/orgs/antvis/people)


## 🤝  Contributing
Contributions, issues and feature requests are welcome.
Feel free to check [issues](https://github.com/antvis/S2/issues) page if you want to contribute.


```bash
$ git clone git@github.com:antvis/S2.git

$ cd s2

$ npm run bootstrap

$ npm run core:start
```

## 📄 License

MIT@[AntV](https://github.com/antvis).
