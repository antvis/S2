---
title: 简介
order: 0
redirect_from:
  - /zh/docs/manual
---

<div>

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" title="npm">
    <img src="https://img.shields.io/npm/dm/@antv/s2.svg" alt="npm"/>
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img src="https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm" alt="latest version">
  </a>
   <a href="https://github.com/antvis/S2/actions/workflows/test.yml" target="_blank">
    <img src="https://github.com/antvis/S2/actions/workflows/test.yml/badge.svg" alt="ci test status"/>
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
  <a href="https://github.com/antvis/S2/blob/next/LICENSE" target="_blank" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT@AntV-yellow.svg" alt="License: MIT@AntV" />
  </a>
  <a href="https://github.com/antvis/S2/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/antvis/S2" alt="contributors"/>
  <a/>
  <a href="https://github.com/antvis/S2/issues?q=is%3Aissue+sort%3Aupdated-desc+is%3Aclosed">
    <img src="https://img.shields.io/github/issues-closed/antvis/S2" alt="issues closed"/>
  <a/>
  <a href="https://github.com/antvis/S2/pulls">
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="pr welcome"/>
  <a/>
</p>

</div>

## ❓ 什么是 S2

[S2](https://github.com/antvis/s2) 是一个面向可视分析领域的数据驱动的表可视化引擎。`S` 取自于 `SpreadSheet` 的两个 `S`，`2` 代表了透视表中的行列两个维度。旨在提供美观、易用、高性能、易扩展的多维表格。

![demos](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

## ✨ 特性

1. **开箱即用**：提供不同场景下开箱即用的 `React`, `Vue3` 表组件及配套分析组件，只需要简单的配置即可轻松实现复杂场景。
2. **多维交叉分析**： 告别单一分析维度，全面拥抱任意维度的自由组合分析。
3. **高性能**：能支持全量百万数据下 `<4s` 渲染，也能通过局部下钻来实现秒级渲染。
4. **高扩展性**：支持任意的自定义扩展（包括但不局限于布局，样式，交互，数据流等）。
5. **交互友好**：支持丰富的交互形式（单选、圈选、行选、列选、冻结行头、宽高拖拽，自定义交互等）

## 📦 安装

<embed src="@/common/install.zh.md"></embed>

## 🔨 使用

### 1. 数据准备

<details>
  <summary>s2DataConfig</summary>

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
  ],
  meta: [
    {
      field: 'price',
      name: '价格',
    },
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
      name: '类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
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
<div id="container" />
```

```ts
import { PivotSheet } from '@antv/s2';

async function bootstrap() {
  const container = document.getElementById('container');

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render(); // 异步渲染
}

bootstrap();
```

### 4. 结果

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*aTPcT4aKOq4AAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

## 📦 版本

<embed src="@/common/packages.zh.md"></embed>

### 🖥️ 浏览器兼容性

<embed src="@/common/env.zh.md"></embed>

## 🙋‍♂️ 问题反馈

如果你遇到了问题，或者对 [Issues](https://github.com/antvis/S2/issues) 和 [Discussions](https://github.com/antvis/S2/discussions) 列表的问题感兴趣，**可以直接认领并尝试修复**，帮助 S2 变得更好，期待在 [贡献者列表](https://github.com/antvis/S2/graphs/contributors) 里看见你的头像。

请严格按照模版 [提交 Issue](https://github.com/antvis/S2/issues/new/choose) 或在 [Discussions](https://github.com/antvis/S2/discussions) 提问，在这之前强烈建议阅读 [《⚠️ 提 Issue 前必读》](https://github.com/antvis/S2/issues/1904)

## ⌨️ 本地开发

<embed src="@/common/development.zh.md"></embed>

## 🤝 参与贡献

S2 非常需要你的共建，请阅读 [贡献指南](https://s2.antv.antgroup.com/manual/contribution) 后提交 PR.

## 👁️ 项目洞察

![Alt](https://repobeats.axiom.co/api/embed/ebb7eecb994dc0e3980044aefe43eb81302e3632.svg "Repobeats analytics image")

## 👬 贡献者们

![https://github.com/antvis/s2/graphs/contributors](https://contrib.rocks/image?repo=antvis/s2)

## 👤 作者

[**@AntV**](https://github.com/orgs/antvis/people)

## 📄 License

MIT@[AntV](https://github.com/antvis)
