---
title: 表头
order: 4
tag: Updated
---

## React 表头组件 <Badge>@antv/s2-react</Badge>

表格页头，位于表格容器顶部，起到了内容概览和表格工具栏的作用。由表标题、描述、导出、高级排序、指标切换和自定操作区组成。

### 快速上手

```tsx
<SheetComponent
  header={ {
    title: '表头标题',
    description: '表头描述',
    // 开启导出功能
    export: { open: true },
    // 开启高级排序功能
    advancedSort: { open: true },
    // 开启维度切换功能
    switcher: { open: true },
    // 自定义 ReactNode
    extra: <button> 插入内容 </button>,
  } }
/>
```

<br/>

<Playground path='react-component/header/demo/default.tsx' rid='container' height='400'></Playground>

### API

<embed src="@/docs/common/header.zh.md"></embed>
