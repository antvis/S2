---
title: Introduction
order: 0
redirect_from:
 - /en/docs/manual
---

<div><p><a href="https://www.npmjs.com/package/@antv/s2" target="_blank"><img alt="Version" src="https://img.shields.io/npm/v/@antv/s2.svg"> </a><a href="https://www.npmjs.com/package/@antv/s2" target="_blank"><img alt="Version" src="https://img.shields.io/npm/v/@antv/s2/beta.svg"> </a><a href="https://github.com/antvis/S2/actions/workflows/test.yml" target="_blank"><img src="https://github.com/antvis/S2/actions/workflows/test.yml/badge.svg" alt="ci test status"> </a><a href="https://codecov.io/gh/antvis/S2" target="_blank"><img src="https://codecov.io/gh/antvis/S2/branch/next/graph/badge.svg" alt="Coverage"> </a><a href="https://github.com/antvis/S2/releases" target="_blank"><img src="https://img.shields.io/github/release-date/antvis/S2" alt="release-date"></a></p></div>

## ❓ What is S2

[S2](https://github.com/antvis/s2) is a data-driven table visualization engine for the field of visual analytics. "S" is taken from the two "S" of "SpreadSheet", and "2" represents the two dimensions of row and column in the pivot table. Aims to provide beautiful, easy-to-use, high-performance, and easy-to-extend multidimensional tables.

![demos](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

## ✨ Features

1. Out-of-the-box: Provide out-of-the-box `React` , `Vue3` table components and supporting analysis components in different scenarios, and only need simple configuration to easily implement complex scenarios.
2. Multidimensional cross-analysis: bid farewell to a single analysis dimension, fully embrace the free combination analysis of any dimension.
3. High performance: It can support `<4s` rendering with a full amount of millions of data, and can also achieve second-level rendering through partial drill-down.
4. High scalability: supports arbitrary custom extensions (including but not limited to layout, style, interaction, data flow, etc.).
5. Friendly interaction: support rich interactive forms (single selection, circle selection, row selection, column selection, frozen row header, width and height drag and drop, custom interaction, etc.)

## 📦 install

```bash
npm install @antv/s2
# yarn add @antv/s2
```

## 🔨 use

### 1. Data preparation

<details><summary>s2DataConfig</summary><pre> <code class="language-ts">const&#x26;nbsp;s2DataConfig&#x26;nbsp;=&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;fields:&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;rows:&#x26;nbsp;['province',&#x26;nbsp;'city'],
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;columns:&#x26;nbsp;['type'],
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;values:&#x26;nbsp;['price'],
&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;data:&#x26;nbsp;[
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"杭州",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"1",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"杭州",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"2",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"舟山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"17",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"舟山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"6",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"长春",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"8",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"白山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"12",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"长春",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"3",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"白山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;price:&#x26;nbsp;"25",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"杭州",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"0.5",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"杭州",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"20",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"舟山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"1.7",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"浙江",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"舟山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"0.12",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"长春",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"10",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"白山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"笔",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"9",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"长春",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"3",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province:&#x26;nbsp;"吉林",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city:&#x26;nbsp;"白山",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;"纸张",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;cost:&#x26;nbsp;"1",
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;}
&#x26;nbsp;&#x26;nbsp;]
};
</code></pre></details>

### 2. Configuration item preparation

```ts
const s2Options = {
  width: 600,
  height: 600
}
```

### 3. Rendering

```html
<div id="container" />
```

```ts
import { PivotSheet } from '@antv/s2';

async function run() {
  const container = document.getElementById('container');

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render(); // return Promise
}

run();
```

### 4. Results

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*Ln3cTY_Rk1cAAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

## 📦 version

<embed src="@/docs/common/packages.en.md"></embed>

## 👤 author

[**@AntV**](https://github.com/orgs/antvis/people)

## 🤝 Participate and contribute

<embed src="@/docs/common/development.en.md"></embed>

## 📧 Contact us

<embed src="@/docs/common/contact-us.en.md"></embed>

## 👬 Contributors

![https://github.com/antvis/s2/graphs/contributors](https://contrib.rocks/image?repo=antvis/s2)

## 📄 License

MIT@ [AntV](https://github.com/antvis) .
