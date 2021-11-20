---
title: Tooltip
order: 7
---

## 简介

通过表格交互透出表格信息以及部分分析功能

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*zRquQpJqBzUAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

## 使用

在 `s2options` 中配置 [tooltip](/zh/docs/api/general/S2Options#tooltip) 字段，还可通过 `row`、`col`、`cell` 分别配置行头、列头、数据单元格

```ts
const s2options = {
  tooltip: {
    ...
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
        // 行头设置不显示
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
      hiddenColumns: true, //开启隐藏列 (明细表有效)
    },
  }
};

```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9MaTR51tXi0AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mcvMTr1Sa8MAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 超出指定区域自动调整位置

通过配置 `autoAdjustBoundary` 字段开启:

- `container` : tooltip 超出表格容器范围时, 自动调整位置, 始终在表格内显示
- `body` : tooltip 超出浏览器窗口可视范围时, 自动调整位置, 始终在可视范围内显示
- `null` : 关闭自动调整

```ts
const s2options = {
  tooltip: {
    autoAdjustBoundary: "container" // 默认 "body"
  }
};

```

### 自定义

#### 组件（ tooltipComponent ）

自定义 `Tooltip` 弹框，直接在 `tooltip` 配置则所有单元格的 `Tooltip` 显示都为该组件，也可以分别給行、列、数据单元格配置相应的组件

```tsx
const TooltipComponent = (
  <div className="tooltip-custom-component">tooltipComponent</div>
);
const RowTooltip = (
  <div className="tooltip-custom-component">rowTooltip</div>
);

const s2options = {
  tooltip: {
    tooltipComponent: TooltipComponent,
    row: {
      tooltipComponent: RowTooltip,
    },
  },
};
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*EwvcRZjOslMAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 重写 spreadsheet.showTooltip() 方法

在引用 `SheetComponent` 时重写表用来展示 `Tooltip` 的方法 `spreadsheet.showTooltip()` , 详情可参考[`spreadsheet`](/zh/docs/api/basic-class/spreadsheet)

```ts
// options 配置 tooltip显示
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

以下所有显示内容都可覆盖所有单元格和事件, 自定义数据具体细节可查看 [TooltipShowOptions](/zh/docs/api/common/custom-tooltip)

- 显示位置 (position)

  ```tsx
  instance.showTooltip = (tooltipOptions) => {
    const { position } = tooltipOptions;
    instance.tooltip.show({ ...tooltipOptions, position: { position.x + 1, position.y + 1 } });
  };
  ```

- 展示层数据 (data)

  - 名称

    当前单元格名称

    ```tsx
    instance.showTooltip = (tooltipOptions) => {
      const { data } = tooltipOptions;
      const name = `${data.name} - 测试`;
      instance.tooltip.show({ ...tooltipOptions, data: { ...data, data.name ? name : '' } });
    };
    ```

  - 提示

    当前单元格提示信息

    ```tsx
    instance.showTooltip = (tooltipOptions) => {
      const { data } = tooltipOptions;
      const extra = [
        {
          field: 'type',
          value: '笔',
          tips: '说明：这是笔的说明',
        },
      ];
      const { tips } = extra.find((item) => item.value === data.name) || {};
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

    数据点明细信息，即当前单元格的数据信息, 具体详情可查看 [ListItem](/zh/docs/api/common/custom-tooltip#ListItem)

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
      const infos = '按住 Shift 多选或框选，查看多个数据点';
      instance.tooltip.show({ ...tooltipOptions, data: { ...data, infos } });
    };
    ```

  <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4rrAR4HBGFoAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

- 部分配置 ( options )

  `tooltip` 部分配置, 具体细节可查看 [TooltipOptions](/zh/docs/api/common/custom-tooltip#TooltipOptions)

  - 操作栏（ operator ）
  
    可操作配置, 具体细节参考 [TooltipOperatorOptions](/zh/docs/api/common/custom-tooltip#TooltipOperatorOptions)

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
