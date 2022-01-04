import { getDataCellId } from '../cell/data-cell';
import { TableFacet } from '@/facet';
import { S2Options, InteractionStateName, CellTypes } from '@/common';
import { RootInteraction } from '@/interaction';

export const scrollToCell = (
  rowIndex: number,
  colIndex: number,
  options: S2Options,
  facet: TableFacet,
  interaction: RootInteraction,
) => {
  const { frozenRowCount, frozenColCount = 0 } = options;
  const colsNodes = facet.layoutResult.colLeafNodes;

  let offsetX = 0;
  let offsetY = 0;

  offsetX = colsNodes.find((item) => item.colIndex === colIndex)?.x || 0;
  if (frozenColCount > 1) {
    const firstUnfrozenNodeX =
      colsNodes.find((item) => item.colIndex === frozenColCount)?.x || 0;
    offsetX -= firstUnfrozenNodeX;
  }

  offsetY = facet.viewCellHeights.getCellOffsetY(rowIndex - 1);

  if (frozenRowCount > 0 && rowIndex > frozenRowCount - 1) {
    offsetY -= (facet as any).getTotalHeightForRange(0, frozenRowCount - 1);
  }

  if (offsetY < 0) {
    offsetY = 0;
  }

  if (offsetX < 0) {
    offsetX = 0;
  }

  facet.scrollWithAnimation({
    offsetX: {
      value: offsetX,
    },
    offsetY: {
      value: offsetY,
    },
  });

  interaction.changeState({
    stateName: InteractionStateName.SELECTED,
    cells: [
      {
        colIndex,
        rowIndex,
        id: getDataCellId(String(rowIndex), colsNodes[colIndex].id),
        type: CellTypes.DATA_CELL,
      },
    ],
  });
};
