import { InteractionStateName } from '@/common/constant';
import { S2CellType } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { forEach, includes, isEmpty } from 'lodash';

/**
 * @desc clear the interaction state information
 * @param spreadsheet sheet instance
 */
export const clearState = (spreadsheet: SpreadSheet) => {
  const allCells = spreadsheet.interaction.getPanelGroupAllDataCells();
  if (!isEmpty(allCells)) {
    forEach(allCells, (cell: S2CellType) => {
      cell.hideInteractionShape();
    });
  }
  spreadsheet.store.set('interactionStateInfo', {});
  if (spreadsheet.options.selectedCellsSpotlight) {
    const unSelectedCells =
      spreadsheet.interaction.getPanelGroupAllUnSelectedDataCells() || [];
    unSelectedCells.forEach((cell) => {
      cell.clearUnselectedState();
    });
  }
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
  if (!spreadsheet.interaction.isEqualStateName(stateName)) {
    // There can only be one state in the table. When the stateName is inconsistent with the state in the stateInfo, the previously stored state should be cleared.
    clearState(spreadsheet);
    spreadsheet.hideTooltip();
    const stateStore = {
      stateName,
      cells: [cell],
    };
    spreadsheet.store.set('interactionStateInfo', stateStore);
  } else if (!includes(spreadsheet.interaction.getActiveCells(), cell)) {
    spreadsheet.interaction.addActiveCells([cell]);
  }
};
