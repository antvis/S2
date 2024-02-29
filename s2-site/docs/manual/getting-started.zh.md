---
title: 快速上手
order: 1
tag: Updated
---

## 📦 安装

### 使用 npm 或 yarn 或 pnpm 安装

```bash
# npm
$ npm install @antv/s2@next --save

# yarn
$ yarn add @antv/s2@next

# pnpm
$ pnpm add @antv/s2@next
```

### 使用 React 或 Vue3 版本

```bash
# React
$ pnpm add @antv/s2@next @antv/s2-react@next antd @ant-design/icons

# Vue3
$ pnpm add @antv/s2@next @antv/s2-vue@next ant-design-vue@3.x

```

### 浏览器引入 <Badge type="error">不推荐</Badge>

<embed src="@/docs/common/browser.zh.md"></embed>

## 🔨 使用

### 版本

<embed src="@/docs/common/packages.zh.md"></embed>

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
<div id="container" />
```

```ts
import { PivotSheet } from '@antv/s2';

async function bootstrap() {
  const container = document.getElementById('container');

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render(); // 返回 Promise
}

bootstrap();
```

#### 4. 结果

<Playground path='basic/pivot/demo/grid.ts' rid='container' height='400'></playground>

### `React` 版本

`S2` 提供了开箱即用的 `React` 版本 [表格组件](examples/gallery#category-表格组件)
, 还有丰富的配套 [分析组件](/examples/gallery#category-Tooltip), 帮助开发者快速满足业务看数分析需求。

#### 表格组件使用

```tsx
import React from 'react';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const App = () => {
  return (
    <SheetComponent
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  )
}
```

:::warning{title='注意事项'}
`React` 版本的 `分析组件` 如：`高级排序`, `导出`, `下钻`, `Tooltip` 等组件基于 `antd` 组件库开发，如需使用，需要额外安装，并引入对应样式。

```bash
pnpm add antd @ant-design/icons
```

:::

​📊 查看 [React 版本透视表 demo](/examples/react-component/sheet#pivot)。

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

:::warning{title='注意事项'}

`Vue3` 版本的 `分析组件` 如：`高级排序`, `导出`, `下钻`, `Tooltip` 等组件基于 `ant-design-vue@3.x` 组件库开发，如需使用，需要额外安装，并引入对应样式。

```bash
pnpm add ant-design-vue@3.x
```

:::

```ts
import "@antv/s2-vue/dist/style.min.css";
```

​📊 查看 [Vue3 版本透视表 demo](https://codesandbox.io/s/s2-vue-hwg64q)。

## TypeScript

`S2` 使用 `TypeScript` 开发，提供完整的类型定义文件，配合 `VS Code` 等编辑器可以获得良好的类型提示。

## ⌨️ 本地开发

<embed src="@/docs/common/development.zh.md"></embed>
