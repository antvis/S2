<h1 align="center">@antv/s2-react</h1>

<div align="center">

数据驱动的多维分析表格 (React 版本)。

<p>
 <a href="https://www.npmjs.com/package/@antv/s2-react" title="npm">
    <img src="https://img.shields.io/npm/dm/@antv/s2-react.svg" alt="npm"/>
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2-react" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2-react/latest.svg" alt="latest version">
  </a>
  <a href="https://www.npmjs.com/package/@antv/s2-react" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@antv/s2-react/beta.svg" alt="beta version">
  </a>
   <a href="https://github.com/antvis/S2/actions/workflows/test.yml" target="_blank">
    <img src="https://github.com/antvis/S2/actions/workflows/test.yml/badge.svg" alt="ci test status"/>
  </a>
</p>

</div>

## 📦 安装

```bash
$ npm install @antv/s2-react
# yarn add @antv/s2-react
```

## 🔨 使用

### 1. 数据准备

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
      city: '丹东',
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
      city: '丹东',
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
};
```

</details>

### 2. 配置项准备

```ts
const s2Options = {
  width: 600,
  height: 600,
}
```

### 3. 渲染

```html
<div id="container"></div>
```

```ts
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

### 4. 结果

![result](https://gw.alipayobjects.com/zos/antfincdn/vCukbtVNvl/616f7ef1-e626-4225-99f8-dc8f6ca630dd.png)
