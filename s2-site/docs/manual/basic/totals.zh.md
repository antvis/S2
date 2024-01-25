---
title: 小计总计
order: 5
---

## 简介

小计总计属于表的透视功能，可以给行头和列头分别配置小计总计。

### 小计

汇总某一维度的度量值

#### 形式一：增加额外行/列

平铺模式下，给当前维度额外增加一行/列

<img src="https://gw.alipayobjects.com/zos/antfincdn/sK5Rx1%26Sp/c4dcee0c-af4b-4be6-b665-c810eec78101.png" width="600" alt="row" />

<br/>

#### 形式二：挂靠节点

树状模式下，挂靠到当前节点所在行/列中

<img src="https://gw.alipayobjects.com/zos/antfincdn/Ljeww3JNa/543f1a66-51e3-4134-a2ec-83fd6a64f7d9.png" width="600" alt="row" />

<br/>

### 总计

汇总所有维度的度量值，平铺模式和树状模式都需增加额外行/列

#### 1. 单度量值

平铺：

<img src="https://gw.alipayobjects.com/zos/antfincdn/9GwQ67LQ%26/c11b6f7b-ff0a-4ce3-89e7-1eccb95719a3.png" width="600"  alt="row" />

<br/>

树状：

<img src="https://gw.alipayobjects.com/zos/antfincdn/MRc64qzqf/d77ae378-4512-45a8-b2e0-9fb7e4a19c45.png" width="600" alt="row" />

<br/>

#### 2. 多度量值

平铺：

<img src="https://gw.alipayobjects.com/zos/antfincdn/bPhcUuHCi/6cd43952-58fb-469a-b4bb-fdd142bf3317.png" width="600" alt="row" />

<br/>

树状：

<img src="https://gw.alipayobjects.com/zos/antfincdn/GekvQBQAw/8dde8830-e496-458c-b05e-bcd4f3e4bc0c.png" width="600" alt="row" />

<br/>

### 分组汇总

按维度进行 `小计/总计` 的汇总计算，用于进行某一维度的数据对比分析等。

#### 行总计/行小计分组

<Playground path='analysis/totals/demo/dimension-group-row.ts' rid='pivot-total-group-row' height='400'></playground>

<br/>

#### 列总计/列小计分组

<Playground path='analysis/totals/demo/dimension-group-col.ts' rid='pivot-total-group-col' height='400'></playground>

<br/>

## 使用

### 1. 显示配置

配置 [S2Options](/docs/api/general/S2Options#total) 的 `totals` 属性来实现是否展示行列小计总计以及显示位置，类型如下：

#### Totals

功能描述： 行/列小计总计配置

| 参数 | 说明   | 类型                                          | 默认值 | 必选 |
| ---- | ------ | --------------------------------------------- | ------ | ---- |
| row  | 列总计 | [Total](/docs/api/general/S2Options#total) |  -     |      |
| col  | 行总计 | [Total](/docs/api/general/S2Options#total) | -     |      |

#### Total

功能描述：小计总计算配置

| 参数                | 说明                     | 类型         | 默认值 | 必选 |
| ------------------- | ------------------------ | ------------ | ------ | ---- |
| showGrandTotals     | 是否显示总计             | `boolean`    | false  | ✓    |
| showSubTotals       | 是否显示小计。当配置为对象时，always 控制是否在子维度不足 2 个时始终展示小计，默认不展示。  | `boolean \| { always: boolean }`    | false  | ✓    |
| subTotalsDimensions | 小计的汇总维度           | `string[]`   | []     | ✓    |
| reverseGrandTotalsLayout       | 总计布局位置，默认下或右 | `boolean`    | false  | ✓    |
| reverseSubTotalsLayout    | 小计布局位置，默认下或右 | `boolean`    | false  | ✓    |
| label               | 总计别名                 | `string`     |        |      |
| subLabel            | 小计别名                 | `string`     |        |      |
| calcGrandTotals          | 计算总计                 | `CalcTotals` |        |      |
| calcSubTotals       | 计算小计                 | `CalcTotals` |        |      |

```ts
const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['province'],
      totalsGroupDimensions: ['city'],
      subTotalsGroupDimensions: ['type', 'sub_type'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
    },
  },
};
```

### 2. 数据

#### 1. 数据传入

数据根据行/列位置以及 `key` 值传入，维度 `key` 值没有包含所有行、列的 `key`，举例如下：

```typescript
[
  // 总计/总计
  {
    price: '15.5',
  },
  // 浙江/总计
  {
    province: '浙江',
    price: '5.5',
  },
  // 浙江-杭州/总计
  {
    province: '浙江',
    city: '杭州',
    price: '3',
  },
  // 总计/笔
  {
    type: '笔',
    price: '10',
  },
  // 浙江-小计/笔
  {
    province: "浙江",
    type: "笔",
    price: "3"
  },
]

```

##### 将总计、小计数据集合到 data 中

```ts
const s2DataConfig = {
  data: [
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: '1',
    },
    // 总计/总计
    {
      price: '15.5',
    },
  ],
  ...
}
```

#### 2. 计算出数据

可以给 `totals` 下的 `row` 、 `col` 分别配置属性 `calcGrandTotals` 、 `calcSubTotals` 来实现计算汇总数据

##### 2.1. 配置聚合方式

通过配置 `aggregation` 来实现，聚合方式目前支持 `SUM` （求和）、 `MIN` （最小值）、 `MAX` （最大值）和 `AVG` （算术平均）。 [查看示例](https://s2.antv.antgroup.com/zh/examples/analysis/totals/#calculate)

```ts
const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['province'],
      calcGrandTotals: {
        aggregation: 'SUM',
      },
      calcSubTotals: {
        aggregation: 'SUM',
      },
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
      calcGrandTotals: {
        aggregation: 'SUM',
      },
      calcSubTotals: {
        aggregation: 'SUM',
      },
    },
  },
};
```

<br/>

##### 2.2. 配置自定义方法

```ts
const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['province'],
      calcGrandTotals: {
        calcFunc: (query, data) => {},
      },
      calcSubTotals: {
        calcFunc: (query, data) => {},
      },
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
      calcGrandTotals: {
        calcFunc: (query, data) => {},
      },
      calcSubTotals: {
        calcFunc: (query, data) => {},
      },
    },
  },
};
```

### 优先级

1. 数据传入优先级高于计算数据

2. 配置自定义方法优先级大于配置聚合方式，即配置 `calcFunc > aggregation`

3. 当同一个单元格为 `行+列` 汇总值时，**优先级**为：`列总计/列小计 > 行总计/行小计`
