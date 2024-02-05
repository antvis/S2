---
title: 自定义折叠/展开节点
order: 7
tag: New
---

S2 支持在树状结构下，配置折叠/展开的节点，默认**展开所有节点**.

> 平铺模式，后续支持

<Playground path='layout/custom/demo/custom-tree-collapse-nodes.ts' rid='container' height='400'></playground>

<br/>

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
    }
  },
}
```

<br/>

## 折叠指定节点

配置 `collapseFields`, 支持 `维值 id` 和 `维度 field` 两种方式，即可以是 `root[&] 浙江省` 和 `city`

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseFields: {},
    },
  },
}
```

### 根据节点对应维值 id

指定 `id` 可以折叠指定节点，如配置为 `root[&] 浙江省`, 那么 `浙江省` 下所有节点都会被折叠

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseFields: {
        'root[& 浙江省': true
      },
    },
  },
}
```

<br/>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*C36jTrhZBAsAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

<br/>

### 根据节点对应维度 field

指定 `field` 可以折叠节点对应维度的节点，如行头配置了 `province`, `city` 两个维度，`collapseFields` 配置为 `['city']`, 那么所有城市都会被折叠

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city']
  }
}

const s2Options = {
  style: {
    rowCell: {
      collapseFields: {
        province: false,
        city: true
      }
    },
  },
}
```

<br/>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*YWWWSoyl96UAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

<br/>

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

## 折叠所有节点

配置 `collapseAll` 即可，**优先级小于** `collapseFields`, 详见 [配置优先级](#配置优先级)

```ts
const s2Options = {
  style: {
    rowCell: {
      collapseAll: true,
    },
  },
}
```

<br/>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*P-jqT4U7YrcAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

<br/>

## 默认展开层级

表格默认展开全部节点，`collapseFields` 需要预先知道对应的 节点 `id` 或 `field`, 当不关心具体节点，只关心节点层级时，可以使用 `expandDepth` 语法糖，配置展开层级 （从 0 开始）**优先级小于** `collapseFields`, 详见 [配置优先级](#配置优先级)

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

<br/>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5nsESLuvc_EAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

<br/>

## 配置优先级

S2 提供了三个 折叠/展开相关配置，已满足不同的使用场景，优先级如下：

`collapseFields` > `expandDepth` > `collapseAll`

如果想让 `collapseAll` 生效，可将 `collapseFields` 和 `expandDepth` 置为 `null` 即可

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

## API 文档

<embed src="@/docs/common/style.zh.md"></embed>
