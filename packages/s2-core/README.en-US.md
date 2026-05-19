<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18" alt="language" />  [简体中文](./README.md) ｜
English

<h1 align="center">S2</h1>

<div align="center">

Data-driven multi-dimensional analysis table.

<p>
  <a href="https://www.npmjs.com/package/@antv/s2" title="npm">
    <img src="https://img.shields.io/npm/dm/@antv/s2.svg" alt="npm"/>
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img src="https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm" alt="latest version">
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2" target="_blank">
    <img  src="https://img.shields.io/npm/v/@antv/s2/next.svg?logo=npm" alt="next version">
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
    <img src="https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/s2.min.js?label=gzip%20size&compression=gzip" alt="npm bundle size" />
  </a>
  <a href="https://github.com/antvis/S2/discussions" target="_blank">
    <img src="https://img.shields.io/badge/discussions-on%20github-blue" alt="GitHub discussions"/>
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

S2 is a solution in multi-dimensional cross-analysis tables, which provides data-driven analysis table components.
 It supplements multi-dimensional analysis tables in the industry. By providing the core library, essential components,
demo components and expansion capabilities, it allows developers to use it quickly and freely.

## 🏠 Homepage

![homepage](https://gw.alipayobjects.com/zos/antfincdn/6R5Koawk9L/huaban%2525202.png)

* [Homepage](https://s2.antv.antgroup.com/en)
* [Demos](https://s2.antv.antgroup.com/en/examples)

## ✨ Features

1. Multi-dimensional cross-analysis: Say goodbye to a single analysis dimension and fully embrace the free combination analysis of any dimension.
2. High performance: It can support rendering in less than 8s under the total amount of millions of data and achieve second-level rendering through partial drilling.
3. High scalability: Support any custom extensions (including but not limited to layout, style, interaction, data hook flow, etc.).
4. Out of the box: Provide out-of-the-box `React` and `Vue3` table components and supporting analysis components in different analysis scenarios. You only need a simple configuration to realize the table rendering
 of complex scenes quickly.
5. High interaction: support rich interaction forms (single selection, circle selection, row selection, column selection, freeze line header, width and height dragging, custom interaction, etc.)

## 📦 Installation

```bash
$ pnpm add @antv/s2
# yarn add @antv/s2
# npm install @antv/s2 --save
```

## 🔨 Getting Started

### 1. Data Preparation

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
      city: '长春',
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
      city: '长春',
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

### 2.  Options Preparation

```ts
const s2Options = {
  width: 600,
  height: 600,
}
```

### 3. Component Rendering

```html
<div id="container" />
```

```ts
import { PivotSheet } from '@antv/s2';

async function bootstrap() {
  const container = document.getElementById('container');

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render();
}

bootstrap()
```

### 4. Preview

![result](https://gw.alipayobjects.com/zos/antfincdn/vCukbtVNvl/616f7ef1-e626-4225-99f8-dc8f6ca630dd.png)

### 📦 Packages

| Package  | Latest  | Size   | Download     |
| -------- | ------ | ----------  | ------ |
| [@antv/s2](https://github.com/antvis/S2/tree/next/packages/s2-core)        | ![latest](https://img.shields.io/npm/v/@antv/s2/latest.svg?logo=npm)  | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2@latest/dist/s2.min.js?label=gzip%20size&compression=gzip)       | ![download](https://img.shields.io/npm/dm/@antv/s2.svg?logo=npm)       |
| [@antv/s2-react](https://github.com/antvis/S2/tree/next/packages/s2-react) | ![latest](https://img.shields.io/npm/v/@antv/s2-react/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react@latest/dist/s2-react.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react.svg?logo=npm) |
| [@antv/s2-react-components](https://github.com/antvis/S2/tree/next/packages/s2-react-components) | ![latest](https://img.shields.io/npm/v/@antv/s2-react-components/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-react-components@latest/dist/s2-react-components.min.js?label=gzip%20size&compression=gzip) | ![download](https://img.shields.io/npm/dm/@antv/s2-react-components.svg?logo=npm) |
| [@antv/s2-vue](https://github.com/antvis/S2/tree/next/packages/s2-vue)     | ![latest](https://img.shields.io/npm/v/@antv/s2-vue/latest.svg?logo=npm) | ![size](https://img.badgesize.io/https:/unpkg.com/@antv/s2-vue@latest/dist/s2-vue.min.js?label=gzip%20size&compression=gzip)   | ![download](https://img.shields.io/npm/dm/@antv/s2-vue.svg?logo=npm)   |

## 👤 Author

[**@AntV**](https://github.com/orgs/antvis/people)

## 🤝 Contributing

Contributions, issues and feature requests are welcome.
Feel free to check [issues](https://github.com/antvis/S2/issues) page if you want to contribute.

> S2 use pnpm as package manager

```bash
git clone git@github.com:antvis/S2.git

cd S2

pnpm install # or pnpm bootstrap

# build all
pnpm build

# debug s2-core
pnpm core:start

# debug s2-react
pnpm react:playground

# debug s2-vue
pnpm vue:playground

# unit test
pnpm test

# check the code style and the type definition
pnpm lint

# start the website
pnpm site:start
```

## 📧 Contact Us

<p>
  <a>
    <img width="300" height="auto" alt="DingTalk" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2VvTSZmI4vYAAAAAAAAAAAAADmJ7AQ/original">
  </a>
</p>

## 👬 Contributors

![https://github.com/antvis/s2/graphs/contributors](https://contrib.rocks/image?repo=antvis/s2)

## 📄 License

MIT@[AntV](https://github.com/antvis)
