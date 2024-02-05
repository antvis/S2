---
title: Advanced Sort
order: 2
tag: Updated
---

The `React` version provides an advanced sorting component, optionally available. [view example](/examples/analysis/sort#advanced)

> Note: state is not maintained internally

## Get started quickly

Use the `SheetComponent` component of `@antv/s2-react` , and configure `advancedSort` for the `header` . For configuration details, see [AdvancedSortCfgProps](/docs/api/components/advanced-sort#advancedsortcfgprops)

```ts
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SortParams } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const AdvancedSortDemo = () => {
  const [dataCfg, setDataCfg] = useState(s2DataConfig);

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
          onSortConfirm: (ruleValues, sortParams: SortParams) => {
            setDataCfg({ ...dataCfg, sortParams });
          },
        },
      }}
    />
  );
};

ReactDOM.render(<AdvancedSortDemo />, document.getElementById('container'));
```

## configuration

### show

```ts
advancedSort: {
  open: true,
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*E4dxS6EpfHEAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

### submit

Through the `onSortConfirm` function, the selected rule data `ruleValues` and the data `sortParams` that can be processed into a table can be directly used

```ts
advancedSort: {
  open: true,
  onSortConfirm: (ruleValues: RuleValue[], sortParams: SortParams) => {
    console.log(ruleValues, sortParams)
  },
},
```

### Customization

#### copy display

`S2` provides display customization and rule copy customization for the entrance `Button`

| parameter | illustrate       | type              | Defaults | required |
| --------- | ---------------- | ----------------- | -------- | -------- |
| className | class class name | `string`          | -        |          |
| icon      | sort button icon | `React.ReactNode` | -        |          |
| text      | sort button name | `ReactNode`       | -        |          |
| ruleText  | Rule description | `string`          | -        |          |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*R45ZQK4Xk3kAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*myN3SYxjPXsAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

#### dimension list

Support custom dimension list `dimension` , if not configured, the default is:`行头+列头+数值`

| parameter | illustrate     | type       | Defaults | required |
| --------- | -------------- | ---------- | -------- | -------- |
| field     | dimension id   | `string`   | -        | ✓        |
| name      | dimension name | `string`   | -        | ✓        |
| list      | dimension list | `string[]` | -        | ✓        |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*6g9aTKIOlRcAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

`list` for manual sorting

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*rPkKQJo8ln4AAAAAAAAAAAAAARQnAQ" width="600" alt="row">

#### rule list

Support custom rule configuration list, if not configured, the default is:`首字母、手动排序、其他字段`

> Note: If you customize here, you need to customize sortParams through ruleValues in onSortConfirm

| Attributes | type           | required | Defaults          | Functional description |
| ---------- | -------------- | -------- | ----------------- | ---------------------- |
| label      | `string`       |          | ✓                 | rule name              |
| value      | \`'sortMethod' | 'sortBy' | 'sortByMeasure'\` | ✓                      |
| children   | `RuleOption[]` |          | ✓                 | rule sublist           |

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*V2PWTItVICQAAAAAAAAAAAAAARQnAQ" width="600" alt="row">

#### Open sort popup

The `onSortOpen: () => void` callback can be used to support custom opening sorting pop-up windows, which are generally used to obtain pop-up frame data in advance
