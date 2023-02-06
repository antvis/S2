---
title: Frozen
order: 1
---

## Frozen

Function description: Row and column header freeze configuration

| parameter        | type      | required | Defaults | Functional description                                                     |
| ---------------- | --------- | -------- | -------- | -------------------------------------------------------------------------- |
| rowHeader        | `boolean` |          | `true`   | Freeze row headers (pivot tables work)                                     |
| rowCount         | `number`  |          | `0`      | The number of frozen rows, counting from the top (schedules are valid)     |
| colCount         | `number`  |          | `0`      | The number of frozen columns, counting from the left (schedules are valid) |
| trailingRowCount | `number`  |          | `0`      | Number of frozen rows, counting from the bottom (valid for schedules)      |
| trailingColCount | `number`  |          | `0`      | Number of frozen columns, counting from the right (schedules are valid)    |
