---
title: 导出
order: 11
---

## 简介

此功能可快速将表格内容复制到剪切板

### 复制

`@antv/s2` 核心层提供了基础的复制功能，可配置 `enableCopy` 开启

```ts
const s2Options = {
  interaction: {
    enableCopy: true
  }
};
```

使用快捷键 `command/ctrl + c` 即可复制选中区域（局部复制）

- 复制单元格内容
![复制](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*oL8_S5zBKSYAAAAAAAAAAAAAARQnAQ)

- 复制行头内容
![复制行头](https://gw.alipayobjects.com/zos/antfincdn/XO1VOY%26kZ/1da2946a-5396-41f1-8b59-2e482c8127a5.png)

- 复制列头内容
![复制列头](https://gw.alipayobjects.com/zos/antfincdn/j8nJMIDrj/86a234b0-ce16-4a64-b06c-e8c5e631b597.png)

**copyWithHeader**: 复制数据是否带表头信息，默认为 `false`

```ts
const s2Options = {
  interaction: {
    enableCopy: true,
    copyWithHeader: true,
  }
};
```

![带表头复制](https://gw.alipayobjects.com/zos/antfincdn/wSBjSYKSM/3eee7bc2-7f8e-4dd9-8836-52a978d9718a.png)

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

![导出](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*d0CqRY6M3yMAAAAAAAAAAAAAARQnAQ)

`markdown:docs/common/export.zh.md`
