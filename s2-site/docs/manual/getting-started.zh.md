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

### 使用 React 或 Vue3 版本

```bash
# React
$ yarn add @antv/s2 @antv/s2-react

# Vue3
$ yarn add @antv/s2 @antv/s2-vue
```

### 浏览器引入（不推荐）

`markdown:docs/common/browser.zh.md`

如需兼容 `IE`，需要自行引入 `polyfill` 兼容。

## 🔨 使用

创建 `S2` 表格有三种方式，基础类版本 `(s2-core)` 和 基于 `core` 层 封装的 `React` 和 `Vue3` 版本

- core 版本：[`@antv/s2`](https://github.com/antvis/S2/tree/master/packages/s2-core)
- React 版本：[`@antv/s2-react`](https://github.com/antvis/S2/tree/master/packages/s2-react)
- Vue3 版本：[`@antv/s2-vue`](https://github.com/antvis/S2/tree/master/packages/s2-vue)

### 基础类

#### 1. 数据 (data) 准备

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
  ]
};
```

</details>

#### 2. 配置项准备

```ts
const s2Options = {
  width: 600,
  height: 480
}
```

#### 3. 渲染

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.render();
```

#### 4. 结果

<playground path='basic/pivot/demo/grid.ts' rid='container' height='400'></playground>

### `React` 版本

`S2` 提供了开箱即用的 `React` 版本 [表格组件](/zh/examples/gallery#category-表格组件), 还有丰富的配套 [分析组件](/zh/examples/gallery#category-Tooltip), 帮助开发者快速满足业务看数分析需求。

#### 表格组件使用

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

#### 注意事项

`React` 版本的 `分析组件` 如：`高级排序`, `导出`, `下钻`,`Tooltip` 等组件基于 `antd` 组件库开发，如需使用，需要额外安装，并引入对应样式

```ts
yarn add antd @ant-design/icons
```

```ts
import 'antd/dist/antd.min.css';
```

​📊 查看 [React 版本透视表 demo](/zh/examples/react-component/sheet#pivot)。

#### 表格移动端组件使用

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { MobileSheet } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const container = document.getElementById('container');

ReactDOM.render(
  <MobileSheet
    dataCfg={s2DataConfig}
  />,
  document.getElementById('container'),
);

```

#### 注意事项

使用移动端组件 `MobileSheet`, 将会被内置移动专用的 `options`,并且移动端存在专门的组件，与 PC 端的组件有所不同。
详情可点击 xxx todo-zc: 进行查看。

​📊 查看 [React 版本透视表移动端 demo](/zh/examples/react-component/sheet#mobile-pivot)。

### `Vue3` 版本

`S2` 同时也提供了开箱即用的 `Vue3` 版本表格组件，帮助开发者快速满足业务看数分析需求。

#### 表格组件使用

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

#### 渲染组件

```ts
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

```

#### 注意事项

`Vue3` 版本的 `分析组件` 如：`高级排序`, `导出`, `下钻`, `Tooltip` 等组件基于 `ant-design-vue` 组件库开发，如需使用，需要额外安装，并引入对应样式

```ts
yarn add ant-design-vue
```

```ts
import "@antv/s2-vue/dist/style.min.css";
```

​📊 查看 [Vue3 版本透视表 demo](https://codesandbox.io/s/s2-vue-hwg64q)。

## ⌨️ 本地开发

```shell
git clone git@github.com:antvis/S2.git
cd S2

# 安装依赖
yarn
# 调试 s2-react
yarn react:playground
# 调试 s2-vue
yarn vue:playground

# 本地启动官网
yarn site:bootstrap
yarn site:start
```
