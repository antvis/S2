export const DEFAULT_FACET_CFG = {
  hierarchyType: 'grid', // grid / tree
  treeRowsWidth: 100,
  width: 640,
  height: 480,
  collapsedRows: {},
  collapsedCols: {},
  cols: [], // required
  rows: [], // required
  // cross cell
  cellCfg: {
    width: 96,
    height: 32, // 列高统一用 cell 高
    padding: [0,4,0,4],
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
    treeRowsWidth: 100,
    widthByField: {
      // [field]: width,
    },
  },
};
