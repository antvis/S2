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
