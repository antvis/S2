---
title: Tooltip
order: 7

---

## Introduction

Displays table information and some analysis functions through table interactions.

<img src="https://gw.alipayobjects.com/zos/antfincdn/tnuTdq%24b2/1a076d70-e836-41be-bd1b-ab0ec0916ea7.png" width="600" alt="preview" />

## Important Notes

:::warning
The `base version (@antv/s2)` only retains the core logic for showing/hiding the `tooltip`, providing the necessary data and sorting API, but **does not render the content**.

The `React (@antv/s2-react)` and `Vue3 (@antv/s2-vue)` versions render the `tooltip` content, including the `sort dropdown menu`, `cell selection summary`, and `hide column button`, by using a [Custom Tooltip Class](#custom-tooltip-class).

See the [React implementation](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/tooltip/custom-tooltip.tsx) and the [Vue3 implementation](https://github.com/antvis/S2/blob/next/packages/s2-vue/src/components/tooltip/custom-tooltip.ts).

- If you need a `tooltip`, you can directly use the out-of-the-box `@antv/s2-react` or `@antv/s2-vue` to avoid secondary encapsulation.
- If you do not want to depend on a framework, or wish to use the `tooltip` in frameworks like `Vue` or `Angular`, please refer to the [Custom Tooltip Class](#custom-tooltip-class) section and the following examples:
  - 1. [Using in-group sorting in @antv/s2](/en/examples/analysis/sort/#group-sort-base)
  - 2. [Customizing tooltip content in @antv/s2](/en/examples/react-component/tooltip/#custom-content-base)
  - 3. [Customizing sorting in @antv/s2](/en/examples/custom/custom-order/#custom-order-base)
- Don't forget to import the styles:

  ```ts
  // @antv/s2
  import "@antv/s2/dist/s2.min.css";
  // @antv/s2-react
  import "@antv/s2-react/dist/s2-react.min.css";
  // @antv/s2-vue
  import "@antv/s2-vue/dist/s2-vue.min.css";
  ```

:::

## Usage

Configure the [tooltip](/en/api/general/s2-options#tooltip) field in `s2Options`, which applies to **all** cells by default.

```ts
const s2Options = {
  tooltip: {}
};
```

**You can also configure it individually for different cell types**:

- `cornerCell`
- `rowCell`
- `colCell`
- `dataCell`

```ts
const s2Options = {
  tooltip: {
    cornerCell: {},
    rowCell: {},
    colCell: {},
    dataCell: {},
  }
};
```

### Display Configuration

Control the visibility of the `Tooltip` by configuring the `enable` field. Default is `true`.

```ts
const s2Options = {
  tooltip: {
    enable: true,
    rowCell: {
      // Individually disable for row headers
      enable: false,
    }
  }
};
```

### Operation Configuration <Badge>@antv/s2-react</Badge> <Badge type="success">@antv/s2-vue</Badge>

Add [operation items](/en/api/general/s2-options#tooltipoperation) to the `Tooltip` by configuring the `operation` field. This supports [customization](#custom-tooltip-operation-items).

```ts
const s2Options = {
  tooltip: {
    operation: {
      hiddenColumns: true, // Enable hide column (effective for leaf nodes)
    },
  }
};
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9MaTR51tXi0AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />
<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mcvMTr1Sa8MAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### Auto-Adjust Position Beyond a Specified Area

Enable this by configuring the `autoAdjustBoundary` field:

- `container`: When the tooltip exceeds the **table container** boundary, its position is automatically adjusted to always be visible within the table.
- `body`: When the tooltip exceeds the **browser window's** visible area, its position is automatically adjusted to always be visible.
- `null`: Disables auto-adjustment.

```ts
const s2Options = {
  tooltip: {
    autoAdjustBoundary: "container" // Default is "body"
  }
};
```

### Customization

#### Custom Tooltip Content

##### In the Base Class <Badge>@antv/s2</Badge>

<Playground path='react-component/tooltip/demo/custom-content-base.ts' rid='custom-content-base' height='300'></playground>

For `@antv/s2`, the `tooltip` content can be any `DOM` node or `string (innerHTML)`.

:::warning
Please be aware of XSS filtering!
:::

```ts
const content = document.createElement('div');
content.innerHTML = 'This is custom content';

const s2Options = {
  tooltip: {
    content,
    // content: '<div>I am a string</div>'
  },
};
```

You can also call it manually:

```ts
const content = document.createElement('div');
content.innerHTML = 'This is custom content';

s2.showTooltip({
  position: {},
  content
});
```

##### In React <Badge>@antv/s2-react</Badge>

For `@antv/s2-react`, the tooltip content can be any `JSX` element.

<Playground path='react-component/tooltip/demo/custom-content-react.tsx' rid='react-custom-content' height='300'></playground>

The `content` also supports a callback function, allowing you to flexibly customize content based on the [current cell information](/en/api/basic-class/interaction) and default tooltip details.

```tsx
const TooltipContent = (props) => <div>...</div>;

const s2Options = {
  tooltip: {
    content: (cell, defaultTooltipShowOptions) => {
      console.log('Current cell:', cell);
      console.log('Default tooltip details:', defaultTooltipShowOptions);
      return <TooltipContent cell={cell} detail={defaultTooltipShowOptions} />;
    },
  },
};
```

To use the default tooltip, return `null`.

#### Custom Tooltip Operation Items <Badge>@antv/s2-react</Badge> <Badge type="success">@antv/s2-vue</Badge>

In addition to the default operation items, you can configure `operation.menu` to customize them. Nested items are supported, and you can listen for `onClick` events.

:::info{title="Note"}
In `@antv/s2-react`, you need to explicitly specify a menu component via `render`, such as Ant Design's [Menu component](https://ant.design/components/menu#api).
:::

```tsx
import { Menu } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

const s2Options = {
  tooltip: {
    operation: {
      menu: {
        render: (props) => <Menu {...props} />,
        onClick: (info, cell) => {
          console.log('Menu item clicked:', info, cell);
        },
        items: [
          {
            key: 'custom-a',
            label: 'Operation 1',
            icon: 'Trend', // Can be a built-in icon
            onClick: (info, cell) => {
              console.log('Operation 1 clicked');
            },
            children: [{
              key: 'custom-a-a',
              label: 'Operation 1-1',
              icon: <PlusCircleFilled />, // Can be a ReactNode
              onClick: (info, cell) => {
                console.log('Operation 1-1 clicked', info, cell);
              },
            }]
          },
        ],
      }
    },
  },
};
```

<Playground path='react-component/tooltip/demo/custom-operation.tsx' rid='container-custom-operations' height='300'></playground>

#### Custom Tooltip Mount Point

By default, the tooltip is mounted on `body`. You can customize the mount location.

```ts
const s2Options = {
  tooltip: {
    getContainer: () => document.querySelector('.container')
  }
}
```

#### Custom Tooltip Container Style

Add extra `style` and `class` to the tooltip container for easier style overrides.

```ts
const s2Options = {
  tooltip: {
    style: {
      fontSize: '20px'
    },
    className: 'test'
  }
};
```

#### Custom Tooltip Class

You can also create a `Custom Tooltip Class` to integrate with any framework (`Vue`, `Angular`, `React`). Inherit from `BaseTooltip` and override methods like `show`, `hide`, and `destroy`.

- [View BaseTooltip Class](/en/api/basic-class/base-tooltip)
- [View React Example](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/tooltip/custom-tooltip.tsx)
- [View Vue Example](https://codesandbox.io/s/compassionate-booth-hpm3rf?file=/src/App.vue)

```ts
import { BaseTooltip, SpreadSheet } from '@antv/s2';
import "@antv/s2/dist/s2.min.css";

export class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  renderContent() { /* ... */ }
  // ... other overrides
}

const s2Options = {
  tooltip: {
    enable: true,
    render: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
}
```

<Playground path='react-component/tooltip/demo/custom-tooltip.tsx' rid='container-2' height='300'></playground>

#### Custom Tooltip Display Trigger

By default:

- Headers show `tooltip` on **click**, or on hover if the text is truncated.
- Data cells show `tooltip` after hovering for **800ms**.

You can customize this with custom interactions. For example, to show a tooltip on row header hover, listen for `S2Event.ROW_CELL_HOVER`. [Example](/en/examples/interaction/custom#row-col-hover-tooltip)

```tsx
const onRowCellHover = ({ event, viewMeta }) => {
  viewMeta.spreadsheet.tooltip.show({
    position: {
      x: event.clientX,
      y: event.clientY,
    },
    content: <CustomRowCellTooltip/>,
  });
};

<SheetComponent onRowCellHover={ onRowCellHover }/>
```
