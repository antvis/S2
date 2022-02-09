import { filter } from 'lodash';
import { generateId } from '../layout/generate-id';
import { ID_SEPARATOR } from '@/common/constant';
import { ColCell, RowCell } from '@/cell';

/**
 * @description Return all the row cells or column cells which are needed to be highlighted.
 * @param id rowId or colId
 * @param headerCells all the rowHeader cells or all the colHeader cells
 * @param isRowInHierarchyTreeType  The tree mode will only highlight the leaf nodes at the head of the row
 */
export const getActiveHoverRowColCells = (
  id: string,
  headerCells: ColCell[] | RowCell[],
  isRowInHierarchyTreeType?: boolean,
) => {
  let allHeaderIds: string[];
  const ids = id.split(ID_SEPARATOR);
  if (isRowInHierarchyTreeType) {
    allHeaderIds = [id];
  } else {
    allHeaderIds = [generateId(ids[0], ids[1])];
    for (let i = 2; i < ids.length; i += 1) {
      allHeaderIds.push(generateId(allHeaderIds[i - 2], ids[i]));
    }
  }

  const allHeaderCells = filter(headerCells, (cell: ColCell | RowCell) =>
    allHeaderIds.includes(cell.getMeta()?.id),
  );
  return allHeaderCells;
};
