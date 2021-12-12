---
title: 自定义目录树
order: 2
---
`S2` 行头提供了三种模式， `grid` 网状平铺、`tree` 树状结构，还有 `customTree` 自定义目录树。

自定义目录树模式适用于数值挂在行头，需要开发者自定义目录结构的场景。

## 前提

这种模式需要一些前提：

1、数值必须置于行头（`dataCfg.fields.valueInCols = false`，无论配置与否都会被强制改为 `false`）

2、`rows` 配置应该为空 (`dataCfg.fields.rows = []` 无论配置与否都会被强制改为 []）

## 配置

生成目录树结构的配置如下：

```ts
const s2options = {
  width: 660,
  height: 600,
  hierarchyType: 'customTree', // 目录树
};

const s2DataConfig = {
  fields: {
    rows: [], // 空
    columns: ['type', 'sub_type'],
    values: [
      'measure-a',
    ],
    customTreeItems, // 行自定义树结构
    valueInCols: false,
  },
  data,
};

```

## 结构描述

`dataCfg.fields.customTreeItems` 结构完全兼容 [antd Tree](https://ant.design/components/tree-cn/) 树形的配置方式，并且在其基础上增加额外的功能元信息。

```ts
export interface CustomTreeItem {
  // 节点唯一标识
  key: string;
  // 节点显示名称
  title: string;
  // 是否收起（默认都展开）
  collapsed?: boolean;
  // 节点描述信息
  description?: string;
  // 子节点描述
  children?: CustomTreeItem[];
}
```

此结构也可以通过内部的一个方法 `transformCustomTreeItems` 进行转换，参考 [例子](/zh/examples/custom/custom-tree#custom-tree)
