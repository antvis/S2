---
title: 维度切换组件
order: 10
---

内部不维护状态
自定义 title

S2 自带维度切换组件 Switcher 。借助它，你可以非常方便的实现交互式行列切换，以及维度隐藏的功能。

![preview](https://gw.alipayobjects.com/zos/antfincdn/fyf455mio/2021-09-29%25252015.08.03.gif)

## 快速上手

<details>
<summary>点击查看 Switcher 维度配置</summary>

```js
const switcherFields = {
  rows: {
    items: [{ id: "province" }, { id: "city" }],
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

```js
import React from "react";
import ReactDOM from "react-dom";
import { Switcher } from "@antv/s2";

const onSubmit = (result) => {
  console.log("result:", result);
};

ReactDOM.render(
  <Switcher {...switcherFields} onSubmit={onSubmit} />,
  document.getElementById("container")
);

```

<playground path='analysis/switcher/demo/pure-switcher.tsx' rid='container'></playground>

## 配置解释

### 维度配置

Switcher 可接收三种类型的维度配置，分别是`rows`，`columns`和`values`。它们的类型皆为 [SwitcherField](/zh/docs/api/components/switcher#switcherfield)。

> 其中`rows`和`columns`两个维度可以相互拖拽到彼此的配置框中，而`values`只能在自己的配置框中更改字段顺序。

通过传入不同维度配置，Switcher 的展示形态也会有所不同：
<table
        style="width: 100%; outline: none; border-collapse: collapse;"
      >
        <colgroup>
          <col width="33%"/>
          <col width="33%" />
        </colgroup>
        <tbody>
        <tr>
            <td style="text-align: center;">
            三种维度
            </td>
              <td style="text-align: center;">
            两种维度
            </td>
              <td style="text-align: center;">
            一种维度
            </td>
        </tr>
         <tr style="vertical-align: top;">
          <td>
             <img alt="three-dimensions" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/yp0RwxxNa/93e973ba-38d1-41b5-b6c7-374dbb003850.png">
            </td>
            <td>
             <img alt="two-dimensions" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/tAUVwe9CP/93feeb52-1490-430f-98a3-fdba64750f31.png">
            </td>
              <td>
            <img alt="one-dimension" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/fuvYDKebN/75b333ef-56f4-4c2c-ba15-12c4fd03113c.png">
            </td>
        </tr>
        </tbody>
  </table>

* 每个维度默认只能进行拖拽排序。如果你希望能控制其字段的显隐，可以设置其`selectable`属性用于开启字段的 checkbox：

```js
const field = {
  selectable: true,
  items: [
    /*...*/
  ],
};
```

* 如果维度中的每一个字段项还存在关系子项，可以设置其`expandable`属性用于开发展开子项的 checkbox，也可以进一步设置`expandText`定制展开 checkbox 的提示文字：

```js
const field = {
  expandable: true,
  expandText: "展开同环比", // 默认：展开子项
  items: [
    /*...*/
  ],
};
```

<table
        style="width: 100%; outline: none; border-collapse: collapse;"
      >
        <colgroup>
          <col width="50%"/>
          <col width="50%" />
        </colgroup>
        <tbody>
        <tr>
            <td style="text-align: center;">
            控制显隐
            </td>
              <td style="text-align: center;">
            展开子项
            </td>
        </tr>
         <tr style="vertical-align: top;">
          <td>
             <img alt="selectable" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/hqNGSM13B/a202c136-d403-4510-9271-733687504110.png">
            </td>
            <td>
             <img alt="expandable" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/5VbNE%26p2X/53dd765c-a72f-4e7a-a4ce-3904c8e7acfc.png">
            </td>
        </tr>
        </tbody>
  </table>
### 提交修改

Switcher 组件会在弹窗关闭后触发 `onSubmit` 回调，且此回调会接收一个 [SwitcherResult](/zh/docs/api/components/switcher#switcherresult) 类型的参数，你可以通过该回调拿到排序的结果。

所有结果会**按维度**分组，并且每一组字段会**扁平化后**按按顺序排序。

你可以通过以下示例查看详细的结果数据类型：
<playground path='analysis/switcher/demo/pivot.tsx' rid='result'></playground>

❗️注意：出于减少内部状态过时的考虑，Switcher 组件内部并不会持久化操作后状态。也就是说在每次弹窗关闭后，Switcher 内部状态会清空，再次打开时任然以 Props 中的各个维度配置为准。

### 定制化

* 如果 Switcher 组件内置的触发按钮不满足你的需求，可通过`title`定制化触发按钮
* Switcher 组件也提供了`resetText`属性用于定义重置按钮的问题

![customize](https://gw.alipayobjects.com/zos/antfincdn/N2fNJBRwz/ef4ffb16-505b-41ed-9a72-c6804c66827a.png)

🎨 Switcher 组件详细的配置参考 [Switcher Props](/zh/docs/api/components/switcher) 文档。

## 示例

### 交叉表

交叉表联合 Switcher 组件使用：

* 行列值可以相互移动
* 指标值可以控制显隐

<playground path='analysis/switcher/demo/pivot-with-children.tsx' rid='pivot'></playground>

​

### 明细表

* 列头可以控制显隐
* 表格列头对应出现展开图标

<playground path='analysis/switcher/demo/table.tsx' rid='table'></playground>

​📊 查看更多 [维度切换示例](/zh/examples/analysis/switcher#pure-switcher)。
