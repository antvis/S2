---
title: 导出
order: 5
---

## React 导出组件

```tsx
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{ exportCfg: { open: true } }}
/>
```

### ExportCfgProps

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| open | 开启组件 | `boolean` | `false` | ✓ |
| className | 类名 | `string` |  |  |
| icon | 展示图标 | `ReactNode` |  |  |
| copyOriginalText | 复制原始数据文案 | `string` |  |  |
| copyFormatText | 复制格式化数据文案 | `string` |  |  |
| downloadOriginalText | 下载原始数据文案 | `string` |  |  |
| downloadFormatText | 下载格式化数据文案 | `string` |  |  |
| successText | 操作成功文案 | `string` |  |  |
| errorText | 操作失败文案 | `string` |  |  |
| fileName | 自定义下载文件名 | `string` | `sheet` |  |
| syncCopy | 同步复制数据 （默认异步） | `boolean` | `false` |  |
| dropdown | 下拉菜单配置，透传给 `antd` 的 `Dropdown` 组件 | [DropdownProps](https://ant.design/components/dropdown-cn/#API) | | |

<embed src="@/docs/common/export.zh.md"></embed>

## Vue 导出组件

开发中，敬请期待
