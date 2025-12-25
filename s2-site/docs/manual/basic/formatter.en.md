---
title: Data Formatting
order: 9

---

`s2DataConfig` supports configuring `meta` to format data.

<Playground path="basic/pivot/demo/grid.ts" rid='grid' height="200"></playground>

## Custom Row and Column Header Dimension Names

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
      name: 'Province',
    },
    {
      field: 'city',
      name: 'City',
    },
    {
      field: 'type',
      name: 'Category',
    },
    {
      field: 'sub_type',
      name: 'Sub-category',
    },
    {
      field: 'number',
      name: 'Quantity',
    },
  ]
};
```

## Custom Numerical Format

You can customize the format of numerical values using `formatter`. The function receives:

- `value`: The current cell's value.
- `record`: The entire row of data for the current cell.
- `meta`: The original metadata for the current cell.

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
      name: 'Province',
    },
    {
      field: 'city',
      name: 'City',
    },
    {
      field: 'type',
      name: 'Category',
    },
    {
      field: 'sub_type',
      name: 'Sub-category',
    },
    {
      field: 'number',
      name: 'Quantity',
      formatter: (value, record, meta) => {
        return `${value / 100} %`
      },
    },
  ]
}
```

## Bulk Settings

If multiple fields share the same formatting, you can configure them in an array for bulk setup or use a regular expression to match fields.

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

## Retain Formatting on Copy/Export

By default, copy and export operations use the original data. By enabling `withFormat`, the `name` and `formatter` from the `meta` configuration will be used for copying and exporting.

```ts
const s2Options = {
  interaction: {
    copy: {
      withFormat: true
    }
  }
}
```
