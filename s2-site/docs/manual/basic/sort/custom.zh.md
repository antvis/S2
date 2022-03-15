---
title: 自定义排序 
order: 2
---

## 简介

对表格数据行进行自定义排序，支持行头/列头排序、单行/列排序、自定义列表、函数等功能。

## 使用

通过在 [dataConfig](`https://g.antv.vision/zh/docs/api/general/S2DataConfig.zh.md`)
中传入 [sortParams](https://g.antv.vision/zh/docs/api/general/S2DataConfig#SortParams) 数据驱动

| 参数          | 说明                                        | 类型                                  | 默认值 | 必选 |
| ------------- | ------------------------------------------- | ------------------------------------- | ------ | ---- |
| sortFieldId   | 度量 Id，即要被排序的 Id                    | `string`                              | -      | ✓   |
| sortMethod    | 排序方式                                    | `ASC` \| `DESC` \| `asc` \| `desc`  | -      |      |
| sortBy        | 自定义排序列表                              | `string[]`                            | -      |      |
| sortByMeasure | 按照度量值（数值）排序（透视表适用）        | `string`                              | -      |      |
| query         | 筛选条件，缩小排序范围 如 ：`{ city: '成都' }` | `object`                              | -      |      |
| type          | 组内排序用来显示icon（透视表适用）      | `string`                              | -      |      |
| sortFunc      | 自定义排序的function                        | `(v: SortFuncParam) => Array<string>` | -      |      |

```ts
import { EXTRA_FIELD } from "@antv/s2";

const s2DataConfig = {
    sortParams: [
        {
            sortFieldId: 'type', sortMethod: 'DESC',
            // EXTRA_FIELD 是 dataCfg.fields.values 字段的虚拟 fieldId
            query: { city: '成都', [EXTRA_FIELD]: 'price' }
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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DlG8SYEFlS8AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 2. 维度值列表（sortBy）

支持为 `行/列头` 设置表内相应列表，如果有嵌套，子维度则为组内排序（如下 `city` ），举例如下：

```ts
sortParams: [
    { sortFieldId: 'province', sortBy: [ '吉林', '浙江' ] },
    { sortFieldId: 'city', sortBy: [ '舟山', '杭州', '白山', '丹东' ] },
    { sortFieldId: 'type', sortBy: [ '纸张', '笔' ] },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*5A9lSpS6uHwAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 3. 度量值字段（sortByMeasure）

支持 `行头/列头` 根据度量值（数值）数据进行排序

#### 行/列

支持根据 `行或列` 排序，举例如下：

```ts
sortParams: [
    {
        // type 依据 浙江-舟山-price 升序 排序
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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*SZ04TIhCQwkAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*wZ4fQJ5-AsMAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 4. 汇总值

`行/列头` 的非叶子节点，此时 `sortByMeasure` 为汇总虚拟字段 TOTAL_VALUE，值为 `$$total$$`。

#### 配置数据聚合方式

1. 使用 data 数据中的聚合数据。
2. 使用 S2 总提供的聚合计算。​📊 查看文档 [小计总计配置](/zh/docs/api/general/S2Options#totals)

#### 行总计/行小计

通过 `行总计/行小计` 对列头进行排序， 举例如下：

**行小计** ：

```js
import { TOTAL_VALUE, EXTRA_FIELD } from "@antv/s2";

...

// 在 S2DataConfig 中配置
sortParams = [
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

// 在 s2Options 中配置，使用前端总计的聚合方法进行排序。如果 data 数据中存在聚合数据则使用
totals = {
  row: {
    subTotalsDimensions: [ 'province' ],
    calcSubTotals: {
      aggregation: 'SUM'
    }
  }
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*RfN8Q5IauP8AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

行总计:

```ts
import { TOTAL_VALUE, EXTRA_FIELD } from "@antv/s2";

...
sortParams = [
    {
        // 对 type 中笔和纸的总计进行 降序 排序
        sortFieldId: 'type',
        sortMethod: 'DESC',
        sortByMeasure: TOTAL_VALUE,
        query: {
            [EXTRA_FIELD]: 'price',
        },
    },
]

// data 中带有排序使用的数据时，S2 会优先使用 data 返回的数据进行排序
data = [
    {
        "type": "笔",
        "price": "38"
    },
    {
        "type": "纸张",
        "price": "36"
    }
]
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/%26pwbU6StZ/img.png" width = "600"  alt="rowTotal" />

#### 列总计/列小计

通过 `列总计/列小计` 对行头进行排序，举例如下：

```js
import { TOTAL_VALUE, EXTRA_FIELD } from "@antv/s2";

...

sortParams = [
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

totals = {
  row: {
    subTotalsDimensions: ['province'],
    calcSubTotals: {
      aggregation: 'SUM',
    },
  }
}

```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ZXBjR6fZFpQAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

当有 `列小计` 时，在 `query` 中增加相应的参数获取相应的单元格，同上 `行小计`

### 5. 自定义方法（sortFunc）

`sortFunc` 会根据当前条件返回 `SortFuncParam` 参数，支持 `维度值` 和 `度量值` 两种方式

| 参数            | 说明                                      | 类型                                  | 默认值 | 必选 |
| :------------- | :------------------------------------------ | :------------------------------------ | ------ | :--- |
| sortFieldId    | 度量 Id，即要被排序的 Id                    | `string`                              | -      | ✓    |
| sortMethod     | 排序方式                                    | `ASC` \| `DESC` \| `asc` \| `desc`    | -      |      |
| sortBy         | 自定义排序列表                              | `string[]`                            | -      |      |
| sortByMeasure  | 按照度量值（数值）排序                      | `string`                              | -      |      |
| query          | 筛选条件，缩小排序范围 如 ：`{city:'白山'}` | `object`                              | -      |      |
| type           | 组内排序用来显示icon                        | `string`                              | -      |      |
| data           | 当前排序数据列表                            | `Array<string | Record<string, any>>` | -      |      |

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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*7MLkQLxhliAAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 度量值（数值）

支持度量值自定义，即数值，举例如下：

```ts
sortParams: [
    {
        // sortFieldId 为度量值时，需传入 query 定位数值列表，params.data 为带有度量值的 data 列表
        sortFieldId: 'price',
        sortByMeasure: 'city',
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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*H_TESKL1MakAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

📊 查看demo [自定义排序](/zh/examples/analysis/sort#custom-sort-func)。

## 优先级

1. `sortParams` 里的条件优先级高于原始数据
2. `sortParams` 多个 `item` ：按照顺序优先级，排在后面的优先级高
3. `item` 中多个条件：`sortByMeasure` > `sortFunc` > `sortBy` > `sortMethod`
