---
title: 自定义单元格宽高
order: 5
tag: Updated
---

S2 可以手动拖拽动态改变单元格的宽高，同时内置了 `行列等宽`, `列等宽` 和 `行列紧凑布局` 三种布局 ([查看例子](/examples/layout/basic/#compact))

我们可以通过 [主题](/docs/manual/basic/theme/) 修改单元格的背景色，字体大小等配置，如果想自定义单元格的宽高，可以通过 `s2Options` 的 [style](/docs/api/general/S2Options#style) 配置来实现

<Playground path='layout/custom/demo/custom-pivot-size.ts' rid='container' height='400'></playground>

<br/>

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

<br/>

<img src="https://gw.alipayobjects.com/zos/antfincdn/%24peMHWxZX/d20c9c80-d8d0-4fae-8d88-d31fe83c8072.png" alt="preview" width="600"/>

## 调整数值单元格宽高

:::warning{title="注意"}

优先级小于 `rowCell.height` 和 `colCell.width`

:::

```ts
const s2Options = {
  style: {
    dataCell: {
      width: 100,
      height: 90
    },
  }
}
```

行头单元格**高度** 和列头单元格的**宽度** 始终和数值单元格一致，所以此时相当于也调整了**行头的高度** 和 **列头的宽度**.

<img src="https://gw.alipayobjects.com/zos/antfincdn/NGkbpdMTE/dc5b22e3-84af-4620-a4ba-3d28c2e29603.png" alt="preview" width="600"/>

## 调整行头单元格宽高

:::warning{title="注意"}
行头单元格高度调整**作用于叶子节点** （非叶子节点的高度是所有子节点高度度总和）, 且高度始终和 **数值单元格** 高度一致。
:::

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

还可以根据当前行头节点信息动态调整，返回 `null` 代表使用默认宽高

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

<img src="https://gw.alipayobjects.com/zos/antfincdn/YKhvdW8Xs/eb290abb-7cf0-44a2-bb79-66334d1f5438.png" alt="preview" width="600"/>

:::info{title="提示"}

如果想给特定某一行/列设置不同的宽高，可以通过 `rowCell` 的 `widthByField` 和 `heightByField` 预设高度来实现，支持两种类型的配置：

- **fieldId** （例：`root[&]浙江省[&]杭州市`):  行列交叉后每一个行头节点对应的唯一 ID, 适用于宽高精确到具体的单元格 [（如何获取 ID）](/docs/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC)
- **field** （例：`city`): 对应 `s2DataConfig.fields.rows` 中配置的 `field`, 适用于精确到某一类维值的单元格

:::

<br/>

```ts
const s2Options = {
  style: {
    rowCell: {
      widthByField: {
        city: 100
      },
      heightByField: {
        'root[&]浙江省[&]杭州市': 60,
        'root[&]浙江省[&]宁波市': 100,
      },
    },
  },
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/oaGLPvya5/bf8b9dfe-1873-4567-9c4b-400632cebbe3.png" alt="preview" width="600"/>

:::info{title="提示"}

明细表有一点特殊，由于只有列头，如果想给**特定行**设置不同的高度，则可以根据行序号调整

:::

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

<br/>

<Playground path='layout/custom/demo/custom-table-size.ts' rid='container' height='400'></playground>

## 调整树状模式下行头宽度

和平铺模式配置无区别

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

## 调整列头单元格宽高

:::warning{title="注意"}
列头单元格宽度调整**作用于叶子节点** （非叶子节点的宽度是所有子节点宽度总和）, 且**宽度**始终和 **数值单元格** 宽度一致
:::

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

<br/>

<img src="https://gw.alipayobjects.com/zos/antfincdn/c48lO0meZ/9deb7f26-f363-421a-b0c5-4d8cdeb910dc.png" alt="preview" width="600"/>

<br/>

如果想给每一列设置**不同**的宽高，可以根据当前列头节点信息动态调整宽高，返回 `null` 代表使用默认宽高

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

:::info{title="提示"}

如果想给特定某一列设置不同的宽高，可以通过 `colCell` 的 `widthByField` 和 `heightByField` 预设宽高来实现，支持两种类型的配置：

- **fieldId** （例：`root[&]家具[&]沙发[&]number`):  行列交叉后每一个列头节点对应的唯一 ID, 适用于宽高精确到具体的单元格 [（如何获取 ID）](/docs/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC)
- **field** （例：`city`): 对应 `s2DataConfig.fields.columns` 中配置的 `field`, 适用于精确到某一类维值的单元格

:::

```ts
import { EXTRA_FIELD } from '@antv/s2'

const s2Options = {
  style: {
    colCell: {
       widthByField: {
        // 默认 [数值挂列头], EXTRA_FIELD 为内部虚拟数值列
        [EXTRA_FIELD]: 60,
        'root[&]家具[&]沙发[&]number': 120,
      },
      heightByField: {
        [EXTRA_FIELD]: 80,
      },
    },
  },
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*lcRNQpDF2eMAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

## 隐藏列头

还可以将高度设置为 `0`, 从而实现**隐藏列头**的效果，[查看例子](/examples/layout/custom#hide-columns)

```ts
const s2Options = {
  style: {
    colCell: {
      height: 0,
    },
  },
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/VKHZ7SqIL/7371cfc3-b8e9-4f0b-a9c5-a9689aa0053a.png" alt="preview" width="600"/>

## API 文档

<embed src="@/docs/common/style.zh.md"></embed>
