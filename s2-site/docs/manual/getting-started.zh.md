---
title: 快速上手
order: 1
tag: Updated
---

## 📦 安装

<embed src="@/common/install.zh.md"></embed>

### 浏览器引入 <Badge type="error">不推荐</Badge>

<embed src="@/common/browser.zh.md"></embed>

## 🔨 使用

### 版本

<embed src="@/common/packages.zh.md"></embed>

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

### `React` 版本 <Badge>@antv/s2-react</Badge>

`S2` 提供了开箱即用的 `React` 版本 [表格组件](examples/gallery#category-表格组件), 帮助开发者快速满足业务看数分析需求。
还有丰富的配套 [分析组件](/examples/gallery#category-Tooltip),

#### 版本依赖

```json
"peerDependencies": {
  "@antv/s2": "^2.0.0",
  "react": ">=16.9.0",
  "react-dom": ">=16.9.0"
}
```

#### 使用

```tsx | pure
import React from 'react';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

const App = () => {
  return (
    <SheetComponent
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  )
}
```

​📊 查看 [React 版本透视表 demo](/examples/react-component/sheet#pivot)。

### `React` 版本分析组件 <Badge>@antv/s2-react-components</Badge>

`S2` 提供了配套的 [分析组件](/manual/advanced/analysis/introduction), 可以和 `@antv/s2` 或 `@antv/s2-react` 组合使用。

#### 版本依赖

```json
"peerDependencies": {
  "@ant-design/icons": ">=4.7.0",
  "@antv/s2": "^2.0.0",
  "antd": ">=4.16.13",
  "react": ">=16.9.0",
  "react-dom": ">=16.9.0"
}
```

#### 使用

```tsx
import React from 'react';
import { AdvancedSort } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

const App = () => {
  return (
    <AdvancedSort />
  )
}
```

​📊 前往 [进阶教程 - 分析组件](/manual/advanced/analysis/introduction) 了解更多。

### `Vue3` 版本 <Badge type="success">@antv/s2-vue</Badge> <Badge type="error">停止维护</Badge>

:::warning{title="注意"}
`@antv/s2-vue` 现已停止维护，由于精力投入有限，出于维护成本，包下载量等因素综合考虑，从 `2.0.0` 正式版后不再继续更新，请基于 `@antv/s2` 自行封装，或 fork 仓库进行二次开发社区版本。
:::

`S2` 同时也提供了开箱即用的 `Vue3` 版本表格组件，帮助开发者快速满足业务看数分析需求。

#### 版本依赖

```json
"peerDependencies": {
  "@antv/s2": "^2.0.0",
  "ant-design-vue": "^3.2.0",
  "vue": ">=3.x"
}
```

#### 使用

```ts
// App.vue
<script lang="ts">
import type { S2DataConfig, S2Options } from '@antv/s2';
import { SheetComponent } from '@antv/s2-vue';
import { defineComponent, onMounted, reactive, ref, shallowRef } from 'vue';
import "@antv/s2-vue/dist/s2-vue.min.css";

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

`Vue3` 版本的 `分析组件` 如：`导出`, `下钻`, `Tooltip` 等组件基于 `ant-design-vue@3.x` 组件库开发，如需使用，需要额外安装，并引入对应样式。

```bash
pnpm add ant-design-vue@3.x
```

:::

```ts
import "@antv/s2-vue/dist/s2-vue.min.css";
```

​📊 查看 [Vue3 版本透视表 demo](https://codesandbox.io/s/s2-vue-hwg64q)。

## TypeScript

`S2` 使用 `TypeScript` 开发，提供完整的类型定义文件，配合 `VS Code` 等编辑器可以获得良好的类型提示。

## ⌨️ 本地开发

<embed src="@/common/development.zh.md"></embed>
