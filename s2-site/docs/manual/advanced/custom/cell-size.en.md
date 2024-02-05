---
title: Customize Cell Size
order: 5
tag: Updated
---

S2 can manually drag and drop to dynamically change the width and height of cells. At the same time, there are three built-in layouts: row and column`行列等宽`,`列等宽`and`行列紧凑布局`layout ( [see examples](/examples/layout/basic/#compact) )

We can modify the background color, font size and other configurations of the cell through the [theme](/docs/manual/basic/theme/) . If you want to customize the width and height of the cell, you can use the [style](/docs/api/general/S2Options#style) configuration of `s2Options` to achieve it

<Playground path="layout/custom/demo/custom-pivot-size.ts" rid="container" height="400"></Playground>

<br>

```ts
const s2Options = {
  style: {
    // 行头单元格配置
    rowCell: {},
    // 列头单元格配置
    colCell: {},
    // 数值单元格配置
    dataCell: {},
  },
}
```

<br>

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24peMHWxZX/d20c9c80-d8d0-4fae-8d88-d31fe83c8072.png" alt="preview" width="600">

## Adjust value cell width and height

> Priority is less than `rowCell.height` and `colCell.width`

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

The **height** of row header cell and the **width** of column header cell are always consistent with the value cell, so it is equivalent to adjusting the **height** of **row header and the width** of column header at this time.

<img src="https://gw.alipayobjects.com/zos/antfincdn/NGkbpdMTE/dc5b22e3-84af-4620-a4ba-3d28c2e29603.png" alt="preview" width="600">

## Adjust row header cell width and height

The height adjustment of row header cells is **applied to leaf nodes** (the height of non-leaf nodes is the sum of the heights of all child nodes), and the height is always consistent with the height of **the value cell** .

```ts
const s2Options = {
  style: {
    rowCell: {
      width: 50,
      height: 50
    },
  },
}
```

It can also be dynamically adjusted according to the current row header node information, returning `null` means using the default width and height

```ts
const s2Options = {
  style: {
    rowCell: {
      width: (rowNode) => {
        // 例：叶子节点 300px, 非叶子节点 200px
        return rowNode.isLeaf ? 300 : 200;
      },
      height: (rowNode) => {
        // 例：偶数行高度 300pox, 奇数行默认高度
        return rowNode.level % 2 === 0 ? 300 : null,
      }
    },
  },
}
```

<br>

<img src="https://gw.alipayobjects.com/zos/antfincdn/YKhvdW8Xs/eb290abb-7cf0-44a2-bb79-66334d1f5438.png" alt="preview" width="600">

<br>

If you want to set different widths and heights for a specific row/column, you can use `rowCell` 's `widthByField` and `heightByField` preset heights to achieve it. Two types of configurations are supported:

* **fieldId** (eg: `root[&] 浙江省[&] 杭州市`): the unique ID corresponding to each row head node after the row and column cross, applicable to specific cells whose width and height are accurate [(how to get the ID)](/docs/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC)
* **field** (example: `city` ): corresponds to the `field` configured in `s2DataConfig.fields.rows` , applicable to cells accurate to a certain type of dimension value

<br>

```ts
const s2Options = {
  style: {
    rowCell: {
      widthByField: {
        city: 100
      },
      heightByField: {
        'root[&] 浙江省 [&] 杭州市': 60,
        'root[&] 浙江省 [&] 宁波市': 100,
      },
    },
  },
}
```

<br>

<img src="https://gw.alipayobjects.com/zos/antfincdn/oaGLPvya5/bf8b9dfe-1873-4567-9c4b-400632cebbe3.png" alt="preview" width="600">

<br>

The schedule is a bit special. Since there are only column headers, if you want to set a different height for a specific row, you can adjust it according to the row number

```ts
const s2Options = {
  style: {
    rowCell: {
      // 给第一行和第三行设置不同的高度
      heightByField: {
        '1': 130,
        '3': 60,
      },
    },
  },
}
```

<br>

<Playground path="layout/custom/demo/custom-table-size.ts" rid="container" height="400"></Playground>

## Adjust line header width in tree mode

No difference from tile mode configuration

```ts
const s2Options = {
  hierarchyType: 'tree',
  style: {
    rowCell: {
      width: 200,
    }
  },
}
```

## Adjust column header cell width and height

The width adjustment of column header cells is **applied to leaf nodes** (the width of non-leaf nodes is the sum of the widths of all child nodes), and the **width** is always consistent with the width of **the value cell**

```ts
const s2Options = {
  style: {
    colCell: {
      width: 200,
      height: 60,
    },
  },
}
```

<br>

<img src="https://gw.alipayobjects.com/zos/antfincdn/c48lO0meZ/9deb7f26-f363-421a-b0c5-4d8cdeb910dc.png" alt="preview" width="600">

<br>

If you want to set a **different** width and height for each column, you can dynamically adjust the width and height according to the current column header node information, return `null` to use the default width and height

```ts
const s2Options = {
  style: {
    colCell: {
      width: (colNode) => {
        // 例：前两列宽度 100px, 其他 50px
        return colNode.colIndex <= 2 ? 100 : 50
      },
      height: (colNode) => {
        // 例：前两列高度 100px, 其他 50px
        return colNode.colIndex <= 2 ? 100 : 50
      },
    },
  },
}
```

If you want to set different widths and heights for a specific column, you can use `colCell` 's `widthByField` and `heightByField` preset widths and heights to achieve it. Two types of configurations are supported:

* **fieldId** (example: `root[&] 家具[&] 沙发[&]number` ): the unique ID corresponding to each column head node after the row and column cross, applicable to specific cells whose width and height are accurate [(how to get the ID)](/docs/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC)
* **field** (example: `city` ): corresponds to the `field` configured in `s2DataConfig.fields.columns` , applicable to cells accurate to a certain type of dimension value

```ts
import { EXTRA_FIELD } from '@antv/s2'

const s2Options = {
  style: {
    colCell: {
       widthByField: {
        // 默认 [数值挂列头], EXTRA_FIELD 为内部虚拟数值列
        [EXTRA_FIELD]: 60,
        'root[&] 家具 [&] 沙发 [&]number': 120,
      },
      heightByField: {
        [EXTRA_FIELD]: 80,
      },
    },
  },
}
```

<br>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*lcRNQpDF2eMAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600">

<br>

## hide column header

You can also set the height to `0` to achieve the effect of **hiding the column header** , [see an example](/examples/layout/custom#hide-columns)

```ts
const s2Options = {
  style: {
    colCell: {
      height: 0,
    },
  },
}
```

<br>

<img src="https://gw.alipayobjects.com/zos/antfincdn/VKHZ7SqIL/7371cfc3-b8e9-4f0b-a9c5-a9689aa0053a.png" alt="preview" width="600">

## API documentation

<embed src="@/docs/common/style.en.md"></embed>
