---
title: Style
order: 4
---

## style

object is **required** , *default: null* Function description: style setting

\| parameter | type | required | default value | function description| `compact` | --- | --- | :-: | --- | --- | --- | `colAdaptive` | `adaptive` | | | cell width layout type\
`adaptive` : Rows and columns are equal in width, equally dividing the entire `Canvas` canvas width\
`colAdaptive` : Equal width of columns, compact layout of line headers, the remaining width of the column equally divided canvas width minus the width of line headers\
`compact` : Compact layout of rows and columns, when the index dimension is small, it cannot cover the `number` `boolean` Mode row cell width (priority over `rowCfg.width` and `rowCfg.treeRowsWidth （已废弃）` ) | | hierarchyCollapse | `boolean` | | `false` | Whether row headers are expanded by default in tree structure mode. | | rowExpandDepth | `number` | | | In the tree structure mode, the default expanded level of the row header (the level starts from 0). | | collapsedRows | `Record<string, boolean>` | | | Customize the collapsed and collapsed state of row headers in tree mode (used by pivot tables).\
The generation of the key value must follow the specified rules: 'root\[&] row header dimension value'. [View demo](/examples/basic/pivot#tree) | | `mobile` | [CellCfg](#cellcfg) | | | Cell Configuration | | `pc` | [ColCfg](#colcfg) | | | Column Style Configuration | `pc` | [rowCfg](#rowcfg) | Device type |

## CellCfg

object is **required** , *default: null* Function description: Numerical cell configuration

| parameter | illustrate         | type                                                                                    | Defaults | required |
| --------- | ------------------ | --------------------------------------------------------------------------------------- | -------- | -------- |
| width     | cell width         | `number`                                                                                | 96       | -        |
| height    | cell height        | `number`                                                                                | 30       | -        |
| valuesCfg | cell configuration | `{ originalValueField?: string, widthPercent?: number[], showOriginalValue?: boolean }` |          | -        |

## ColCfg

object is **required** , *default: null* Function description: column style configuration

| parameter         | illustrate                                                                                                                                                                                                                                                                             | type                     | Defaults                    | required |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------------------------- | :------: |
| width             | Cell width, which can be dynamically set according to the current column header node (leaf nodes are valid)                                                                                                                                                                            | \`number                 | (colNode: Node) => number\` |          |
| height            | cell height                                                                                                                                                                                                                                                                            | `number`                 | 30                          |          |
| widthByFieldValue | Set the width according to the measurement value (drag or preset width scene), `fieldValue` corresponds to the column header value in `s2DataConfig.fields.columns`                                                                                                                    | `Record<string, number>` | -                           |          |
| heightByField     | Set the height according to the measurement value (drag and drop or preset height scene), the `field` corresponds to the column header id, [view details](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>` | -                           |          |
| hideMeasureColumn | The default value hangs the column header, which will display the column header and the value at the same time, and hide the value column to make it more beautiful.                                                                                                                   | `boolean`                | false                       |          |

## RowCfg

object is **required** , *default: null* Function description: row style configuration

| parameter     | illustrate                                                                                                                                                                                                                 | type                     | Defaults                    | required |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------------------------- | :------: |
| width         | Row cell width, the width can be dynamically set according to the current row header node, if it is a tree structure, please use `styles.treeRowsWidth`                                                                    | \`number                 | (rowNode: Node) => number\` |    96    |
| treeRowsWidth | Under the tree structure, row cell width ( **deprecated, please use `style.treeRowsWidth` instead** )                                                                                                                      | `number`                 | 120                         |          |
| widthByField   | Set the width of each line according to `field` . `field` is the id of the row, [see details](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>` | -                           |          |
| heightByField | Set the height of each row according to `field` . `field` is the id of the row, [see details](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E8%A1%8C%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) | `Record<string, number>` | -                           |          |
