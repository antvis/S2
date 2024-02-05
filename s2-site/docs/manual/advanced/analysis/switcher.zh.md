---
title: 维度切换
order: 2
---

<Badge>@antv/s2-react</Badge>

S2 提供开箱即用的维度切换组件 `<Switcher/>`, 借助它，你可以非常方便的实现交互式行列切换，以及维度隐藏的功能。

<img src="https://gw.alipayobjects.com/zos/antfincdn/fyf455mio/2021-09-29%25252015.08.03.gif" height="400" alt="preview" />

## 快速上手

<details>
<summary>点击查看 Switcher 维度配置</summary>

```js
const switcherFields = {
  rows: {
    items: [{ id: "province" }, { id: "city" }],
    allowEmpty: false,
  },
  columns: {
    items: [{ id: "type" }],
  },
  values: {
    selectable: true,
    items: [{ id: "price" }, { id: "cost" }],
  },
};
```

</details>

```tsx
import React from "react";
import { Switcher } from "@antv/s2-react";
import '@antv/s2-react/dist/style.min.css';

const onSubmit = (result) => {
  console.log("result:", result);
};

const App = () => {
  return (
    <Switcher {...switcherFields} onSubmit={onSubmit} />,
  )
}
```

<Playground path='react-component/switcher/demo/pure-switcher.tsx' rid='pure-switcher'></playground>

## 配置解释

### 维度配置

:::info{title="提示"}
Switcher 可接收三种类型的维度配置，分别是 `rows`，`columns` 和 `values`, 它们的类型皆为 [SwitcherField](/docs/api/components/switcher#switcherfield)。

其中 `rows` 和 `columns` 两个维度可以相互拖拽到彼此的配置框中，而 `values` 只能在自己的配置框中更改字段顺序。

:::

通过传入 `sheetType` 以及维度配置，`Switcher` 的展示形态也会有所不同：

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="50%"/>
    <col width="50%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        一种维度（主要用于明细表）
      </td>
      <td style="text-align: center;">
        三种维度（主要用于透视表）
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        <img height="400" alt="one-dimension" style="max-height: unset;" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*a0uHRZ70hDcAAAAAAAAAAAAAARQnAQ" />
      </td>
      <td style="text-align: center;">
        <img height="400" alt="three-dimensions" style="max-height: unset;" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*FTYGTLw7e5wAAAAAAAAAAAAAARQnAQ" />
      </td>
    </tr>
  </tbody>
</table>

#### 可选中

* 每个维度默认只能进行**拖拽排序**, 如果你希望能控制其字段的**显隐**，可以设置 `selectable: true`, 该属性用于开启字段的 `checkbox` :

```js
const field = {
  selectable: true,
  items: [
    /*...*/
  ],
};
```

#### 展开子项

* 如果维度中的每一个字段项还存在关联子项，可以设置 `expandable:true`, 该属性用于控制子项是否被展开，也可以进一步设置 `expandText` 定制展开 `checkbox` 的提示文字：

```js
const field = {
  expandable: true,
  expandText: "展开同环比", // 默认：展开子项
  items: [
    /*...*/
  ],
};
```

#### 允许为空

* 如果当前维度在移动交互中需要至少保留一个子项不能被拖拽出去，可以设置 `allowEmpty:false`, 该属性用于控制维度是否可以将全部子项拖出到其他维度：

```js
const field = {
  allowEmpty: false, // 默认：true
  items: [
    /*...*/
  ],
};
```

![allowEmpty](https://gw.alipayobjects.com/zos/antfincdn/rUmA%26o3J%26/2022-02-24%25252017.31.46.gif)

### 提交修改

`Switcher` 组件在弹窗关闭后会触发 `onSubmit` 回调，且此回调会接收一个 [SwitcherResult](/docs/api/components/switcher#switcherresult) 类型的参数，你可以通过该回调拿到修改后的结果。

所有结果会**按维度**分组，并且每一组字段会**扁平化后**按按顺序排序，你可以通过以下示例查看详细的结果数据类型。

<Playground path='react-component/switcher/demo/pivot.tsx' rid='result'></playground>

:::warning{title="注意"}

出于减少内部状态过时的考虑，`Switcher` 组件内部**并不会持久化操作后状态**。也就是说在每次弹窗关闭后，`Switcher` 内部状态会清空，再次打开时还是以组件 `props` 中的各个维度配置为准。

:::

### 定制化

* 如果 `Switcher` 组件内置的触发按钮不满足你的需求，可通过 `title` 定制化触发按钮
* `Switcher` 组件也提供了 `resetText` 属性用于定义重置按钮的问题

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*tElLTIzXBR0AAAAAAAAAAAAAARQnAQ" height="400" alt="preview" />

* `Switcher` 组件的弹出层基于 `antd` 的 [Popover](https://ant.design/components/popover-cn/) 开发，支持透传 `Popover` [配置项](https://ant.design/components/popover-cn/#API), 进行弹出层的自定义，比如 `触发方式`, `箭头指向`, `卡片弹出方向` 等

```tsx
<Switcher popover={{ arrowPointAtCenter: true }} />
```

🎨 `Switcher` 组件详细的配置参考 [Switcher Props](/docs/api/components/switcher) 文档。

## 示例

### 结合透视表使用

:::info{title="提示"}

* 行列值可以相互移动
* 指标值可以控制显隐

:::

<Playground path='react-component/switcher/demo/pivot-with-children.tsx' rid='pivot'></playground>

### 结合明细表使用

:::info{title="提示"}

* 列头可以控制显隐
* 表格列头对应出现展开图标

:::

<Playground path='react-component/switcher/demo/table.tsx' rid='table'></playground>

​📊 查看更多 [维度切换示例](/examples/react-component/switcher#pure-switcher)。
