---
title: 隐藏列头
order: 3
---

对于明细表来说，当你想降低不重要信息干扰时，可以隐藏列头，方便你更直观的查看数据，有两种方式隐藏列头

## 手动隐藏 - 通过点击

点击列头，弹出 tooltip, 点击 `隐藏` 按钮即可

![preview](https://gw.alipayobjects.com/zos/antfincdn/pBa8%24Q1gG/15a1cdef-a4b1-4fcf-a2cf-b6f4a39f710b.png)

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

## 自动隐藏 - 通过配置

```ts
const s2DataConfig = {
  fields: {
    columns: ['province', 'city', 'type', 'price'],
  },
};

const s2Options = {
  hiddenColumnFields: ['city']
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/niXiAVu74/5f9adba7-923c-431f-aa37-95f2d892da8c.png)

`hiddenColumnFields` 支持自动分组，举个例子，比如隐藏的是 `province`, `type`, `price`, 第二列 `city` 未配置隐藏，那么就会得到两组

- ['province']
- ['type', 'price']

从而渲染**两个**隐藏按钮，按钮之间独立作用，点击第一个展开按钮，展开 `province`, 点击第二个展开按钮，展开 `type` 和 `price`

```ts
const s2Options = {
  hiddenColumnFields: ['province', 'type', 'price']
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/TLJEeN7iG/388c8320-ab7a-4601-b8d6-77d186516fb2.png)

还可以集成分析组件，通过改变配置的方式，实现动态隐藏列头，具体请查看 [分析组件](#)
