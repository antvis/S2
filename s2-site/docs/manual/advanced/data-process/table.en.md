---
title: Table
order: 2
---

This article will introduce the data flow processing process of the schedule, so that readers can understand the internal data logic of `S2` more intuitively. The data processing flow of the detailed table is simpler than that of the pivot table, mainly for filtering and sorting, and preprocessing the data.

## Raw data

The initial configuration and data are as follows:

```tsx
const dataCfg = {
    fields: {
        columns: ['city', 'type', 'sub_type', 'price'],
    },
    data: [{
        "price": 1,
        "province": "浙江省",
        "city": "杭州市",
        "type": "家具",
        "sub_type": "桌子"
    }, {
        "price": 2,
        "province": "浙江省",
        "city": "绍兴市",
        "type": "家具",
        "sub_type": "桌子"
    }, {
        "price": 3,
        "province": "浙江省",
        "city": "杭州市",
        "type": "家具",
        "sub_type": "沙发"
    }, {
        "price": 4,
        "province": "浙江省",
        "city": "绍兴市",
        "type": "家具",
        "sub_type": "沙发"
    }]
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

## Sort, filter and generate display data

If the user configures filtering and sorting, S2 will process the raw data to generate filtered and sorted display data.

For example, if the user configures the filter:

```tsx
// dataCfg
{
    filterParams: [
        {
            filterKey: 'city',
            filteredValues: ['杭州市'],
            customFilter: (row) => row['city'] === '杭州市' || row['city'] === '宁波市',
        }
    ]
}
```

This time, S2 will filter the `city` field, and only keep the records whose value is Hangzhou:

```tsx
[
    {
        "price": 1,
        "province": "浙江省",
        "city": "杭州市",
        "type": "家具",
        "sub_type": "桌子"
    }, 
    {
        "price": 3,
        "province": "浙江省",
        "city": "杭州市",
        "type": "家具",
        "sub_type": "沙发"
    },
]
```

If user configured sorting:

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

S2 will sort the `price` field in descending order, and the data will eventually become like this:

```tsx
[
    {
        "price": 3,
        "province": "浙江省",
        "city": "杭州市",
        "type": "家具",
        "sub_type": "沙发"
    },
    {
        "price": 1,
        "province": "浙江省",
        "city": "杭州市",
        "type": "家具",
        "sub_type": "桌子"
    }, 
]
```

## retrieve data

The above data will be saved in the field named `displayData` in `TableDataSet` . The original data originally passed in by the user will not be modified.

We can get it through `s2Instance.dataSet.displayData` .

At the same time, the data of a row and column can be obtained through the `s2Instance.dataSet.getCellData({ rowIndex: number; col: number; })` API. Similarly, what is obtained here is the display data after filtering and sorting.
