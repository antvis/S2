import { SpreadSheet } from 'src/sheet-type';
import { ScrollDirection } from 'src/common/constant/interaction';
import { get } from 'lodash';

// 获取滚动指定列到视口内的滚动 x 轴 Offset。滚动到视口边缘位置，左侧和右侧视滚动方向而定。
export const getScrollOffsetForCol = (
  colIndex: number,
  direction: ScrollDirection,
  spreadsheet: SpreadSheet,
) => {
  const { facet } = spreadsheet;
  const { width } = facet.panelBBox;
  const frozenColWidth = get(facet, 'frozenGroupInfo.col.width', 0);
  const frozenTrailingColWidth = get(
    facet,
    'frozenGroupInfo.trailingCol.width',
    0,
  );

  const colNode = facet.layoutResult.colLeafNodes[colIndex];
  if (direction === ScrollDirection.LEADING) {
    return colNode.x - frozenColWidth;
  }
  return colNode.x + colNode.width - (width - frozenTrailingColWidth);
};

// 获取滚动指定行到视口内的滚动 y 轴 Offset。滚动到视口边缘位置，上侧和下侧视滚动方向而定。
export const getScrollOffsetForRow = (
  rowIndex: number,
  direction: ScrollDirection,
  spreadsheet: SpreadSheet,
) => {
  const { facet } = spreadsheet;
  const { getCellOffsetY } = facet.viewCellHeights;
  const rowOffset = getCellOffsetY(rowIndex + 1);

  const { height } = facet.panelBBox;

  const frozenRowHeight = get(facet, 'frozenGroupInfo.row.height', 0);
  const frozenTrailingRowHeight = get(
    facet,
    'frozenGroupInfo.trailingRow.height',
    0,
  );

  if (direction === ScrollDirection.LEADING) {
    return getCellOffsetY(rowIndex) - frozenRowHeight;
  }

  return rowOffset - (height - frozenTrailingRowHeight);
};
