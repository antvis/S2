---
title: 快速上手
order: 1
---
## 📦 安装

```bash
$ npm install @antv/s2
# yarn add @antv/s2
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
const s2options = {
  width: 800,
  height: 600,
}
```

### 3. 渲染

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css'

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2options)

s2.render()
```

### 4. 结果

<playground path='basic/pivot/demo/grid.ts' rid='container' height='300'></playground>

### 本地开发

```shell
git clone git@github.com:antvis/S2.git

cd s2

yarn bootstrap

yarn core:start
```
