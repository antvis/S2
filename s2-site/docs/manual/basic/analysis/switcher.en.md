---
title: Switcher
order: 10
---

S2 provides out-of-the-box dimension switching component `Switcher` . With it, you can easily implement interactive row and column switching, as well as the function of dimension hiding.

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/fyf455mio/2021-09-29%25252015.08.03.gif" height="400" alt="preview">

## Get started quickly

Click to view Switcher dimension configuration

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

```js
import React from "react";
import ReactDOM from "react-dom";
import { Switcher } from "@antv/s2-react";

const onSubmit = (result) => {
  console.log("result:", result);
};

ReactDOM.render(
  <Switcher {...switcherFields} onSubmit={onSubmit} />,
  document.getElementById("container")
);
```

<Playground data-mdast="html" path="react-component/switcher/demo/pure-switcher.tsx" rid="container"></playground>

## configuration explanation

### dimension configuration

Switcher can receive three types of dimension configurations, namely `rows` , `columns` and `values` . They are all of type [SwitcherField](/zh/docs/api/components/switcher#switcherfield) .

> Among them, the two dimensions of `rows` and `columns` can be dragged into each other's configuration boxes, while `values` ​​can only change the field order in its own configuration box.

By passing `sheetType` and dimension configuration, the display form of Switcher will also be different:

<table data-mdast="html" style="width: 100%; outline: none; border-collapse: collapse;"><colgroup><col width="50%"><col width="50%"></colgroup><tbody><tr><td style="text-align: center;">A dimension (mainly used in schedules)</td><td style="text-align: center;">three dimensions (mainly used in pivot tables)</td></tr><tr><td style="text-align: center;"><img height="400" alt="one-dimensional" style="max-height: unset;" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*a0uHRZ70hDcAAAAAAAAAAAAAARQnAQ"></td><td style="text-align: center;"><img height="400" alt="three-dimensions" style="max-height: unset;" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*FTYGTLw7e5wAAAAAAAAAAAAAARQnAQ"></td></tr></tbody></table>

* By default, each dimension can only be **sorted by drag** and drop. If you want to control the visibility of its **fields** , you can set `selectable: true` , which is used to enable the `checkbox` of the field:

```js
const field = {
  selectable: true,
  items: [
    /*...*/
  ],
};
```

* If each field item in the dimension also has associated sub-items, you can set `expandable:true` , which is used to control whether the sub-items are expanded, or you can further set `expandText` to customize the prompt text of the expanded `checkbox` :

```js
const field = {
  expandable: true,
  expandText: "展开同环比", // 默认：展开子项
  items: [
    /*...*/
  ],
};
```

* If the current dimension needs to keep at least one sub-item that cannot be dragged out during the mobile interaction, you can set `allowEmpty:false` , which is used to control whether the dimension can drag all sub-items to other dimensions:

```js
const field = {
  allowEmpty: false, // 默认：true
  items: [
    /*...*/
  ],
};
```

![allowEmpty](https://gw.alipayobjects.com/zos/antfincdn/rUmA%26o3J%26/2022-02-24%25252017.31.46.gif)

### Submit changes

The `Switcher` component will trigger the `onSubmit` callback after the popup window is closed, and this callback will receive a parameter of type [SwitcherResult](/zh/docs/api/components/switcher#switcherresult) , through which you can get the modified result.

All results are **grouped by dimension** , and each set of fields is **flattened and** sorted sequentially.

You can see the detailed result data types with the following example:

<Playground data-mdast="html" path="analysis/switcher/demo/pivot.tsx" rid="result"></playground>

❗️ Note: In order to reduce the outdated state of the internal state, the `Switcher` component does **not persist the state after the operation** . That is to say, after each pop-up window is closed, the internal state of Switcher will be cleared, and when it is opened again, the configuration of each dimension in `Props` will still prevail.

### Customization

* If the built-in trigger button of the `Switcher` component does not meet your needs, you can customize the trigger button through the `title`
* The `Switcher` component also provides the `resetText` attribute to define the problem of the reset button

<img data-mdast="html" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*tElLTIzXBR0AAAAAAAAAAAAAARQnAQ" height="400" alt="preview">

* The pop-up layer of the `Switcher` component is developed based on `antd` 's [Popover](https://ant.design/components/popover-cn/) , which supports transparent transmission of `Popover` [configuration items](https://ant.design/components/popover-cn/#API) to customize the pop-up layer, such as`触发方式`,`箭头指向`,`卡片弹出方向`, etc.

```tsx
<Switcher popover={{ arrowPointAtCenter: true }} />
```

🎨 For detailed configuration of the `Switcher` component, refer to the [Switcher Props](/zh/docs/api/components/switcher) document.

## example

### Use with pivot tables

* Row and column values ​​can be shifted relative to each other
* The indicator value can control the display and concealment

<Playground data-mdast="html" path="react-component/switcher/demo/pivot-with-children.tsx" rid="pivot"></playground>

### Use with schedule

* The column header can control the visibility
* The expansion icon appears corresponding to the column header of the table

<Playground data-mdast="html" path="react-component/switcher/demo/table.tsx" rid="table"></playground>

​📊 See more [examples of dimension switching](/zh/examples/react-component/switcher#pure-switcher) .
