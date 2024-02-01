---
title: 趋势分析表
order: 9
tag: Updated
---

<Badge>@antv/s2-react</Badge>

为了满足更多的分析场景，S2 提供开箱即用的场景表组件 —— 趋势分析表。借助它，你可以非常方便的实现单元格内展示多指标的场景表格。

如图所示，该类表格的表形态特点在于可以在**同一个数据单元格**和**列头单元格内**展示多个指标数据，用于需要**关注时间趋势下的数据指标**，**查看同环比**等场景。行头可以 [自定义层级结构](/docs/manual/advanced/custom/custom-tree)。因此有此类分析需求时，可以直接使用该组件。

<img src="https://gw.alipayobjects.com/zos/antfincdn/detasbG55j/5f1c0072-0761-463c-ac44-2fe7b300d041.png" width="600"  alt="preview" />

:::warning{title="注意"}

**趋势分析表组件**使用了 S2 提供的各种能力进行融合，所以建议在阅读本章前，请确保你已经阅读过以下章节：

- [基本概念](/docs/manual/basic/base-concept)
- [字段标记](/docs/manual/basic/conditions/)
- [自定义行列头](/docs/manual/advanced/custom/custom-tree)

:::

## 快速上手

### s2DataConfig

[查看详情](https://gw.alipayobjects.com/os/bmw-prod/3c2009ce-8c2a-451d-b29a-619a796c7903.json)

#### s2Options

<details>
<summary>查看详情</summary>

```ts
const s2Options = {
  width: 600,
  height: 480,
  // 角头文本
  cornerText: '指标层级',
  // 条件格式
  conditions: {
    // 同环比数值映射规则
    text: [
      {
        field: 'number',
        mapping: (value, cellInfo) => {
          const { meta, colIndex } = cellInfo;
          if (
            colIndex === 0 ||
            !value ||
            !meta?.fieldValue
          ) {
            return {
              fill: '#000',
            };
          }
          return {
            fill: value > 0 ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
  },
  style: {
    dataCell: {
      valuesCfg: {
        // 原始数据字段，用于原始数据导出和 tooltip 展示
        originalValueField: 'originalValues',
      },
    },
  },
};
```

</details>

```tsx
import React from "react";
import { SheetComponent } from "@antv/s2-react";
import '@antv/s2-react/dist/style.min.css';

const App = () => {
  return (
    <SheetComponent
      sheetType="strategy"
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  )
}
```

<Playground path='react-component/sheet/demo/strategy.tsx' rid='strategy'></playground>

## 配置解释

### S2DataConfig 配置

#### 1. 数据源：[MultiData](/zh/docs/api/general/S2DataConfig#multidata) 配置项，一个单元格对应多条数据，分为原始数据和格式化数据

```ts
const data = {
  "measure-a": {
    values: ["1", "2"],
    originalValues: [1, 2]
  }
}
```

#### 2. 行头层级结构：[自定义层级结构](/zh/docs/manual/advanced/custom/custom-tree)

```ts
const fields = {
  rows: [
    {
      key: 'a-1',
      title: '节点 1',
      children: []
    }
  ]
}
```

#### 3. 虚拟列：趋势分析表存在同环比指标时，会通过虚拟列来显示对应的同环比指标名称，此时，表格会显示两级列头

```ts
import { EXTRA_COLUMN_FIELD } from '@antv/s2'

const fields = {
  columns: ['date', EXTRA_COLUMN_FIELD]
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/SsDx1wGE%24/119a04f5-daac-43ca-9773-c8a66547280c.png" width="600"  alt="preview" />

:::info{title="提示"}
虚拟例和普通字段一样，可以 [自定义格式化](/manual/basic/formatter)
:::

```ts
const s2DataConfig = {
  meta: [
    // 日期列头 格式化
    {
      field: 'date',
      name: '时间',
      formatter: (value) => `${value}年`,
    },
    // 同环比名称（虚拟列头） 格式化
    {
      field: EXTRA_COLUMN_FIELD,
      formatter: (value, data, meta) => {
        console.log(data, meta);
        return meta?.colIndex === 0 ? '自定义标题' : value;
      },
    },
  ],
};
```

:::warning{title="注意"}

- 如果不涉及到原始数据复制导出类需求，可不声明 `originalValues`
- 当只有单指标，（即没有同环比） 时，可不配置虚拟列 (`EXTRA_COLUMN_FIELD`)
- 列头指标顺序和单元格指标展示顺序一一对应

:::

### S2Options 配置

:::info{title="提示"}

- 趋势分析表会将行头布局强制置为**树状模式**，并且数值置于行头，即 `hierarchyType: 'tree'`.
- 可通过 `s2Options.cornerText` 自定义角头文本。
- 染色逻辑配置可以在  `options.conditions` 中配置，不需要指定 `field` 参数，用法参考 [字段标记](/zh/docs/manual/basic/conditions) 目前暂时只支持文本颜色通道

:::

<embed src="@/docs/common/custom/customTreeNode.zh.md"></embed>

## Tooltip

:::info{title="提示"}

趋势分析表的 `Tooltip`, 使用 `S2` 提供的 [自定义能力](/docs/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E5%86%85%E5%AE%B9) 分别对 `行头 (rowCell)`, `列头 (colCell)`, `数值 (dataCell)` 进行了 [定制](https://github.com/antvis/S2/blob/f35ff01400384cd2f3d84705e9daf75fc11b0149/packages/s2-react/src/components/sheets/strategy-sheet/index.tsx#L105).

:::

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| ------------- | ----------------- | --------- | ----- | --- |
| cell           | 当前单元格 | `S2CellType`   |  ✓   |
| defaultTooltipShowOptions | 默认 tooltip 展示配置 | `TooltipShowOptions<ReactNode>`  |  |      |
| label        | 标题    | `ReactNode \| (cell: S2CellType, defaultLabel: ReactNode) => ReactNode` |    |      |
| showOriginalValue      | 是否显示原始数值 （如有）      | `boolean` | `false`   |      |

也可以从 `@antv/s2-react` 包中引入单独使用，可以根据你自己的业务进行二次封装。

```tsx
import { StrategySheetRowTooltip, StrategySheetColTooltip, StrategySheetDataTooltip } from '@antv/s2-react'

const s2Options = {
  tooltip: {
    content: (cell) => <StrategySheetDataTooltip cell={cell} label={label} />
  }
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/MCgZSZyEm/df084a59-407c-4a69-bc93-1f12eb01b019.png" width="600"  alt="preview" />

### 1. 自定义标题

默认使用行头节点名字作为 Tooltip 标题，可通过 `label` 自定义内容的方式

```tsx
// 字符串
<StrategySheetDataTooltip cell={cell} label={"自定义标题"}/>

// 自定义组件
<StrategySheetDataTooltip cell={cell} label={(cell, defaultLabel) => `${defaultLabel}（自定义标题`} />
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/dosQkhLBp/fbe5a635-60ad-4e55-9a23-858842b977ac.png" width="600"  alt="preview" />

### 2. 显示原始数据

开启 `showOriginalValue` 后，会读取当前 Tooltip 对应的 `originalValues` 数据（如有）, 将原始数据一同展示，即 `展示值（原始值）`

```tsx
<StrategySheetDataTooltip cell={cell} showOriginalValue />
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/xe57%261A5E/9e0ae256-7823-498c-8d88-740ff30bff5a.png" width="600"  alt="preview" />

### 3. 渲染同环比额外节点

可以通过 `renderDerivedValue` 在自定义同环比数值，比如替换成原始值

- `currentValue`: 当前值
- `originalValue`: 原始值
- `cell`: 当前 Tooltip 对应的单元格信息

```tsx
<StrategySheetDataTooltip
  cell={cell}
  renderDerivedValue={(currentValue, originalValue, cell) => <span>({originalValue})</span> }
/>
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/jOYhdqOr6/a43696e1-3cdb-49b7-9906-4053c3f7e65b.png" width="600"  alt="preview" />

## 配置 mini 图

在指标趋势分析场景下，通常我们希望看到数据的全局走势。走势分析不仅需要包含具体的涨跌，最好还能展示出固定时间段内的趋势图，或者指标的完成情况（进度），所以我们在表格里提供了 mini 图的绘制。为了减少对外部组件库的依赖，我们内置了一个十分轻量的，基于 `@antv/g` 绘制的 mini 图库，以极小的性能开销在单元格内绘制出`子弹图`、`折线图`以及`柱状图`, 具体请查看 [单元格内绘制图表](/manual/advanced/custom/custom-chart) 章节。

<Playground path='react-component/sheet/demo/strategy-mini-chart.tsx' rid='strategy-mini-chart'></playground>

如果想要更换 mini 图样式配置，可以参考 [主题配置]('/api/general/s2theme#minicharttheme')

### 在普通透视表中使用

如果不依赖 `React`, 想在 `@antv/s2` 普通的透视表中使用 mini 图，可以参考这个 [示例](/zh/examples/custom/custom-cell/#mini-chart)

<Playground path='custom/custom-cell/demo/mini-chart.ts' rid='mini-chart'></playground>

### API

<embed src="@/docs/common/mini-chart.zh.md"></embed>
