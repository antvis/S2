export const DEFAULT_FACET_CFG = {
  hierarchyType: 'grid', // grid / tree
  treeRowsWidth: 100,
  plotSize: {
    width: 640,
    height: 480,
  },
  collapsedRows: {},
  collapsedCols: {},
  cols: [], // required
  rows: [], // required
  // cell 配置，cell 可能是一个 view，也可能是 view 里的某一行或者某一列
  cellCfg: {
    width: 96,
    height: 32, // 列高统一用 cell 高
    padding: 0,
  },
  colCfg: {
    height: 32,
    widthByFieldValue: {
      // 列头高优先使用 heightByField，然后使用 height，然后使用 CELL_CFG.height
      // [fieldValue]: width,
    },
    colWidthType: 'adaptive', // 列布局方式：adaptive 宽度适应 | compact 紧凑
    heightByField: {
      // [field]: height,
    },
  },
  rowCfg: {
    width: 96,
    widthByField: {
      // [field]: width,
    },
  },
};
