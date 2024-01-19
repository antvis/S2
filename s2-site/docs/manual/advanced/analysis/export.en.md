---
title: Export
order: 11
tag: Updated
---

## Introduction

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
The copied and exported content can be directly displayed in Excel, and S2 has completed the format compatibility.
=======
复制与导出的内容都可以直接放入 `Excel` 中进行展示，S2 已经完成了格式上的兼容。
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

### copy

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
This function can quickly copy the content of the table to the clipboard `@antv/s2` core layer provides a basic copy function, which can be enabled by configuring `enableCopy`
=======
此功能可快速将表格内容复制到剪切板中，
`@antv/s2` 核心层提供了基础的复制功能，可配置 `enableCopy` 开启
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

#### full copy

The export component of S2 provides copying of original data and copying of formatted data respectively.

* Full copy of original data

<img alt="originFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pfSsTrvuJ0UAAAAAAAAAAAAAARQnAQ" width="600">

* Full copy of formatted data

<img alt="formatFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mLSdTrAWZrwAAAAAAAAAAAAAARQnAQ" width="600">

#### local copy

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
Use the shortcut key `command/ctrl + c` to copy the selected area (partial copy)
=======
通过 [内置交互](/manual/advanced/interaction/basic) （单选/多选/圈选）, 使用快捷键 `Command/Ctrl + C` 即可复制选中区域（局部复制）
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

```ts
const s2Options = {
  interaction: {
    // 是否开启复制
    enableCopy: true,
    // 复制格式化后的数据 (s2DataConfig.meta 中配置的 formatter)
    copyWithFormat: false,
    // 复制数值时是否携带所对应的行列头维值
    copyWithHeader: true,
    // 圈选复制前，需要开启圈选功能
    brushSelection: {
      dataCell: true, // 圈选数值单元格 （默认开启）
      rowCell: true,  // 圈选行头单元格
      colCell: true,  // 圈选列头单元格
    }
  }
};
```

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
* copy to excel
=======
##### 复制粘贴到 Excel
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

<img alt="excelCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*LzTYTpFosccAAAAAAAAAAAAAARQnAQ" width="600"/>

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
* Copy with HTML format
=======
<br/>
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

##### 复制粘贴到富文本编辑器中 （带 `HTML` 格式）

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
* Copy header content
=======
<img alt="HTMLCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DuHCSbpv_XkAAAAAAAAAAAAAARQnAQ" width="600"/>
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

<br/>

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
* Copy column header content
=======
##### 复制行头单元格
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

<img alt="CopyCol" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_NukQpysLC8AAAAAAAAAAAAAARQnAQ" width="600"/>

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
* CopyWithHeader **copyWithHeader** : whether to copy data with header information, the default is `false`
=======
<br/>

##### 复制列头单元格

<img alt="CopyRow" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ncuAQaL4AvAAAAAAAAAAAAAAARQnAQ" width="600"/>

<br/>

##### 带表头复制

**copyWithHeader**: 复制数据时是否携带相对应**行列表头**信息，默认为 `false`
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

```ts
const s2Options = {
  interaction: {
    enableCopy: true,
    copyWithHeader: true,
  }
};
```

<img alt="copyWithHeader" src="https://gw.alipayobjects.com/zos/antfincdn/wSBjSYKSM/3eee7bc2-7f8e-4dd9-8836-52a978d9718a.png" width="600" />

<br/>

##### 复制格式化后的数据

**copyWithFormat**: 当 `S2DataConfig` 的 `meta` 中配置了 [自定义格式函数时](/api/general/s2-data-config#meta), 是否按照 `formatter` 复制数据

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
    enableCopy: true,
    copyWithFormat: true,
  }
};
```

### export

<<<<<<< HEAD:s2-site/docs/manual/advanced/analysis/export.en.md
`@antv/s2-react` component layer provides export function
=======
`@antv/s2-react` 组件层提供了开箱即用的导出功能
>>>>>>> origin/next:s2-site/docs/manual/basic/analysis/copy-export.zh.md

:::info{title='使用 `@antv/s2` 如何导出？'}
`@antv/s2` 内置了一系列工具函数，[见下方文档](#原始导出方法)
:::

```tsx
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

<video width="600" controls><source src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ" type="video/mp4">Your browser does not support HTML video.</video>

<embed src="@/docs/common/copy-export.en.md"></embed>
