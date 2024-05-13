import { isNil } from 'lodash';
import { ScrollDirection } from '../../common/constant/interaction';
import type { TableFacet } from '../../facet';
import type { SpreadSheet } from '../../sheet-type';
import { FrozenGroupPosition } from '../../common';

// 获取滚动指定列到视口内的滚动 x 轴 Offset。滚动到视口边缘位置，左侧和右侧视滚动方向而定。
export const getScrollOffsetForCol = (
  colIndex: number,
  direction: ScrollDirection,
  spreadsheet: SpreadSheet,
) => {
  const { facet } = spreadsheet;
  const { viewportWidth } = facet.panelBBox;
  const positions = (facet as TableFacet)?.frozenGroupPositions;
  const frozenColWidth = positions[FrozenGroupPosition.Col].width;
  const frozenTrailingColWidth =
    positions[FrozenGroupPosition.TrailingCol].width;

  const colNode = facet.getColLeafNodes()[colIndex];

  if (direction === ScrollDirection.SCROLL_UP) {
    return colNode.x - frozenColWidth;
  }

  return colNode.x + colNode.width - (viewportWidth - frozenTrailingColWidth);
};

// 获取滚动指定行到视口内的滚动 y 轴 Offset。滚动到视口边缘位置，上侧和下侧视滚动方向而定。
export const getScrollOffsetForRow = (
  rowIndex: number,
  direction: ScrollDirection,
  spreadsheet: SpreadSheet,
) => {
  const { facet } = spreadsheet;
  const { getCellOffsetY } = facet.viewCellHeights;
  const { viewportHeight } = facet.panelBBox;
  const rowOffset = getCellOffsetY(rowIndex + 1);

  if (isNil(rowOffset)) {
    return 0;
  }

  const positions = (facet as TableFacet)?.frozenGroupPositions;
  const frozenRowHeight = positions[FrozenGroupPosition.Row].height;
  const frozenTrailingRowHeight =
    positions[FrozenGroupPosition.TrailingRow].height;

  if (direction === ScrollDirection.SCROLL_UP) {
    return getCellOffsetY(rowIndex) - frozenRowHeight;
  }

  return rowOffset - (viewportHeight - frozenTrailingRowHeight);
};
