---
title: 隐藏列头
order: 2
---

当你想降低不重要信息干扰时，可以隐藏列头，方便你更直观的查看数据，有三种方式隐藏列头

<Playground path='interaction/advanced/demo/pivot-hide-columns.ts' rid='pivot-hide-columns' height='400'></playground>

## 1. 手动隐藏 - 通过点击

点击列头在弹出的 `tooltip` 里，点击 `隐藏` 按钮即可

<img src="https://gw.alipayobjects.com/zos/antfincdn/pBa8%24Q1gG/15a1cdef-a4b1-4fcf-a2cf-b6f4a39f710b.png" width="400" alt="preview" />

关闭交互式隐藏

```ts
const s2Options = {
  tooltip: {
    operation: {
      hiddenColumns: false,
    },
  },
}
```

## 2. 自动隐藏 - 通过配置

可配置默认隐藏的列头，透视表和明细表

### 1. 明细表

明细表不存在多列头，指定 `fields` 的 `columns` 里面任意字段即可

```ts
const s2DataConfig = {
  fields: {
    columns: ['province', 'city', 'type', 'price'],
  },
};

const s2Options = {
  interaction: {
    hiddenColumnFields: ['city']
  }
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/GHizMg2ok/f8d667c9-910a-40da-a6e3-74c238e7afa8.png)

### 2. 透视表

透视表存在多列头，需要指定列头对应的 [节点 id](/docs/api/basic-class/node)

<details>
  <summary>如何获取列头 Id?</summary>

```ts
// /docs/api/basic-class/spreadsheet
const s2 = new PivotSheet()
console.log(s2.facet.getColCellNodes())
```

</details>

```ts
const s2DataConfig = {
  fields: {
    rows: [
      'province',
      'city'
    ],
    columns: [
      'type',
      'sub_type'
    ],
    values: [
      'number'
    ],
    valueInCols: true
  },
}

const s2Options = {
  interaction: {
    hiddenColumnFields: ['root[&]家具[&]沙发[&]number'],
  }
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/1VeZokRvz/a1933e73-f3ed-4289-beb1-8a06fa3292b6.png)

`hiddenColumnFields` 支持自动分组，举个示例，比如隐藏的是 `province`, `type`, `price`

```ts
const s2Options = {
  interaction: {
    hiddenColumnFields: ['province', 'type', 'price']
  }
}
```

第二列 `city` 未配置隐藏，那么就会得到两组

- ['province']
- ['type', 'price']

从而渲染**两个**隐藏按钮，按钮之间独立作用，点击第一个展开按钮，展开 `province`, 点击第二个展开按钮，展开 `type` 和 `price`

![preview](https://gw.alipayobjects.com/zos/antfincdn/LYrMG8bf5/660aa34c-5fce-4f62-b422-ee6d3b5478d1.png)

还可以集成分析组件，通过改变配置的方式，实现动态隐藏列头，具体请查看 [分析组件](/docs/manual/basic/analysis/switcher/)

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*a0uHRZ70hDcAAAAAAAAAAAAAARQnAQ" height="300" alt="preview" />

## 3. 手动隐藏 - 通过实例方法

[查看所有 API](/docs/api/basic-class/interaction)

```ts
const s2 = new PivotSheet(...)

const hiddenColumnFields = ['province', 'type', 'price']
s2.interaction.hideColumns(hiddenColumnFields)
```

## 获取隐藏列头数据

可通过 `S2Event` 透出的 `COL_CELL_EXPANDED` 和 `COL_CELL_HIDDEN` 分别监听列头的展开和隐藏

```ts
import { S2Event } from '@antv/s2'

const s2 = new PivotSheet(...);

s2.on(S2Event.COL_CELL_EXPANDED, (cell) => {
  console.log('列头展开', cell);
});

s2.on(
  S2Event.COL_CELL_HIDDEN,
  (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
    console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
  },
);
```

也可以访问存储在 [`store`](/docs/api/basic-class/store) 的 `hiddenColumnsDetail` 主动获取

```ts
const hiddenColumnsDetail = s2.store.get('hiddenColumnsDetail')
console.log(hiddenColumnsDetail)
```
