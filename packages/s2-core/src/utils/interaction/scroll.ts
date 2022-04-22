import { SpreadSheet } from 'src/sheet-type';
import { TableFacet } from 'src/facet';
import { ScrollDirection } from 'src/common/constant/interaction';

// 获取滚动指定列到视口内的滚动 x 轴 Offset。滚动到视口边缘位置，左侧和右侧视滚动方向而定。
export const getScrollOffsetForCol = (
  colIndex: number,
  direction: ScrollDirection,
  spreadsheet: SpreadSheet,
) => {
  const { facet } = spreadsheet;
  const { width } = facet.panelBBox;
  const frozenColWidth =
    (facet as TableFacet)?.frozenGroupInfo.frozenCol.width ?? 0;
  const frozenTrailingColWidth =
    (facet as TableFacet)?.frozenGroupInfo.frozenTrailingCol.width ?? 0;

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

  const frozenRowHeight =
    (facet as TableFacet)?.frozenGroupInfo.frozenRow.height ?? 0;
  const frozenTrailingRowHeight =
    (facet as TableFacet)?.frozenGroupInfo.frozenTrailingRow.height ?? 0;

  if (direction === ScrollDirection.LEADING) {
    return getCellOffsetY(rowIndex) - frozenRowHeight;
  }

  return rowOffset - (height - frozenTrailingRowHeight);
};
