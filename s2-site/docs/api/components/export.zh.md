---
title: 导出
order: 5
tag: Updated
---

## React 导出组件 <Badge>@antv/s2-react-components</Badge>

```tsx | pure
import { Export } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css'

<Export sheetInstance={s2} />
```

### ExportCfgProps

| 属性 | 说明 | 类型 | 默认值 | 必选 |
| -- | -- | -- | -- | -- |
| sheetInstance | 表格实例 | [SpreadSheet](/api/basic-class/spreadsheet) |  |  |
| className | 类名 | `string` |  |  |
| icon | 展示图标 | `ReactNode` |  |  |
| copyOriginalText | 复制原始数据文案 | `string` |  |  |
| copyFormatText | 复制格式化数据文案 | `string` |  |  |
| downloadOriginalText | 下载原始数据文案 | `string` |  |  |
| downloadFormatText | 下载格式化数据文案 | `string` |  |  |
| fileName | 自定义下载文件名 (csv) | `string` | `sheet` |  |
| async | 异步复制/导出数据 （默认异步） | `boolean` | `true` |  |
| dropdown | 下拉菜单配置，透传给 `antd` 的 `Dropdown` 组件 | [DropdownProps](https://ant.design/components/dropdown-cn/#API) | | |
| customCopyMethod | 自定义导出组件内部复制处理逻辑 | (params: [CopyAllDataParams](#copyalldataparams)) => `Promise<string> \| string \| Promise<Copyable> \| Copyable` | | |
| onCopySuccess | 复制成功 | (data: `Copyable \| string \| undefined`) => void | | |
| onCopyError | 复制失败 | (error: `unknown`) => void | | |
| onDownloadSuccess | 下载成功 | (data: `string`) => void | | |
| onDownloadError | 下载失败 | (error: `unknown`) => void | | |

<embed src="@/docs/common/copy-export.zh.md"></embed>
