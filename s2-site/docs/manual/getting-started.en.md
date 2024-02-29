---
title: Quick Start
order: 1
tag: Updated
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

<embed src="@/docs/common/browser.en.md"></embed>

If you need to be compatible with `IE` , you need to introduce `polyfill` compatibility.

## 🔨 use

There are three ways to create an `S2` table, the basic class version `(s2-core)` and the `React` and `Vue3` version based on the `core` layer package

<embed src="@/docs/common/packages.en.md"></embed>

### basic class

#### 1. Data preparation

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

async function run() {
  const container = document.getElementById('container');

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render(); // return Promise
}

run();
```

#### 4. Results

<Playground path="basic/pivot/demo/grid.ts" rid="container" height="400"></Playground>

### `React` version

`S2` provides an out-of-the-box `React` version \[table component] (/examples/gallery#category-table component), as well as a wealth of supporting [analysis components](/examples/gallery#category-Tooltip) to help developers quickly meet business analysis needs.

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

<embed src="@/docs/common/development.en.md"></embed>
