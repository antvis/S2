import { get } from 'lodash';
import { Group } from '@antv/g-canvas';
import { renderText } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import { KEY_GROUP_FROZEN_COL_RESIZE_AREA } from '@/common/constant';

import { renderDetailTypeSortIcon } from '../utils/layout/add-detail-type-sort-icon';
import { getEllipsisText, getTextPosition } from '../utils/text';

export class TableColCell extends ColCell {
  protected isFrozenCol() {
    const { frozenColCount, frozenTrailingColCount } = this.spreadsheet.options;
    const { colIndex } = this.meta;
    const colLeafNodes = this.spreadsheet.facet.layoutResult.colLeafNodes;

    return (
      (frozenColCount > 0 && colIndex < frozenColCount) ||
      (frozenTrailingColCount > 0 &&
        colIndex >= colLeafNodes.length - frozenTrailingColCount)
    );
  }

  protected getColResizeArea() {
    const isFrozenCol = this.isFrozenCol();

    if (!isFrozenCol) {
      return super.getColResizeArea();
    }
    const prevResizeArea = this.spreadsheet.foregroundGroup.findById(
      KEY_GROUP_FROZEN_COL_RESIZE_AREA,
    );
    return (prevResizeArea ||
      this.spreadsheet.foregroundGroup.addGroup({
        id: KEY_GROUP_FROZEN_COL_RESIZE_AREA,
      })) as Group;
  }

  protected getColResizeAreaOffset() {
    const { offset, position } = this.headerConfig;
    const { x, y } = this.meta;

    let finalOffset = offset;
    // 如果当前列被冻结，不对 resizer 做 offset 处理
    if (this.isFrozenCol()) {
      finalOffset = 0;
    }

    return {
      x: position.x - finalOffset + x,
      y: position.y + y,
    };
  }

  protected drawTextShape() {
    const { spreadsheet } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      key,
    } = this.meta;
    const content = label;

    const style = this.getStyle();
    const textStyle = get(style, 'bolderText');
    const padding = get(style, 'cell.padding');
    const iconSize = get(style, 'icon.size');
    const rightPadding = padding?.right + iconSize;
    const leftPadding = padding?.left;

    const textAlign = get(textStyle, 'textAlign');
    const textBaseline = get(textStyle, 'textBaseline');

    const cellBoxCfg = {
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      textAlign,
      textBaseline,
      padding: {
        left: leftPadding,
        right: rightPadding,
      },
    };
    const position = getTextPosition(cellBoxCfg);

    const textX = position.x;
    const textY = position.y;

    const text = getEllipsisText(
      content,
      cellWidth - leftPadding - rightPadding,
      textStyle,
    );

    this.textShape = renderText(
      this,
      [this.textShape],
      textX,
      textY,
      text,
      {
        textAlign,
        ...textStyle,
      },
      { cursor: 'pointer' },
    );

    renderDetailTypeSortIcon(
      this,
      spreadsheet,
      x + cellWidth - iconSize,
      textY,
      key,
    );
  }
}
