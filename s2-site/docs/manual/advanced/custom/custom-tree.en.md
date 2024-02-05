---
title: Customize Category Tree
order: 2
tag: New
---

By default, `S2` provides two row header layout modes [: tile mode (grid)](/examples/basic/pivot#grid) and [tree mode (tree)](/examples/basic/pivot#tree) .

If you are not satisfied, you can use a custom directory tree to customize your directory structure

```ts
const s2Options = {
  hierarchyType: 'tree', // grid 平铺模式，tree 树状模式
};
```

<Playground path="custom/custom-tree/demo/custom-tree.ts" rid="container" height="400"></Playground>

## premise

1\. The value needs to be **placed at the head of the line** , that is, `valueInCols: false` (regardless of whether it is configured or not, it will be placed at the head of the line forcibly, and the modification is invalid)

```ts
const s2DataConfig = {
  fields: {
    valueInCols: false
  }
}
```

2\. The line header needs to be a **standard tree structure** , see the [data structure description](#customtreenode) below

## configuration

The configuration to generate the directory tree structure is as follows:

```ts
const s2Options = {
  hierarchyType: 'tree',
};

const customTreeNodes = [
  {
    title: '自定义节点 A',
    field: 'custom-node-1',
    children: [
      {
        title: '指标 A',
        field: 'measure-a',
      },
      {
        title: '指标 B',
        field: 'measure-b',
      },
    ],
  },
  {
    title: '自定义节点 B',
    field: 'custom-node-2',
    children: [
      {
        title: '自定义节点 D',
        field: 'custom-node-2-1',
        collapsed: true,
        children: [{ title: '指标 F', field: 'measure-f' }],
      },
    ],
  },
];

const s2DataConfig = {
  fields: {
    rows: customTreeNodes,
    valueInCols: false,
    columns: ['type', 'sub_type'],
    values: [
      'measure-a',
    ],
  },
  data,
};
```

## Node name formatting

By default, `customTreeNode.title` is used as the node name, and general formatting functions can also be used to process specific nodes

```ts
const s2DataConfig = {
  ...,
  meta: [
    {
      field: 'custom-node-1',
      name: '名称 1'
    }
  ]
};
```

## Node expand/collapse

By default, `customTreeNode.collapsed` is used as the expanded/collapsed state, and general configurations can also be used. For details, please refer to the chapter on [custom collapsed/expanded nodes](/manual/advanced/custom/custom-collapse-nodes)

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseFields: {
        'custom-node-1': true,
        'custom-node-2': false,
      },
    },
  },
}
```

## Custom header text

For`自定义目录`, you can also configure `cornerText` to customize the text of the corner header

```ts
const s2Options = {
  cornerText: '自定义角头标题'
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/fyUwaEw2S/3e38caa2-31eb-4272-9158-a1392b5e6f9e.png)

## Description of custom tree structure

<embed src="@/docs/common/custom/customTreeNode.en.md"></embed>
