---
title: 快速上手
order: 0
redirect_from:
  - /zh/docs/manual
---

## ✨ 特性

1. 多维交叉分析： 告别单一分析维度，全面拥抱任意维度的自由组合分析。
2. 高性能：能支持全量百万数据下 `<8s` 渲染，也能通过局部下钻来实现秒级渲染。
3. 高扩展性：支持任意的自定义扩展（包括但不局限于布局，样式，交互，数据 hook 流等）。
4. 开箱即用：提供不同分析场景下开箱即用的 react 表组件及配套分析组件，只需要简单的配置即可轻松实现复杂场景的表渲染。
5. 可交互：支持丰富的交互形式（单选、圈选、行选、列选、冻结行头、宽高拖拽，自定义交互等）

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
