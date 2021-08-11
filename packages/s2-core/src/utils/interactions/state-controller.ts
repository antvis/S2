import { InteractionStateName } from '@/common/constant';
import { S2CellType } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { isEmpty, forEach, includes } from 'lodash';

/**
 * @desc clear the interaction state information
 * @param spreadsheet sheet instance
 */
export const clearState = (spreadsheet: SpreadSheet) => {
  const stateInfo = spreadsheet.getCurrentState();
  if (!isEmpty(stateInfo?.cells)) {
    forEach(stateInfo?.cells, (cell: S2CellType) => {
      cell.hideShapeUnderState();
    });
  }
  spreadsheet.store.set('interactionStateInfo', {});
};

/**
 * @desc set the interaction state information
 * @param stateName the name of interaction state
 * @param spreadsheet sheet instance
 */
export const setState = (
  cell: S2CellType,
  stateName: InteractionStateName,
  spreadsheet: SpreadSheet,
) => {
  const stateInfo = spreadsheet.getCurrentState();
  if (stateName !== stateInfo?.stateName) {
    // There can only be one state in the table. When the stateName is inconsistent with the state in the stateInfo, the previously stored state should be cleared.
    clearState(spreadsheet);
    spreadsheet.hideTooltip();
    const stateStore = {
      stateName,
      cells: [cell],
    };
    spreadsheet.store.set('interactionStateInfo', stateStore);
  } else {
    const currentStateCells = stateInfo?.cells;
    if (!includes(currentStateCells, cell)) {
      currentStateCells.push(cell);
    }
  }
};
