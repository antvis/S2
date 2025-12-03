---
title: 分页
order: 6
---

S2 内置了前端分页渲染的能力，但不提供分页组件，需要自行实现。

## 使用

首先需要在 `s2Options` 中配置 `pagination` 属性

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

## 效果预览

第 1 页 (`current: 1`) :

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AyLvT6VcJYMAAAAAAAAAAAAADmJ7AQ/original" width="600"  alt="preview" />

第 2 页 (`current: 2`) :

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Fr7ASIyRuy4AAAAAAAAAAAAADmJ7AQ/original" width="600"  alt="preview" />

## API

### Pagination

功能描述：分页配置。查看 [文档](/manual/advanced/analysis/pagination) 和 [示例](/examples/react-component/pagination/#pivot)

| 参数      | 说明          | 类型   | 默认值 | 必选  |
| --------- | ------------------- | ------ | ------ | --  |
| pageSize  | 每页数量            | `number` | - |  ✓   |
| current   | 当前页（从 1 开始） | `number` | `1` |  ✓   |
| total     | 数据总条数          | `number` | - |      |
