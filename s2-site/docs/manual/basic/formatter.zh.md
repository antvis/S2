---
title: 数据格式化
order: 9
tag: New
---

`s2DataConfig` 支持配置 `meta` 对数据进行格式化

<Playground path="basic/pivot/demo/grid.ts" rid='grid' height="200"></playground>

## 自定义行列头维值名称

```ts {7,10}
 const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  meta: [
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '商品类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
    {
      field: 'number',
      name: '数量',
    },
  ]
};
```

## 自定义数值格式

可以通过 `formatter` 自定义数值的格式，可以拿到

- `value`: 当前单元格数值
- `record`: 当前单元格整行数据
- `meta`: 当前单元格原信息

```ts {7,27-29}
 const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  meta: [
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '商品类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
    {
      field: 'number',
      name: '数量',
      formatter: (value, record, meta) => {
        return `${value / 100} %`
      },
    },
  ]
}
```

## 批量设置

如果多个字段格式化一致，可以配置为数组以便于批量设置，或使用正则匹配。

```ts
 const s2DataConfig = {
  meta: [
    {
      field: ['province', 'city'],
      formatter: (value, record, meta) => {
        return `${value}-test`
      },
    },
    {
      field: /type/,
      formatter: (value, record, meta) => {
        return `${value}-test`
      },
    }
  ]
}
```

## 复制导出时保留格式化信息

复制导出默认使用原数据进行处理，开启 `withFormat` 后，则以 `meta` 中的 `name` 和 `formatter` 进行复制导出。

```ts
const s2Options = {
  interaction: {
    withFormat: true
  }
}
```
