import { filter, forEach } from 'lodash';
import type { ColCell, RowCell } from '../../cell';
import { NODE_ID_SEPARATOR, InteractionStateName } from '../../common/constant';
import { generateId } from '../layout/generate-id';

/**
 * @description Return all the row cells or column cells which are needed to be highlighted.
 * @param id rowId or colId
 * @param headerCells all the rowHeader cells or all the colHeader cells
 * @param isRowInHierarchyTreeType  The tree mode will only highlight the leaf nodes at the head of the row
 */
export const getActiveHoverRowColCells = (
  id: string,
  headerCells: (ColCell | RowCell)[],
  isRowInHierarchyTreeType?: boolean,
) => {
  let allHeaderIds: string[];
  const ids = id.split(NODE_ID_SEPARATOR);

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

export const updateAllColHeaderCellState = (
  colId: string | undefined,
  colHeaderCells: ColCell[],
  stateName: InteractionStateName,
) => {
  if (colId) {
    const allColHeaderCells = getActiveHoverRowColCells(colId, colHeaderCells);

    forEach(allColHeaderCells, (cell) => {
      cell.updateByState(stateName);
    });
  }
};
