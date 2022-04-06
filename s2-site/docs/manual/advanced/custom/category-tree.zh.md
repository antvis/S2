---
title: 自定义目录树
order: 2
---

`S2` 默认提供 [平铺模式 (grid)](https://s2.antv.vision/zh/examples/basic/pivot#grid) 和 [树状模式 (tree)](https://s2.antv.vision/zh/examples/basic/pivot#tree) 两种行头布局方式

如果都不满足的话，可以使用自定义目录树，来定制你的目录结构

```ts
const s2Options = {
  hierarchyType: 'customTree', // grid 平铺模式，tree 树状模式
};
```

<playground path='custom/custom-tree/demo/custom-tree.ts' rid='container' height='400'></playground>

## 前提

1、数值需要置于行头，即 `valueInCols: false` （无论配置与否都会强制置于行头，修改无效）

```ts
const s2DataConfig = {
  fields: {
    valueInCols: false
  }
}
```

2、行头需要为空，即 `rows: []` （无论配置与否行头都会强制清空，修改无效）

```ts
const s2DataConfig = {
  fields: {
    rows: [],
  }
}
```

## 配置

生成目录树结构的配置如下：

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

## 自定义角头文本

对于 `自定义目录`, 还可以配置 `cornerText` 自定义角头的文本

```ts
const s2Options = {
  cornerText: '自定义角头标题'
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/fyUwaEw2S/3e38caa2-31eb-4272-9158-a1392b5e6f9e.png)

## 自定义树结构说明

`markdown:docs/common/custom/customTreeItem.zh.md`
