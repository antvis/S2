---
title: 小计总计
order: 3
---

# 简介

小计总计属于表的透视功能，可以給行和列分别配置小计总计

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1L6EQ73xuLgAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

# 显示配置

配置 Options 的 [Totals]() 属性来实现是否展示行列小计总计以及显示位置

```typescript
const s2options = {
  // 配置小计总计
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

# 数据传入

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

## 方式一：集合到 data 中

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

## 方式二：传入 totalData

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
