---
title: 高级排序
order: 2
tag: Updated
---

<Badge>@antv/s2-react</Badge>

`@antv/s2-react` 基于 `@antv/s2` 的 [排序能力](/manual/basic/sort/basic)，结合 `antd` 封装了 `高级排序组件`，可按需使用。[查看示例](/examples/analysis/sort#advanced)

:::warning{title="注意"}
组件内部不维护状态，可自行实现成受控模式。
:::

## 快速上手

使用 `@antv/s2-react` 的 `SheetComponent` 组件 ，并给 `header` 配置 `advancedSort` ，配置具体信息可查看 [AdvancedSortCfgProps](/docs/api/components/advanced-sort#advancedsortcfgprops)

```tsx
import React from 'react';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

export const AdvancedSortDemo = () => {
  const [dataCfg, setDataCfg] = React.useState(s2DataConfig);

  return (
    <SheetComponent
      sheetType="pivot"
      adaptive={false}
      dataCfg={dataCfg}
      options={s2Options}
      header={{
        advancedSort: {
          open: true,
          sortParams: [{ sortFieldId: 'province', sortMethod: 'DESC' }],
          onSortConfirm: (ruleValues, sortParams) => {
            setDataCfg({ ...dataCfg, sortParams });
          },
        },
      }}
    />
  );
};

```

## 配置

### 显示

```tsx
<SheetComponent
  header={{
    advancedSort: {
      open: true,
    },
  }}
/>
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*E4dxS6EpfHEAAAAAAAAAAAAAARQnAQ" width="600"  alt="row" />

### 提交

通过 `onSortConfirm` 函数透出所选规则数据 `ruleValues` 和处理成表可直接用的数据 `sortParams`

```tsx
<SheetComponent
  header={{
    advancedSort: {
      open: true,
      onSortConfirm: (ruleValues, sortParams) => {
        console.log(ruleValues, sortParams)
      }
    },
  }}
/>

```

### 自定义

#### 文案显示

`S2` 提供了对入口 `Button` 的显示定制以及规则文案定制

| 参数            | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| className    | class 类名称    | `string`            | -      |      |
| icon    | 排序按钮图标    | `ReactNode`          | -      |      |
| text    | 排序按钮名称    | `ReactNode`             | -      |      |
| ruleText    | 规则描述    | `ReactNode`            | -      |      |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*R45ZQK4Xk3kAAAAAAAAAAAAAARQnAQ" width="600"  alt="row" />

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*myN3SYxjPXsAAAAAAAAAAAAAARQnAQ" width="600"  alt="row" />

#### 维度列表

支持自定义维度列表 `dimension` ，不配置默认为：`行头+列头+数值`

| 参数  | 说明     | 类型       | 默认值 | 必选 |
| ----- | -------- | ---------- | ------ | ---- |
| field | 维度 id   | `string`   | -      | ✓   |
| name  | 维度名称 | `string`   | -      | ✓   |
| list  | 维度列表 | `string[]` | -      | ✓   |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*6g9aTKIOlRcAAAAAAAAAAAAAARQnAQ" width="600" alt="row" />

`list` 用于手动排序

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*rPkKQJo8ln4AAAAAAAAAAAAAARQnAQ" width= "600" alt="row" />

#### 规则列表

支持自定义规则配置列表，默认规则为：`首字母、手动排序、其他字段`

:::warning{title="注意"}
如果这里自定义，则需在 `onSortConfirm` 中通过 `ruleValues` 自定义 `sortParams`
:::

| 属性     | 类型                                        | 必选 | 默认值 | 功能描述   |
| ------- | ------------------------------------------ | --- | ----- | --------- |
| label    | `string`                                    |      | ✓      | 规则名称   |
| value    | `'sortMethod' \| 'sortBy' \| 'sortByMeasure'` | ✓    |        | 规则值     |
| children | [RuleOption](/api/components/advanced-sort#ruleoption)[]                              |      | ✓      | 规则子列表 |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*V2PWTItVICQAAAAAAAAAAAAAARQnAQ" width="600" alt="row" />

#### 打开排序弹窗

可通过 `onSortOpen: () => void` 回调来支持自定义打开排序弹窗，一般用于提前获取弹框数据。

## 示例

<Playground path='/analysis/sort/demo/advanced.tsx' rid='advanced-sort'></playground>
