---
title: header
order: 0
---

### HeaderCfgProps

**optional** *HeaderCfgProps* default: `{}`

| parameter       | illustrate                                                         | type                                                                  | Defaults        | required |
| --------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------- | --------------- | -------- |
| title           | custom title                                                       | `React.ReactNode`                                                     | -               |          |
| description     | custom description                                                 | `React.ReactNode`                                                     | -               |          |
| className       | header class name                                                  | `string`                                                              | -               |          |
| style           | header style                                                       | `React.CSSProperties`                                                 | -               |          |
| extra           | Customize the operation area on the right side of the table header | `React.ReactNode`                                                     | -               |          |
| advancedSortCfg | Configure advanced sorting                                         | [AdvancedSortCfgProps](/docs/api/components/advanced-sort)         | `{open: false}` |          |
| exportCfg       | configuration export                                               | [ExportCfgProps](/docs/api/components/export)                      | `{open: false}` |          |
| switcherCfg     | Configure indicator switching                                      | [SwitcherCfgProps](/docs/api/components/switcher#switchercfgprops) | `{open: false}` |          |
