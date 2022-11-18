---
title: Customize Category Tree
order: 2
---

By default, `S2` provides two row header layout modes [: tile mode (grid)](https://s2.antv.vision/zh/examples/basic/pivot#grid) and [tree mode (tree)](https://s2.antv.vision/zh/examples/basic/pivot#tree) .

If you are not satisfied, you can use a custom directory tree to customize your directory structure

```ts
const s2Options = {
  hierarchyType: 'customTree', // grid 平铺模式，tree 树状模式
};
```

<Playground data-mdast="html" path="custom/custom-tree/demo/custom-tree.ts" rid="container" height="400"></playground>

## premise

1\. The value needs to be placed at the head of the line, that is, `valueInCols: false` (regardless of whether it is configured or not, it will be placed at the head of the line forcibly, and the modification is invalid)

```ts
const s2DataConfig = {
  fields: {
    valueInCols: false
  }
}
```

2\. The row header needs to be empty, that is, `rows: []` (regardless of configuration or not, the row header will be forcibly cleared, and the modification is invalid)

```ts
const s2DataConfig = {
  fields: {
    rows: [],
  }
}
```

## configuration

The configuration to generate the directory tree structure is as follows:

```ts
const s2Options = {
  hierarchyType: 'customTree',
};

const customTreeItems = [
  {
    title: '自定义节点 A',
    key: 'custom-node-1',
    children: [
      {
        title: '指标 A',
        key: 'measure-a',
      },
      {
        title: '指标 B',
        key: 'measure-b',
      },
    ],
  },
  {
    title: '自定义节点 B',
    key: 'custom-node-2',
    children: [
      {
        title: '自定义节点 D',
        key: 'custom-node-2-1',
        collapsed: true,
        children: [{ title: '指标 F', key: 'measure-f' }],
      },
    ],
  },
];

const s2DataConfig = {
  fields: {
    rows: [],
    valueInCols: false,
    columns: ['type', 'sub_type'],
    values: [
      'measure-a',
    ],
    customTreeItems
  },
  data,
};
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

<embed src="@/docs/common/custom/customTreeItem.zh.md"></embed>
