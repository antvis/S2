<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](./README.en.md)


<h1 align="center">@antv/s2</h1>

<div align="center">

数据驱动的多维分析表格。

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

S2是一种多维交叉分析表格领域的解决方案，完全基于数据驱动的方式，弥补了行业中此领域的空缺。通过提供底层能力库，基础组件，
业务场景组件以及自由扩展的能力，让开发者基于自身场景自由选择，既能开箱即用，又能自由发挥。


<!-- ### 🏠 [Homepage](https://s2.antv.vision) -->

## ✨ 特性
1. 多维交叉分析： 告别单一分析维度，全面拥抱任意维度的自由组合分析。
2. 高性能：能支持全量百万数据下的不到8s的渲染，也能通过局部下钻来实现秒级渲染。
3. 高扩展性：支持任意的自定义扩展（包括但不局限于布局，样式，交互，数据hook流等）。
4. 开箱即用：提供不同分析场景下开箱即用的react表组件及配套分析组件，只需要简单的配置即可轻松实现复杂场景的表渲染。
5. 高交互：支持丰富的交互形式（单选、圈选、行选、列选、冻结行头、宽高拖拽，自定义交互等）

##  📦 安装

```bash
$ npm install @antv/s2
```

## 🔨 使用

### 1. 数据准备

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
      field: '商品类型',
      name: '价格',
    },
    {
      field: 'cost',
      name: '成本',
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

### 2. 配置项准备

```ts
const s2options = {
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  mode: 'pivot',
}
```

### 3. 渲染

```html
<div id="container"></div>
```

```ts
import { SpreadSheet } from '@antv/s2';

const container = document.getElementById('container');

const s2 = new SpreadSheet(container, s2DataCfg, s2options)

s2.render()
```


## Author

👤 [**@AntV**](https://github.com/antvis)


## 🤝 参与贡献

```bash
$ git clone git@github.com:antvis/S2.git

$ cd s2

$ npm run bootstrap

$ npm run core:start
```

## 📄 License

MIT@[AntV](https://github.com/antvis).
