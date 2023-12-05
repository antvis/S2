---
title: 导出
order: 8
---

## 原始导出方法

组件层的复制，导出等功能，基于核心层 `@antv/s2` 透出的一系列工具方法封装，可以根据实际业务，基于工具方法自行封装

```ts
import { copyData, copyToClipboard, download, registerTransformer, CopyMIMEType } from '@antv/s2'

// 拿到复制数据 （选中的单元格）
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

// 导出数据 (filename.csv)
download(data, 'filename')

// 自定义复制导出转换 （复制到 word、语雀等场景会成为一个空表格）
registerTransformer(CopyMIMEType.HTML, (matrix) => {
  return `<td></td>`
})

const data = copyData(spreadsheet, '\t', false)

```

### copyData

| 参数          | 说明     | 类型     | 默认值      | 必选 |
| ------------| ------------------ | ------------- | --------------------------- | --- |
| spreadsheet | s2 实例       | [SpreadSheet](/docs/api/basic-class/spreadsheet)          |                            | ✓    |
| split       | 分隔符    | `string`    |     | ✓    |
| formatOptions  | 是否格式化，可以分别对数据单元格和行列头进行格式化，传布尔值会同时对单元格和行列头生效。 |  <code> boolean \|  { isFormatHeader?: boolean, isFormatData?: boolean} </code>    | `false` |      |

### copyToClipboard

| 参数 | 说明     | 类型     | 默认值 | 必选 |
| --- | --- | ------- | ----- | --- |
| data | 数据源 | `string` |        | ✓    |
| sync | 是否同步复制数据 （默认异步） | `boolean` |   `false`     |     |

### download

| 参数     | 说明     | 类型     | 默认值 | 必选 |
| ------- | ------- | ------- | ----- | --- |
| data     | 数据源 | `string` |        | ✓    |
| filename | 文件名称 | `string` |        | ✓    |

### registerTransformer

```ts
enum CopyMIMEType {
  PLAIN = 'text/plain',
  HTML = 'text/html',
}

type MatrixTransformer = (data: string[][]) => CopyableItem;

type CopyableItem = {
  type: CopyMIMEType;
  content: string;
};
```

| 参数 | 说明     | 类型     | 默认值 | 必选 |
| --- | --- | ------- | ----- | --- |
| type | 复制内容的 MIMEType | `CopyMIMEType` |        | ✓    |
| transformer | 处理函数 | `MatrixTransformer` |      |   ✓   |
