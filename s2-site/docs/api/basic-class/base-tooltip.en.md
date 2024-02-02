---
title: BaseTooltip
order: 6
---

Function description: Tooltip class. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/ui/tooltip/index.ts)

```ts
s2.tooltip.show({
  position: {
    x: 0,
    y: 0,
  },
  content: 'xxx'
})
```

| parameter             | illustrate                                            | type                                                                        |
| --------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| `spreadsheet`         | Form example                                          | () => [SpreadSheet](/docs/api/basic-class/spreadsheet)                      |
| `container`           | tooltip mount container                               | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) |
| `options`             | tooltip configuration                                 | [TooltipShowOptions](#tooltipshowoptions)                                   |
| `position`            | coordinate                                            | `{ x: number, y: number }`                                                  |
| `visible`             | Display state                                         | `boolean`                                                                   |
| `show`                | show tooltip                                          | (showOptions: [TooltipShowOptions](#tooltipshowoptions) ) => void           |
| `hide`                | hide tooltip                                          | `() => void`                                                                |
| `destroy`             | Destroy the tooltip, and remove the mounted container | `() => void`                                                                |
| `clearContent`        | Empty tooltip content                                 | `() => void`                                                                |
| `disablePointerEvent` | Disable tooltip mouse response                        | `() => void`                                                                |

<embed src="@/docs/common/custom-tooltip.en.md"></embed>
