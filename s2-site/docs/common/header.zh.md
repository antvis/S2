---
title: 表头
order: 0
---

### HeaderCfgProps

功能描述：表头参数配置

| 参数            | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| title           | 自定义标题           | `React.ReactNode`      | -      |      |
| description     | 自定义说明           | `React.ReactNode`               | -      |      |
| className       | 表头类名             | `string`               | -      |      |
| style           | 表头样式             | `React.CSSProperties`  | -      |      |
| extra           | 自定义表头右侧操作区   |  `React.ReactNode`         | -       |      |
| advancedSort | 高级排序         | [AdvancedSortCfgProps](/docs/api/components/advanced-sort) | `{ open: false }` |      |
| export       | 导出             | [ExportCfgProps](/docs/api/components/export)  | `{ open: false }` |      |
| switcher       | 维度切换             | [SwitcherCfgProps](/docs/api/components/switcher#switchercfgprops)  | `{ open: false }` |      |
