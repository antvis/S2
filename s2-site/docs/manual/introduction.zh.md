---
title: 简介
order: 0
redirect_from:
  - /zh/docs/manual
---



![introduction](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*X_KJQZAxjKUAAAAAAAAAAAAAARQnAQ)

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
import '@antv/s2/dist/s2.min.css'

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2options)

s2.render()
```

### 4. 结果

![result](https://gw.alipayobjects.com/zos/antfincdn/vCukbtVNvl/616f7ef1-e626-4225-99f8-dc8f6ca630dd.png)

## 👤 Author

[**@AntV**](https://github.com/orgs/antvis/people)

## 🤝 参与贡献

初次使用 S2，建议从[快速上手](zh/docs/manual/getting-started)教程开始了解，如果有遇到问题或不满足的需求，可以移步至[issue](https://github.com/antvis/s2/issues) 区给我们留下建议。

提交代码前请参考我们的[贡献指南](zh/docs/manual/contribution)

```bash
git clone git@github.com:antvis/S2.git

cd s2

yarn

yarn core:start
```

## 📄 License

MIT@[AntV](https://github.com/antvis).
