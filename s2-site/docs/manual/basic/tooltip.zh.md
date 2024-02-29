---
title: Tooltip
order: 7
tag: Updated
---

## 简介

通过表格交互透出表格信息以及部分分析功能

<img src="https://gw.alipayobjects.com/zos/antfincdn/tnuTdq%24b2/1a076d70-e836-41be-bd1b-ab0ec0916ea7.png" width = "600"  alt="preview" />

## 注意事项

:::warning
`@antv/s2` 中只保留了 `tooltip` 的核心显隐逻辑，提供相应数据，**不渲染内容**.

`React` 版本 和 `Vue3` 版本中通过 [自定义 Tooltip 类](#自定义-tooltip-类) 的方式渲染 `tooltip` 的内容，包括 `排序下拉菜单`, `单元格选中信息汇总`, `列头隐藏按钮` 等。

:::

查看 `React` 版本的 [具体实现](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/tooltip/custom-tooltip.tsx)
和 `Vue3` 版本的 [具体实现](https://github.com/antvis/S2/blob/next/packages/s2-vue/src/components/tooltip/custom-tooltip.ts)

- 如果您有 `tooltip` 的需求，您可以直接使用开箱即用的 `@antv/s2-react` `@antv/s2-vue`, 免去你二次封装，使用更加方便。
- 如果您不希望依赖框架，或者希望在 `Vue`, `Angular` 框架中使用 `tooltip`, 请参考 [自定义 Tooltip 类](#自定义-tooltip-类) 章节。
- 别忘了引入样式。

```ts
import "@antv/s2/dist/style.min.css";
```

## 使用

在 `s2Options` 中配置 [tooltip](/docs/api/general/S2Options#tooltip) 字段，默认作用于**所有**单元格。

```ts
const s2Options = {
  tooltip: {}
};
```

**还可以对不同类型的单元格单独配置**：

- `cornerCell`: 角头单元格
- `rowCell`: 行头单元格
- `colCell`: 列头单元格
- `dataCell`: 数值单元格

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

### 显示配置项

通过配置 `showTooltip` 字段控制 `Tooltip` 的显示，默认为 `false`.

```ts
const s2Options = {
  tooltip: {
    enable: true,
    rowCell: {
      // 单独设置行头不显示
      enable: false,
    }
  }
};
```

### 操作配置项

通过配置 `operation` 字段在 `Tooltip` 上增加 [操作项](/docs/api/general/S2Options#tooltipoperation), 支持 [自定义](#自定义-tooltip-操作项).

```ts
const s2Options = {
  tooltip: {
    operation: {
      hiddenColumns: true, //开启隐藏列（叶子节点有效）
    },
  }
};

```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9MaTR51tXi0AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mcvMTr1Sa8MAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 超出指定区域自动调整位置

通过配置 `autoAdjustBoundary` 字段开启：

- `container` : tooltip 超出**表格容器**范围时，自动调整位置，始终在表格内显示
- `body` : tooltip 超出**浏览器窗口**可视范围时，自动调整位置，始终在可视范围内显示
- `null` : 关闭自动调整

```ts
const s2Options = {
  tooltip: {
    autoAdjustBoundary: "container" // 默认 "body"
  }
};

```

### 自定义

#### 自定义 Tooltip 内容

##### 在基础类中使用 <Badge>@antv/s2</Badge>

<Playground path='react-component/tooltip/demo/custom-content-base.ts' rid='custom-content-base' height='300'></playground>

对于 `@antv/s2` 类的使用方式：`tooltip` 内容可以是任意 `dom` 节点或者 `字符串 (innerHTML)`.

:::warning
请注意 XSS 过滤！
:::

```ts
const content = document.createElement('div')
content.innerHTML = '我是自定义内容'

const s2Options = {
  tooltip: {
    content,
    // content: '<div>我是字符串</div>'
  },
};
```

```ts
const s2Options = {
  tooltip: {
    content: `
      <div>
        <div>我是自定义内容</div>
        <p>我也是是自定义内容</p>
      </div>
    `
  },
};
```

或者是手动调用：

```ts
const content = document.createElement('div')
content.innerHTML = '我是自定义内容'

s2.showTooltip({
  position: {},
  content
})

s2.showTooltip({
  position: {},
  content: `
    <div>
      <div>我是自定义内容</div>
      <p>我也是是自定义内容</p>
    </div>
  `
})
```

##### 在 React 中使用 <Badge>@antv/s2-react</Badge>

对于 `@antv/s2-react` 组件的使用方式：tooltip 内容 可以是任意的 `jsx` 元素

<Playground path='react-component/tooltip/demo/custom-content-react.tsx' rid='react-custom-content' height='300'></playground>

```tsx
const content = (
  <div>
    <span>我是自定义内容</span>
  </div>
)

const s2Options = {
  tooltip: {
    content,
  },
};
```

同时 `content` 还支持回调的方式，可以根据 [当前单元格信息](/docs/api/basic-class/interaction) 和 默认 `tooltip` 的详细信息，灵活的自定义内容

```ts
const TooltipContent = (props) => <div>...</div>

const s2Options = {
  tooltip: {
    content: (cell, defaultTooltipShowOptions) => {
      console.log('当前单元格：', cell)
      console.log('默认 tooltip 详细信息：', defaultTooltipShowOptions)
      return <TooltipContent cell={ cell } detail={ detail } />
    },
  },
};
```

如果需要使用默认 Tooltip, 返回 `null` 即可

```ts
const s2Options = {
  tooltip: {
    content: () => {
      return null
    },
  },
};
```

##### 1. 配置级

对不同的单元格进行配置时，`tooltip.content` 的优先级 小于 `rowCell.content`, `colCell.content`, `dataCell.content`, `cornerCell.content`

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

##### 2. 方法级

通过表格实例 可以手动显示 `tooltip`

```ts
const TooltipContent = () => (
  <div>content</div>
);

s2.showTooltip({
  content: <TooltipContent />
})

// 或者 s2.tooltip.show({ content: <TooltipContent/> })
```

##### 3. 内容显示优先级

`方法调用` > `单元格配置` > `基本配置`

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*EwvcRZjOslMAAAAAAAAAAAAAARQnAQ" width="600" alt="row" />

#### 自定义 Tooltip 操作项

除了默认提供的操作项，还可以配置 `operation.menu` 自定义操作项，支持嵌套，也可以监听各自的 `onClick` 点击事件，可以拿到当前 `tooltip`
对应的菜单项信息以及 [单元格信息](/docs/api/basic-class/base-cell).

:::info{title="注意"}
如果使用的是 `@antv/s2-react`, 支持透传 Ant Design [Menu 组件 API](https://ant-design.antgroup.com/components/menu-cn#api)

```ts
menu: {
  mode: 'vertical'
}
```

:::

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2R8ST6bBxAcAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="row" />

```ts
const s2Options = {
  tooltip: {
    operation: {
      menu: {
        onClick: (info, cell) => {
          console.log('菜单项点击：', info, cell);
        },
        items: [
          {
            key: 'custom-a',
            label: '操作 1',
            icon: 'Trend',
            onClick: (info, cell) => {
              console.log('操作 1 点击');
              console.log('tooltip 对应的单元格：', info, cell)
            },
            children: [{
              key: 'custom-a-a',
              label: '操作 1-1',
              icon: 'Trend',
              onClick: (info, cell) => {
                console.log('操作 1-1 点击', info, cell);
              },
            }]
          },
          {
            key: 'custom-b',
            label: '操作 2',
            icon: 'EyeOutlined',
            onClick: (info, cell) => {
              console.log('操作 2 点击', info, cell);
            },
          },
        ],
      }
    },
  },
};
```

还可以通过 `visible` 参数控制当前操作项是否显示，支持传入一个回调，可以根据当前 [单元格信息](/docs/api/basic-class/base-cell) 动态显示

```ts
const s2Options = {
  tooltip: {
    operation: {
      menu: {
        items: [
          {
            key: 'custom-a',
            label: '操作 1',
            icon: 'Trend',
            visible: false,
          },
          {
            key: 'custom-b',
            label: '操作 2',
            icon: 'EyeOutlined',
            visible: (cell) => {
              // 根据单元格信息动态显示，如：叶子节点不显示
              const meta = cell.getMeta()
              return meta.isLeaf
            },
          },
        ],
      }
    },
  },
};
```

通过实例方法调用同理，[查看更多配置](/api/basic-class/base-tooltip#tooltipshowoptions)

```ts
s2.showTooltip({
  options: {
    operator: {
      menu: {
        items: [
          {
            key: 'custom-a',
            label: '操作 1',
            icon: 'Trend',
            onClick: (info, cell) => {
              console.log('操作 1 点击：', info, cell);
            },
          }
        ],
      }
    },
  }
})
```

<br/>

<Playground path='react-component/tooltip/demo/custom-operation.tsx' rid='container-custom-operations' height='300'></playground>

<br/>

如果使用的是 `@antv/s2-react`, 那么 `label` 和 `icon` 还支持任意 `ReactNode`, 菜单项透传 `antd` 的 `Menu` [组件配置项](https://ant-design.antgroup.com/components/menu-cn#api)

```tsx
import { StarOutlined } from '@ant-design/icons';

const s2Options = {
  tooltip: {
    operation: {
      menu: {
        // 可以使用 antd 的配置项 https://ant-design.antgroup.com/components/menu-cn#api
        mode: "vertical",
        subMenuOpenDelay: 0.2,
        items: [
          {
            key: 'custom-a',
            label: <div>操作 1</div>,
            icon: <StarOutlined />,
          }
        ]
      }
    },
  },
};
```

<br/>

#### 自定义 Tooltip 挂载节点

默认挂载在 `body` 上，可自定义挂载位置

```html

<div class="container"/>
```

<br/>

```ts
const s2Options = {
  tooltip: {
    getContainer: () => document.querySelector('.container')
  }
}
```

<br/>

#### 自定义 Tooltip 容器样式

在 `tooltip` 容器中添加额外的 `style` 样式和 `class` 类名，可以更方便的覆盖样式

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

#### 自定义 Tooltip 类

除了上面讲到的 `自定义 Tooltip 内容` 外，你还可以 `自定义 Tooltip 类` 与任意框架 (`Vue`, `Angular`, `React`) 结合

继承 `BaseTooltip` 基类，可重写 `显示 (show)`, `隐藏 (hide)`, `销毁 (destroy)` 等方法，结合 `this.spreadsheet` 实例，来实现满足你业务的 `tooltip`,
也可以重写 `renderContent` 方法，渲染你封装的任意组件

- [查看 BaseTooltip 基类](/api/basic-class/base-tooltip)
- [查看 React 示例](https://github.com/antvis/S2/blob/next/packages/s2-react/src/components/tooltip/custom-tooltip.tsx)
- [查看 Vue 示例](https://codesandbox.io/s/compassionate-booth-hpm3rf?file=/src/App.vue)

```ts
import { BaseTooltip, SpreadSheet } from '@antv/s2';
// 引入 `tooltip` 样式文件
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

覆盖默认，使用你自定义的 `Tooltip`

```ts
const s2Options = {
  tooltip: {
    enable: true,
    render: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
}
```

<Playground path='react-component/tooltip/demo/custom-tooltip.tsx' rid='container-2' height='300'></playground>

#### 自定义 Tooltip 显示时机

在 `tooltip` 开启前提下的默认情况：

- 行列头**点击**时显示 `tooltip`, 单元格文字**被省略**时悬停显示 `tooltip`
- 数值单元格悬停超过 **800ms** 显示 `tooltip`

比如想自定义成鼠标悬停行头时显示 `tooltip`, 可通过自定义交互 [详情](/docs/manual/advanced/interaction/custom),
监听行头单元格的 [交互事件](/docs/manual/advanced/interaction/basic#%E4%BA%A4%E4%BA%92%E4%BA%8B%E4%BB%B6) `S2Event.ROW_CELL_HOVER`
. [示例](/examples/interaction/custom#row-col-hover-tooltip)

```ts
import { BaseEvent, S2Event } from '@antv/s2';

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

如果使用的是 `React` 组件，也可以使用 [单元格回调函数](/docs/api/components/sheet-component)
来进行自定义。[示例](/examples/react-component/tooltip#custom-hover-show-tooltip)

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

#### 在 Vue3 中自定义

在 `Vue3` 中可以通过两种方式自定义内容。

[![Edit @antv/s2 Vue3 Tooltip Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/antv-s2-vue3-tooltip-demo-hpm3rf?autoresize=1&fontsize=14&hidenavigation=1&theme=dark)

<img src="https://gw.alipayobjects.com/zos/antfincdn/AphZDgJvY/b4654699-927d-4b58-9da2-a5793f964061.png" width="600"  alt="preview" />

##### `createVNode` 自定义类的方式（推荐）

```typescript
// TooltipContent.vue

<template>
  <div>我是自定义 tooltip 内容</div>
  <p>当前值：{{ meta?.label ?? meta?.fieldValue}} </p>
</template>

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

    // 使用 Vue 提供的 `createVNode` 方法将组件渲染成虚拟 DOM
    const tooltipVNode = createVNode(TooltipContent, { meta });
    // 使用  `render` 函数将其挂载在 tooltip 容器上
    render(tooltipVNode, this.container);
  }
}
```

##### `defineCustomElement` 自定义内容的方式 <Badge type="error">不推荐</Badge>

> 注意，customElements 不能重复注册，否则浏览器会报错

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

<iframe
src="https://codesandbox.io/embed/antv-s2-vue3-tooltip-demo-hpm3rf?autoresize=1&fontsize=14&hidenavigation=1&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="@antv/s2 Vue3 Tooltip Demo"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi;
payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
> </iframe>

#### 重写展示方法

除了上面说到的 `自定义 Tooltip 类` 自定义展示方法外，也可以修改 [表格实例](/api/basic-class/spreadsheet) 上 `Tooltip` 的方法 `spreadsheet.showTooltip()`
。[了解如何获取表格实例？](/manual/advanced/get-instance)

```ts
// options 配置 tooltip 显示
tooltip: {
  enable: true,
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

##### 可自定义显示内容

以下所有显示内容都可覆盖所有单元格和事件，自定义数据具体细节可查看 [TooltipShowOptions](/api/general/s2options#tooltipshowoptions)

- 显示位置 (position)

  ```tsx
    instance.showTooltip = (tooltipOptions) => {
      const { position } = tooltipOptions;
      instance.tooltip.show({ ...tooltipOptions, position: { x: position.x + 1, y: position.y + 1 } });
    };
  ```

- 展示层数据 (data)

  - 名称

      当前单元格名称，一般只有单元格中文案被省略才会显示

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const name = `${data.name} - 测试`;
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, name: data.name ? name : '' } });
      };
      ```

  - 提示

      当前单元格提示信息

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const tips = '说明：这是个说明';
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, tips } });
      };
      ```

  - 所选项统计列表（ summaries ）

      所选项统计列表，主要按度量值区分，具体详情可查看 [TooltipSummaryOptions](/api/general/s2options#tooltipoptions#tooltipsummaryoptions)

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const customSummaries = (data.summaries || []).map((item) => {
          return { ...item, name: `${item.name} - 测试` };
        });
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, summaries: customSummaries } });
      };
      ```

  - 轴列表（ headInfo ）

      轴列表，在数据单元格中显示 `行/列头` 名称，具体详情可查看 [TooltipHeadInfo](/api/general/s2options#tooltipoptions#tooltipheadinfo)

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

  - 数据点明细信息（ details ）

      数据点明细信息，即当前单元格的数据信息，具体详情可查看 [ListItem](/api/general/s2options#tooltipoptions#listitem)

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const customDetails = (data.details || []).map((item) => {
          return { name: `${item.name} - 测试`, value: `${item.value} - w` };
        });
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, details: customDetails } });
      };
      ```

  - 底部提示信息（ infos ）

      底部提示信息，一般可用于快捷键操作提示

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { data } = tooltipOptions;
        const infos = '按住 Cmd/Ctrl 或框选，查看多个数据点';
        instance.tooltip.show({ ...tooltipOptions, data: { ...data, infos } });
      };
      ```

  <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4rrAR4HBGFoAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

- 部分配置 ( options )

  `tooltip` 部分配置，具体细节可查看 [TooltipOptions](/api/general/s2options#tooltipoptions)

  - 操作栏（ operator ）

      可操作配置，具体细节参考 [TooltipOperatorOptions](/api/general/s2options#tooltipoperatoroptions)

      ```tsx
      instance.showTooltip = (tooltipOptions) => {
        const { options } = tooltipOptions;
        const customOperator = {
          menu: {
            onClick: ({ key }) => {
              console.log('任意菜单项点击', key);
            },
            items: [
              {
                key: 'trend',
                icon: 'trend',
                label: '趋势',
                onClick: (info, cell) => {
                  console.log('当前菜单项点击：', info, cell)
                }
              },
            ],
          }
        };
        instance.tooltip.show({ ...tooltipOptions, options: { ...options, operator: customOperator } });
      };
      ```

<Playground path='react-component/tooltip/demo/custom-show-tooltip.tsx' rid='container-3' height='300'></playground>
