---
title: Custom Sort
order: 0

---

## Introduction

Customize the sorting of table data rows, support row header/column header sorting, single row/column sorting, custom lists, functions and other functions. [Check out the examples](/examples/analysis/sort#custom-sort-func) .

## use

Driven by passing [sortParams](/en/api/general/s2-data-config#SortParams) data in [s2DataConfig](/en/api/general/s2-data-config)

### sortParam

| parameter     | illustrate                                                                     | type                                  | Defaults | required |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------- | -------- | -------- |
| sortFieldId   | Measure Id, the Id to be sorted                                                | `string`                              | -        | ✓        |
| sortMethod    | sort by                                                                        | `ASC` \| `DESC` \| `asc` \| `desc`    | -        |          |
| sortBy        | custom sorted list                                                             | `string[]`                            | -        |          |
| sortByMeasure | Sort by metric value (numeric value) (for pivot tables)                        | `string`                              | -        |          |
| query         | Filter criteria, narrow the sorting range such as: `{ city: '成都' }`            | `object`                              | -        |          |
| type          | Sorting within the group is used to display icons (applicable to pivot tables) | `string`                              | -        |          |
| sortFunc      | Function for custom sorting                                                    | `(v: SortFuncParam) => Array<string>` | -        |          |

```ts
import { EXTRA_FIELD } from "@antv/s2";

const s2DataConfig = {
  sortParams: [
    {
      sortFieldId: 'type',
      sortMethod: 'DESC',
      // EXTRA_FIELD 是 dataCfg.fields.values 字段的虚拟 fieldId
      query: { city: '成都', [EXTRA_FIELD]: 'price' },
    },
  ],
  ...
};
```

## Way

### 1. Ascending/descending method (sortMethod)

Row/column header dimensions are supported, and the ascending and descending order **is based on the first letter** . Examples are as follows:

```ts
sortParams: [
  { sortFieldId: 'province', sortMethod: 'DESC' },
  { sortFieldId: 'type', sortMethod: 'ASC' },
]
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DlG8SYEFlS8AAAAAAAAAAAAAARQnAQ" width="600" alt="row">

### 2. List of dimension values ​​(sortBy)

Supports setting the corresponding list in the table for the`行/列头`. If there is nesting, the sub-dimensions will be sorted within the group (as shown in `city` ), for example:

```ts
sortParams: [
  { sortFieldId: 'province', sortBy: [ '吉林', '浙江' ] },
  { sortFieldId: 'city', sortBy: [ '舟山', '杭州', '白山', '长春' ] },
  { sortFieldId: 'type', sortBy: [ '纸张', '笔' ] },
];
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*5A9lSpS6uHwAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

### 3. Measure field (sortByMeasure)

Support`行头/列头`sorting based on metric (numeric) data

#### row/column

Supports sorting by`行或列`, examples are as follows:

```ts
const s2DataConfig = {
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
  ]
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*SZ04TIhCQwkAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

#### row+column

Supports sorting by`行+列`, examples are as follows:

```ts
const s2DataConfig = {
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
  ]
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*wZ4fQJ5-AsMAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

### 4. Summary value

The non-leaf node of the`行/列头`. At this time, `sortByMeasure` is the summary virtual field TOTAL\_VALUE, and the value is `$$total$$` .

#### Configure Data Aggregation Mode

1. Use aggregated data from data.
2. Use aggregate calculations available in S2. ​📊 View document [subtotal total configuration](/en/api/general/s2-options#totals)

#### Row Total/Row Subtotal

Sort column headers by`行总计/行小计`, examples are as follows:

**Row subtotal** :

```ts
import { TOTAL_VALUE, EXTRA_FIELD } from "@antv/s2";

const s2DataConfig = {
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
}

// 使用前端总计的聚合方法进行排序。如果 data 数据中存在聚合数据则使用
const s2Options = {
  totals: {
    row: {
      subTotalsDimensions: [ 'province' ],
      calcSubTotals: {
        aggregation: 'SUM'
      }
    }
  }
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*RfN8Q5IauP8AAAAAAAAAAAAAARQnAQ" width="600" alt="row">

row totals:

```ts
import { TOTAL_VALUE, EXTRA_FIELD } from "@antv/s2";

const s2DataConfig = {
  sortParams: [
    {
      // 对 type 中笔和纸的总计进行 降序 排序
      sortFieldId: 'type',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        [EXTRA_FIELD]: 'price',
      },
    },
  ],
  // data 中带有排序使用的数据时，S2 会优先使用 data 返回的数据进行排序
  data:[
    {
      type: "笔",
      price: "38"
    },
    {
      type: "纸张",
      price: "36"
    }
  ]
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/%26pwbU6StZ/img.png" width="600" alt="rowTotal">

#### Column Total/Column Subtotal

Sort row headers by`列总计/列小计`, examples are as follows:

```ts
import { TOTAL_VALUE, EXTRA_FIELD } from "@antv/s2";

const s2DataConfig = {
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
  ]
}

const s2Options = {
  totals: {
    row: {
      subTotalsDimensions: ['province'],
      calcSubTotals: {
        aggregation: 'SUM',
      },
    }
  }
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ZXBjR6fZFpQAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

When there is a subtotal in the`列小计`, add the corresponding parameter in the `query` to get the corresponding cell, same`行小计`above

### 5. Custom method (sortFunc)

`sortFunc` will return `SortFuncParam` parameter according to the current conditions, and supports two ways of`维度值`and`度量值`

| parameter     | illustrate                                                    | type                               | Defaults                | required |
| ------------- | ------------------------------------------------------------- | ---------------------------------- | ----------------------- | -------- |
| sortFieldId   | Measure Id, the Id to be sorted                               | `string`                           | -                       | ✓        |
| sortMethod    | sort by                                                       | `ASC` \| `DESC` \| `asc` \| `desc` | -                       |          |
| sortBy        | custom sorted list                                            | `string[]`                         | -                       |          |
| sortByMeasure | Sort by metric value (numeric value)                          | `string`                           | -                       |          |
| query         | Filter criteria, narrow the sort range such as: `{city:'白山'}` | `object`                           | -                       |          |
| type          | Sorting within the group is used to display the icon          | `string`                           | -                       |          |
| data          | List of currently sorted data                                 | \`Array\<string                    | Record\<string, any>>\` | -        |

#### Dimension value (row/column header)

Support dimension value customization, that is, row header or column header, examples are as follows:

```ts
const s2DataConfig = {
  sortParams: [
    {
      // sortFieldId 为维度值时，params.data 为维度值列表
      sortFieldId: 'province',
      sortFunc: (params) => {
          const { data } = params;
          return data.sort((a, b) => a.localeCompare(b));
      },
    },
  ]
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*7MLkQLxhliAAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

#### measure (numeric)

Supports custom calculations using metrics, for example:

```ts

const s2DataConfig = {
  sortParams: [
    {
      sortFieldId: 'city',
      sortByMeasure: 'price',
      // 当使用 sortByMeasure 时，可以传入 query 定位数值列表
      // 如下方限定 params.data 为 type=纸张，数值=price 的数据
      query: { type: '纸张', [EXTRA_FIELD]: 'price' },
      sortFunc: (params) => {
        const { data, sortByMeasure, sortFieldId } = params || {};
        return data
          // 使用 price 做比较
          ?.sort((a, b) => b[sortByMeasure] - a[sortByMeasure])
          // map 出 city 维度的数组
          ?.map((item) => item[sortFieldId]);
      },
    },
  ]
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/xZbG1ALW0/cd83b502-cde6-4a7b-a581-36aae26b4028.png" width="600" alt="row">

📊 View demo [custom sorting](/examples/analysis/sort#custom-sort-func) .

## priority

1. The condition priority in `sortParams` is higher than the original data
2. `sortParams` multiple `item` : according to the order priority, the priority of the latter is higher
3. Multiple conditions in `item` : `sortByMeasure` > `sortFunc` > `sortBy` > `sortMethod`
