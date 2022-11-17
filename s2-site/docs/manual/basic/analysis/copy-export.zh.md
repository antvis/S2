---
title: 复制和导出
order: 11
---

## 简介

复制与导出的内容都可以直接放入 Excel 中进行展示，S2 已经完成了格式上的兼容。

### 复制

此功能可快速将表格内容复制到剪切板
`@antv/s2` 核心层提供了基础的复制功能，可配置 `enableCopy` 开启

#### 全量复制

S2 的导出组件，分别提供了原始数据的复制和格式化后数据的复制。

- 原始数据全量复制

<img alt="originFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pfSsTrvuJ0UAAAAAAAAAAAAAARQnAQ" width="600">

- 格式化数据全量复制

<img alt="formatFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mLSdTrAWZrwAAAAAAAAAAAAAARQnAQ" width="600">

#### 局部复制

使用快捷键 `command/ctrl + c` 即可复制选中区域（局部复制）

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

- 复制到 Excel

<img alt="excelCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*LzTYTpFosccAAAAAAAAAAAAAARQnAQ" width="600">

- 复制带 HTML 格式

<img alt="HTMLCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DuHCSbpv_XkAAAAAAAAAAAAAARQnAQ" width="600">

- 复制行头内容

<img alt="CopyCol" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_NukQpysLC8AAAAAAAAAAAAAARQnAQ" width="600">

- 复制列头内容

<img alt="CopyRow" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ncuAQaL4AvAAAAAAAAAAAAAAARQnAQ" width="600">

- 带表头复制
**copyWithHeader**: 复制数据是否带表头信息，默认为 `false`

```ts
const s2Options = {
  interaction: {
    enableCopy: true,
    copyWithHeader: true,
  }
};
```

<img alt="copyWithHeader" src="https://gw.alipayobjects.com/zos/antfincdn/wSBjSYKSM/3eee7bc2-7f8e-4dd9-8836-52a978d9718a.png" width="600">

### 导出

`@antv/s2-react` 组件层提供了导出功能

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

点击复制或下载按钮，导出全量数据（全量复制）

<video width="600" controls>
  <source src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ" type="video/mp4">
  Your browser does not support HTML video.
</video>

`markdown:docs/common/export.zh.md`
