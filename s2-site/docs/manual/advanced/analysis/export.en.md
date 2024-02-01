---
title: Export
order: 3
tag: Updated
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
    // 是否开启复制
    copy: { enable: true },
    // 复制格式化后的数据 (s2DataConfig.meta 中配置的 formatter)
    withFormat: false,
    // 复制数值时是否携带所对应的行列头维值
    withHeader: true,
    // 圈选复制前，需要开启圈选功能
    brushSelection: {
      dataCell: true, // 圈选数值单元格 （默认开启）
      rowCell: true,  // 圈选行头单元格
      colCell: true,  // 圈选列头单元格
    }
  }
};
```

* copy to excel

<img alt="excelCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*LzTYTpFosccAAAAAAAAAAAAAARQnAQ" width="600"/>

* Copy with HTML format

##### 复制粘贴到富文本编辑器中 （带 `HTML` 格式）

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

##### 复制格式化后的数据

**withFormat**: 当 `S2DataConfig` 的 `meta` 中配置了 [自定义格式函数时](/api/general/s2-data-config#meta), 是否按照 `formatter` 复制数据

```ts
const s2DataConfig = {
  fields: { ... }
  meta: [
    {
      field: 'city',
      name: '城市',
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

:::info{title='使用 `@antv/s2` 如何导出？'}
`@antv/s2` 内置了一系列工具函数，[见下方文档](#原始导出方法)
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

<embed src="@/docs/common/copy-export.en.md"></embed>
