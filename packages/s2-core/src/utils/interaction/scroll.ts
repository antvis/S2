import { isNil } from 'lodash';
import { FrozenGroupArea } from '../../common';
import { ScrollDirection } from '../../common/constant/interaction';
import type { TableFacet } from '../../facet';
import type { SpreadSheet } from '../../sheet-type';

// 获取滚动指定列到视口内的滚动 x 轴 Offset。滚动到视口边缘位置，左侧和右侧视滚动方向而定。
export const getScrollOffsetForCol = (
  colIndex: number,
  direction: ScrollDirection,
  spreadsheet: SpreadSheet,
) => {
  const { facet } = spreadsheet;
  const { viewportWidth } = facet.panelBBox;
  const areas = (facet as TableFacet)?.frozenGroupAreas;
  const frozenColWidth = areas[FrozenGroupArea.Col].width;
  const frozenTrailingColWidth = areas[FrozenGroupArea.TrailingCol].width;

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

  const areas = (facet as TableFacet)?.frozenGroupAreas;
  const frozenRowHeight = areas[FrozenGroupArea.Row].height;
  const frozenTrailingRowHeight = areas[FrozenGroupArea.TrailingRow].height;

  if (direction === ScrollDirection.SCROLL_UP) {
    return getCellOffsetY(rowIndex) - frozenRowHeight;
  }

  return rowOffset - (viewportHeight - frozenTrailingRowHeight);
};
