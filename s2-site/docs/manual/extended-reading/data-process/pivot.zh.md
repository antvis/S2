---
title: 透视表
order: 1
---

本文会介绍透视表的数据流处理过程，让读者更直观的了解 `S2` 内部数据逻辑。

数据处理流程是：

![s2-data-process](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*TFcyS6P0IPsAAAAAAAAAAAAADmJ7AQ/original)

![dataSet](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*yJaCSqkl4HIAAAAAAAAAAAAADmJ7AQ/original)

以下图透视表为例：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Wd1xTZoHhWwAAAAAAAAAAAAADmJ7AQ/original" alt="透视表" />

> 以下的代码都是伪代码，只是为了说明关键步骤，数据流处理逻辑大部分都在 [data-set](https://github.com/antvis/S2/tree/next/packages/s2-core/src/data-set) 文件夹中。

## 原始数据

初始配置和数据如下：

```tsx
const dataCfg = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['price'],
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
  ]
};

const options = {
    width: 600,
    height: 600
};

<SheetComponent
  dataCfg={dataCfg}
  options={options}
  sheetType="pivot"
/>
```

## 数据处理

### processDataCfg

这一步主要是对用户传入的配置根据当前的表格类型进行配置转换，主要是处理 `fields` 的信息，增加 `meta` 配置，并根据 `valueInCols` 配置，在`rows`或者`columns`中增加 `$$extra$$` 指标字段。

### transformIndexesData

在这一步，S2 会将用户传入的 data 信息做映射转换，从一维数组转换为多维数组 `indexesData`，并在转换过程中生成行列头的维度信息 `rowPivotMeta`，`colPivotMeta`。索引建立后，后续获取数据就能通过映射快速查询，增加查询效率。

以下面的数据为例：

```js
{
  price: 4,
  province: '浙江省',
  city: '绍兴市',
  type: '家具',
  sub_type: '沙发',
};
```

首先，处理数据，提取当前明细数据在初始配置条件下的行、列维度结果。

```ts

const rowDimensionValues = transformDimensionsValues(data, ['province', 'city']); // 结果是 ['浙江省', '绍兴市']
const colDimensionValues = transformDimensionsValues(data, ['type', 'sub_type']); // 结果是 ['家具', '沙发']
```

然后，根据数据的行列维度结果和 `fields` 配置信息，S2 会同步的生成 `indexesData`, `rowPivotMeta` 和 `colPivotMeta`

```ts
// indexesData 使用 prefix 区分普通数据和下钻数据
const prefix = 'province[&]city[&]type[&]sub_type';

// getDataPath 内部同步生成 rowPivotMeta 和 colPivotMeta 信息
// 第 0 位 始终是小计、总计的专属位，明细数据都是从第 1 位开始
const rowPath = getDataPath(rowDimensionValues); // 结果是 [1, 2];
const colPath = getDataPath(colDimensionValues); // 结果是 [1, 2];

const dataPath =[prefix, ...rowPath.concat(...colPath)] ; // 结果是 ['province[&]city[&]type[&]sub_type', 1, 2, 1, 2];

const indexesData={};
lodash.set(indexesData, dataPath, currentData);
```

对于表场景查询频率非常高，透视表本身的展现形式也表达了一种树形结构，因此我们选择了构建树形 Map 结构来实现 `rowPivotMeta` 和 `colPivotMeta`。

最后，按照上述流程，遍历所有数据，就能得到最终的  `indexesData`, `rowPivotMeta` 和 `colPivotMeta`，可以通过 S2 实例中的 `dataSet` 字段查看详情：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*rOySQIXC0tUAAAAAAAAAAAAADmJ7AQ/original" style="border-radius: 5px; margin-bottom: 20px; display:block;" width="500" alt="indexesData">

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*lFmhQ7wd3TwAAAAAAAAAAAAADmJ7AQ/original" style="border-radius: 5px; display:block;" width="500" alt="rowPivotMeta">

### handleSort

`rowPivotMeta` 和 `colPivotMeta` 都是 Map 结构，当 Map 结构获取 `keys` 或者 `values` 时，是结果按照插入顺序排序的。当存在 `sortParams` 时，我们希望获取的结果顺序就是排序后的顺序，所以在这一步，会根据排序配置，重新生成 Map 结构，使之满足排序后的结果。在后续布局时，就无需在重新排序，可以加速布局效率。

## 数据获取

### 获取单个数据

当渲染透视表数据单元格时，需要获取对应的展示内容（数据）。举个示例，需要右下角单元格数据时，代码如下：

```ts
const data = getCellData({
    query: { province: '浙江省', city: '绍兴市', type: '家具', sub_type: '沙发', $$extra$$: 'price' }
});
```

实现过程是，先拿到行、列维度枚举值：

```ts
const rowDimensionValues = transformDimensionsValues(query, ['province', 'city']); // ['浙江省', '绍兴市']
const colDimensionValues = transformDimensionsValues(query, ['type', 'sub_type', '$$extra$$']); // ['家具', '沙发', 'price']
```

然后通过枚举值获取数据查询路径，并从前面生成的多维数组中拿到具体数据。

```ts
const path = getDataPath({ rowDimensionValues, colDimensionValues });
const rawData = lodash.get(indexesData, path);
```

在拿到数据后，我们需要为原始数据增加 `$$extra$$` 等信息，用于标识所选择的具体是哪个维度，因此，内部使用了 [CellData](https://github.com/antvis/S2/blob/next/packages/s2-core/src/data-set/cell-data.ts) 类对 rawData 进行包裹，对其行为进行增强。

```ts
const data = CellData.getCellData(rawData, query[EXTRA_FIELD]);

console.log(data); //{ raw: rawData, extraField: "xxx" }
```

### 获取多个数据

如果想获取多个单元格数据，其大致流程和获取单个数据一致；获取多个单元格数据允许有维度缺失，会返回多个符合 query 的数据。

比如获取*浙江省*下的所有信息示例代码如下：

```ts
const dataList = getMultiData({
    query: { province: '浙江省', $$extra$$: 'price' }
});
```

总结下，获取数据是通过查询条件，构造当前查询条件对应的数据路径，然后从多维数组中直接拿取。
