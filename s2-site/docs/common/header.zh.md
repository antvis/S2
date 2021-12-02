---
title: 表头 Header 
order: 0
---

### HeaderCfgProps

<description> **optional**  _HeaderCfgProps_   default: `{}` </description>

| 参数            | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| title           | 自定义标题           | `React.ReactNode`      | -      |      |
| description     | 自定义说明           | `string`               | -      |      |
| className       | 表头类名             | `string`               | -      |      |
| style           | 表头样式             | `React.CSSPropertie`  | -      |      |
| extra           | 自定义表头右侧操作区   |  `React.ReactNode`         | -       |      |
| advancedSortCfg | 配置高级排序         | [AdvancedSortCfgProps](/zh/docs/api/components/advanced-sort) | {open: false} |      |
| exportCfg       | 配置导出             | [ExportCfgProps](/zh/docs/api/components/export)  | {open: false} |      |
| switcherCfg       | 配置指标切换             | [SwitcherCfgProps](/zh/docs/api/components/switcher#switchercfgprops)  | {open: false} |      |
