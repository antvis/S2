---
title: Customize Tree
order: 2
tag: New
---

By default, `S2` provides two **row header** layout modes [: tile mode (grid)](https://s2.antv.vision/zh/examples/basic/pivot#grid) and [tree mode (tree)](https://s2.antv.vision/zh/examples/basic/pivot#tree) .

By default **, the hierarchical structure is generated through the data obtained after crossing** . If you are not satisfied, you can customize your directory structure by customizing the row and column headers. These two layout methods are also supported.

<Playground path="custom/custom-tree/demo/custom-header.ts" rid="container" height="400"></Playground>

### data structure

`markdown:docs/common/custom/customTreeNode.en.md`

```ts
const customTree: CustomTreeNode[] = [
  {
    key: 'a-1',
    title: '自定义节点 a-1',
    description: 'a-1 描述',
    children: [
      {
        key: 'a-1-1',
        title: '自定义节点 a-1-1',
        description: 'a-1-1 描述',
        children: [
          {
            key: 'measure-1',
            title: '指标 1',
            description: '指标 1 描述',
            children: [],
          },
          {
            key: 'measure-2',
            title: '指标 2',
            description: '指标 2 描述',
            children: [],
          },
        ],
      },
      {
        key: 'a-1-2',
        title: '自定义节点 a-1-2',
        description: 'a-1-2 描述',
        children: [],
      },
    ],
  },
  {
    key: 'a-2',
    title: '自定义节点 a-2',
    description: 'a-2 描述',
    children: [],
  },
];

const data = [
  {
    'measure-1': 13,
    'measure-2': 2,
    type: '家具',
    sub_type: '桌子',
  },
  {
    'measure-1': 11,
    'measure-2': 8,
    type: '家具',
    sub_type: '椅子',
  },
]
```

### custom outfit

[view example](#)

1. `rows` are configured as a custom `tree` structure
2. The value needs to be placed at the head of the line, that is, `valueInCols: false` (regardless of whether it is configured or not, it will be forced to be placed at the head of the line, and the modification is invalid)

```ts
const s2DataConfig = {
  fields: {
    rows: customTree,
    columns: ['type', 'sub_type'],
    values: ['measure-1', 'measure-2']
    valueInCols: false,
  },
  data,
};
```

#### tile mode

```ts
const s2Options = {
  hierarchyType: 'grid',
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/78uZ2l%24JQ/01a484d7-0edd-4ba0-882f-eed59fc209f1.png" width="1000" alt="preview">

#### tree mode

```ts
const s2Options = {
  hierarchyType: 'tree',
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/iJft9ExZs/da1f768c-7689-44df-be54-708442a74d76.png" width="1000" alt="preview">

### custom header

[view example](#)

1. `columns` are configured as a custom `tree` structure
2. The value needs to be placed at the head of the column, that is, `valueInCols: true` (regardless of whether it is configured or not, it will be forced to be placed at the head of the column, and the modification is invalid)

```ts
const s2DataConfig = {
  fields: {
    columns: customTree,
    rows: ['type', 'sub_type'],
    values: ['measure-1', 'measure-2']
    valueInCols: true,
  },
  data,
};
```

#### tile mode

```ts
const s2Options = {
  hierarchyType: 'grid',
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/sn6R4Kmvh/ce49ecf2-e672-47d5-885b-135c39620e18.png" width="1000" alt="preview">

#### tree mode

```ts
const s2Options = {
  hierarchyType: 'tree',
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/ORZGnHNfz/5f876c02-e647-4598-a4bf-68d4b803a18a.png" width="1000" alt="preview">

### Custom header text

#### tile mode

For the tiling mode, the corner header corresponds **to the first cell of each column of the row header.** Like ordinary fields, you can configure [meta](/zh/docs/api/general/S2DataConfig#meta) to format the cell text. At this time, the `field` corresponds to the `key` value of [CustomTreeNode](#customtreenode)

```ts
const meta = [
  {
    field: 'a-1',
    name: '层级 1',
  },
  {
    field: 'a-1-1',
    name: '层级 2',
  },
  {
    field: 'measure-1',
    name: '层级 3',
  }
]
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/6U%26nLnY3r/e65b9e7c-d9a3-4841-839f-2405d0c45ea2.png" width="600" alt="preview">

#### tree mode

For the tree mode, the corner headers correspond to **all first-level nodes and values** . You can configure [meta](/zh/docs/api/general/S2DataConfig#meta) to format the cell text just like ordinary fields, or you can configure [s2Options.cornerText](/zh/docs/api/general/S2Options) to customize the corner header text

```ts
const meta = [
  {
    field: 'a-1',
    name: '层级 1',
  },
  {
    field: 'a-2',
    name: '层级 2',
  },
]
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/TmAPj7Ky2/a2c78816-45c5-450b-ab0c-0e2d7d98d209.png" width="200" alt="preview">

```ts
const s2Options = {
  cornerText: '自定义角头标题'
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/BF7WZ0w2h/e5fc914e-b69e-47e4-9da5-ebee4b070207.png" width="200" alt="preview">

### more applications

Based on custom row and column headers, we can derive more usage scenarios, such as based on`自定义行头`+`树状模式`, we can customize a [trend analysis table analysis component](zh/docs/manual/basic/analysis/strategy/) .
