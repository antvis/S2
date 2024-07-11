---
title: Tooltip
order: 7
tag: Updated
---

## Introduction

Expose table information and some analysis functions through table interaction

<img src="https://gw.alipayobjects.com/zos/antfincdn/tnuTdq%24b2/1a076d70-e836-41be-bd1b-ab0ec0916ea7.png" width = "600" alt="preview" />

## Precautions

`@antv/s2` only retains the core display logic of `tooltip`, provides corresponding data, **does not render content**

In `React` version and `Vue3` version, the content of `tooltip` is rendered by means of [custom Tooltip class](#custom-tooltip-class), including `sort drop-down menu`, `cell selection information summary`, `Column header hide button` etc.

View `React`
Version [specific implementation](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/tooltip/custom-tooltip.tsx)
and the `Vue3` version [concrete implementation](https://github.com/antvis/S2/blob/next/packages/s2-vue/src/components/tooltip/custom-tooltip.ts)

- If you need `tooltip`, you can directly use the out-of-the-box `@antv/s2-react` `@antv/s2-vue`, which saves you secondary packaging and is more convenient to use
- If you don't want to depend on the framework, or want to use `tooltip` in `Vue`, `Angular` framework, please refer to [Custom Tooltip Class](#Custom-tooltip-class) chapter
- Don't forget to import styles

```ts
import "@antv/s2/dist/style.min.css";
```

## use

Configure the [tooltip](/docs/api/general/S2Options#tooltip) field in `s2Options`, which works on **all** cells by default

```ts
const s2Options = {
   tooltip: {}
};
```

Different types of cells can also be configured separately:

- `cornerCell`: corner cell
- `rowCell`: row header cell
- `colCell`: column header cell
- `dataCell`: Numerical cell

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

### Display configuration items

Control the display of `Tooltip` by configuring the `showTooltip` field, the default is `false`

```ts
const s2Options = {
   tooltip: {
     enable: true,
     rowCell: {
       // Set the line header separately to not display
       enable: false,
     }
   }
};
```

### Operation configuration items

Add [operation item](/docs/api/general/S2Options#tooltipoperation) on `Tooltip` by configuring `operation` field, support [custom](#custom-tooltip-operation item).

```ts
const s2Options = {
   tooltip: {
     operation: {
       hiddenColumns: true, //Enable hidden columns (leaf nodes are valid)
     },
   }
};

```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9MaTR51tXi0AAAAAAAAAAAAAARQnAQ" width = "600" alt="row" />

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mcvMTr1Sa8MAAAAAAAAAAAAAARQnAQ" width = "600" alt="row" />

### Automatically adjust the position beyond the specified area

Enabled by configuring the `autoAdjustBoundary` field:

- `container` : When the tooltip exceeds the range of the **table container**, it will automatically adjust its position and always display it in the table
- `body` : When the tooltip exceeds the visible range of the **browser window**, it will automatically adjust its position and always display within the visible range
- `null` : turn off autofit

```ts
const s2Options = {
   tooltip: {
     autoAdjustBoundary: "container" // default "body"
   }
};

```

### customize

#### Customize Tooltip content

For the use of `@antv/s2` class: tooltip content can be any `dom` node or `string`

```ts
const content = document. createElement('div')
content.innerHTML = 'I am custom content'

const s2Options = {
   tooltip: {
     content,
     // content: 'I am a string'
   },
};
```

For the use of `@antv/s2-react` components: tooltip content can be any `jsx` element

```ts
const content = (
   <div>
     <span>I am custom content</span>
   </div>
)

const s2Options = {
   tooltip: {
     content,
   },
};
```

At the same time, `content` also supports the method of callback, which can flexibly customize the content according to [current cell information](/docs/api/basic-class/interaction) and the default `tooltip` details

```ts
const TooltipContent = (props) => <div>
...
</div>

const s2Options = {
   tooltip: {
     content: (cell, defaultTooltipShowOptions) => {
       console.log('Current cell:', cell)
       console.log('Default tooltip details:', defaultTooltipShowOptions)
       return <TooltipContent cell = { cell }
       detail = {detail}
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

When configuring different cells, `tooltip.content` has lower priority than `rowCell.content`, `colCell.content`, `dataCell.content`, `cornerCell.content`

```tsx
const TooltipContent = (
   <div>content</div>
);

const RowCellTooltipContent = (
   <div>rowCellTooltip</div>
);

const ColCellTooltipContent = (
   <div>colCellTooltip</div>
);

const DataCellTooltipContent = (
   <div>dataTooltip</div>
);

const s2Options = {
   tooltip: {
     content: TooltipContent,
     rowCell: {
       content: RowCellTooltipContent,
     },
     colCell: {
       content: ColCellTooltipContent
     },
     dataCell: {
       content: DataCellTooltipContent
     }
   },
};
```

##### 2. Method level

The `tooltip` can be displayed manually through the table instance

```ts
const TooltipContent = (
   <div>content</div>
);

s2. showTooltip({
   content: TooltipContent
})

// or s2.tooltip.show({ content: TooltipContent })
```

<Playground path='react-component/tooltip/demo/custom-content.tsx' rid='container-1' height='300'></Playground>

##### 3. Content display priority

`Method Call` > `Cell Configuration` > `Basic Configuration`

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*EwvcRZjOslMAAAAAAAAAAAAAARQnAQ" width="600" alt="row" />

#### Customize Tooltip action items

In addition to the operation items provided by default, you can also configure `operation.menu` custom operation items, which support nesting, and you can also listen to their respective `onClick` click events, and you can get the current `tooltip`
Corresponding [cell information](/docs/api/basic-class/base-cell)

```ts
const s2Options = {
   tooltip: {
     operation: {
       menu: {
        onClick: (info, cell) => {
          console.log('menu click', info, cell);
        },
        items: [
          {
            key: 'custom-a',
            text: 'Operation 1',
            icon: 'Trend',
            onClick: (info, cell) => {
              console.log('operation 1 click');
              console.log('The cell corresponding to the tooltip:', info, cell)
            },
            children: [ {
              key: 'custom-a-a',
              text: 'Operation 1-1',
              icon: 'Trend',
              onClick: (info, cell) => {
                console.log('operation 1-1 click:', info, cell);
              },
            }]
          },
          {
            key: 'custom-b',
            text: 'Operation 2',
            icon: 'EyeOutlined',
            onClick: (info, cell) => {
              console.log('operation 2 click:', info, cell);
            },
          },
        ],
       }
     },
   },
};
```

You can also control whether the current operation item is displayed through the `visible` parameter, and support passing in a callback, which can be dynamically displayed according to the current [cell information](/docs/api/basic-class/base-cell)

```ts
const s2Options = {
   tooltip: {
     operation: {
        menu: {
          items: [
            {
              key: 'custom-a',
              text: 'Operation 1',
              icon: 'Trend',
              visible: false,
            },
            {
              key: 'custom-b',
              text: 'Operation 2',
              icon: 'EyeOutlined',
              visible: (cell) => {
                // Display dynamically according to cell information, such as: leaf nodes are not displayed
                const meta = cell. getMeta()
                return meta.isLeaf
              },
            },
          ],
        }
     },
   },
};
```

<br/>

<Playground path='react-component/tooltip/demo/custom-operation.tsx' rid='container-custom-operations' height='300'></Playground>

<br/>

If you are using `@antv/s2-react`, then `text` and `icon` also support any `ReactNode`

```tsx
import { StarOutlined } from '@ant-design/icons';

const s2Options = {
   tooltip: {
     operation: {
        menu: {
          items: [
            {
              key: 'custom-a',
              text: <div>Operation 1</div>,
              icon: <StarOutlined/>,
            }
          ]
        }
     }
   },
};
```

<br/>

#### Customize Tooltip mount node

Mounted on `body` by default, you can customize the mount location

```html

<div class="container"/>
```

<br/>

```ts
const s2Options = {
   tooltip: {
     getContainer: () => document. querySelector('.container')
   }
}
```

<br/>

#### Customize Tooltip container style

Add additional `style` styles and `class` class names in the `tooltip` container to make it easier to override styles

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

In addition to the `custom Tooltip content` mentioned above, you can also `custom Tooltip class` combined with any framework (`Vue`, `Angular`, `React`)

Inherit `BaseTooltip` base class, you can rewrite `show (hide)`, `destroy (destroy)` and other methods, combined with `this.spreadsheet` instance, to achieve `tooltip` that meets your business ,
You can also override the `renderContent` method to render any component you encapsulate

- [View BaseTooltip base class](/api/basic-class/base-tooltip)
- [View React example](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/tooltip/custom-tooltip.tsx)
- [View Vue example](https://codesandbox.io/s/compassionate-booth-hpm3rf?file=/src/App.vue)

```ts
import { BaseTooltip, SpreadSheet } from '@antv/s2';
// import `tooltip` style file
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
     enable: true,
     render: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
   },
}
```

<Playground path='react-component/tooltip/demo/custom-tooltip.tsx' rid='container-2' height='300'></Playground>

#### Customize Tooltip display timing

The default when `tooltip` is enabled:

- Show `tooltip` when row and column headers **click**, and show `tooltip` when hovering cell text **omitted**
- value cell hover over **800ms** shows `tooltip`

For example, if you want to customize it to display `tooltip` when the mouse hovers over the line header, you can use custom interaction [details](/docs/manual/advanced/interaction/custom),
Listen to the [interaction event](/docs/manual/advanced/interaction/basic#%E4%BA%A4%E4%BA%92%E4%BA%8B%E4%BB%B6) `S2Event.ROW_CELL_HOVER`
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
     enable: true,
   },
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

If you are using `React` components, you can also use [cell callback function](/docs/api/components/sheet-component)
to customize. [Example](/examples/react-component/tooltip#custom-hover-show-tooltip)

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

#### Customizing in Vue3

There are two ways to customize content in `Vue3`.

[![Edit @antv/s2 Vue3 Tooltip Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](<https://codesandbox.io/s/antv-s2-vue3-tooltip> -demo-hpm3rf?autoresize=1&fontsize=14&hidenavigation=1&theme=dark)

<img src="https://gw.alipayobjects.com/zos/antfincdn/AphZDgJvY/b4654699-927d-4b58-9da2-a5793f964061.png" width="600" alt="preview" />

##### `createVNode` custom class method (recommended)

```typescript
// TooltipContent.vue

<template>
   <div>I am custom
Tooltips
content </div>
<p> current value: {
   {
     meta?.label??meta?.fieldValue
   }
}
</p>
</template>

< script
lang = "ts"
setup >
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'TooltipContent',
   props: ['meta']
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
     const meta = cell?. getMeta();

     // Use the `createVNode` method provided by Vue to render the component into a virtual DOM
     const tooltipVNode = createVNode(TooltipContent, { meta });
     // Mount it on the tooltip container using the `render` function
     render(tooltipVNode, this. container);
   }
}
```

##### `defineCustomElement` way to customize content (not recommended)

> Note that customElements cannot be registered repeatedly, otherwise the browser will report an error

```ts
import { defineCustomElement } from "vue";

// Parse Vue components into Web Components
const VueTooltipContent = defineCustomElement({
   props: [ "meta" ],
   template:`
     <div>I am custom Tooltip content</div>
     <p>Current value: {{ meta?.label ?? meta?.fieldValue }}</p>
   `
});

// Register a Web Component
customElements.define("vue-tooltip-content", VueTooltipContent);

const s2Options = {
   tooltip: {
     content: (cell, defaultTooltipShowOptions) => {
       const meta = cell. getMeta();
       // Replace Tooltip content
       return new VueTooltipContent({ meta });
     },
   },
};
```

<iframe
src="https://codesandbox.io/embed/antv-s2-vue3-tooltip-demo-hpm3rf?autoresize=1&fontsize=14&hidenavigation=1&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="@antv/s2 Vue3 Tooltip Demo"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi;
payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
> </iframe>

#### Rewrite display method

In addition to the custom display method of `custom Tooltip class` mentioned above, you can also modify the method `spreadsheet.showTooltip()` of `Tooltip` on [table instance](/api/basic-class/spreadsheet)
. [See how to get table instance?](/manual/advanced/get-instance)

```ts
// options configure tooltip display
tooltip: {
   enable: true,
}
```

```tsx
<SheetComponent
   onMounted={ (instance) => {
     instance.showTooltip = (tooltipOptions) => {
       // You can customize the tooltipOptions here
       instance.tooltip.show(tooltipOptions);
     };
   } }
   ...
/>;

```

##### Customizable display content

All the following displayed content can cover all cells and events. For details of custom data, please refer to [TooltipShowOptions](/api/general/s2options#tooltipshowoptions)

- display position (position)

   ```tsx
     instance.showTooltip = (tooltipOptions) => {
       const { position } = tooltipOptions;
       instance.tooltip.show({ ...tooltipOptions, position: { x: position.x + 1, y: position.y + 1 } });
     };
   ```

- presentation layer data (data)

  - name

      The name of the current cell, generally only displayed if the text in the cell is omitted

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const name = `${data.name} - test`;
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, name: data.name ? name : '' } });
      };
      ```

  - hint

      Current cell prompt information

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const tips = 'Note: This is a note';
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, tips } });
      };
      ```

  - List of selected item statistics ( summaries )

      The statistical list of selected options is mainly distinguished by measurement value. For details, please refer to [TooltipSummaryOptions](/api/general/s2options#tooltipoptions#tooltipsummaryoptions)

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const customSummaries = (data.summaries || []).map((item) => {
          return { ...item, name: `${item.name} - Test` };
        });
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, summaries: customSummaries } });
      };
      ```

  - list of axes ( headInfo )

Axis list, display `row/column header` names in data cells, see [TooltipHeadInfo](/api/general/s2options#tooltipoptions#tooltipheadinfo) for details

       ```tsx
       instance.showTooltip = (tooltipOptions) => {
         const { data } = tooltipOptions;
         const { cols = [], rows = [] } = data.headInfo || {};
         const customCols = cols. map(item => {
           return {...item, value: `${item.value} - test`}
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

     - Data point details (details)

       Data point details, that is, the data information of the current cell, for details, please refer to [ListItem](/api/general/s2options#tooltipoptions#listitem)

       ```tsx
       instance.showTooltip = (tooltipOptions) => {
         const { data } = tooltipOptions;
         const customDetails = (data.details || []).map((item) => {
           return { name: `${item.name} - test`, value: `${item.value} - w` };
         });
         instance.tooltip.show({ ...tooltipOptions, data: { ...data, details: customDetails } });
       };
       ```

     - Bottom prompt information ( infos )

       Bottom prompt information, generally used for shortcut key operation prompts

       ```tsx
       instance.showTooltip = (tooltipOptions) => {
         const { data } = tooltipOptions;
         const infos = 'Press and hold Cmd/Ctrl or box selection to view multiple data points';
         instance.tooltip.show({ ...tooltipOptions, data: { ...data, infos } });
       };
       ```

   <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4rrAR4HBGFoAAAAAAAAAAAAAARQnAQ" width = "600" alt="row" />

- partial configuration ( options )

  `tooltip` part configuration, details can be found in [TooltipOptions](/api/general/s2options#tooltipoptions)

  - Operation bar ( operator )

      Operable configuration, see [TooltipOperatorOptions](/api/general/s2options#tooltipoperatoroptions) for details

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { options } = tooltipOptions;
        const customOperator = {
          menu: {
            onClick: ({ key }) => {
              console.log('click any menu item', key);
            },
            items: [
              {
                key: 'trend',
                icon: 'trend',
                text: 'Trend',
                onClick: (info, cell) => {
                  console.log('Current menu item clicked:', info, cell)
                }
              },
            ],
          }
        };
        instance.tooltip.show({ ...tooltipOptions, options: { ...options, operator: customOperator } });
      };
      ```

<Playground path='react-component/tooltip/demo/custom-show-tooltip.tsx' rid='container-3' height='300'></Playground>
