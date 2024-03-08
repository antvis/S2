---
title: 基础排序
order: 0
tag: Updated
---

## 简介

S2 支持对表格数据进行多种形式的排序，如行/列头维值根据首字母顺序排序、行/列头维值根据对应的小计/总计/数值排序。S2 除了提供默认的排序方法外，还允许使用函数自定义排序。[查看示例](/examples/analysis/sort#custom-sort-func)

## 使用

通过在 [s2DataConfig](/docs/api/general/S2DataConfig) 中传入 [sortParams](/docs/api/general/S2DataConfig#sortparams) 启用排序

### sortParams

| 参数 | 说明 | 类型 | 默认值 | 必选 |
| --- | --- | --- | --- | --- |
| sortFieldId | 度量 Id，即要被排序的 Id | `string` | - | ✓ |
| sortMethod | 排序方式 | `ASC` \| `DESC` \| `asc` \| `desc` | - |  |
| sortBy | 自定义排序列表 | `string[]` | - |  |
| sortByMeasure | 按照度量值（数值）排序（透视表适用） | `string` | - |  |
| query | 筛选条件，缩小排序范围 如 ：`{ city: '成都' }` | `object` | - |  |
| type | 组内排序用来显示 icon（透视表适用） | `string` | - |  |
| sortFunc | 自定义排序的 function | `(v: SortFuncParam) => Array<string>` | - |  |

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
}
```

## 方式

### 1. 升/降序方法（sortMethod）

支持对 `行头/列头` 进行排序，类型包括数字、类数字、普通字符串，非数字兜底使用 **localeCompare** 进行比较，举例如下：

```ts
const s2DataConfig = {
  sortParams: [
    { sortFieldId: 'province', sortMethod: 'DESC' },
    { sortFieldId: 'type', sortMethod: 'ASC' },
  ]
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DlG8SYEFlS8AAAAAAAAAAAAAARQnAQ" width="500" alt="row" />

### 2. 维度值列表（sortBy）

支持对 `行头/列头` 按照指定的维值列表排序，如果行列有多级，则各子级内部进行组内排序（如下 `city` ），举例如下：

```ts
const s2DataConfig = {
  sortParams: [
    { sortFieldId: 'province', sortBy: ['浙江', '吉林'] },
    { sortFieldId: 'city', sortBy: ['舟山', '杭州', '白山', '长春'] },
    { sortFieldId: 'type', sortBy: ['纸张', '笔'] },
  ]
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*jD1iTZdrUZwAAAAAAAAAAAAADmJ7AQ/original" width="500" alt="row" />

### 3. 度量值字段（sortByMeasure）

支持 `行头/列头` 按照交叉的度量值（数值）进行排序。以下图为例，如果需要对行头的 `城市` 维度排序，首先需要找出用于排序的数据。`城市` 维度在交叉区域对应了 7 列数值数据，使用任何一列数据做比较，都可以决定 `城市` 维度的排序，所以在使用 `度量值字段（sortByMeasure）` 时，不仅要指定需要排序的 `sortFieldId`，还需要使用 `query` 属性限定用于比较的数值数据。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*gAxoSaj9Z4IAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

根据维度所在的层级，以及用于排序的数据不同，可以分为两类排序，示例如下：

#### 按明细数据排序

- `sortByMeasure` 取具体数值，如 `number`
- `sortFieldId` 为 `行/列` 维度最后一个字段，如行维度中的 `city`
- `query` 能限定到最后一级明细数据，如包含所有列维度 `type`、`sub_type` 的维值【见示例 1】

#### 按汇总数据排序

> 在 S2 中怎么开启总计/小计？
>
> 1. 使用 data 数据中的聚合数据。
> 2. 使用 S2 中提供的聚合计算。​📊 查看文档 [小计总计配置](/docs/api/general/S2Options#totals)

- `sortByMeasure` 取 `TOTAL_VALUE`
- `sortFieldId` 可以取任意维度字段（非末级的 `province` 或末级的 `city`）
  - 取 `province` 时，`query` 可限定 `type`、`sub_type` 所有维值或部分维值，此时是以 `province` 的行小计交叉格为准【见示例 2】
  - 取 `city` 时，`query` 只可限定到部分列维度，如 `type`，此时以列小计交叉格数据为准【见示例 3】

#### 示例 1，明细数据排序

```javascript
{
  sortFieldId: 'city',
  sortByMeasure: 'number',
  sortMethod: 'asc',
  query: {
    type: '办公用品',
    sub_type: '纸张',
    [EXTRA_FIELD]: 'number'
  }
}
```

<image src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*im9YR7e_wooAAAAAAAAAAAAADmJ7AQ/original" width="600" />

#### 示例 2，非内侧维度按汇总数据排序

当 `query` 包含 `部分` 列维度

```javascript
{
  sortFieldId: 'province',
  sortByMeasure: TOTAL_VALUE,
  sortMethod: 'asc',
  query: {
    type: '家具',
    [EXTRA_FIELD]: 'number'
  }
}
```

<image src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HthpSLAX6BYAAAAAAAAAAAAADmJ7AQ/original" width="600" />

当 `query` 包含 `所有` 列维度

```javascript
{
  sortFieldId: 'province',
  sortByMeasure: TOTAL_VALUE,
  sortMethod: 'asc',
  query: {
    type: '办公用品',
    sub_type: '笔',
    [EXTRA_FIELD]: 'number'
  }
}
```

<image src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*8MlDSbozN0gAAAAAAAAAAAAADmJ7AQ/original" width="600" />

#### 示例 3，最内侧维度按汇总数据排序

```javascript
{
  sortFieldId: 'city',
  sortByMeasure: TOTAL_VALUE,
  sortMethod: 'desc',
  query: {
    type: '办公用品',
    [EXTRA_FIELD]: 'number'
  }
}
```

<image src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*SiB0T7oePzEAAAAAAAAAAAAADmJ7AQ/original" width="600" />

### 4. 自定义方法（sortFunc）

`sortFunc` 会根据当前条件返回 `SortFuncParam` 参数，支持 `维度值` 和 `度量值` 两种方式

| 参数 | 说明 | 类型 | 默认值 | 必选 |
| --- | --- | --- | --- | --- |
| sortFieldId | 度量 Id，即要被排序的 Id | `string` | - | ✓ |
| sortMethod | 排序方式 | `ASC` \| `DESC` \| `asc` \| `desc` | - |  |
| sortBy | 自定义排序列表 | `string[]` | - |  |
| sortByMeasure | 按照度量值（数值）排序 | `string` | - |  |
| query | 筛选条件，缩小排序范围 如 ：`{city:'白山'}` | `object` | - |  |
| type | 组内排序用来显示 icon | `string` | - |  |
| data | 当前排序数据列表 | `Array<string \| CellData>` | - |  |

#### 维度值（行/列头）

支持维度值自定义，即行头或列头，举例如下：

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
  ],
};
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*7MLkQLxhliAAAAAAAAAAAAAAARQnAQ" width="600" alt="row" />

#### 度量值（数值）

支持使用度量值进行自定义计算，举例如下：

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
        return (
          data
            .map(item => item.raw) // 此时 item 为 CellData，需要取出原始数据对象
            // 使用 price 做比较
            ?.sort((a, b) => b[sortByMeasure] - a[sortByMeasure])
            // map 出 city 维度的数组
            ?.map((item) => item[sortFieldId])
        );
      },
    },
  ],
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/xZbG1ALW0/cd83b502-cde6-4a7b-a581-36aae26b4028.png" width="600" alt="row" />

📊 查看 demo [自定义排序](/examples/analysis/sort#custom-sort-func)。

## 优先级

1. `sortParams` 里的条件优先级高于原始数据
2. `sortParams` 多个 `item` ：按照顺序优先级，排在后面的优先级高
3. `item` 中多个条件：`sortFunc` > `sortBy` > `sortByMeasure` > `sortMethod`
