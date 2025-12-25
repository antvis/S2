---
title: Row and Column Resizing
order: 3

---

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*WdvmQ5pd4BwAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

S2 provides three default layout methods: [`adaptive`](/examples/layout/basic#adaptive), [`colAdaptive`](/examples/layout/basic#colAdaptive), and [`compact`](/examples/layout/basic#compact). **You can also dynamically adjust the row and column width and height by dragging the cells of the row/column headers.**

### Basic Usage

You can configure `resize` to control the range of the resize hotspot for adjusting the width and height of cells. It is divided into three parts: `corner header`, `row header`, and `column header`, and is **enabled by default for all**. You can quickly enable or disable all `resize` hotspots by setting a `boolean` value, or you can configure the hotspots for each area to be enabled or disabled through an object type. [View Example](/examples/interaction/advanced#resize-active)

:::info{title="Tip"}
When adjusting the width and height, the tooltip will be closed to avoid obstruction, but the interaction state (such as selection) will be retained.
:::

```ts
const s2Options = {
  interaction: {
    resize: true
  },
};

// Equivalent to
// const s2Options = {
//   interaction: {
//     resize: {
//       rowCellVertical: true,
//       cornerCellHorizontal: true,
//       colCellHorizontal: true,
//       colCellVertical: true
//     }
//   },
// };
```

<Playground path="interaction/basic/demo/resize.ts" rid="resize"></playground>

### Hotspot Control

It supports configuring `rowCellVertical`, `cornerCellHorizontal`, `colCellHorizontal`, and `colCellVertical` to conveniently control the hotspot control of the area.

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="40%"/>
    <col width="60%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        rowCellVertical (row header vertical) - for row header leaf nodes
      </td>
      <td>
        <img height="300" alt="default" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*LdioQJ5NU-MAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        cornerCellHorizontal (corner header horizontal) - for corner header CornerNodeType as Series and Row
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*57S1QLpmaY8AAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        colCellHorizontal (column header horizontal) - for column header leaf nodes
      </td>
      <td>
        <img height="300" alt="gray" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Zni8Ro69STkAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        colCellVertical (column header vertical) - for each level of column header nodes
      </td>
      <td>
        <img height="300" alt="dark" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*qtxcR7_YAYgAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
  </tbody>
</table>

In addition, it also supports `resize.visible` to dynamically control whether the hotspot is displayed. [View Example](/examples/interaction/basic#resize)

1. Example: Only leaf nodes display the `resize` hotspot:

```ts
const s2Options = {
  interaction: {
    resize: {
      visible: (cell) => {
        const meta = cell.getMeta();
        return meta.isLeaf
      }
    }
  },
};
```

2. Example: Only a certain cell displays the `resize` hotspot:

```ts
const s2Options = {
  interaction: {
    resize: {
      visible: (cell) => {
        const meta = cell.getMeta();
        return meta.id === 'root[&]Furniture[&]Table[&]number'
      }
    }
  },
};
```

### Dragging Disabled

Configure `resize.disable` to control the custom drag validation logic of the hotspot. [View Example](/examples/interaction/advanced#resize-disable)

<img src="https://gw.alipayobjects.com/zos/antfincdn/64tnK5%263K/Kapture%2525202022-07-19%252520at%25252015.40.15.gif" alt="preview" width="600" />

Example: Do not allow the cell width to be reduced:

```ts
const s2Options = {
  interaction: {
    resize: {
      disable: (resizeInfo) => resizeInfo.resizedWidth <= resizeInfo.width;
    }
  },
};
```

### Dragging Impact Range

By default, the width and height adjustment only applies to the current cell. You can configure `rowResizeType` and `colResizeType` to affect all rows (columns) or the current row (column) after dragging.

- `all`: Corresponds to the cell dimension `{ city: 20, type: 100 }`
- `current`: Corresponds to the cell ID `{ 'root[&]Hangzhou': 20, 'root[&]Category': 100 }`
- `selected`: Corresponds to the currently selected cell ID `{ 'root[&]Hangzhou': 20, 'root[&]Chengdu': 100 }`

```ts
const s2Options = {
  interaction: {
    resize: {
      // Affect all rows when adjusting row height
      rowResizeType: 'all', // 'all' | 'current' | 'selected'
      // Only affect the current column when adjusting column width
      colResizeType: 'current',
    }
  },
};
```

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="40%"/>
    <col width="60%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        resizeType: 'all'
      </td>
      <td>
        <img height="300" alt="default" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*K9BHSYFdps4AAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        resizeType: 'current'
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*aXByQbhqG7AAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
     <tr>
      <td style="text-align: center;">
        resizeType: 'selected'
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HuK4SK1EKykAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
  </tbody>
</table>

### Minimum Draggable Width and Height

```ts
const s2Options = {
  interaction: {
    resize: {
      // Minimum draggable width of the cell
      minCellWidth: 40,
      // Minimum draggable height of the cell
      minCellHeight: 20
    }
  },
};
```

### Theme Configuration

It supports modifying the hotspot size/color, reference line color/spacing, and other configurations by adjusting the theme. For details, please see the [Theme Configuration](/manual/basic/theme) chapter.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*4fHCSaNfxvYAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600" />

```ts
s2.setTheme({
  resizeArea: {
    // Hotspot size
    size: 2,
    // Hotspot background color
    background: '#396',
    // Hotspot background color opacity
    backgroundOpacity: 0,
    // Drag reference line color
    guideLineColor: '#396',
    // Drag reference line disabled color
    guideLineDisableColor: 'rgba(0,0,0,0.25)',
    //  Reference line spacing
    guideLineDash: [1, 6]
  },
});
```

### Get Cell Width and Height Information After Dragging

After the cell width and height are adjusted, you can get it by listening to the [S2Event.LAYOUT_RESIZE](/api/general/s2-event#drag-to-adjust-width-and-height) event.

```ts
import { S2Event } from '@antv/s2'
import { merge } from 'lodash';

s2.on(S2Event.LAYOUT_RESIZE, (data) => {
  console.log('data:', data);

  // Persistence
  const lastStyle = JSON.parse(localStorage.getItem('style')) || {};
  const style = merge({}, lastStyle, data.style);

  localStorage.setItem('style', JSON.stringify(style));
});
```

If you need to persist the width and height information, the usage is the same as [Custom Cell Width and Height](/manual/advanced/custom/cell-size), just update the corresponding `style`.

```ts
const style = JSON.parse(localStorage.getItem('style')) || {}

const s2Options = {
  style
}

// or
s2.setOptions({ style })
```
