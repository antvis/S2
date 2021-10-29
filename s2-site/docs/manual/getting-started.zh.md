---
title: 快速上手
order: 1
---
## 📦 安装

### npm or yarn 安装

```bash
# npm
$ npm install @antv/s2 --save
# yarn
$ yarn add @antv/s2
```

### 浏览器引入

```html
<!-- 引入在线资源 -->
<script type="text/javascript" src="https://unpkg.com/@antv/s2@0.2.5/dist/s2.min.js"></script>
<script>
 
</script>
<!-- 下载到本地 引入本地脚本 -->
<script src="./s2.min.js"></script>
```

## 🔨 使用

创建一个基础的透视表格需要以下三个步骤：

1. 准备绘制容器。
2. 数据准备。
3. 配置项准备。
4. 创建透视表。

### 原生使用 S2

#### 1. 数据准备

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

#### 2. 配置项准备

```ts
const s2options = {
  width: 800,
  height: 600,
}
```

#### 3. 渲染

```html
<div id="container"></div>
```

```ts
import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2options);

s2.render();

```

#### 4. 结果

<playground path='basic/pivot/demo/grid.ts' rid='container' height='300'></playground>

### React 中使用 S2

S2 提供了开箱即用的 react 版本[表格组件](/zh/examples/gallery#category-表格组件)，还有配套丰富的[分析组件](/zh/examples/gallery#category-Tooltip), 帮助开发者快速满足业务看数分析需求。

使用 React 版本 S2，只有渲染这一步有所不同：

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

const container = document.getElementById('container');

ReactDOM.render(
 SheetComponent dataCfg={s2DataConfig} options={s2options} />,
      document.getElementById('container'),
);

```

## 本地开发

```shell
git clone git@github.com:antvis/S2.git

cd s2

yarn bootstrap

yarn core:start

# 网站开发

yarn site:bootstrap

yarn site:start

```
