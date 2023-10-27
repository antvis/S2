---
title: 趋势分析表组件
order: 9
---

为了满足更多的分析场景，S2 提供开箱即用的场景表组件 —— 趋势分析表。借助它，你可以非常方便的实现单元格内展示多指标的场景表格。

<img src="https://gw.alipayobjects.com/zos/antfincdn/detasbG55j/5f1c0072-0761-463c-ac44-2fe7b300d041.png" width="600"  alt="preview" />

如图所示，该类表格的表形态特点在于可以在同一个数据单元格和列头单元格内展示多个指标数据，用于需要关注时间趋势下的数据指标，查看同环比等场景。行头可以自定义层级结构。因此有此类分析需求时，可以直接使用该组件。

## 快速上手

### [DataConfig](https://gw.alipayobjects.com/os/bmw-prod/3c2009ce-8c2a-451d-b29a-619a796c7903.json)

<details>
<summary>点击查看趋势分析表 options 配置</summary>

```js
const s2Options = {
  width: 600,
  height: 480,
  cornerText: '指标层级',
  hierarchyType: 'customTree',
  conditions: {
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
    cellCfg: {
      valuesCfg: {
        originalValueField: 'originalValues',
      },
    },
  },
};
```

</details>

```ts
import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import '@antv/s2-react/dist/style.min.css';

ReactDOM.render(
  <SheetComponent
    dataCfg={s2DataCfg}
    options={s2Options}
    sheetType="strategy"
  />,
  document.getElementById('container'),
);

```

<Playground path='react-component/sheet/demo/strategy.tsx' rid='container'></playground>

## 配置解释

### S2DataConfig 配置

主要用到 `S2DataConfig` `MultiData` 和 `CustomTreeItem` 这两个配置项

### MultiData

object **必选**,_default：null_

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/examples/react-component/sheet#strategy)

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| ------------- | ----------------- | --------- | ----- | --- |
| values           | 格式化后的数据，直接展示在 dataCfg 中 | `(string \| number)[][]`   |  ✓   |
| originalValues | 原始数据，用于原始数据导出 | `(string \| number)[][]` |  |      |
| label        | 用作单元格小标题，单独占一行展示    | `string` |    |      |
| [key: string]       | 其他透传字段，用于自定义单元格的定制化展示       | `unknown` | ``   |      |

 ⚠️ 注意项

* 如果不涉及到原始数据复制导出类需求，可不提供 `originalValues`
* 列头指标顺序和单元格指标展示顺序一一对应

<embed src="@/docs/common/custom/customTreeItem.zh.md"></embed>

### S2Options 配置

* 必须指定 `hierarchyType: 'customTree'`
* 染色逻辑配置可以在  `options.conditions` 中配置，不需要指定 `field` 参数，用法参考 [字段标记](/docs/manual/basic/conditions) 目前暂时只支持文本颜色通道

## Tooltip

趋势分析表的 `Tooltip`, 使用 `S2` 提供的 [自定义能力](/docs/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E5%86%85%E5%AE%B9) 分别对 `行头 (row)`, `列头 (col)`, `数值 (data)` 进行了 [定制](https://github.com/antvis/S2/blob/f35ff01400384cd2f3d84705e9daf75fc11b0149/packages/s2-react/src/components/sheets/strategy-sheet/index.tsx#L105), 同时可以在 `@antv/s2-react` 包中进行单独引入

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| ------------- | ----------------- | --------- | ----- | --- |
| cell           | 当前单元格 | `S2CellType`   |  ✓   |
| defaultTooltipShowOptions | 默认 tooltip 展示配置 | `TooltipShowOptions<ReactNode>`  |  |      |
| label        | 标题    | `ReactNode | (cell: S2CellType, defaultLabel: ReactNode) => React.ReactNode` |    |      |
| showOriginalValue      | 是否显示原始数值 （如有）      | `boolean` | `false`   |      |

```ts
import { StrategySheetRowTooltip, StrategySheetColTooltip, StrategySheetDataTooltip } from '@antv/s2-react'

const s2Options = {
  tooltip: {
    content: (cell) => <StrategySheetDataTooltip cell={cell} label={label}/>
  }
}
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/MCgZSZyEm/df084a59-407c-4a69-bc93-1f12eb01b019.png" width="600"  alt="preview" />

### 自定义标题

默认使用行头节点名字作为 Tooltip 标题，可通过 `label` 自定义内容的方式

```tsx
// 字符串
<StrategySheetDataTooltip cell={cell} label={"自定义标题"}/>

// 自定义组件
<StrategySheetDataTooltip cell={cell} label={(cell, defaultLabel) => `${defaultLabel}（自定义标题`} />
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/dosQkhLBp/fbe5a635-60ad-4e55-9a23-858842b977ac.png" width="600"  alt="preview" />

### 显示原始数据

开启 `showOriginalValue` 后，会读取当前 Tooltip 对应的 `originalValues` 数据（如有）, 将原始数据一同展示，即 `展示值（原始值）`

```tsx
<StrategySheetDataTooltip cell={cell} showOriginalValue />
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/xe57%261A5E/9e0ae256-7823-498c-8d88-740ff30bff5a.png" width="600"  alt="preview" />

### 渲染同环比额外节点

可以通过 `renderDerivedValue` 在自定义同环比数值，比如替换成原始值

* `currentValue`: 当前值
* `originalValue`: 原始值
* `cell`: 当前 Tooltip 对应的单元格信息

```tsx
<StrategySheetDataTooltip
  cell={cell}
  renderDerivedValue={(currentValue, originalValue, cell) => <span>({originalValue})</span> }
/>
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/jOYhdqOr6/a43696e1-3cdb-49b7-9906-4053c3f7e65b.png" width="600"  alt="preview" />

## 配置 mini 图

在指标趋势分析场景下，通常我们希望看到数据的全局走势。走势分析不仅需要包含具体的涨跌，最好还能展示出固定时间段内的趋势图，或者指标的完成情况（进度），所以我们在表格里提供了 mini 图的绘制。为了减少对外部组件库的依赖，我们内置了一个十分轻量的，基于 `@antv/g` 绘制的 mini 图库，以极小的性能开销在单元格内绘制出子弹图、折线图及柱状图。

<Playground path='react-component/sheet/demo/strategy-mini-chart.tsx' rid='container2'></playground>

### 在普通透视表中使用

如果不依赖 `React`, 想在 `@antv/s2` 普通的透视表中使用 mini 图，可以参考这个 [示例](/zh/examples/custom/custom-cell/#mini-chart)

<Playground path='custom/custom-cell/demo/mini-chart.ts' rid='container3'></playground>

### API

<embed src="@/docs/common/mini-chart.zh.md"></embed>

如果想要更换 Mini 图样式配置，可以参考 [主题配置]('/zh/api/general/s2theme#minicharttheme')
