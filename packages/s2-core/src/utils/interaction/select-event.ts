import { S2CellType } from '@/common/interface';

export const getCellMeta = (cell: S2CellType) => {
  const meta = cell.getMeta();
  const { id, colIndex, rowIndex } = meta;
  return {
    id,
    colIndex,
    rowIndex,
    type: cell.cellType,
  };
};
