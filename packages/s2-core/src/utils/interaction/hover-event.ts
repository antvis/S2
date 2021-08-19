import { ID_SEPARATOR } from '@/common/constant';
import { ColCell, RowCell } from '@/cell';
import { filter } from 'lodash';

const generateId = (parentId: string, childrenId: string) => {
  return `${parentId}${ID_SEPARATOR}${childrenId}`;
};

/**
 * @description return all the row cells or column cells which are needed to be highlighted
 * @param id rowId or colId
 * @param headerCells all the rowHeader cells or all the colHeader cells
 *
 */
export const getActiveHoverRowColCells = (
  id: string,
  headerCells: ColCell[] | RowCell[],
) => {
  const ids = id.split(ID_SEPARATOR);
  const allHeaderIds = [generateId(ids[0], ids[1])];
  for (let i = 2; i < ids.length; i += 1) {
    allHeaderIds.push(generateId(allHeaderIds[i - 2], ids[i]));
  }
  const allHeaderCells = filter(headerCells, (cell: ColCell | RowCell) =>
    allHeaderIds.includes(cell.getMeta()?.id),
  );
  return allHeaderCells;
};
