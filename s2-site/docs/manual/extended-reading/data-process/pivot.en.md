---
title: Pivot
order: 1
---

This article will introduce the data flow processing process of the pivot table, so that readers can understand the internal data logic of `S2` more intuitively.

The data processing process is: `Raw Data -> Generate Multidimensional Array -> Generate Hierarchy -> Get Data`, and we will explain them one by one, the goal is to realize the pivot table in the following figure:

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*J2fuRIJnQdgAAAAAAAAAAAAAARQnAQ" alt="s2-data-process-demo" width="600">

## Raw data

The initial configuration and data are as follows:

```tsx
const dataCfg = {
    fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['price']
    },
    data: [{
        "price": 1,
        "province": "Zhejiang",
        "city": "Hangzhou",
        "type": "Furniture",
        "sub_type": "Table"
    }, {
        "price": 2,
        "province": "Zhejiang",
        "city": "Shaoxing",
        "type": "Furniture",
        "sub_type": "Table"
    }, {
        "price": 3,
        "province": "Zhejiang",
        "city": "Hangzhou",
        "type": "Furniture",
        "sub_type": "Sofa"
    }, {
        "price": 4,
        "province": "Zhejiang",
        "city": "Shaoxing",
        "type": "Furniture",
        "sub_type": "Sofa"
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

## generate multidimensional array

First, process the third piece of data to extract the row and column dimension results of the current detailed data under the initial configuration conditions.

```ts
// The 4th data item
// { "price": 4,"province": "Zhejiang","city": "Shaoxing","type": "Furniture","sub_type": "Sofa" }
const rowDimensionValues = transformDimensionsValue(currentData, ['province', 'city']); // Result is ['Zhejiang', 'Shaoxing']
const colDimensionValues = transformDimensionsValue(currentData, ['type', 'sub_type']); // Result is ['Furniture', 'Sofa']
```

Then, according to the row and column dimension results of the data and the initial configuration conditions, we can obtain the path to the current detailed data (that is, the coordinate index in the row tree structure and column tree structure)

```ts
const rowPath = getPath(rowDimensionValues); // Result is [0, 1]; Because Hangzhou and Shaoxing are under Zhejiang, so Shaoxing coordinate is 1, same below.
const colPath = getPath(colDimensionValues); // Result is [0, 1];
const dataPath = rowPath.concat(...colPath); // Result is [0, 1, 0, 1];

lodash.set(indexesData, dataPath, currentData); // [0, 1, 0, 1] is { "price": 4,"province": "Zhejiang","city": "Shaoxing","type": "Furniture","sub_type": "Sofa" }
```

Finally, according to the above process, traverse all the data to get the final multidimensional array, the result is:

```ts
[
 [
  [
   [
    [{
     "price": 1,
     "province": "Zhejiang",
     "city": "Hangzhou",
     "type": "Furniture",
     "sub_type": "Table",
     "$$extra$$": "price",
     "$$value$$": 1
    }],
    [{
     "price": 3,
     "province": "Zhejiang",
     "city": "Hangzhou",
     "type": "Furniture",
     "sub_type": "Sofa",
     "$$extra$$": "price",
     "$$value$$": 3
    }]
   ]
  ],
  [
   [
    [{
     "price": 2,
     "province": "Zhejiang",
     "city": "Shaoxing",
     "type": "Furniture",
     "sub_type": "Table",
     "$$extra$$": "price",
     "$$value$$": 2
    }],
    [{
     "price": 4,
     "province": "Zhejiang",
     "city": "Shaoxing",
     "type": "Furniture",
     "sub_type": "Sofa",
     "$$extra$$": "price",
     "$$value$$": 4
    }]
   ]
  ]
 ]
]
```

## generate hierarchy

The next step is to generate a tree structure of rows and columns according to the data structure. We know that there are generally three meta structures for storing detailed data: flat arrays, graphs, and trees. The query frequency for table scenarios is very high, and the presentation form of the pivot table itself also expresses a tree structure, so we chose to build a tree structure Structure to implement Meta.

Next, we take the row tree structure as an example to explain the construction process of the hierarchical structure in `S2` .

First, get the row dimension enumeration value of a piece of data:

```ts
// The 4th data item
// { "price": 4,"province": "Zhejiang","city": "Shaoxing","type": "Furniture","sub_type": "Sofa" }
const rowDimensionValues = transformDimensionsValue(currentData, ['province', 'city']); // Result is ['Zhejiang', 'Shaoxing']
```

Then, traverse the row dimension enumeration of this piece of data:

```ts
let currentMeta = this.rowPivotMeta; // Stores row tree structure Map.
for (let i = 0; i < rowDimensionValues.length; i++) { // Traverse ['Zhejiang', 'Shaoxing'];
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

When looping `['Zhejiang', 'Shaoxing']` for the first time, the result of `currentMeta` is:

```ts
Map(1) {
    [[entries]] => [{
        'Zhejiang' => { key: 'Zhejiang', value: { children: Map(0)}})
    }]
}
```

The result of the second loop is:

```ts
Map(1) {
    [[Entries]] => [{
        'Zhejiang' => { key: 'Zhejiang', value: { 
            children: Map(1) {
                [[Entries]] => [{
                    'Shaoxing' => { key: 'Shaoxing', value: { children: Map(0)}}
                }]
            }
        }}
    }]
}
```

After traversing a piece of detailed data, it becomes a hierarchical structure such as`Zhejiang => Shaoxing`. After traversing all the detailed data, the final row hierarchy is as follows:

```ts
Map(1) {
    [[Entries]] => [{
        'Zhejiang' => { key: 'Zhejiang', value: { 
            childField: 'city',
            children: Map(2) {
                [[Entries]] => [{
                    'Hangzhou' => { key: 'Hangzhou', value: { children: Map(0)}}
                }, {
                    'Shaoxing' => { key: 'Shaoxing', value: { children: Map(0)}}
                }]
            }
        }}
    }]
}
```

The final hierarchy of columns is as follows:

```ts
Map(1) {
    [[Entries]] => [{
        'Furniture' => { key: 'Furniture', value: { 
            childField: 'sub_type',
            children: Map(2) {
                [[Entries]] => [{
                    'Table' => { key: 'Table', value: { children: Map(0)}}
                }, {
                    'Sofa' => { key: 'Sofa', value: { children: Map(0)}}
                }]
            }
        }}
    }]
}
```

## retrieve data

When rendering a pivot table data cell, it is necessary to obtain the corresponding display content (data). For example, when the cell data in the lower right corner is needed, the code is as follows:

```ts
const data = getCellData({
    query: { province: 'Zhejiang', city: 'Shaoxing', type: 'Furniture', sub_type: 'Sofa', $$extra$$: 'price' }
});
```

The implementation process is to first get the row and column dimension enumeration values:

```ts
const rowDimensionValues = getQueryDimValues(['province', 'city'], query); // ['Zhejiang', 'Shaoxing']
const colDimensionValues = getQueryDimValues(['type', 'sub_type', '$$extra$$'], query); // ['Furniture', 'Sofa', 'price']
```

Then obtain the data query path through the enumeration value, and get the specific data from the multidimensional array generated earlier.

```ts
const path = getDataPath({ rowDimensionValues, colDimensionValues }); // [0, 1, 0, 1, 0]
const data = lodash.get(indexesData, path);
```

To sum up, to obtain data is to construct the data path corresponding to the current query condition through the query condition, and then directly fetch it from the multidimensional array.
