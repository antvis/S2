---
title: 导出
order: 11
---

## 简介

此功能可快速将表内容导出到剪切板

### 复制

```typescript
const s2options = {
  interaction: {
    enableCopy: true
  }
};
```

使用快捷键 `command/ctrl + c` 即可复制选中区域（局部复制）

![复制](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*oL8_S5zBKSYAAAAAAAAAAAAAARQnAQ)

### 导出

```typescript
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{ exportCfg: { open: true } }}
/>
```

点击复制或下载按钮，导出全量数据（全量复制）

![导出](https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*d0CqRY6M3yMAAAAAAAAAAAAAARQnAQ)

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
