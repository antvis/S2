---
title: Copy And Export
order: 11
---

## Introduction

The copied and exported content can be directly displayed in Excel, and S2 has completed the format compatibility.

### copy

This function can quickly copy the content of the table to the clipboard `@antv/s2` core layer provides a basic copy function, which can be enabled by configuring `enableCopy`

#### full copy

The export component of S2 provides copying of original data and copying of formatted data respectively.

* Full copy of original data

<img data-mdast="html" alt="originFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pfSsTrvuJ0UAAAAAAAAAAAAAARQnAQ" width="600">

* Full copy of formatted data

<img data-mdast="html" alt="formatFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mLSdTrAWZrwAAAAAAAAAAAAAARQnAQ" width="600">

#### local copy

Use the shortcut key `command/ctrl + c` to copy the selected area (partial copy)

```ts
const s2Options = {
  interaction: {
    // 是否开启复制
    enableCopy: true,
    // 圈选复制前，需要开启圈选功能
    brushSelection: {
      data: true, // 默认开启
      row: true,
      col: true,
    }
  }
};
```

* copy to excel

<img data-mdast="html" alt="excelCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*LzTYTpFosccAAAAAAAAAAAAAARQnAQ" width="600">

* Copy with HTML format

<img data-mdast="html" alt="HTMLCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DuHCSbpv_XkAAAAAAAAAAAAAARQnAQ" width="600">

* Copy header content

<img data-mdast="html" alt="CopyCol" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_NukQpysLC8AAAAAAAAAAAAAARQnAQ" width="600">

* Copy column header content

<img data-mdast="html" alt="CopyRow" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ncuAQaL4AvAAAAAAAAAAAAAAARQnAQ" width="600">

* CopyWithHeader **copyWithHeader** : whether to copy data with header information, the default is `false`

```ts
const s2Options = {
  interaction: {
    enableCopy: true,
    copyWithHeader: true,
  }
};
```

<img data-mdast="html" alt="copyWithHeader" src="https://gw.alipayobjects.com/zos/antfincdn/wSBjSYKSM/3eee7bc2-7f8e-4dd9-8836-52a978d9718a.png" width="600">

### export

`@antv/s2-react` component layer provides export function

```ts
import { SheetComponent } from '@antv/s2-react'

<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{
    exportCfg: {
      open: true
    }
  }}
/>
```

Click the copy or download button to export the full amount of data (full amount copy)

[Your browser does not support HTML video.](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ)

<embed src="@/docs/common/export.en.md"></embed>
