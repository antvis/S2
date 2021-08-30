import { SpreadSheet } from '@/sheet-type';
import { InterceptEventType } from '@/common/constant';
import { InteractionStateName } from '@/common/constant/interaction';
import { each, concat, isEmpty } from 'lodash';
import { S2CellType } from '@/common/interface';
import { Node } from '@/index';
import { Event } from '@antv/g-canvas';
import { mergeCellInfo } from '../tooltip';

export const handleRowColClick = (
  event: Event,
  spreadsheet: SpreadSheet,
  isTreeRowClick: boolean,
  isMultiSelection: boolean,
) => {
  const lastState = spreadsheet.interaction.getState();
  const cell = spreadsheet.getCell(event.target);
  const meta = cell.getMeta() as Node;

  if (spreadsheet.interaction.isSelectedCell(cell)) {
    // 点击当前已选cell 则取消当前cell的选中状态
    spreadsheet.interaction.clearState();
    spreadsheet.interaction.interceptEvent.clear();
    spreadsheet.hideTooltip();
    return;
  }

  if (meta.x !== undefined) {
    spreadsheet.interaction.interceptEvent.add(InterceptEventType.HOVER);
    // 树状结构的行头点击不需要遍历当前行头的所有子节点，因为只会有一级
    let leafNodes = isTreeRowClick
      ? Node.getAllLeavesOfNode(meta)
      : Node.getAllChildrenNode(meta);
    let selectedCells: S2CellType[] = [cell];

    if (
      isMultiSelection &&
      lastState.stateName === InteractionStateName.SELECTED
    ) {
      selectedCells = isEmpty(lastState?.cells)
        ? selectedCells
        : concat(lastState?.cells, selectedCells);
      leafNodes = isEmpty(lastState?.nodes)
        ? leafNodes
        : concat(lastState?.nodes, leafNodes);
    }

    // 兼容行列多选
    // Set the header cells (colCell or RowCell)  selected information and update the dataCell state.
    spreadsheet.interaction.changeState({
      cells: selectedCells,
      nodes: leafNodes,
      stateName: InteractionStateName.SELECTED,
    });

    // Update the interaction state of all the selected cells:  header cells(colCell or RowCell) and dataCells belong to them.
    selectedCells.map((cell) => {
      cell.update();
    });
    leafNodes.map((node) => {
      if (node?.belongsCell) {
        node.belongsCell.updateByState(
          InteractionStateName.SELECTED,
          node.belongsCell,
        );
      }
    });

    const cellInfos = spreadsheet.interaction.isSelectedState()
      ? mergeCellInfo(spreadsheet.interaction.getActiveCells())
      : [];

    if (spreadsheet.options.valueInCols) {
      spreadsheet.showTooltipWithInfo(event, cellInfos);
    }
  }
};
