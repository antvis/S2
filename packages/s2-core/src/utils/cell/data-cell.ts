import { isEqual } from 'lodash';
import type { CellMeta, S2CellType } from '../../common/interface';

/**
 * @description  Determine if the current cell belongs to Cells
 * @param cells active cells
 * @param currentCell current activated cell
 */
export const includeCell = (cells: CellMeta[], currentCell: S2CellType) => {
  const currentId = currentCell.getMeta().id;
  return cells.some((cell) => {
    return isEqual(cell.id, currentId);
  });
};

export const getDataCellId = (rowIndex: string, colIndex: string) => {
  return `${rowIndex}-${colIndex}`;
};
