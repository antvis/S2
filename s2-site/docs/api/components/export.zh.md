---
title: 导出
order: 3
---

```typescript
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{ exportCfg: { open: true } }}
/>
```

## exportCfg

| 属性       | 类型            | 必选  | 默认值 | 功能描述   |
| :---------- | :--------------- |  :---- | :------ | :---------- |
| open       | boolean           |   是   | false    | 开启组件   |
| style | `React.CSSProperties`         |      |    | 样式   |
| className   | `string`           |      |    | 类名 |
| icon       | `ReactNode`       |      |    |  展示图标  |
| copyOriginalText       | `string`       |      |    | 复制原始数据文案   |
| copyFormatText       | `string` |      |    | 复制格式化数据文案   |
| downloadOringinalText       | `string` |      |    | 下载原始数据文案   |
| downloadFormatText       | `string` |      |    | 下载格式化数据文案   |
| successText       | `string` |      |    | 操作成功文案   |
| errorText       | `string` |      |    | 操作失败文案   |
| fileName       | `string` |      |  sheet  | 自定义下载文件名   |
