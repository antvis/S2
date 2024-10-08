import {
  SpreadSheet,
  getColCellTheme,
  getCornerCellTheme,
  getRowCellTheme,
  type S2Theme,
  type SimplePalette,
} from '@antv/s2';
import { merge } from 'lodash';
import { AxisCellType } from '../cell/cell-type';

export const getCustomTheme = (
  palette: SimplePalette,
  spreadsheet?: SpreadSheet,
): S2Theme => {
  return {
    [AxisCellType.AXIS_CORNER_CELL]: getCornerCellTheme(palette),
    [AxisCellType.AXIS_ROW_CELL]: getRowCellTheme(palette, spreadsheet),
    [AxisCellType.AXIS_COL_CELL]: merge(getColCellTheme(palette), {
      measureText: {
        textAlign: 'center',
      },
    }),
  };
};
