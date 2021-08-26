import {
  FilterDataItemCallback,
  MappingDataItemCallback,
  S2CellType,
  ViewMeta,
} from '@/common/interface';
import { Data } from '@/common/interface/s2DataConfig';
import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';

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
 * @param meta the meta information of current cell
 */
export const ifIncludeCell = (cells: S2CellType[], meta: ViewMeta) => {
  return cells.some((cell) => {
    const cellMeta = cell.getMeta();
    return cellMeta.colId === meta.colId && cellMeta.rowId === meta.rowId;
  });
};
