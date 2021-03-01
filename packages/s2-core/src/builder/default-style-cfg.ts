import { TREE_ROW_DEFAULT_WIDTH } from '../common/constant';
import { Style } from '../common/interface';

export const DefaultStyleCfg = () => {
  return {
    treeRowsWidth: TREE_ROW_DEFAULT_WIDTH,
    collapsedRows: {},
    collapsedCols: {},
    cellCfg: {
      width: 96,
      height: 30,
      padding: 0,
    },
    rowCfg: {
      width: 96,
      widthByField: {},
    },
    colCfg: {
      height: 40,
      widthByFieldValue: {},
      heightByField: {},
      colWidthType: 'adaptive',
      totalSample: 10,
      detailSample: 30,
      showDerivedIcon: true,
      maxSampleIndex: 1,
    },
    device: 'pc',
  } as Style;
};
