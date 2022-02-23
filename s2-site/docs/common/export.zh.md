---
title: 导出
order: 8
---

## 原始导出方法

组件层的复制，导出等功能，基于核心层 `@antv/s2` 透出的一系列工具方法封装，可以根据实际业务，基于工具方法自行封装

```tsx
import { copyData, copyToClipboard, download } from '@antv/s2'

// 拿到复制数据
const data = copyData(spreadsheet, '\t', false)

// 复制数据到剪贴板
// 同步复制：copyToClipboard(data, false)
copyToClipboard(data)
  .then(() => {
    console.log('复制成功')
  })
  .catch(() => {
    console.log('复制失败')
  })

// 导出数据
download(data, 'filename')
```

### copyData

| 参数        | 说明       | 类型                                                | 默认值  | 必选 |
| :---------- | :--------- | :-------------------------------------------------- | :------ | :--- |
| spreadsheet | s2 实例    | [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) |         | ✓    |
| split       | 分隔符     | `string`                                            |         | ✓    |
| isFormat    | 是否格式化 | `boolean`                                           | `false` |      |

### copyToClipboard

| 参数 | 说明     | 类型     | 默认值 | 必选 |
| :--- | :------- | :------- | :----- | :--- |
| data | 数据源 | `string` |        | ✓    |
| sync | 是否同步复制数据 （默认异步） | `boolean` |   `false`     |     |

### download

| 参数     | 说明     | 类型     | 默认值 | 必选 |
| :------- | :------- | :------- | :----- | :--- |
| data     | 数据源 | `string` |        | ✓    |
| filename | 文件名称 | `string` |        | ✓    |
