---
title: BaseTooltip
order: 6
---

功能描述：Tooltip 类。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/ui/tooltip/index.ts)

```ts
s2.tooltip.show({
  position: {
    x: 0,
    y: 0,
  },
  content: 'xxx'
})
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| `spreadsheet` | 表格实例 | () => [SpreadSheet](/docs/api/basic-class/spreadsheet) |
| `container` | tooltip 挂载容器 | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) |
| `options` | tooltip 配置 | [TooltipShowOptions](#tooltipshowoptions) |
| `position` | 坐标 | `{ x: number, y: number }` |
| `visible` | 显示状态 | `boolean` |
| `show` | 显示 tooltip | (showOptions: [TooltipShowOptions](#tooltipshowoptions)) => void |
| `hide` | 隐藏 tooltip | `() => void` |
| `destroy` | 销毁 tooltip, 并移除挂载容器 | `() => void` |
| `clearContent` | 清空 tooltip 内容 | `() => void` |
| `disablePointerEvent` | 禁用 tooltip 鼠标响应 | `() => void` |

<embed src="@/docs/common/custom-tooltip.zh.md"></embed>
