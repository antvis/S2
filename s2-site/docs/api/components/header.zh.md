---
title: 表头
order: 4
---

## React 表头组件

表格页头，位于表格容器顶部，起到了内容概览和表格工具栏的作用。由表标题、描述、导出、高级排序、指标切换和自定操作区组成。

### 使用方式

```tsx
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{
    title: '表头标题',
    description: '表头描述',
    exportCfg: { open: true }, // 开启导出功能
    advancedSortCfg: { open: true }, // 开启高级排序功能
    switcherCfg: { open: true }, // 开启维度切换功能
    extra: <button> 插入内容 </button>, //自定义 ReactNode
  }}
/>
```

<br/>

<Playground path='react-component/header/demo/default.tsx' rid='container' height='400'></playground>

### API

<embed src="@/docs/common/header.zh.md"></embed>

## Vue 表头组件

开发中，敬请期待
