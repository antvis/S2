---
title: 自定义排序
order: 2
---

## 简介

对表格数据行进行自定义排序，支持行头/列头排序、单行/列排序、自定义列表、函数等功能。

## 使用

通过在 [dataConfig](`https://g.antv.vision/zh/docs/api/general/S2DataConfig.zh.md`) 中传入 [sortParams](https://g.antv.vision/zh/docs/api/general/S2DataConfig#SortParams) 数据驱动

| 细分配置项名称 | 类型 | 必选  | 功能描述 |
| :-- | :-- | :-- | :--  | --- |
| sortFieldId | `string` | ✓  | 度量 Id，即要被排序的 Id |
| sortMethod | `ASC` \| `DESC` \| `asc` \| `desc` |    | 排序方式 |
| sortBy | `string[]`   || 自定义排序列表 |
| sortByMeasure | `string` |    | 按照度量值（数值）排序 |
| query | `object` |  |   筛选条件，缩小排序范围 如 ：`{city:'白山'}` |
| type | `string` |     | 组内排序用来显示icon |
| sortFunc | `(v: SortFuncParam) => Array<string>` |   |  自定义排序的function

```ts
const s2DataConfig = {
  sortParams: [
    {
      sortFieldId: 'type', sortMethod: 'DESC'
    }
  ],
  ...
};
```

## 方式

### 1. 升/降序方法（sortMethod）

支持行/列头维度，此时的升降序 **基于首字母** ，举例如下：

```ts
sortParams: [
  { sortFieldId: 'province', sortMethod: 'DESC' },
  { sortFieldId: 'type', sortMethod: 'ASC' },
]
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*gK10Qrc2XkIAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 2. 维度值列表（sortBy）

支持为 `行/列头` 设置表内相应列表，如果有嵌套，子维度则为组内排序（如下 `city` ），举例如下：

```ts
sortParams: [
  { sortFieldId: 'province', sortBy: ['吉林', '浙江'] },
  { sortFieldId: 'city', sortBy: ['舟山', '杭州', '白山', '丹东'] },
  { sortFieldId: 'type', sortBy: ['纸张', '笔'] },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*CpV-QLBbSYAAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 3. 度量值字段（sortByMeasure）

支持 `行头/列头` 根据度量值（数值）数据进行排序

#### 行/列

支持根据 `行或列` 排序，举例如下：

```ts
sortParams: [
  {
    // city 依据（ 纸张 - price ）& 降序 排序
    sortFieldId: 'city',
    sortMethod: 'DESC',
    sortByMeasure: 'price',
    query: {
      type: '纸张',
      [EXTRA_FIELD]: 'price',
    },
  },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*VtN5TbS56KAAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 行+列

支持根据 `行+列` 排序，举例如下：

```ts
sortParams: [
  {
    // type 依据（ 浙江 - 舟山 ）&（ price ） 升序 排序
    sortFieldId: 'type',
    sortMethod: 'ASC',
    sortByMeasure: 'price',
    query: {
      province: '浙江',
      city: '舟山',
      [EXTRA_FIELD]: 'price',
    },
  },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*wv2WRbiJwHkAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 4. 汇总值

`行/列头` 的非叶子节点，此时 `sortByMeasure` 为汇总虚拟字段 `$$total$$`

#### 行总计/行小计

通过 `行总计/行小计` 对列头进行排序， 举例如下：

**行总计** ：

```ts
sortParams: [
  {
    // type 依据 （ 总计 ）&（ price ）& 降序 排序
    sortFieldId: 'type',
    sortMethod: 'DESC',
    sortByMeasure: TOTAL_VALUE,
    query: {
      [EXTRA_FIELD]: 'price',
    },
  },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*6866RamqI58AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

**行小计** ：

```ts
sortParams: [
  {
    // type 依据 （ 浙江 - 小计 ）&（ price ）& 降序 排序
    sortFieldId: 'type',
    sortMethod: 'DESC',
    sortByMeasure: TOTAL_VALUE,
    query: {
      province: '浙江',
      [EXTRA_FIELD]: 'price',
    },
  },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*E9stTbHHMD4AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 列总计/列小计

通过 `列总计/列小计` 对行头进行排序，举例如下：

```ts
sortParams: [
  {
    // province 依据（ province - 小计 ）&（ 总计 - price ）& 升序 排序
    sortFieldId: 'province',
    sortMethod: 'ASC',
    sortByMeasure: TOTAL_VALUE,
    query: {
      [EXTRA_FIELD]: 'price',
    },
  }
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*WYC4Ro1iitAAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

当有 `列小计` 时，在 `query` 中增加相应的参数获取相应的单元格，同上 `行小计`

### 5. 自定义方法（sortFunc）

`sortFunc` 会根据当前条件返回 `SortFuncParam` 参数，支持 `维度值` 和 `度量值` 两种方式

| 细分配置项名称 | 类型 | 必选  | 功能描述 |
| :-- | :-- | :-- | :--  | --- |
| sortFieldId | `string` | ✓  | 度量 Id，即要被排序的 Id |
| sortMethod | `ASC` \| `DESC` \| `asc` \| `desc` |    | 排序方式 |
| sortBy | `string[]`   || 自定义排序列表 |
| sortByMeasure | `string` |    | 按照度量值（数值）排序 |
| query | `object` |  |   筛选条件，缩小排序范围 如 ：`{city:'白山'}` |
| type | `string` |     | 组内排序用来显示icon |
| data | `Array<string | Record<string, any>>` |  | 当前排序数据列表

#### 维度值（行/列头）

支持维度值自定义，即行头或列头，举例如下：

```ts
sortParams: [
  {
    // sortFieldId 为维度值时，params.data 为维度值列表
    sortFieldId: 'province',
    sortFunc: (params) => {
      const { data } = params;
      return (data as string[])?.sort((a, b) => a?.localeCompare(b));
    },
  },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*iL0lTZE3ka4AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 度量值（数值）

支持度量值自定义，即数值，举例如下：

```ts
sortParams: [
  {
    // sortFieldId 为度量值时，需传入 query 定位数值列表，params.data 为带有度量值的 data 列表
    sortFieldId: 'city',
    sortByMeasure: 'price',
    sortFunc: function (params) {
      const { data, sortByMeasure, sortFieldId } = params || {};
      return data
        ?.sort((a, b) => b[sortByMeasure] - a[sortByMeasure])
        ?.map((item) => item[sortFieldId]);
    },
    query: { type: '纸张', [EXTRA_FIELD]: 'price' },
  },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*VtN5TbS56KAAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

## 优先级

1. `sortParams` 里的条件优先级高于原始数据
2. `sortParams` 多个 `item` ：按照顺序优先级，排在后面的优先级高
3. `item` 中多个条件：`sortByMeasure` > `sortFunc` > `sortBy` > `sortMethod`
