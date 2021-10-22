---
title: Tooltip
order: 7
---

## 简介

用于透出表格信息以及部分分析功能

> `Tooltip` 暂时依赖 `Antd`

## 形式

待补充...

## 使用

在 `s2options` 中配置 [tooltip](/zh/docs/api/general/S2Options#tooltip) 字段，还可通过 `row`、`col`、`cell` 分别配置行头、列头、数据单元格

```ts
const s2options = {
  tooltip: {
    ...
  }
};
```

### 显示 配置项

通过配置 `showTooltip` 字段控制 `Tooltip` 的显示，默认为 `true`

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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*4SNvSbjIE60AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 操作 配置项

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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*V6OdQJvABJQAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*bllyR4r_6qMAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1IgsQISgpHAAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 重写基类（ renderTooltip ）

使用 `renderTooltip` 配置，并自定义类组件继承 `BaseTooltip` 来重写方法

```ts
tooltip: {
  renderTooltip: (spreadsheet) => {
    return new CustomTooltip(spreadsheet);
  },
}
```

```tsx
class CustomTooltip extends BaseTooltip {
  protected renderInfos() {
    return <div>测试</div>
  }
}
```

##### 可重写方法

以下所有方法都可覆盖所有单元格和事件

- 操作栏（ renderOperation ）

```tsx
protected renderOperation(
  operator: TooltipOperatorOptions,
  onlyMenu?: boolean,
) {
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

  return <TooltipOperator {...customOperator} />;
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*fw6TSrt6nGEAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

- 名称 + 提示（ renderNameTips ）

  当前单元格名称和提示信息

```tsx
const extra = [
  {
    field: 'type',
    value: '笔',
    tips: '说明：这是笔的说明',
  },
];

protected renderNameTips(nameTip: { name: string; tips: string }) {
  const { tips } = extra.find((item) => item.value === nameTip.name) || {};
  if (tips) {
    return <SimpleTips tips={tips} name={`${nameTip.name} - 测试`} />;
  }
  return super.renderNameTips(nameTip);
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*NhxIS7VU87YAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

- 所选项统计列表（ renderSummary ）

  所选项统计列表，主要按度量值区分

```tsx
protected renderSummary(summaries) {
  const customSummaries = (summaries || []).map((item) => {
    return { ...item, name: `${item.name} - 测试` };
  });
  return (
    customSummaries.length > 0 && (
      <TooltipSummary summaries={customSummaries} />
    )
  );
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*w4svRqPJmG4AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

- 轴列表（ renderHeadInfo ）

  轴列表，在数据单元格中显示 `行/列头` 名称

```tsx
protected renderHeadInfo(headInfo) {
  const { cols = [], rows = [] } = headInfo || {};
  const customCols = cols.map(item=> {
      return {...item, value: `${item.value} - 测试`}
  });
  return (
    (cols.length > 0 || rows.length > 0) && (
      <>
        <TooltipHead cols={customCols} rows={rows} />
      </>
    )
  );
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*VkbzTY0wcrwAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

- 数据点明细信息（ renderDetail ）

  数据点明细信息，即当前单元格的数据信息

```tsx
protected renderDetail(details: ListItem[]) {
  const customDetails = (details || []).map((item) => {
    return { name: `${item.name} - 测试`, value: `${item.value} - w` };
  });
  return <TooltipDetail list={customDetails} />;
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*O6H6SKQDViUAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

- 底部提示信息（ renderInfos ）

底部提示信息，一般可用于快捷键操作提示

```tsx
protected renderInfos(infos) {
  return <Infos infos={`按住Cmd/Ctrl或框选，查看多个数据点`} />;
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*lp3tQL5-8YIAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />
