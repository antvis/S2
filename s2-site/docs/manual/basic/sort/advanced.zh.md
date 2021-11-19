---
title: 高级排序
order: 1
---

`S2` 自带高级排序组件，可根据选择组合数据提供給用户使用。

> 注意：内部不维护状态

## 快速上手

使用 `S2` 的组件 `SheetComponent` ，并给 `header` 配置 `advancedSortCfg` ，配置具体信息可查看 [AdvancedSortCfgProps](https://g.antv.vision/zh/docs/api/components/advanced-sort#advancedsortcfgprops)

```ts
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SortParams } from '@antv/s2';

const AdvancedSortDemo = () => {
  const [dataCfg, setDataCfg] = useState(s2DataConfig);

  return (
    <div>
      <SheetComponent
        sheetType="pivot"
        adaptive={false}
        dataCfg={dataCfg}
        options={s2options}
        header={{
          advancedSortCfg: {
            open: true,
            sortParams: [{ sortFieldId: 'province', sortMethod: 'DESC' }],
            onSortConfirm: (ruleValues, sortParams: SortParams) => {
              setDataCfg({ ...dataCfg, sortParams });
            },
          },
        }}
      />
    </div>
  );
};

ReactDOM.render(<AdvancedSortDemo />, document.getElementById('container'));

```

## 配置

### 显示

```ts
advancedSortCfg: {
  open: true,
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*E4dxS6EpfHEAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

### 提交

通过 `onSortConfirm` 函数透出所选规则数据 `ruleValues` 和处理成表可直接用的数据 `sortParams`

```ts
advancedSortCfg: {
  open: true,
  onSortConfirm: (ruleValues: RuleValue[], sortParams: SortParams) => {
    console.log(ruleValues, sortParams)
  },
},

```

### 定制化

#### 文案显示

`S2` 提供了对入口 `Button` 的显示定制以及规则文案定制

| 属性      | 类型              | 必选 | 默认值 | 功能描述     |
| :-------- | :---------------- | :--- | :----- | :----------- |
| className | `string`          |      |        | class类名称  |
| icon      | `React.ReactNode` |      |        | 排序按钮图标 |
| text      | `ReactNode`       |      |        | 排序按钮名称 |
| ruleText  | `string`          |      |        | 规则描述     |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*R45ZQK4Xk3kAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*myN3SYxjPXsAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 维度列表

支持自定义维度列表 `dimension` ，不配置默认为：`行头+列头+数值`

| 属性  | 类型       | 必选 | 默认值 | 功能描述 |
| :---- | :--------- | :--- | :----- | :------- |
| field | `string`   |      | ✓      | 维度id   |
| name  | `string`   |      | ✓      | 维度名称 |
| list  | `string[]` |      | ✓      | 维度列表 |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*6g9aTKIOlRcAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

`list` 用于手动排序

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*rPkKQJo8ln4AAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 规则列表

支持自定义规则配置列表，不配置默认为：`首字母、手动排序、其他字段`

>注意：如果这里自定义，则需在 onSortConfirm 中通过 ruleValues 自定义 sortParams

| 属性     | 类型                                        | 必选 | 默认值 | 功能描述   |
| :------- | :------------------------------------------ | :--- | :----- | :--------- |
| label    | `string`                                    |      | ✓      | 规则名称   |
| value    | `'sortMethod' | 'sortBy' | 'sortByMeasure'` | ✓    |        | 规则值     |
| children | `RuleOption[]`                              |      | ✓      | 规则子列表 |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*V2PWTItVICQAAAAAAAAAAAAAARQnAQ" width = "600"  alt="row" />

#### 打开排序弹窗

可通过 `onSortOpen: () => void` 回调来支持自定义打开排序弹窗，一般用于提前获取弹框数据
