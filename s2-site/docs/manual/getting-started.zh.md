---
title: 快速上手
order: 0
redirect_from:
  - /zh/docs/manual
---

# 简介

**特设功能：**

- ✨ 丰富的交互形式（单选、圈选、行选、列选、隐藏、冻结行头、宽高拖拽，自定义交互等）；
- 🌈 极致的性能体验，支持 1w 行 x 2w 列 不卡顿，[性能对比](https://yuque.antfin-inc.com/docs/share/f0f9379c-cb33-43a5-b25f-cb6badc5ed9c?#)；
- 🎨 支持组内排序、高级排序；
- 📦 支持丰富条件格式（文本、背景色、数据条、图标）；
- 🛡 支持主题样式配置、树状下钻、明细模式、分页等；
- ⚙️ 支持高度的自定义扩展能力（大部分模块都可自定义）

**高级功能：**

- ✂️ 提供整个声明周期流程各个节点 Hook 的能力
- ⛓ 提供不同级别的核心类的抽象定制能力

### 安装

```typescript

```

### 快速上手

首先需要准备一个表挂载的容器 DOM 容器

```typescript
<div id="container"></div>
```

> 准备一份数据(csv 或者对象数组) [tableau-supermarket.csv](https://yuque.antfin.com/attachments/lark/0/2020/csv/60482/1605680236717-717d8db6-6a0c-4cae-bcc7-461e747cfe74.csv?_lake_card=%7B%22uid%22%3A%221599480259267-0%22%2C%22src%22%3A%22https%3A%2F%2Fyuque.antfin.com%2Fattachments%2Flark%2F0%2F2020%2Fcsv%2F60482%2F1605680236717-717d8db6-6a0c-4cae-bcc7-461e747cfe74.csv%22%2C%22name%22%3A%22tableau-supermarket.csv%22%2C%22size%22%3A141746%2C%22type%22%3A%22text%2Fcsv%22%2C%22ext%22%3A%22csv%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%22Aj2sj%22%2C%22refSrc%22%3A%22https%3A%2F%2Fyuque.antfin.com%2Fattachments%2Flark%2F0%2F2020%2Fcsv%2F60482%2F1599480259521-6b702e95-b60a-4813-9719-8b8e19336d22.csv%22%2C%22card%22%3A%22file%22%7D)

#### 组件方式引入

```typescript
import { dsvFormat } from 'd3-dsv'; // 格式化csv格式数据为对象数组

// 1、获取原始数据
const data = dsvFormat(',').parse(文件数据流)
// 2、数据相关配置
const dataCfg = {
   fields: {
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit', 'count']
    },
    meta: [
      {
        field: 'count',
        name: '销售个数',
        formatter: (v) => v
      },
      {
        field: 'profit',
        name: '利润',
        formatter: (v) => v
      },
    ],
    data,
}

// 3、渲染参数相关配置
const options = {
  width: 800,
  height: 660,
  hierarchyType: 'grid',
  showSeriesNumber: true,
  mode: 'pivot',
  valueInCols: true,
  style: {
    treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'compact'
      },
      cellCfg: {
        height: 32
      },
      device: 'pc'
  }
}

// 4、准备底层表实体
const getSpreadSheet = (dom: string | HTMLElement, dataCfg: DataCfg, options: SpreadsheetOptions) => {
  return new SpreadSheet(dom, dataCfg, options);
};

// 5、开始渲染表
ReactDOM.render(
<reactComponent
        dataCfg={dataCfg}
        options={options}
        spreadsheet={getSpreadSheet}
      />,
       ’#container‘);


```

#### 库方式引入

与[组件引入方式](#UWOYd)只有第四、五步不同

```typescript
import { SpreadSheet } from '';

// 4、根据配置创建表实例
const spreadsheet = new SpreadSheet('container', dataCfg, options);

// 5、开始渲染
spreadsheet.render();
```

#### 最终渲染样式

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/60482/1599481177077-35d79073-067f-480b-b7bb-205960225eae.png#align=left&display=inline&height=433&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1082&originWidth=1748&size=188209&status=done&style=none&width=699)

### 本地开发

```shell
Mac
# 安装依赖
$ tnpm install

# 运行测试用来，时时调试
$ tnpm run test-live

Windows
# 安装依赖
$ tnpm install
# 跨平台环境
$ tnpm install cross-env

# 运行测试用来
$ tnpm run test-live
在test-live script 前加上 cross-env
```
