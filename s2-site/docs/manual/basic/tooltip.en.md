---
title: Tooltip
order: 7
---

## Introduction

Expose table information and some analysis functions through table interaction

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/tnuTdq%24b2/1a076d70-e836-41be-bd1b-ab0ec0916ea7.png" width="600" alt="preview">

## Precautions

`@antv/s2` only retains the core display and hidden logic of `tooltip` , provides corresponding data, and **does not
render content**

In the `React` version and `Vue3` version, the content of the `tooltip` is rendered
by [customizing the Tooltip class](#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E7%B1%BB) , including the`Sort drop-down menu`
, `Cell selection information summary`
,`Column header hide button`, etc.

View the specific implementation of the `React` version and
the [specific](https://github.com/antvis/S2/blob/master/packages/s2-vue/src/components/tooltip/custom-tooltip.ts) [implementation](https://github.com/antvis/S2/blob/master/packages/s2-react/src/components/tooltip/custom-tooltip.tsx)
of the `Vue3` version

* If you need a `tooltip` , you can directly use the out-of-the-box `@antv/s2-react` `@antv/s2-vue` , which saves you
  secondary packaging and is more convenient to use
* If you don't want to depend on the framework, or want to use `tooltip` in `Vue` , `Angular` framework, please refer to
  the chapter [of custom Tooltip class](#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E7%B1%BB)
* Don't forget to import styles

```ts
 import "@antv/s2/dist/style.min.css";
```

## use

Configure the [tooltip](/docs/api/general/S2Options#tooltip) field in `s2Options` , which acts on **all** cells by
default

```ts
 const s2Options = {
  tooltip: {}
};
```

Different types of cells can also be configured separately:

* `corner` : corner head
* `row` : row head
* `col` : column header
* `data` : value

```ts
 const s2Options = {
  tooltip: {
    corner: {},
    row: {},
    col: {},
    data: {},
  }
};
```

### Show configuration items

Control the display of `Tooltip` by configuring the `showTooltip` field, the default is `false`

```ts
 const s2Options = {
  tooltip: {
    showTooltip: true,
    row: {
      // 单独设置行头不显示
      showTooltip: false,
    }
  }
};
```

### Operation configuration item

Add [operation items](/docs/api/general/S2Options#tooltipoperation) on `Tooltip` by configuring the `operation`
field, which supports [customization](#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E6%93%8D%E4%BD%9C%E9%A1%B9) .

```ts
 const s2Options = {
  tooltip: {
    operation: {
      trend: true, // 显示趋势图按钮
      hiddenColumns: true, //开启隐藏列（叶子节点有效）
    },
  }
};
```

<img data-mdast="html" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9MaTR51tXi0AAAAAAAAAAAAAARQnAQ" width="600" alt="row">

<img data-mdast="html" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mcvMTr1Sa8MAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

### Automatically adjust the position beyond the specified area

Enable by configuring `autoAdjustBoundary` field:

* `container` : When the tooltip exceeds the range of the **table container** , it will automatically adjust its
  position and always display it in the table
* `body` : When the tooltip exceeds the visible range of the **browser window** , it automatically adjusts its position
  and always displays it within the visible range
* `null` : turn off autofit

```ts
 const s2Options = {
  tooltip: {
    autoAdjustBoundary: "container" // 默认"body"
  }
};
```

### customize

#### Customize Tooltip content

For the use of `@antv/s2` class: tooltip content can be any `dom` node or`string`

```ts
const content = document.createElement('div')
content.innerHTML = '我是自定义内容'

const s2Options = {
  tooltip: {
    content,
    // content: '我是字符串'
  },
};
```

For the use of `@antv/s2-react` components: tooltip content can be any `jsx` element

```ts
 const content = (
  <div>
    <span>我是自定义内容 < /span>
  < /div>
)

const s2Options = {
  tooltip: {
    content,
  },
};
```

At the same time, `content` also supports the way of callback, which can flexibly customize the content according
to [the current cell information](/docs/api/basic-class/interaction) and the detailed information of the
default `tooltip`

```ts
 const TooltipContent = (props) => <div>
...
</div>

const s2Options = {
  tooltip: {
    content: (cell, defaultTooltipShowOptions) => {
      console.log('当前单元格：', cell)
      console.log('默认 tooltip 详细信息：', defaultTooltipShowOptions)
      return <TooltipContent cell = { cell }
      detail = { detail }
      />
    },
  },
};
```

If you need to use the default Tooltip, just return `null`

```ts
 const s2Options = {
  tooltip: {
    content: () => {
      return null
    },
  },
};
```

##### 1. Configuration level

When configuring different cells, the priority of `tooltip.content` is lower than `row.content` , `col.content`
, `data.content` , `corner.content`

```tsx
 const TooltipContent = (
  <div>content</div>
);

const RowTooltipContent = (
  <div>rowTooltip</div>
);

const ColTooltipContent = (
  <div>colTooltip</div>
);

const DataTooltipContent = (
  <div>dataTooltip</div>
);

const s2Options = {
  tooltip: {
    content: TooltipContent,
    row: {
      content: RowTooltipContent,
    },
    col: {
      content: ColTooltipContent
    }
    data: {
      content: DataTooltipContent
    }
  },
};
```

##### 2. Method level

The `tooltip` can be displayed manually through the table instance

```ts
 const TooltipContent = (
  <div>content < /div>
);

s2.showTooltip({
  content: TooltipContent
})

// 或者 s2.tooltip.show({ content: TooltipContent })
```

<Playground data-mdast="html" path="react-component/tooltip/demo/custom-content.tsx" rid="container-1" height="300"></playground>

##### 3. Content display priority

`Method Call` > `Cell Configuration` > `Basic Configuration`

<img data-mdast="html" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*EwvcRZjOslMAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

#### Custom Tooltip Action Items

In addition to the operation items provided by default, you can also configure `operation.menus` custom operation items
support nesting, and listen to their respective `onClick` click events to get
the [cell information](/docs/api/basic-class/base-cell) corresponding to the current `tooltip`

```ts
 const s2Options = {
  tooltip: {
    operation: {
      menus: [
        {
          key: 'custom-a',
          text: '操作 1',
          icon: 'Trend',
          onClick: (cell) => {
            console.log('操作 1 点击');
            console.log('tooltip 对应的单元格：', cell)
          },
          children: [ {
            key: 'custom-a-a',
            text: '操作 1-1',
            icon: 'Trend',
            onClick: (cell) => {
              console.log('操作 1-1 点击');
            },
          } ]
        },
        {
          key: 'custom-b',
          text: '操作 2',
          icon: 'EyeOutlined',
          onClick: (cell) => {
            console.log('操作 2 点击');
          },
        },
      ],
    },
  },
};
```

You can also control whether the current operation item is displayed through the `visible` parameter, and support
passing in a callback, which can be dynamically displayed according to the
current [cell information](/docs/api/basic-class/base-cell)

```ts
 const s2Options = {
  tooltip: {
    operation: {
      menus: [
        {
          key: 'custom-a',
          text: '操作 1',
          icon: 'Trend',
          visible: false,
        },
        {
          key: 'custom-b',
          text: '操作 2',
          icon: 'EyeOutlined',
          visible: (cell) => {
            // 叶子节点不显示
            const meta = cell.getMeta()
            return meta.isLeaf
          },
        },
      ],
    },
  },
};
```

<Playground data-mdast="html" path="react-component/tooltip/demo/custom-operation.tsx" rid="container-custom-operations" height="300"></playground>

#### Customize Tooltip mount node

Mounted on the `body` by default, you can customize the mount location

```html

<div class="container"/>
```

```ts
 const s2Options = {
  tooltip: {
    getContainer: () => document.querySelector('.container')
  }
}
```

#### Custom Tooltip container style

Adding additional `style` styles and `class` names in the `tooltip` container makes it easier to override styles

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

![preview](https://gw.alipayobjects.com/zos/antfincdn/5Mk9LYotc/bb266a1d-7f8a-4876-b2b4-c633fc44efc2.png)

![preview](https://gw.alipayobjects.com/zos/antfincdn/mGoP8DC5d/db963e35-dfe2-4e46-8866-aec85cbd38da.png)

#### Custom Tooltip class

In addition to the `Custom Tooltip Content` mentioned above, you can also `Custom Tooltip class` to combine with any
framework ( `Vue`
, `Angular` , `React` )

Inherit the `BaseTooltip` base class, rewrite`show (show)`, `hide (hide)`, `destroy (destroy)` and other methods,
combine `this.spreadsheet` instance to realize the `tooltip` that meets your business, and also rewrite
the `renderContent` method to render your package any component

* [View BaseTooltip base class](/docs/api/basic-class/base-tooltip)

* [Check out the React example](https://github.com/antvis/S2/blob/master/packages/s2-react/src/components/tooltip/custom-tooltip.tsx)
* [Check out the Vue example](https://codesandbox.io/s/compassionate-booth-hpm3rf?file=/src/App.vue)

```ts
 import { BaseTooltip, SpreadSheet } from '@antv/s2';
// 引入`tooltip` 样式文件
import "@antv/s2/dist/style.min.css";

export class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  renderContent() {
  }

  clearContent() {
  }

  show(showOptions) {
    console.log(this.spreadsheet)
  }

  hide() {
  }

  destroy() {
  }
}
```

Override the default and use your custom `Tooltip`

```ts
 const s2Options = {
  tooltip: {
    showTooltip: true,
    renderTooltip: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
}
```

<Playground data-mdast="html" path="react-component/tooltip/demo/custom-tooltip.tsx" rid="container-2" height="300"></playground>

#### Custom Tooltip display timing

The default situation under the premise that `tooltip` is enabled:

* The `tooltip` is displayed when the column header is **clicked** , and the `tooltip` is displayed when the cell
  text **is omitted**
* The `tooltip` is displayed when the value cell hovers for more than **800ms**

For example, if you want to customize the `tooltip` to be displayed when the mouse hovers over the row header, you can
monitor
the [interaction event](/docs/manual/advanced/interaction/basic#%E4%BA%A4%E4%BA%92%E4%BA%8B%E4%BB%B6) `S2Event.ROW_CELL_HOVER`
of the row header cell by customizing the interaction [details](/docs/manual/advanced/interaction/custom)
. [Example](/examples/interaction/custom#row-col-hover-tooltip)

```ts
 import { PivotSheet, BaseEvent, S2Event } from '@antv/s2';

class RowHoverInteraction extends BaseEvent {
  bindEvents() {
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (event) => {
      this.spreadsheet.tooltip.show({
        position: { x: 0, y: 0 },
        content: "..."
      })
    })
  }
}

const s2Options = {
  tooltip: {
    showTooltip: true,
  }
  interaction: {
    customInteractions: [
      {
        key: 'RowHoverInteraction',
        interaction: RowHoverInteraction,
      },
    ],
  }
};
```

If you are using `React` components, you can also use [cell callback functions](/docs/api/components/sheet-component)
for customization. [example](/examples/react-component/tooltip#custom-hover-show-tooltip)

```tsx
 const CustomColCellTooltip = () => <div>col cell tooltip</div>;

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

#### Customize in Vue3

There are two ways to customize content in `Vue3` .

[![Edit @antv/s2 Vue3 Tooltip Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/antv-s2-vue3-tooltip-demo-hpm3rf?autoresize=1\&fontsize=14\&hidenavigation=1\&theme=dark)

<img data-mdast="html" src="https://gw.alipayobjects.com/zos/antfincdn/AphZDgJvY/b4654699-927d-4b58-9da2-a5793f964061.png" width="600" alt="preview">

##### The way to `createVNode` custom class (recommended)

```ts
 // TooltipContent.vue

<template>
  <div>我是自定义 Tooltip
内容 < /div>
< p > 当前值：{
  {
    meta?.label ?? meta?.fieldValue
  }
}
</p>
< /template>

< script
lang = "ts"
setup >
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TooltipContent',
  props: [ 'meta' ]
});
</script>
```

```ts
 import { defineCustomElement, render, createVNode } from "vue";
import { BaseTooltip, PivotSheet } from "@antv/s2";
import TooltipContent from "./TooltipContent.vue";
import "@antv/s2/dist/style.min.css";

class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet) {
    super(spreadsheet);
  }

  renderContent() {
    const cell = this.spreadsheet.getCell(this.options.event?.target);
    const meta = cell?.getMeta();

    // 使用 Vue 提供的`createVNode` 方法将组件渲染成虚拟 DOM
    const tooltipVNode = createVNode(TooltipContent, { meta });
    // 使用`render` 函数将其挂载在 tooltip 容器上
    render(tooltipVNode, this.container);
  }
}
```

##### `defineCustomElement` way to customize content (not recommended)

> Note that customElements cannot be registered repeatedly, otherwise the browser will report an error

```ts
 import { defineCustomElement } from "vue";

// 将 Vue 组件解析成 Web Component
const VueTooltipContent = defineCustomElement({
  props: [ "meta" ],
  template: `
 <div>我是自定义 Tooltip 内容</div>
 <p>当前值：{{ meta?.label ?? meta?.fieldValue }}</p>
 `
});

// 注册一个 Web Component
customElements.define("vue-tooltip-content", VueTooltipContent);

const s2Options = {
  tooltip: {
    content: (cell, defaultTooltipShowOptions) => {
      const meta = cell.getMeta();
      // 替换 Tooltip 内容
      return new VueTooltipContent({ meta });
    },
  },
};
```

[@antv/s2 Vue3 Tooltip Demo](https://codesandbox.io/embed/antv-s2-vue3-tooltip-demo-hpm3rf?autoresize=1\&fontsize=14\&hidenavigation=1\&theme=dark)

#### Override display method

In addition to the custom display method of the`自定义 Tooltip 类`mentioned above, the method `spreadsheet.showTooltip()` of
the `Tooltip` on the [table instance](/docs/api/basic-class/spreadsheet) can also be
modified. [How to get table instance?](/docs/manual/advanced/get-instance)

```ts
 // options 配置 tooltip 显示
tooltip: {
  showTooltip: true,
}
```

```tsx
 <SheetComponent
  onMounted={ (instance) => {
    instance.showTooltip = (tooltipOptions) => {
      // 可自定义这里的 tooltipOptions
      instance.tooltip.show(tooltipOptions);
    };
  } }
 ...
/>;
```

##### Display content can be customized

All of the following displays can cover all cells and events. For details on custom data
see [TooltipShowOptions](/docs/common/custom-tooltip)

* display position

  ```tsx
   instance.showTooltip = (tooltipOptions) => {
   const { position } = tooltipOptions;
   instance.tooltip.show({ ...tooltipOptions, position: { x: position.x + 1, y: position.y + 1 } });
   };
  ```

* Presentation layer data (data)

  * name

      The name of the current cell, generally only displayed if the text in the cell is omitted

      ```tsx
       instance.showTooltip = (tooltipOptions) => {
       const { data } = tooltipOptions;
       const name = `${data.name} - 测试`;
       instance.tooltip.show({ ...tooltipOptions, data: { ...data, name: data.name ? name : '' } });
      };
      ```

  * hint

      Current cell prompt information

      ```tsx
       instance.showTooltip = (tooltipOptions) => {
       const { data } = tooltipOptions;
       const tips = '说明：这是个说明';
       instance.tooltip.show({ ...tooltipOptions, data: { ...data, tips } });
      };
      ```

  * List of selected item statistics ( summaries )

      The statistical list of selected items is mainly distinguished by measurement value. For details, please refer
      to [TooltipSummaryOptions](/docs/common/custom-tooltip#tooltipsummaryoptions)

      ```tsx
       instance.showTooltip = (tooltipOptions) => {
       const { data } = tooltipOptions;
       const customSummaries = (data.summaries || []).map((item) => {
       return { ...item, name: `${item.name} - 测试` };
       });
       instance.tooltip.show({ ...tooltipOptions, data: { ...data, summaries: customSummaries } });
      };
      ```

* list of axes ( headInfo )

      Axis list, display`row/column headers`names in data cells,

      see [TooltipHeadInfo](/docs/common/custom-tooltip#tooltipheadinfo)
      for details

      ```tsx
       instance.showTooltip = (tooltipOptions) => {
       const { data } = tooltipOptions;
       const { cols = [], rows = [] } = data.headInfo || {};
       const customCols = cols.map(item=> {
       return {...item, value: `${item.value} - 测试`}
       });
       instance.tooltip.show({
       ...tooltipOptions,
       data: {
       ...data,
       headInfo: { rows, cols: customCols }
       }
       });
      };
      ```

* Data point details ( details )

      Data point details, that is, the data information of the current cell, for details, please refer

      to [ListItem](/docs/common/custom-tooltip#listitem)

      ```tsx
       instance.showTooltip = (tooltipOptions) => {
       const { data } = tooltipOptions;
       const customDetails = (data.details || []).map((item) => {
       return { name: `${item.name} - 测试`, value: `${item.value} - w` };
       });
       instance.tooltip.show({ ...tooltipOptions, data: { ...data, details: customDetails } });
      };
      ```

* Tip information at the bottom ( infos )

      Bottom prompt information, generally used for shortcut key operation prompts

      ```tsx
       instance.showTooltip = (tooltipOptions) => {
       const { data } = tooltipOptions;
       const infos = 'Hold Cmd/Ctrl or marquee to view multiple data points';
       instance.tooltip.show({ ...tooltipOptions, data: { ...data, infos } });
      };
      ```

  <img data-mdast="html" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4rrAR4HBGFoAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

* Partial configuration ( options )

  [Tooltip part configuration, see TooltipOptions](/docs/common/custom-tooltip#tooltipoptions) `tooltip` details

* Operation Bar ( operator )

      Operable configuration, refer to [TooltipOperatorOptions](/docs/common/custom-tooltip#tooltipoperatoroptions)

      for details

      ```tsx
       instance.showTooltip = (tooltipOptions) => {
       const { options } = tooltipOptions;
       const customOperator = {
       onClick: ({ key }) => {
          console.log('任意菜单项点击', key);
       },
       menus: [
       {
       key: 'trend',
       icon: 'trend',
       text: '趋势',
       onClick: () => {
       console.log('当前菜单项点击')
       }
       },
       ],
       };
       instance.tooltip.show({ ...tooltipOptions, options: { ...options, operator: customOperator } });
      };
      ```

<Playground data-mdast="html" path="react-component/tooltip/demo/custom-show-tooltip.tsx" rid="container-3" height="300"></playground>
