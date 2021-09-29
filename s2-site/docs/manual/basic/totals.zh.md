---
title: 小计总计
order: 5
---

## 简介

小计总计属于表的透视功能，可以給行和列分别配置小计总计

### 小计

汇总某一维度的度量值

#### 形式一：增加额外行/列

平铺模式下，給当前维度额外增加一行/列

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*hqnGSZBKnlEAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 形式二：挂靠节点

树状模式下，挂靠到当前节点所在行/列中

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*0l39T4mKRPsAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 总计

汇总所有维度的度量值，平铺模式和树状模式都需增加额外行/列

#### 1. 单度量值

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*NZUsTYZllO0AAAAAAAAAAAAAARQnAQ" width = "500"  alt="row" />
<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*YOcuTLNDYXIAAAAAAAAAAAAAARQnAQ" width = "500"  alt="row" />

#### 2. 多度量值

待放图...

## 使用

### 1. 显示配置

配置 [S2Options](/zh/docs/api/general/S2Options#total) 的 `totals` 属性来实现是否展示行列小计总计以及显示位置，类型如下：

#### Totals

object **必选**,_default：null_ 功能描述： 小计总计配置

| 参数 | 类型   | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- | --- |
| row | [Total](/zh/docs/api/general/S2Options#total) |  |  | {} | 列总计 |
| col | [Total](/zh/docs/api/general/S2Options#total) |  |  | {} | 行总计 |

#### Total

object **必选**,_default：null_ 功能描述： 小计总计算配置

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- | --- |
| showGrandTotals | boolean | ✓ |  | false | 是否显示总计 |
| showSubTotals | boolean | ✓ |  | false | 是否显示小计 |
| subTotalsDimensions | string[] | ✓ |  | [] | 小计的汇总维度 |
| reverseLayout | boolean | ✓ |  | false | 总计布局位置，默认下或右 |
|  |
| reverseSubLayout | boolean | ✓ |  | false | 小计布局位置，默认下或右 |
| label | string |  |  |  | 总计别名 |
| subLabel | string |  |  |  | 小计别名 |

```typescript
const s2options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['province'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['type'],
    },
  },
};

```

### 2. 数据传入

数据根据行/列位置以及 key 值传入，维度 key 值没有包含所有行、列的 key，举例如下：

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

#### 方式一：集合到 data 中

```typescript
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
        }
    ],
    ...
}

```

#### 方式二：传入 totalData

```typescript
const s2DataConfig = {
    data: [
        {
            province: '浙江',
            city: '杭州',
            type: '笔',
            price: '1',
        },
    ],
    totalData: [
        // 总计/总计
        {
            price: '15.5',
        }
    ],
    ...
}

```
