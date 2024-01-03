---
title: 自定义目录树
order: 2
tag: New
---

`S2` 默认提供 [平铺模式 (grid)](/examples/basic/pivot#grid) 和 [树状模式 (tree)](/examples/basic/pivot#tree) 两种行头布局方式

如果都不满足的话，可以使用自定义目录树，来定制你的目录结构

```ts
const s2Options = {
  hierarchyType: 'tree', // grid 平铺模式，tree 树状模式
};
```

<Playground path='custom/custom-tree/demo/custom-tree.ts' rid='container' height='400'></playground>

## 前提

1、数值需要**置于行头**，即 `valueInCols: false` （无论配置与否都会强制置于行头，修改无效）

```ts
const s2DataConfig = {
  fields: {
    valueInCols: false
  }
}
```

2、行头需要为**标准树状结构**, 见下文 [数据结构说明](#customtreenode)

## 配置

生成目录树结构的配置如下：

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

## 节点名称格式化

默认使用 `customTreeNode.title` 作为节点名称，也可以使用通用的格式化函数处理特定节点

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

## 节点展开/收起

默认使用 `customTreeNode.collapsed` 作为展开/收起状态，也可以使用通用的配置，具体请查看 [自定义折叠/展开节点](/manual/advanced/custom/custom-collapse-nodes) 章节

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

## 自定义角头文本

对于 `自定义目录`, 还可以配置 `cornerText` 自定义角头的文本

```ts
const s2Options = {
  cornerText: '自定义角头标题'
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/fyUwaEw2S/3e38caa2-31eb-4272-9158-a1392b5e6f9e.png)

## 自定义树结构说明

<embed src="@/docs/common/custom/customTreeNode.zh.md"></embed>
