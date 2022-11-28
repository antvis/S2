---
title: Quick Start
order: 1
---

## 📦 install

### npm | yarn install

```bash
# npm
$ npm install @antv/s2

# yarn
$ yarn add @antv/s2
```

### Use React or Vue3 version

```bash
# React
$ yarn add @antv/s2 @antv/s2-react

# Vue3
$ yarn add @antv/s2 @antv/s2-vue
```

### Browser introduction (deprecated)

<embed data-mdast="html" src="@/docs/common/browser.en.md"></embed>

If you need to be compatible with `IE` , you need to introduce `polyfill` compatibility.

## 🔨 use

There are three ways to create an `S2` table, the basic class version `(s2-core)` and the `React` and `Vue3` version based on the `core` layer package

<embed data-mdast="html" src="@/docs/common/packages.en.md"></embed>

### basic class

#### 1. Data preparation

s2DataConfig

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

#### 2. Configuration item preparation

```ts
const s2Options = {
  width: 600,
  height: 480
}
```

#### 3. Rendering

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.render();
```

#### 4. Results

<Playground data-mdast="html" path="basic/pivot/demo/grid.ts" rid="container" height="400"></playground>

### `React` version

`S2` provides an out-of-the-box `React` version [Table Component](/examples/react-component/sheet/#pivot), as well as a wealth of supporting [analysis components](/examples/gallery#category-Tooltip) to help developers quickly meet business analysis needs.

#### Table components use

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

#### Precautions

`React` version`分析组件`such as`高级排序`,`导出`,`下钻`, `Tooltip` and other components are developed based on `antd` component library. If you want to use it, you need to install it additionally and introduce the corresponding style

```ts
yarn add antd @ant-design/icons
```

```ts
import 'antd/dist/antd.min.css';
```

​📊 Check out the [React version pivot table demo](/examples/react-component/sheet#pivot) .

### `Vue3` version

`S2` also provides an out-of-the-box `Vue3` version of the table component to help developers quickly meet business analysis needs.

#### Table components use

```ts
// App.vue
<script lang="ts">
import type { S2DataConfig, S2Options } from '@antv/s2';
import { SheetComponent } from '@antv/s2-vue';
import { defineComponent, onMounted, reactive, ref, shallowRef } from 'vue';
import "@antv/s2-vue/dist/style.min.css";

export default defineComponent({
  setup() {
    // dataCfg 数据字段较多，建议使用 shallow, 如果有数据更改直接替换整个对象
    const dataCfg = shallowRef(s2DataConfig);
    const options: S2Options = reactive(s2Options);

    return {
      dataCfg,
      options,
    };
  },

  components: {
    SheetComponent,
  },
});
</script>

<template>
  <SheetComponent :dataCfg="dataCfg" :options="options" />
</template>
```

#### render component

```ts
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

#### Precautions

`Vue3` version`分析组件`such as:`高级排序`,`导出`,`下钻`, `Tooltip` and other components are developed based on the `ant-design-vue` component library. If you want to use it, you need to install it additionally and introduce the corresponding style

```ts
yarn add ant-design-vue
```

```ts
import "@antv/s2-vue/dist/style.min.css";
```

​📊 Check out [the Vue3 version pivot table demo](https://codesandbox.io/s/s2-vue-hwg64q) .

## ⌨️ Local development

```shell
git clone git@github.com:antvis/S2.git
cd S2

# 安装依赖
yarn
# 调试 s2-core
yarn core:start
# 调试 s2-react
yarn react:playground
# 调试 s2-vue
yarn vue:playground

# 本地启动官网
yarn site:bootstrap
yarn site:start
```
