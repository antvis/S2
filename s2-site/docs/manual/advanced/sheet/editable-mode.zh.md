---
title: 编辑表
order: 3
---

<Badge>@antv/s2-react</Badge>

编辑表是明细表的衍生形态之一。在提供完整的明细表的分析功能之外，还支持对数据的修改操作，双击数值单元格后，会添加一个带有 `<input />` 的  `div` 蒙层，定位到当前单元格上方，从而实现数据的编辑能力。

:::warning{title="注意"}
**透视表**定位更多是看数分析，暂不支持编辑能力，如有必要，或者想直接使用 `@antv/s2` 实现编辑功能，可参考 [明细表的实现](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/sheets/editable-sheet/custom-cell/edit-cell/index.tsx) 自行封装。
:::

<img alt="editable-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600" />

## 快速上手

<details>
  <summary>查看数据</summary>

  ```ts
  // 1. 准备数据
  const data = [
    {
      "province": "浙江",
      "city": "杭州",
      "type": "笔",
      "price": 1
    },
    {
      "province": "浙江",
      "city": "杭州",
      "type": "纸张",
      "price": 2
    },
    {
      "province": "浙江",
      "city": "舟山",
      "type": "笔",
      "price": 17
    },
    {
      "province": "浙江",
      "city": "舟山",
      "type": "纸张",
      "price": 6
    },
    {
      "province": "吉林",
      "city": "长春",
      "type": "笔",
      "price": 8
    },
    {
      "province": "吉林",
      "city": "白山",
      "type": "笔",
      "price": 12
    },
    {
      "province": "吉林",
      "city": "长春",
      "type": "纸张",
      "price": 3
    },
    {
      "province": "吉林",
      "city": "白山",
      "type": "纸张",
      "price": 25
    },

    {
      "province": "浙江",
      "city": "杭州",
      "type": "笔",
      "price": 20
    },
    {
      "province": "浙江",
      "city": "杭州",
      "type": "纸张",
      "price": 10
    },
    {
      "province": "浙江",
      "city": "舟山",
      "type": "笔",
      "price": 15
    },
    {
      "province": "浙江",
      "city": "舟山",
      "type": "纸张",
      "price": 2
    },
    {
      "province": "吉林",
      "city": "长春",
      "type": "笔",
      "price": 15
    },
    {
      "province": "吉林",
      "city": "白山",
      "type": "笔",
      "price": 30
    },
    {
      "province": "吉林",
      "city": "长春",
      "type": "纸张",
      "price": 40
    },
    {
      "province": "吉林",
      "city": "白山",
      "type": "纸张",
        "price": 50
      }
    ]
  ```

</details>

```tsx
import React from "react";
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const s2DataCfg = {
  fields: {
    columns: ["province", "city", "type", "price"],
  },
  meta: [
    // 列头字段对应的元信息，比如展示的中文名
    {
      field: "province",
      name: "省份",
    },
    {
      field: "city",
      name: "城市",
    },
    {
      field: "type",
      name: "类型",
    },
    {
      field: "price",
      name: "价格",
    },
  ],
  data,
};

const s2Options = {
  width: 400,
  height: 200,
};

const App = () => {
  // 编辑完成
  const onDataCellEditEnd = (meta) => {
    console.log('onDataCellEditEnd', meta);
  };

  return (
    <SheetComponent
      sheetType="editable"
      dataCfg={s2DataCfg}
      options={s2Options}
      onDataCellEditEnd={onDataCellEditEnd}
    />
  )
}
```

## 示例

<Playground path='react-component/sheet/demo/editable.tsx' rid='editable'></playground>
