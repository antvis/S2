import { filter, forEach } from 'lodash';
import type { HeaderCell } from '../../cell';
import { InteractionStateName, NODE_ID_SEPARATOR } from '../../common/constant';
import { generateId } from '../layout/generate-id';

/**
 * @description Return all the row cells or column cells which are needed to be highlighted.
 * @param id rowId or colId
 * @param headerCells all the rowHeader cells or all the colHeader cells
 * @param isHierarchyTree The tree mode will only highlight the leaf nodes at the head of the row
 */
export const getActiveHoverHeaderCells = (
  id: string,
  headerCells: HeaderCell[],
  isHierarchyTree?: boolean,
) => {
  let allHeaderIds: string[];
  const ids = id.split(NODE_ID_SEPARATOR);

  if (isHierarchyTree) {
    allHeaderIds = [id];
  } else {
    allHeaderIds = [generateId(ids[0], ids[1])];
    for (let i = 2; i < ids.length; i += 1) {
      allHeaderIds.push(generateId(allHeaderIds[i - 2], ids[i]));
    }
  }

  const allHeaderCells = filter(headerCells, (cell) =>
    allHeaderIds.includes(cell.getMeta()?.id),
  );

  return allHeaderCells;
};

export const updateAllHeaderCellState = (
  id: string | undefined,
  headerCells: HeaderCell[],
  stateName: InteractionStateName,
) => {
  if (id) {
    const allColHeaderCells = getActiveHoverHeaderCells(id, headerCells);

    forEach(allColHeaderCells, (cell) => {
      cell.updateByState(stateName);
    });
  }
};
