---
title: 自定义单元格宽高
order: 5
---

S2 可以手动拖拽动态改变单元格的宽高，也提供默认的 `行列等宽`, `列等宽` 和 `行列紧凑布局` 三种布局 ([查看例子](/zh/examples/layout/basic/#compact))

我们可以通过 [主题](/zh/docs/manual/basic/theme/) 修改单元格的背景色，字体大小等配置，如果想自定义单元格的宽高，可以通过 `s2Options` 的 [style](/zh/docs/api/general/S2Options#style) 配置来实现

<Playground path='layout/custom/demo/custom-pivot-size.ts' rid='container' height='400'></playground>

```ts
const s2Options = {
  style: {
    // 树状模式下行头宽度
    treeRowsWidth: 100,
    // 数值单元格配置
    cellCfg: {},
    // 列头配置
    colCfg: {},
    // 行头配置
    rowCfg: {},
  },
}
```

## 调整树状模式下行头宽度

> 优先级大于 `style.rowCfg.width`

```ts
const s2Options = {
  hierarchyType: 'tree',
  style: {
    treeRowsWidth: 200,
  },
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24peMHWxZX/d20c9c80-d8d0-4fae-8d88-d31fe83c8072.png" alt="preview" width="600"/>

## 调整数值单元格宽高

```ts
const s2Options = {
  style: {
    cellCfg: {
      width: 100,
      height: 90
    },
  },
}
```

由于行头单元格**高度**始终和数值单元格一致，所以此时相当于也调整了**行头的高度**

<img src="https://gw.alipayobjects.com/zos/antfincdn/NGkbpdMTE/dc5b22e3-84af-4620-a4ba-3d28c2e29603.png" alt="preview" width="600"/>

## 调整行头单元格宽高

> 优先级小于 `style.treeRowsWidth`

```ts
const s2Options = {
  style: {
    rowCfg: {
      width: 50,
    },
  },
}
```

还可以根据当前行头节点信息动态调整，返回 `null` 代表使用默认宽度

```ts
const s2Options = {
  style: {
    rowCfg: {
      width: (row) => {
        console.log('row: ', row);
        // 动态配置：叶子节点 300px, 非叶子节点 200px
        return row.isLeaf ? 300 : 200;
      },
    },
  },
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/YKhvdW8Xs/eb290abb-7cf0-44a2-bb79-66334d1f5438.png" alt="preview" width="600"/>

如果想给每一行设置不同的高度，可以通过 `rowCfg` 的 `heightByField` 预设高度来实现，这里的 `field` 对应行列交叉后每一个行头节点对应的唯一 ID [（如何获取）](/zh/docs/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC)

```ts
const s2Options = {
  style: {
    rowCfg: {
      heightByField: {
        'root[&]浙江省[&]杭州市': 60,
        'root[&]浙江省[&]宁波市': 100,
      },
    },
  },
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/oaGLPvya5/bf8b9dfe-1873-4567-9c4b-400632cebbe3.png" alt="preview" width="600"/>

## 调整列头单元格宽高

```ts
const s2Options = {
  style: {
    colCfg: {
      width: 200,
      height: 60,
    },
  },
}
```

列头单元格宽度调整**作用于叶子节点** （非叶子节点的宽度是所有子节点宽度总和）

<img src="https://gw.alipayobjects.com/zos/antfincdn/c48lO0meZ/9deb7f26-f363-421a-b0c5-4d8cdeb910dc.png" alt="preview" width="600"/>

和行头一样，列头单元格**叶子节点**的**宽度**始终和数值单元格一致，调整数值单元格的宽度相当于也调整了**列头的宽度**

如果想给每一列设置**不同**的宽度，可以根据当前列头节点信息动态调整宽度，返回 `null` 代表使用默认宽度

```ts
const s2Options = {
  style: {
    colCfg: {
      width: (colNode) => {
        console.log('colNode: ', colNode);
        return colNode.colIndex <= 2 ? 100 : 50
      },
    },
  },
}
```

还可以通过 `colCfg.widthByFieldValue` 来预设宽度实现，S2 表格内部使用该属性用来做拖拽调整宽高的数据存储，此时 `fieldValue` 对应 `s2DataConfig.fields.columns` 中配置的列头数值

```ts
const s2Options = {
  style: {
    colCfg: {
      widthByFieldValue: {
        number: 200,
      }
    },
  },
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/OXHJhUbEH/85b95114-f5db-48ca-981c-cb29b004514f.png" alt="preview" width="600"/>

### 隐藏列头

还可以将高度设置为 `0`, 从而实现**隐藏列头**的效果，[查看例子](/zh/examples/layout/custom#hide-columns)

```ts
const s2Options = {
  style: {
    colCfg: {
      height: 0,
    },
  },
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/VKHZ7SqIL/7371cfc3-b8e9-4f0b-a9c5-a9689aa0053a.png" alt="preview" width="600"/>
