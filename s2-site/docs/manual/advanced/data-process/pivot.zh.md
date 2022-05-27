---
title: 透视表
order: 1
---

本文会介绍透视表的数据流处理过程，让读者更直观的了解 `S2` 内部数据逻辑。

数据处理流程是：`原始数据 -> 生成多维数组 -> 生成层级结构 -> 获取数据` ，接下来我们会逐一讲解，目标是实现下图透视表：

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

## 生成多维数组

首先，处理第三条数据，提取当前明细数据在初始配置条件下的行、列维度结果。

```ts
// 第四条数据
// { "price": 4,"province": "浙江省","city": "绍兴市","type": "家具","sub_type": "沙发" }
const rowDimensionValues = transformDimensionsValue(currentData, ['province', 'city']); // 结果是 ['浙江省', '绍兴市']
const colDimensionValues = transformDimensionsValue(currentData, ['type', 'sub_type']); // 结果是 ['家具', '沙发']
```

然后，根据数据的行列维度结果和初始配置条件，我们可以获取到当前明细数据的路径（即在行树结构和列树结构的坐标索引）

```ts
const rowPath = getPath(rowDimensionValues); // 结果是 [0, 1]; 因为浙江下面有杭州和绍兴，所以绍兴坐标为 1，下同。
const colPath = getPath(colDimensionValues); // 结果是 [0, 1];
const dataPath = rowPath.concat(...colPath); // 结果是 [0, 1, 0, 1];

lodash.set(indexesData, dataPath, currentData); // [0, 1, 0, 1] 是 { "price": 4,"province": "浙江省","city": "绍兴市","type": "家具","sub_type": "沙发" }
```

最后，按照上述流程，遍历所有数据，得到最终的多维数组，结果是：

```ts
[
 [
  [
   [
    [{
     "price": 1,
     "province": "浙江省",
     "city": "杭州市",
     "type": "家具",
     "sub_type": "桌子",
     "$$extra$$": "price",
     "$$value$$": 1
    }],
    [{
     "price": 3,
     "province": "浙江省",
     "city": "杭州市",
     "type": "家具",
     "sub_type": "沙发",
     "$$extra$$": "price",
     "$$value$$": 3
    }]
   ]
  ],
  [
   [
    [{
     "price": 2,
     "province": "浙江省",
     "city": "绍兴市",
     "type": "家具",
     "sub_type": "桌子",
     "$$extra$$": "price",
     "$$value$$": 2
    }],
    [{
     "price": 4,
     "province": "浙江省",
     "city": "绍兴市",
     "type": "家具",
     "sub_type": "沙发",
     "$$extra$$": "price",
     "$$value$$": 4
    }]
   ]
  ]
 ]
]
```

## 生成层级结构

接下来是按照数据结构，分别生成行列的树状结构。我们知道，存储明细数据的 Meta 结构一般有三种：扁平数组、图、树，对于表场景查询频率非常高，透视表本身的展现形式也表达了一种树形结构，因此我们选择了构建树形结构来实现 Meta。

下面，我们以行树结构为例，讲解 `S2` 中层级结构的构造过程。

首先，拿到某条数据的行维度枚举值：

```ts
// 第四条数据
// { "price": 4,"province": "浙江省","city": "绍兴市","type": "家具","sub_type": "沙发" }
const rowDimensionValues = transformDimensionsValue(currentData, ['province', 'city']); // 结果是 ['浙江省', '绍兴市']
```

然后，遍历此条数据的行维度枚举：

```ts
let currentMeta = this.rowPivotMeta; // 存储行树形结构 Map.
for (let i = 0; i < rowDimensionValues.length; i++) { // 遍历 ['浙江省', '绍兴市'];
    if (isFirstCreate) {
        currentMeta.set(rowDimensionValues[i], { // currentMeta = 
            level: currentMeta.size,
            children: new Map(),
        });
    }
    const meta = this.rowPivotMeta.get(value);
    currentMeta = meta?.children; 
}
```

第一次循环 `['浙江省', '绍兴市']` 时，`currentMeta` 的结果是：

```ts
Map(1) {
    [[entries]] => [{
        '浙江省' => { key: '浙江省', value: { children: Map(0)}})
    }]
}
```

第二次循环的结果是：

```ts
Map(1) {
    [[Entries]] => [{
        '浙江省' => { key: '浙江省', value: { 
            children: Map(1) {
                [[Entries]] => [{
                    '绍兴市' => { key: '绍兴市', value: { children: Map(0)}}
                }]
            }
        }}
    }]
}
```

当遍历一条明细数据后，变成 `浙江省 => 绍兴市` 这样层级结构。当遍历完所有明细数据后，最终的行层级结构如下：

```ts
Map(1) {
    [[Entries]] => [{
        '浙江省' => { key: '浙江省', value: { 
            childField: 'city',
            children: Map(2) {
                [[Entries]] => [{
                    '杭州市' => { key: '杭州市', value: { children: Map(0)}}
                }, {
                    '绍兴市' => { key: '绍兴市', value: { children: Map(0)}}
                }]
            }
        }}
    }]
}
```

列的最终层级结构如下：

```ts
Map(1) {
    [[Entries]] => [{
        '家具' => { key: '家具', value: { 
            childField: 'sub_type',
            children: Map(2) {
                [[Entries]] => [{
                    '桌子' => { key: '桌子', value: { children: Map(0)}}
                }, {
                    '沙发' => { key: '沙发', value: { children: Map(0)}}
                }]
            }
        }}
    }]
}
```

## 获取数据

当渲染透视表数据单元格时，需要获取对应的展示内容（数据）。举个例子，需要右下角单元格数据时，代码如下：

```ts
const data = getCellData({
    query: { province: '浙江省', city: '绍兴市', type: '家具', sub_type: '沙发', $$extra$$: 'price' }
});
```

实现过程是，先拿到行、列维度枚举值：

```ts
const rowDimensionValues = getQueryDimValues(['province', 'city'], query); // ['浙江省', '绍兴市']
const colDimensionValues = getQueryDimValues(['type', 'sub_type', '$$extra$$'], query); // ['家具', '沙发', 'price']
```

然后通过枚举值获取数据查询路径，并从前面生成的多维数组中拿到具体数据。

```ts
const path = getDataPath({ rowDimensionValues, colDimensionValues }); // [0, 1, 0, 1, 0]
const data = lodash.get(indexesData, path);
```

总结下，获取数据是通过查询条件，构造当前查询条件对应的数据路径，然后从多维数组中直接拿取。
