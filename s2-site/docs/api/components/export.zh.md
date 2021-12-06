---
title: 导出
order: 5
---

```tsx
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{ exportCfg: { open: true } }}
/>
```

## ExportCfgProps

| 属性       | 说明               | 类型            | 默认值 | 必选  |
| :---------- | :---------- | :--------------- | :------ |  :---- |
| open       | 开启组件   | `boolean`          | false    |   ✓  |
| className   | 类名 | `string`           |    |      |
| icon       |  展示图标  | `ReactNode`       |    |      |
| copyOriginalText       | 复制原始数据文案   | `string`       |    |      |
| copyFormatText       | 复制格式化数据文案   | `string` |    |      |
| downloadOringinalText       | 下载原始数据文案   | `string` |    |      |
| downloadFormatText       | 下载格式化数据文案   | `string` |    |      |
| successText       | 操作成功文案   | `string` |    |      |
| errorText       | 操作失败文案   | `string` |    |      |
| fileName       | 自定义下载文件名   | `string` |  sheet  |      |

## 原始导出方法

```tsx
import { copyData, copyToClipboard, download} from '@antv/s2'

const data = copyData(spreadsheet, '\t', false)

copyToClipboard(data)
download(data, 'filename')
```

### copyData

| 参数       | 说明               | 类型            | 默认值 | 必选  |
| :---------- | :---------- | :--------------- | :------ |  :---- |
| spreadsheet   | s2实例   | `SpreadSheet`          |     |   ✓  |
| split   | 分隔符 | `string`           |    |   ✓  |
| isFormat   | 是否格式化 | `boolean`           |  false  |     |

### copyToClipboard

| 参数       | 说明               | 类型            | 默认值 | 必选  |
| :---------- | :---------- | :--------------- | :------ |  :---- |
| data   | 拷贝数据   | `string`          |     |   ✓  |

### download

| 参数       | 说明               | 类型            | 默认值 | 必选  |
| :---------- | :---------- | :--------------- | :------ |  :---- |
| data | 拷贝数据 | `string` |     |   ✓  |
| filename | 文件名称 | `string` |     |   ✓  |
