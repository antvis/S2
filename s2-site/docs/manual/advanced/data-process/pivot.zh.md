---
title: 透视表
order: 1
---

本文会介绍透视表的数据流处理过程，让读者更直观的了解 `S2` 内部数据逻辑。

数据处理流程是：`原始数据 -> 生成 indexesData 多维数据 -> 生成层级结构 -> 获取数据` ，接下来我们会逐一讲解，目标是实现下图透视表：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*J2fuRIJnQdgAAAAAAAAAAAAAARQnAQ" alt="s2-data-process-demo" width="600" />

## 原始数据

初始配置和数据如下：

```tsx
const dataCfg = {
    fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['price']
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
    width: 600,
    height: 600
};

<SheetComponent
  dataCfg={dataCfg}
  options={options}
  sheetType="pivot"
/>
```

## 生成 indexesData 多维数据

首先，处理数据，提取当前明细数据在初始配置条件下的行、列维度结果。

```ts
// 以第四条数据为例
// { "price": 4,"province": "浙江省","city": "绍兴市","type": "家具","sub_type": "沙发" }
const rowDimensionValues = transformDimensionsValues(currentData, ['province', 'city']); // 结果是 ['浙江省', '绍兴市']
const colDimensionValues = transformDimensionsValues(currentData, ['type', 'sub_type']); // 结果是 ['家具', '沙发']
```

然后，根据数据的行列维度结果和初始配置条件，我们可以获取到当前明细数据的路径（即在行树结构和列树结构的坐标索引）

```ts
// 以第四条数据为例
const prefix = 'province[&]city[&]type[&]sub_type';
// 第 0 位 始终是小计、总计的专属位，明细数据都是从第 1 位开始
const rowPath = getDataPath(rowDimensionValues); // 结果是 [1, 2];
const colPath = getDataPath(colDimensionValues); // 结果是 [1, 2];
const dataPath =[prefix, ...rowPath.concat(...colPath)] ; // 结果是 ['province[&]city[&]type[&]sub_type', 1, 2, 1, 2];
const indexesData={};
lodash.set(indexesData, dataPath, currentData);
```

最后，按照上述流程，遍历所有数据，得到最终的 indexesData，结果是：

```ts
{
 "province[&]city[&]type[&]sub_type": [
  null,
  [
   null,
   [
    null,
    [
     null,
     [
      null,
      {
       "price": 1,
       "province": "浙江省",
       "city": "杭州市",
       "type": "家具",
       "sub_type": "桌子"
      }
     ],
     [
      null,
      {
       "price": 3,
       "province": "浙江省",
       "city": "杭州市",
       "type": "家具",
       "sub_type": "沙发"
      }
     ]
    ]
   ],
   [
    null,
    [
     null,
     [
      null,
      {
       "price": 2,
       "province": "浙江省",
       "city": "绍兴市",
       "type": "家具",
       "sub_type": "桌子"
      }
     ],
     [
      null,
      {
       "price": 4,
       "province": "浙江省",
       "city": "绍兴市",
       "type": "家具",
       "sub_type": "沙发"
      }
     ]
    ]
   ]
  ]
 ]
}
```

## 生成层级结构

接下来是按照数据结构，分别生成行列的树状结构。我们知道，存储明细数据的 Meta 结构一般有三种：扁平数组、图、树，对于表场景查询频率非常高，透视表本身的展现形式也表达了一种树形结构，因此我们选择了构建树形结构来实现 Meta。

下面，我们以行树结构为例，生成的 Map 结构是：<br/>![rowPivotMeta](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*BScNTbO2TrIAAAAAAAAAAAAADmJ7AQ/original)

## 获取数据

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
const rowData = lodash.get(indexesData, path);
```

在拿到数据后，我们需要为原始数据增加 `$$extra$$` 等信息，用于标识所选择的具体是哪个维度，因此，内部使用了 Proxy 对 rowData 进行包裹，对其行为进行增强。

```ts
const data=new Proxy(rowData,handler);

console.log({...data}); //{ "price": 4,"province": "浙江省","city": "绍兴市","type": "家具","sub_type": "沙发", "$$extra$$": "price", "$$value$$": 4 }
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
