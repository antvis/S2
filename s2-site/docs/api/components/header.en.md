---
title: Header
order: 4
tag: Updated
---

## React header component

The table header, located at the top of the table container, functions as a content overview and a table toolbar. Consists of table title, description, export, advanced sorting, indicator toggle and custom action area.

### How to use

```tsx
<SheetComponent
  dataCfg={ dataCfg }
  options={ options }
  header={ {
    title: '表头标题',
    description: '表头描述',
    export: { open: true }, // 开启导出功能
    advancedSort: { open: true }, // 开启高级排序功能
    switcher: { open: true }, // 开启维度切换功能
    extra: <button> 插入内容 </button>, //自定义 ReactNode
  } }
/>
```

<br>

<Playground path="react-component/header/demo/default.tsx" rid="container" height="400"></Playground>

### APIs

<embed src="@/docs/common/header.en.md"></embed>

## Vue header component

In development, please look forward to
