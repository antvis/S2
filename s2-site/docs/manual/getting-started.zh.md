---
title: 快速上手
order: 1
---
## 📦 安装

### npm | yarn 安装

```bash
# npm
$ npm install @antv/s2

# yarn
$ yarn add @antv/s2
```

### 浏览器引入

```html
<!-- 引入在线资源 -->
<script type="text/javascript" src="https://unpkg.com/@antv/s2@latest/dist/index.min.js"></script>

<!-- 下载到本地 引入本地脚本 -->
<script src="./dist/index.min.js"></script>
```

如需兼容`IE`，需要自行引入 `polyfill` 兼容。

## 🔨 使用

创建 `S2` 表格有两种方式，基础类版本 `(s2-core)` 和 基于 `core` 层 封装的 `React` 版本

- core 版本：[`@antv/s2`](https://github.com/antvis/S2/tree/master/packages/s2-core)
- react 版本：[`@antv/s2-react`](https://github.com/antvis/S2/tree/master/packages/s2-react)

### 基础类

#### 1. 数据 (data) 准备

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

#### 2. 配置项准备

```ts
const s2Options = {
  width: 600,
  height: 600
}
```

#### 3. 渲染

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2Options)

s2.render()
```

#### 4. 结果

<playground path='basic/pivot/demo/grid.ts' rid='container' height='400'></playground>

#### tooltip 注意事项

`@antv/s2` 中只保留了 tooltip 的核心显隐逻辑，我们将所有 tooltip 定制化交互都迁移到了`@antv/s2-react` 中，因此如果您有 tooltip 的需求，我们强烈建议您使用`@antv/s2-react`，细节参见 [tooltip 组件使用文档](https://s2.antv.vision/zh/examples/gallery#category-Tooltip%E7%BB%84%E4%BB%B6)。

### `React` 版本

`S2` 提供了开箱即用的 `React` 版本 [表格组件](/zh/examples/gallery#category-表格组件)，还有配套丰富的 [分析组件](/zh/examples/gallery#category-Tooltip), 帮助开发者快速满足业务看数分析需求。

使用 `React` 版本 `S2`，只有渲染这一步有所不同：

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const container = document.getElementById('container');

ReactDOM.render(
  <SheetComponent
    dataCfg={s2DataConfig}
    options={s2Options}
  />,
  document.getElementById('container'),
);

```

​📊 查看 demo [React 版本透视表](/zh/examples/react-component/sheet#pivot)。

## ⌨️ 本地开发

```shell
git clone git@github.com:antvis/S2.git
cd S2

# 本地启动开发
yarn
yarn core:watch
yarn react:playground

# 本地启动官网
yarn site:bootstrap
yarn site:start
```
