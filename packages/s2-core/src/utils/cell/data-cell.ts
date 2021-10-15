import { isEqual } from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import {
  FilterDataItemCallback,
  MappingDataItemCallback,
  S2CellType,
  CellMeta,
} from '@/common/interface';
import { Data } from '@/common/interface/s2DataConfig';

export const handleDataItem = (
  data: Data,
  callback?: FilterDataItemCallback | MappingDataItemCallback,
) => {
  return callback
    ? callback(data[EXTRA_FIELD] as string, data[VALUE_FIELD])
    : data[VALUE_FIELD];
};

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
