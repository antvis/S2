import { forEach, isEmpty } from 'lodash';
import { INTERACTION_STATE_INFO_KEY } from '../../common/constant';
import type { InteractionStateInfo, S2CellType } from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';

/**
 * @desc clear the interaction state information
 * @param spreadsheet sheet instance
 */
export const clearState = (spreadsheet: SpreadSheet): boolean => {
  const activeIcons = spreadsheet.store.get('visibleActionIcons');
  const allInteractedCells = spreadsheet.interaction.getInteractedCells();
  const cellMetas = spreadsheet.interaction.getState().cells;

  // 如果都处于初始化状态 不需要clear
  if (
    isEmpty(allInteractedCells) &&
    isEmpty(cellMetas) &&
    isEmpty(activeIcons)
  ) {
    return false;
  }

  forEach(activeIcons, (icon) => {
    icon.setAttribute('visibility', 'hidden');
  });
  spreadsheet.store.set('visibleActionIcons', []);

  forEach(allInteractedCells, (cell: S2CellType) => {
    cell.hideInteractionShape();
  });

  spreadsheet.interaction.resetState();
  if (spreadsheet.options.interaction?.selectedCellsSpotlight) {
    const unSelectedCells =
      spreadsheet.interaction.getUnSelectedDataCells() || [];

    forEach(unSelectedCells, (cell) => {
      cell.clearUnselectedState();
    });
  }

  return true;
};

/**
 * @desc set the interaction state information
 * @param spreadsheet sheet instance
 * @param interactionStateInfo
 */
export const setState = (
  spreadsheet: SpreadSheet,
  interactionStateInfo: InteractionStateInfo,
) => {
  const stateName = interactionStateInfo?.stateName;

  if (!spreadsheet.interaction.isEqualStateName(stateName!)) {
    // There can only be one state in the table. When the stateName is inconsistent with the state in the stateInfo, the previously stored state should be cleared.
    clearState(spreadsheet);
    spreadsheet.hideTooltip();
    spreadsheet.store.set(INTERACTION_STATE_INFO_KEY, interactionStateInfo);
  }
};
