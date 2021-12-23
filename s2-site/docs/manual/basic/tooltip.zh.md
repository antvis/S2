---
title: Tooltip
order: 7
---

## 简介

通过表格交互透出表格信息以及部分分析功能

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*zRquQpJqBzUAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

## 使用

在 `s2options` 中配置 [tooltip](/zh/docs/api/general/S2Options#tooltip) 字段，默认作用于**所有**单元格

```ts
const s2options = {
  tooltip: {}
};
```

还可以对不同类型的单元格单独配置：

- `corner`: 角头
- `row`: 行头
- `col`: 列头
- `data`: 数值

```ts
const s2options = {
  tooltip: {
    corner: {},
    row: {},
    col: {},
    data: {},
  }
};
```

### 显示配置项

通过配置 `showTooltip` 字段控制 `Tooltip` 的显示，默认为 `false`

```ts
const s2options = {
  tooltip: {
    showTooltip: true,
    row: {
      // 单独设置行头不显示
      showTooltip: false,
    }
  }
};
```

### 操作配置项

通过配置 `operation` 字段在 `Tooltip` 上增加操作项

```ts
const s2options = {
  tooltip: {
    operation: {
      trend: true, // 显示趋势图按钮
      hiddenColumns: true, //开启隐藏列 （明细表有效）
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
const s2options = {
  tooltip: {
    autoAdjustBoundary: "container" // 默认 "body"
  }
};

```

### 自定义

#### 自定义 Tooltip 内容

对于 `@antv/s2` 类的使用方式：tooltip 内容 可以是任意 `dom` 节点或者 `字符串`

```ts
const content = document.createElement('div')

const s2options = {
  tooltip: {
    content,
    // content: '我是字符串'
  },
};
```

对于 `@antv/s2-react` 组件的使用方式：tooltip 内容 可以是任意的 `jsx` 元素

```ts
const content = (
  <div>
    <span>我是自定义内容</span>
  </div>
)

const s2options = {
  tooltip: {
    content,
  },
};
```

同时，`content` 还支持回调的方式，可以根据 [当前单元格信息](/zh/docs/api/basic-class/interaction) 和 默认 `tooltip` 的详细信息，灵活的自定义内容

```ts
const TooltipContent = (props) => <div>...</div>

const s2options = {
  tooltip: {
    content: (cell, defaultTooltipShowOptions) => {
      console.log('当前单元格：', cell)
      console.log('默认 tooltip 详细信息：', defaultTooltipShowOptions)
      return <TooltipContent cell={cell} detail={detail} />
    },
  },
};
```

##### 1. 配置级

对不同的单元格进行配置时，`tooltip.content` 的优先级 小于 `row.content`, `col.content`, `data.content`, `corner.content`

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

const s2options = {
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

##### 2. 方法级

通过表格实例 可以手动显示 `tooltip`

```ts
const TooltipContent = (
  <div>content</div>
);

s2.showTooltip({
  content: TooltipContent
})

// 或者 s2.tooltip.show({ content: TooltipContent })
```

<playground path='react-component/tooltip/demo/custom-content.tsx' rid='container-1' height='300'></playground>

##### 3. 内容显示优先级

`方法调用` > `单元格配置` > `基本配置`

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*EwvcRZjOslMAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 自定义 Tooltip 类

继承 `BaseTooltip` 基类，可重写 `显示 (show)`, `隐藏 (hide)`, `销毁 (destroy)` 等方法，结合 `this.spreadsheet` 实例，来实现满足你业务的 `tooltip`

```ts
import { BaseTooltip, SpreadSheet } from '@antv/s2';

export class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  renderContent() {}

  clearContent() {}

  show(showOptions) {
    console.log(this.spreadsheet)
  }

  hide() {}

  destroy() {}
}
```

覆盖默认，使用你自定义的 `Tooltip`

```ts
const s2Options = {
  tooltip: {
    showTooltip: true,
    renderTooltip: (spreadsheet: SpreadSheet) => new CustomTooltip(spreadsheet),
  },
}
```

<playground path='react-component/tooltip/demo/custom-tooltip.tsx' rid='container-2' height='300'></playground>

#### 自定义 Tooltip 显示时机

在 `tooltip` 开启前提下的默认情况：

- 行列头**点击**时显示 `tooltip`, 单元格文字**被省略**时悬停显示 `tooltip`
- 数值单元格悬停超过 **800ms** 显示 `tooltip`

比如想自定义成鼠标悬停行头时显示 `tooltip`, 可通过自定义交互 [详情](/zh/docs/manual/advanced/interaction/custom), 监听行头单元格的 [交互事件](/zh/docs/manual/advanced/interaction/basic#%E4%BA%A4%E4%BA%92%E4%BA%8B%E4%BB%B6) `S2Event.ROW_CELL_HOVER`. [例子](/zh/examples/interaction/custom#row-col-hover-tooltip)

```ts
import { PivotSheet, BaseEvent, S2Event } from '@antv/s2';

class RowHoverInteraction extends BaseEvent {
  bindEvents() {
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (event) => {
      this.spreadsheet.tooltip.show({
        position: { x:0, y:0 },
        content: "..."
      })
    })
  }
}

const s2options = {
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

如果使用的是 `React` 组件，也可以使用 [单元格回调函数](zh/docs/api/components/sheet-component) 来进行自定义。[例子](/zh/examples/react-component/tooltip#custom-hover-show-tooltip)

```tsx
const CustomColCellTooltip = () => <div>col cell tooltip</div>;

const onRowCellHover = ({ event, viewMeta }) => {
  viewMeta.spreadsheet.tooltip.show({
    position: {
      x: event.clientX,
      y: event.clientY,
    },
    content: <CustomRowCellTooltip />,
  });
};

<SheetComponent onRowCellHover={onRowCellHover} />
```

#### 重写展示方法

除了上面说到的 `自定义 Tooltip 类` 自定义展示方法外，也可以修改 [表格实例]([`spreadsheet`](/zh/docs/api/basic-class/spreadsheet)) 上 `Tooltip` 的方法 `spreadsheet.showTooltip()`。[了解如何获取表格实例？](zh/docs/manual/advanced/get-instance)

```ts
// options 配置 tooltip 显示
tooltip: {
  showTooltip: true,
}
```

```tsx
<SheetComponent
  getSpreadSheet={(instance) => {
    instance.showTooltip = (tooltipOptions) => {
      // 可自定义这里的 tooltipOptions
      instance.tooltip.show(tooltipOptions);
    };
  }}
  ...
/>;

```

##### 可自定义显示内容

以下所有显示内容都可覆盖所有单元格和事件，自定义数据具体细节可查看 [TooltipShowOptions](/zh/docs/api/common/custom-tooltip)

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

    所选项统计列表，主要按度量值区分，具体详情可查看 [TooltipSummaryOptions](/zh/docs/api/common/custom-tooltip#TooltipSummaryOptions)

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

    轴列表，在数据单元格中显示 `行/列头` 名称，具体详情可查看 [TooltipHeadInfo](/zh/docs/api/common/custom-tooltip#TooltipHeadInfo)

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

    数据点明细信息，即当前单元格的数据信息，具体详情可查看 [ListItem](/zh/docs/api/common/custom-tooltip#ListItem)

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

  `tooltip` 部分配置，具体细节可查看 [TooltipOptions](/zh/docs/api/common/custom-tooltip#TooltipOptions)

  - 操作栏（ operator ）

    可操作配置，具体细节参考 [TooltipOperatorOptions](/zh/docs/api/common/custom-tooltip#TooltipOperatorOptions)

    ```tsx
    instance.showTooltip = (tooltipOptions) => {
      const { options } = tooltipOptions;
      const customOperator = {
        onClick: () => {
          console.log('测试');
        },
        menus: [
          {
            id: 'trend',
            icon: 'trend',
            text: '趋势',
          },
        ],
      };
      instance.tooltip.show({ ...tooltipOptions, options: { ...options, operator: customOperator } });
    };
    ```

<playground path='react-component/tooltip/demo/custom-show-tooltip.tsx' rid='container-3' height='300'></playground>
