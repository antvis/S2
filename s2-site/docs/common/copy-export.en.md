---
title: Export
order: 8
---

## original export method

Functions such as copying and exporting of the component layer are encapsulated based on a series of tools and methods exposed by the core layer `@antv/s2` , which can be self-encapsulated based on tools and methods according to actual business

```tsx | pure
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

| parameter     | illustrate                                                                                                                                                          | type                                                                       | Defaults | required |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------- | -------- |
| spreadsheet   | s2 instance                                                                                                                                                         | [SpreadSheet](/docs/api/basic-class/spreadsheet)                           |          | ✓        |
| split         | delimiter                                                                                                                                                           | `string`                                                                   |          | ✓        |
| formatOptions | Whether to format, you can format the data cell and row header separately, and passing Boolean values will take effect on the cell and row header at the same time. | <code>boolean | { formatHeader?: boolean, formatData?: boolean}</code> | `false`  |          |

### copyToClipboard

| parameter | illustrate                                                   | type      | Defaults | required |
| --------- | ------------------------------------------------------------ | --------- | -------- | -------- |
| data      | data source                                                  | `string`  |          | ✓        |
| sync      | Whether to copy data synchronously (default is asynchronous) | `boolean` | `false`  |          |

### download

| parameter | illustrate  | type     | Defaults | required |
| --------- | ----------- | -------- | -------- | -------- |
| data      | data source | `string` |          | ✓        |
| filename  | file name   | `string` |          | ✓        |
