import { S2CellType } from 'src/common/interface';

export const getSelectedCellMeta = (cell: S2CellType) => {
  const meta = cell.getMeta();
  const { id, colIndex, rowIndex } = meta;
  return {
    id,
    colIndex,
    rowIndex,
    type: cell.cellType,
  };
};
