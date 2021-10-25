---
title: 表头 header
order: 4
---

> **optional**  _HeaderCfgProps_   default: `{}`

表格页头，位于表格容器顶部，起到了内容概览和表格工具栏的作用。由表标题、描述、导出、高级排序和自定操作区组成。

## 使用方式

```tsx
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{
    title: '表头标题', 
    description: '表头描述',
    exportCfg: { open: true }, // 导出link
    advancedSortCfg: { open: true }, // 高级排序 link
    extra: (<button>  插入内容 </button>), //自定义 ReactNode 
  }}
/>
```

<playground path='analysis/header/demo/default.tsx' rid='container' height='400'></playground>

## API

`markdown:docs/common/header.zh.md`
