import { INTERACTION_STATE_INFO_KEY } from '@/common/constant';
import { InteractionStateInfo, S2CellType } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { forEach, isEmpty } from 'lodash';

/**
 * @desc clear the interaction state information
 * @param spreadsheet sheet instance
 */
export const clearState = (spreadsheet: SpreadSheet) => {
  const allInteractedCells = spreadsheet.interaction.getInteractedCells();
  if (!isEmpty(allInteractedCells)) {
    forEach(allInteractedCells, (cell: S2CellType) => {
      cell.hideInteractionShape();
    });

    spreadsheet.interaction.resetState();
    if (spreadsheet.options.selectedCellsSpotlight) {
      const unSelectedCells =
        spreadsheet.interaction.getPanelGroupAllUnSelectedDataCells() || [];
      forEach(unSelectedCells, (cell) => {
        cell.clearUnselectedState();
      });
    }
  }
};

/**
 * @desc set the interaction state information
 * @param stateName the name of interaction state
 * @param spreadsheet sheet instance
 */
export const setState = (
  interactionStateInfo: InteractionStateInfo,
  spreadsheet: SpreadSheet,
) => {
  const stateName = interactionStateInfo?.stateName;
  if (!spreadsheet.interaction.isEqualStateName(stateName)) {
    // There can only be one state in the table. When the stateName is inconsistent with the state in the stateInfo, the previously stored state should be cleared.
    clearState(spreadsheet);
    spreadsheet.hideTooltip();
    spreadsheet.store.set(INTERACTION_STATE_INFO_KEY, interactionStateInfo);
  }
};
