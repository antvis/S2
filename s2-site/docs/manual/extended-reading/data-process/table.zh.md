---
title: 明细表
order: 2
---

本文会介绍明细表的数据流处理过程，让读者更直观的了解 `S2` 内部数据逻辑。明细表的数据处理流程相对透视表更简单，无需数据转化和映射流程，主要是针对筛选和排序，对数据做了预处理。

![明细表](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*gkCGSrcKrZYAAAAAAAAAAAAADmJ7AQ/original)

## 原始数据

初始配置和数据如下：

```tsx
const dataCfg = {
  fields: {
    columns: ['city', 'type', 'sub_type', 'price'],
  },
  data: [
    {
      price: 1,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      price: 2,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      price: 3,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      price: 4,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '沙发',
    },
  ],
};

const options = {
    width: 800,
    height: 600
};

<SheetComponent
  dataCfg={dataCfg}
  options={options}
  sheetType="table"
/>
```

## 排序、筛选并生成展示数据

如果用户配置了筛选和排序，S2 会对原始数据进行处理，从而生成经过筛选、排序后的展示数据。

比如用户配置了筛选：

```tsx
// dataCfg
{
    filterParams: [
        {
            filterKey: 'city',
            customFilter: (row) => row['city'] === '杭州市',
        }
    ]
}
```

这次 S2 会对 `city` 字段做筛选，只保留值为杭州市的记录：

![过滤](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*vUW1TYf_1fgAAAAAAAAAAAAADmJ7AQ/original)

```tsx
[
  {
    price: 1,
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '桌子',
  },
  {
    price: 3,
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '沙发',
  },
]
```

如果用户配置了排序：

```tsx
// dataCfg
{
    sortParams: [
        {
            sortFieldId: 'price', 
            sortMethod: 'DESC' 
        }
    ]
}
```

S2 会对 `price` 字段做降序排序，数据最终变成了这样：

![排序](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZrYCQKpWGw4AAAAAAAAAAAAADmJ7AQ/original)

```tsx
[
  {
    price: 3,
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '沙发',
  },
  {
    price: 1,
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '桌子',
  },
]
```

## 获取数据

上述的数据，会被保存到 `TableDataSet` 中名为 `displayData` 的字段中。用户原来传入的原始数据并不会被修改。

我们可以通过 `s2Instance.dataSet.displayData` 获取。

同时可以可以通过 `s2Instance.dataSet.getCellData({ rowIndex: number; field: string; })` API 来获取某个行列格子的数据。同样的，这里获取的是经过筛选和排序之后的展示数据。
