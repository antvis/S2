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
  cornerText: '指标层级', // 角头对应行头的 label 名
  hierarchyType: 'customTree', // 必须指定类型
  style: {  // 染色逻辑，区分指标和副指标
    cellCfg: {
      valuesCfg: {
        originalValueField: 'originalValues',
        conditions: {
          text: {
            field: 'number',
            mapping: (value, cellInfo) => {
              const { meta } = cellInfo;

              if (meta.fieldValue.values[0][0] === value || !value) {
                return {
                  fill: '#000',
                };
              }
              return {
                fill: value > 0 ? '#FF4D4F' : '#29A294',
              };
            },
          },
        },
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
    dataCfg={dataCfg}
    options={s2Options}
    sheetType="strategy"
  />,
  document.getElementById('container'),
);

```

<playground path='react-component/sheet/demo/strategy.tsx' rid='container'></playground>

## 配置解释

### S2DataConfig 配置

主要用到 `S2DataConfig` `MultiData` 和 `CustomTreeItem` 这两个配置项

### MultiData

object **必选**,_default：null_

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/zh/examples/react-component/sheet#strategy)

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| :------------- | :----------------- | :--------- | :----- | :--- |
| values           | 格式化后的数据，直接展示在 dataCfg 中 | `(string | number)[][]`   |  ✓   |
| originalValues | 原始数据，用于原始数据导出 | `(string | number)[][]`  |  |      |
| label        | 用作单元格小标题，单独占一行展示    | `string` |    |      |
| [key: string]       | 其他透传字段，用于自定义单元格的定制化展示       | `unknown` | ``   |      |

 ⚠️ 注意项

* 如果不涉及到原始数据复制导出类需求，可不提供 `originalValues`
* 列头指标顺序和单元格指标展示顺序一一对应

`markdown:docs/common/custom/customTreeItem.zh.md`

### S2Options 配置

* 必须指定 `hierarchyType: 'customTree'`
* 染色逻辑配置可以在  `options.conditions` 中配置，不需要指定 `field` 参数，用法参考 [字段标记](/zh/docs/manual/basic/conditions) 目前暂时只支持文本颜色通道

## Tooltip

趋势分析表的 `Tooltip`, 使用 `S2` 提供的 [自定义能力](/zh/docs/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89-tooltip-%E5%86%85%E5%AE%B9) 分别对 `行头 (row)`, `列头 (col)`, `数值 (data)` 进行了 [定制](https://github.com/antvis/S2/blob/f35ff01400384cd2f3d84705e9daf75fc11b0149/packages/s2-react/src/components/sheets/strategy-sheet/index.tsx#L105), 同时可以在 `@antv/s2-react` 包中进行单独引入

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

```ts
// 字符串
<StrategySheetDataTooltip cell={cell} label={"自定义标题"}/>

// 自定义组件
<StrategySheetDataTooltip cell={cell} label={(cell, defaultLabel) => `${defaultLabel}（自定义标题`} />
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/dosQkhLBp/fbe5a635-60ad-4e55-9a23-858842b977ac.png" width="600"  alt="preview" />
