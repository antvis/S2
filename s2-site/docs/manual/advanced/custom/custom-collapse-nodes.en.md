---
title: Custom Collapse/Expand Nodes
order: 7
---

S2 supports configuring collapsed/expanded nodes in the tree structure, and **expands all nodes** by default.

> Tiling mode, follow-up support

<Playground path="layout/custom/demo/custom-tree-collapse-nodes.ts" rid="container" height="400"></Playground>

<br>

```ts
const s2Options = {
  hierarchyType: 'tree',
  style: {
    rowCell: {
      // 折叠节点
      collapseFields: {},
      // 展开层级
      expandDepth: 0,
      // 折叠所有
      collapseAll: true
    },
  },
}
```

<br>

## Collapse the specified node

Configure `collapseFields` to support two ways of`维值id` and`维度field` , that is, `root[&] 浙江省`and `city`

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseFields: {},
    },
  },
}
```

### According to the dimension value id corresponding to the node

Specify `id` to fold the specified node, if configured as `root[&] 浙江省`, then all nodes`浙江省`will be folded

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseFields: { 'root[&] 浙江省': true },
    },
  },
}
```

<br>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*C36jTrhZBAsAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600">

<br>

### According to the dimension field corresponding to the node

Specifies that the `field` can collapse the node corresponding to the dimension of the node. For example, if the line header is configured with two dimensions of `province` and `city` , and `collapseFields` is configured as `['city']` , then all cities will be collapsed

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city']
  }
}
const s2Options = {
  style: {
    rowCell: {
      collapseFields: { province: false, city: true }
    },
  },
}
```

<br>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*YWWWSoyl96UAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600">

<br>

```ts
const s2Options = {
  style: {
    dataCell: {
      width: 100,
      height: 90
    },
  },
}
```

## collapse all nodes

Just configure `collapseAll` , the **priority is lower than** `collapseFields` , see [configuration priority](#%E9%85%8D%E7%BD%AE%E4%BC%98%E5%85%88%E7%BA%A7) for details

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseAll: true,
    },
  },
}
```

<br>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*P-jqT4U7YrcAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600">

<br>

## default expansion level

The table expands all nodes by default. `collapseFields` needs to know the corresponding node `id` or `field` in advance. When you don’t care about the specific node but only the node level, you can use the `expandDepth` syntactic sugar to configure the expansion level (starting from 0) with a **lower priority than** `collapseFields` . For details, see [configuration priority](#%E9%85%8D%E7%BD%AE%E4%BC%98%E5%85%88%E7%BA%A7)

```ts
const s2Options = {
  style: {
    rowCell: {
      // 展开两层
      expandDepth: 1,
    },
  },
}
```

<br>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5nsESLuvc_EAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600">

<br>

## configuration priority

S2 provides three folding/expanding related configurations to meet different usage scenarios, and the priorities are as follows:

`collapseFields` > `expandDepth` > `collapseAll`

If you want `collapseAll` to take effect, you can set `collapseFields` and `expandDepth` to `null`

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseFields: null, // 无效
      collapseAll: true, // 生效
      expandDepth: null, // 无效
    },
  },
}
```

## API documentation

<embed src="@/docs/common/style.en.md"></embed>
