---
title: Frozen
order: 1
---

## Frozen

Function description: Row and column header freeze configuration

| parameter        | type      | required | Defaults | Functional description                                                     |
| ---------------- | --------- | -------- | -------- | -------------------------------------------------------------------------- |
| rowHeader        | `boolean` |          | `true`   | When the value is number, it identifies the maximum area where the line header is frozen, and the range of values ​​is (0, 1). 0 means that the line header is not frozen. <br/>When the value is boolean, true corresponds to freezing the maximum area is 0.5, false corresponds to 0. <br/> (only pivot mode works)                                     |
| rowCount         | `number`  |          | `0`      | The number of frozen rows, counting from the top (schedules are valid)     |
| colCount         | `number`  |          | `0`      | The number of frozen columns, counting from the left (schedules are valid) |
| trailingRowCount | `number`  |          | `0`      | Number of frozen rows, counting from the bottom (valid for schedules)      |
| trailingColCount | `number`  |          | `0`      | Number of frozen columns, counting from the right (schedules are valid)    |
