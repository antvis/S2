---
title: Export
order: 3

---

## Introduction

The copied and exported content can be directly displayed in Excel, and S2 has completed the format compatibility.

### copy

This function can quickly copy the content of the table to the clipboard `@antv/s2` core layer provides a basic copy function, which can be enabled by configuring `enableCopy`

#### full copy

The export component of S2 provides copying of original data and copying of formatted data respectively.

* Full copy of original data

<img alt="originFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pfSsTrvuJ0UAAAAAAAAAAAAAARQnAQ" width="600">

* Full copy of formatted data

<img alt="formatFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mLSdTrAWZrwAAAAAAAAAAAAAARQnAQ" width="600">

#### local copy

Use the shortcut key `command/ctrl + c` to copy the selected area (partial copy)

```ts
const s2Options = {
  interaction: {
    // enable copy
    copy: { enable: true },
    // copy formatted data (s2DataConfig.meta configured formatter)
    withFormat: false,
    // whether to include corresponding row and column header dimension values when copying data
    withHeader: true,
    // before brush selection copy, need to enable brush selection
    brushSelection: {
      dataCell: true, // brush select data cells (enabled by default)
      rowCell: true,  // brush select row header cells
      colCell: true,  // brush select column header cells
    }
  }
};
```

* copy to excel

<img alt="excelCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*LzTYTpFosccAAAAAAAAAAAAAARQnAQ" width="600"/>

* Copy with HTML format

##### copy and paste into rich text editor (with `HTML` format)

* Copy header content

<br/>

* Copy column header content

<img alt="CopyCol" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_NukQpysLC8AAAAAAAAAAAAAARQnAQ" width="600"/>

* CopyWithHeader **withHeader** : whether to copy data with header information, the default is `false`

```ts
const s2Options = {
  interaction: {
    copy: { enable: true },
    withHeader: true,
  }
};
```

<img alt="withHeader" src="https://gw.alipayobjects.com/zos/antfincdn/wSBjSYKSM/3eee7bc2-7f8e-4dd9-8836-52a978d9718a.png" width="600" />

<br/>

##### copy formatted data

**withFormat**: when configured in [custom format function](/en/api/general/s2-data-config#meta), whether to follow `formatter` copy data

```ts
const s2DataConfig = {
  fields: { ... }
  meta: [
    {
      field: 'city',
      name: 'city',
      formatter: (value) => `${value}-xx`
    }
  ]
}

const s2Options = {
  interaction: {
    copy: { enable: true },
    withFormat: true,
  }
};
```

### export

`@antv/s2-react` component layer provides export function

:::info{title='How to export with ?'}
`@antv/s2` provides a series of built-in utility functions, [see documentation below](#original-export-method)
:::

```tsx
import { SheetComponent } from '@antv/s2-react'

<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{
    export: {
      open: true
    }
  }}
/>
```

Click the copy or download button to export the full amount of data (full amount copy)

<video width="600" controls><source src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ" type="video/mp4">Your browser does not support HTML video.</video>

<embed src="@/common/copy-export.en.md"></embed>
