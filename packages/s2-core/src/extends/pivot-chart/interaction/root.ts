import {
  CellType,
  RootInteraction as OriginRootInteraction,
  type CellMeta,
} from '@antv/s2';
import { isEqual, map, sortBy, uniq } from 'lodash';
import { AxisCellType } from '../cell/cell-type';

const SameTypes = [
  sortBy([CellType.ROW_CELL, AxisCellType.AXIS_ROW_CELL]),
  sortBy([CellType.COL_CELL, AxisCellType.AXIS_COL_CELL]),
];

export class RootInteraction extends OriginRootInteraction {
  public shouldForbidHeaderCellSelected = (selectedCells: CellMeta[]) => {
    // 禁止跨单元格选择, 这样计算出来的数据和交互没有任何意义

    const types = sortBy(uniq(map(selectedCells, 'type')));

    if (types.length <= 1) {
      return false;
    }

    if (SameTypes.some((same) => isEqual(same, types))) {
      return false;
    }

    return true;
  };
}
