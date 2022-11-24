---
title: Customize Cell Size
order: 5
---

S2 can manually drag and drop to dynamically change the width and height of cells, and also provides default three layouts: row and column`行列等宽`,`列等宽`and`行列紧凑布局`layout ( [see examples](/examples/layout/basic/#compact) )

We can modify the background color, font size and other configurations of the cell through the [theme](/docs/manual/basic/theme/) . If you want to customize the width and height of the cell, you can use the [style](/docs/api/general/S2Options#style) configuration of `s2Options` to achieve it

<Playground data-mdast="html" path="layout/custom/demo/custom-pivot-size.ts" rid="container" height="400"></playground>

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

## Adjust line header width in tree mode

> Priority is greater than `style.rowCfg.width`

```ts
const s2Options = {
  hierarchyType: 'tree',
  style: {
    treeRowsWidth: 200,
  },
}
```

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/%24peMHWxZX/d20c9c80-d8d0-4fae-8d88-d31fe83c8072.png" alt="preview" width="600">

## Adjust value cell width and height

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

Since the **height** of the row header cell is always the same as the value cell, it is equivalent to adjusting the **height of the row header** at this time

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/NGkbpdMTE/dc5b22e3-84af-4620-a4ba-3d28c2e29603.png" alt="preview" width="600">

## Adjust row header cell width and height

> Priority is less than `style.treeRowsWidth`

```ts
const s2Options = {
  style: {
    rowCfg: {
      width: 50,
    },
  },
}
```

It can also be dynamically adjusted according to the current row header node information, returning `null` means using the default width

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

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/YKhvdW8Xs/eb290abb-7cf0-44a2-bb79-66334d1f5438.png" alt="preview" width="600">

If you want to set a different height for each row, you can use `rowCfg` 's `heightByField` preset height to achieve it. The `field` here corresponds to the unique ID corresponding to each row header node after the row and column cross [(how to get it)](/docs/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC)

```ts
const s2Options = {
  style: {
    rowCfg: {
      heightByField: {
        'root[&] 浙江省 [&] 杭州市': 60,
        'root[&] 浙江省 [&] 宁波市': 100,
      },
    },
  },
}
```

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/oaGLPvya5/bf8b9dfe-1873-4567-9c4b-400632cebbe3.png" alt="preview" width="600">

## Adjust column header cell width and height

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

The width adjustment of column header cells is **applied to leaf nodes** (the width of non-leaf nodes is the sum of the widths of all child nodes)

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/c48lO0meZ/9deb7f26-f363-421a-b0c5-4d8cdeb910dc.png" alt="preview" width="600">

Like the row header, the **width** of the **leaf node** of the column header cell is always the same as that of the value cell, and adjusting the width of the value cell is equivalent to adjusting the width of the **column header**

If you want to set a **different** width for each column, you can dynamically adjust the width according to the current column header node information, return `null` to use the default width

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

You can also use `colCfg.widthByFieldValue` to preset the width. This property is used internally in the S2 table for dragging and dropping to adjust the width and height of data storage. At this time, `fieldValue` corresponds to the column header value configured in `s2DataConfig.fields.columns`

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

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/OXHJhUbEH/85b95114-f5db-48ca-981c-cb29b004514f.png" alt="preview" width="600">

### hide column header

You can also set the height to `0` to achieve the effect of **hiding the column header** , [see an example](/examples/layout/custom#hide-columns)

```ts
const s2Options = {
  style: {
    colCfg: {
      height: 0,
    },
  },
}
```

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/VKHZ7SqIL/7371cfc3-b8e9-4f0b-a9c5-a9689aa0053a.png" alt="preview" width="600">
