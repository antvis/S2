<h1 align="center">@antv/s2-react</h1>

<div align="center">

数据驱动的多维分析表格 ( React 版本 )

<p>
 <a href="https://www.npmjs.com/package/@antv/s2-react" title="npm">
    <img src="https://img.shields.io/npm/dm/@antv/s2-react.svg" alt="npm" />
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2-react" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2-react/latest.svg?logo=npm" alt="latest version" />
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2-react" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2-react/next.svg?logo=npm" alt="next version" />
  </a>
   <a href="https://github.com/antvis/S2/actions/workflows/test.yml" target="_blank">
    <img src="https://github.com/antvis/S2/actions/workflows/test.yml/badge.svg" alt="ci test status" />
  </a>
</p>

</div>

## 📦 安装

```bash
$ pnpm add @antv/s2-react
# npm install @antv/s2-react --save
# yarn add @antv/s2-react
```

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

### 2. 配置项准备

<details>
  <summary>s2Options</summary>

```ts
const s2Options = {
  width: 600,
  height: 480
}
```

</details>

### 3. 渲染

```html
<div id="container" />
```

```tsx
import React from 'React'
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

### 4. 结果

![result](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*pfF8QqZuj9EAAAAAAAAAAAAADmJ7AQ/original)
