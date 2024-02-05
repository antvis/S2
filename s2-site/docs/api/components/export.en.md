---
title: Export
order: 5
tag: Updated
---

## React export components

```tsx
<SheetComponent
  dataCfg={dataCfg}
  options={options}
  header={{ export: { open: true } }}
/>
```

### ExportCfgProps

| Attributes           | illustrate                                                                              | type                                                            | Defaults | required |
| -------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------- | -------- |
| open                 | open component                                                                          | `boolean`                                                       | `false`  | ✓        |
| className            | class name                                                                              | `string`                                                        |          |          |
| icon                 | display icon                                                                            | `ReactNode`                                                     |          |          |
| copyOriginalText     | Copy original data copy                                                                 | `string`                                                        |          |          |
| copyFormatText       | copy formatted data copy                                                                | `string`                                                        |          |          |
| downloadOriginalText | Download the original data copy                                                         | `string`                                                        |          |          |
| downloadFormatText   | Download formatted data copy                                                            | `string`                                                        |          |          |
| successText          | Successful operation copy                                                               | `string`                                                        |          |          |
| errorText            | Operation failure copy                                                                  | `string`                                                        |          |          |
| fileName             | Customize the download file name                                                        | `string`                                                        | `sheet`  |          |
| syncCopy             | Copy data synchronously (default is asynchronous)                                       | `boolean`                                                       | `false`  |          |
| drop down            | Dropdown menu configuration, transparently passed to the `Dropdown` component of `antd` | [DropdownProps](https://ant.design/components/dropdown-cn/#API) |          |          |

<embed src="@/docs/common/copy-export.en.md"></embed>

## Vue export component

In development, please look forward to
