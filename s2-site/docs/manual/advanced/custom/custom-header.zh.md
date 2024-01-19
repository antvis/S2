---
title: 自定义行列头分组
order: 2
tag: New
---

`S2` 默认提供 [平铺模式 (grid)](https://s2.antv.vision/zh/examples/basic/pivot#grid) 和 [树状模式 (tree)](https://s2.antv.vision/zh/examples/basic/pivot#tree) 两种**行头**单元格布局方式。

默认通过**分组之后得到的数据生成层级结构**, 如果都不满足的话，可以通过自定义行列头，来定制你的目录结构，同样兼容平铺和树状这两种布局方式。

## 数据结构

<embed src="@/docs/common/custom/customTreeNode.zh.md"></embed>

```ts
const customTree = [
  {
    field: 'a-1',
    title: '自定义节点 a-1',
    description: 'a-1 描述',
    children: [
      {
        field: 'a-1-1',
        title: '自定义节点 a-1-1',
        description: 'a-1-1 描述',
        children: [
          {
            field: 'measure-1',
            title: '指标 1',
            description: '指标 1 描述',
            children: [],
          },
          {
            field: 'measure-2',
            title: '指标 2',
            description: '指标 2 描述',
            children: [],
          },
        ],
      },
      {
        field: 'a-1-2',
        title: '自定义节点 a-1-2',
        description: 'a-1-2 描述',
        children: [],
      },
    ],
  },
  {
    field: 'a-2',
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

## 1. 透视表

### 1.1 自定义行头

:::info{title="提示"}

1. `rows` 配置为自定义 `tree` 结构
2. 数值需要置于行头，即 `valueInCols: false` （无论配置与否都会强制置于行头，修改无效）

:::

<Playground path='layout/custom-header-group/demo/custom-pivot-row-header.ts' rid='custom-pivot-row-header' height='400'></playground>

```ts
const s2DataConfig = {
  fields: {
    rows: customTree,
    columns: ['type', 'sub_type'],
    values: ['measure-1', 'measure-2'],
    valueInCols: false,
  },
  data,
};
```

#### 平铺模式

```ts
const s2Options = {
  hierarchyType: 'grid'
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/78uZ2l%24JQ/01a484d7-0edd-4ba0-882f-eed59fc209f1.png" width="1000" alt="preview" />

#### 树状模式

```ts
const s2Options = {
  hierarchyType: 'tree'
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/iJft9ExZs/da1f768c-7689-44df-be54-708442a74d76.png" width="1000" alt="preview" />

### 1.2 自定义列头

:::info{title="提示"}

1. `columns` 配置为自定义 `tree` 结构
2. 数值需要置于列头，即 `valueInCols: true` （无论配置与否都会强制置于列头，修改无效）

:::

<Playground path='layout/custom-header-group/demo/custom-pivot-col-header.ts' rid='custom-pivot-col-header' height='400'></playground>

```ts
const s2DataConfig = {
  fields: {
    columns: customTree,
    rows: ['type', 'sub_type'],
    values: ['measure-1', 'measure-2'],
    valueInCols: true,
  },
  data,
};
```

#### 平铺模式

```ts
const s2Options = {
  hierarchyType: 'grid'
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/sn6R4Kmvh/ce49ecf2-e672-47d5-885b-135c39620e18.png" width="1000" alt="preview"/>

#### 树状模式

```ts
const s2Options = {
  hierarchyType: 'tree'
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/ORZGnHNfz/5f876c02-e647-4598-a4bf-68d4b803a18a.png" width="1000" alt="preview"/>

### 1.3 自定义角头文本

#### 1.3.1 平铺模式

对于平铺模式，角头显示的文本默认对应**行头每一列的第一个单元格**，可以和普通字段一样，配置 [meta](/zh/docs/api/general/S2DataConfig#meta) 来对单元格文本进行格式化，此时 `field` 对应 [CustomTreeNode](#customtreenode) 的 `field` 值

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

<img src="https://gw.alipayobjects.com/zos/antfincdn/6U%26nLnY3r/e65b9e7c-d9a3-4841-839f-2405d0c45ea2.png" width="600" alt="preview"/>

#### 1.3.2 树状模式

对于树状模式，角头默认显示的文本对应**所有的一级节点和数值**，可以和普通字段一样，配置 [meta](/zh/docs/api/general/S2DataConfig#meta) 来对单元格文本进行格式化，也可以配置 [s2Options.cornerText](/zh/docs/api/general/S2Options) 来自定义角头文本

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

<img src="https://gw.alipayobjects.com/zos/antfincdn/TmAPj7Ky2/a2c78816-45c5-450b-ab0c-0e2d7d98d209.png" width="200" alt="preview"/>

```ts
const s2Options = {
  cornerText: '自定义角头标题'
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/BF7WZ0w2h/e5fc914e-b69e-47e4-9da5-ebee4b070207.png" width="200" alt="preview"/>

## 2. 明细表

### 2.1 自定义列头

:::info{title="提示"}

`columns` 配置为自定义 `tree` 结构

```ts
const s2DataConfig = {
  fields: {
    columns: customTree
  },
  data,
};
```

:::

<Playground path='layout/custom-header-group/demo/custom-table-col-header.ts' rid='custom-table-col-header' height='400'></playground>

## 3. 行列头文本格式化

自定义节点默认使用 `当前节点展示名`, 即 `CustomTreeNode.title`, 也可以使用通用的 [Meta](/api/general/s-2-data-config#meta) 来进行格式化，[查看更多](/manual/basic/formatter)

```ts
const s2DataConfig: S2DataConfig = {
  meta: [
    {
      field: 'a-1',
      formatter: (value) => '名称 1'
    },
    {
      field: 'a-1-1',
      formatter: (value) => '名称 2'
    },
  ],
};
```

## 4. 更多应用

基于自定义行列头，我们可以衍生出更多的使用场景，比如基于 `自定义行头` + `树状模式`, 我们可以自定义出一个 [趋势分析表分析组件](/docs/manual/basic/analysis/strategy/).
