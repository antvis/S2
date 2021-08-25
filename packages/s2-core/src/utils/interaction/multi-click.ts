import { SpreadSheet } from '@/sheet-type';
import { InterceptEventType, S2Event } from '@/common/constant';
import { InteractionStateName } from '@/common/constant/interaction';
import { each, concat, isEmpty } from 'lodash';
import { S2CellType } from '@/common/interface';
import { Node } from '@/index';
import { Event } from '@antv/g-canvas';
import { mergeCellInfo } from '../tooltip';

export const handleRowColClick = (event: Event, spreadsheet: SpreadSheet) => {
  const currentState = spreadsheet.interaction.getState();
  const cell = spreadsheet.getCell(event.target);
  const meta = cell.getMeta() as Node;
  if (meta.x !== undefined) {
    spreadsheet.interaction.clearState();
    spreadsheet.interaction.interceptEvent.add(InterceptEventType.HOVER);
    let leafNodes = Node.getAllLeavesOfNode(meta);
    let selectedCells: S2CellType[] = [];
    each(leafNodes, (node: Node) => {
      if (node.belongsCell) {
        selectedCells.push(node.belongsCell);
      }
    });

    // 兼容行列多选
    selectedCells = isEmpty(currentState?.cells)
      ? selectedCells
      : concat(currentState?.cells, selectedCells);
    leafNodes = isEmpty(currentState?.nodes)
      ? leafNodes
      : concat(currentState?.nodes, leafNodes);
    spreadsheet.interaction.changeState({
      cells: selectedCells,
      nodes: leafNodes,
      stateName: InteractionStateName.SELECTED,
    });

    const cellInfos = spreadsheet.interaction.isSelectedState()
      ? mergeCellInfo(spreadsheet.interaction.getActiveCells())
      : [];

    if (spreadsheet.options.valueInCols) {
      spreadsheet.showTooltipWithInfo(event, cellInfos);
    }
  }
};
