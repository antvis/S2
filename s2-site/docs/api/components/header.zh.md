---
title: 表头 header
order: 4
---
<description>**可选** |  类型：_object_ |  默认配置： `{}` </description>

表格页头，位于表格容器顶部，起到了内容概览和表格工具栏的作用。由表标题、描述、导出、高级排序和自定操作区组成。

## 代码展示

```tsx
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{
    title: '表头标题', 
    description: '表头描述',
    exportCfg: { open: true }, // 导出link
    advancedSortCfg: { open: true }, // 高级排序 link
    extra: [ReactNode], //自定义 ReactNode 
  }}
/>
```

## API

| 参数    | 类型       | 必选  | 默认值 | 功能描述   |
| -----  | --------- | ----- | ------ | ------- |
| title | `React.ReactNode` |  ×  | undefined | 自定义标题 |
| className | `string` | × | undefined | 表头类名 |
| style | `React.CSSProperties` | × | undefined | 表头样式 |
| description | `string` | × | undefined | 自定义说明 |
| className | `string` | × | undefined | 表头类名 |
|  exportCfg | [ExportCfgProps](/zh/docs/api/components/export) | ×  | {open: false} | 配置导出 |
| advancedSortCfg    |  [AdvancedSortCfgProps](/zh/docs/api/components/advanced-sort)  |  ×  | {open: false} | 配置高级排序 |
|  extra|  `ReactNode[]` | × | undefined | 自定义表头右侧操作区 |
