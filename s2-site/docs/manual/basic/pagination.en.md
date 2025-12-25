---
title: Pagination
order: 11

---

<Badge>@antv/s2</Badge>

<embed src="@/common/pagination.en.md"></embed>

### Usage with a Pagination Component

<img src="https://gw.alipayobjects.com/zos/antfincdn/LVw2QOvjgW/b1563a7b-4070-4d61-a18b-6558e2c5b27b.png" width="600"  alt="preview" />

S2 has built-in front-end pagination rendering capabilities but does not provide a pagination component. You need to implement it yourself.

## Usage

First, you need to configure the `pagination` property in `s2Options`.

```ts | {4-7}
const s2Options = {
  width: 600,
  height: 480,
  pagination: {
    pageSize: 4,
    current: 1,
  }
};
```

## Preview

Page 1 (`current: 1`):

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AyLvT6VcJYMAAAAAAAAAAAAADmJ7AQ/original" width="600"  alt="preview" />

Page 2 (`current: 2`):

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Fr7ASIyRuy4AAAAAAAAAAAAADmJ7AQ/original" width="600"  alt="preview" />

## API

### Pagination

Description: Pagination configuration. See the [documentation](/manual/advanced/analysis/pagination) and [example](/examples/react-component/pagination/#pivot).

| Parameter | Description | Type | Default | Required |
|---|---|---|---|---|
| pageSize | The number of items per page. | `number` | - | ✓ |
| current | The current page number (starting from 1). | `number` | `1` | ✓ |
| total | The total number of data items. | `number` | - | |
