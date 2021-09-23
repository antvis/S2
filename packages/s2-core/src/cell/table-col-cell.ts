import { get, isEmpty, last } from 'lodash';
import { isFrozenCol, isFrozenTrailingCol } from 'src/facet/utils';
import { Group } from '@antv/g-canvas';
import { S2Event } from '@/common/constant';
import { renderDetailTypeSortIcon } from '@/utils/layout/add-detail-type-sort-icon';
import { getEllipsisText, getTextPosition } from '@/utils/text';
import { renderIcon, renderLine, renderText } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import { CellBoxCfg, CellTheme } from '@/common/interface';
import { KEY_GROUP_FROZEN_COL_RESIZE_AREA } from '@/common/constant';

export class TableColCell extends ColCell {
  protected isFrozenCell() {
    const { frozenColCount, frozenTrailingColCount } = this.spreadsheet.options;
    const { colIndex } = this.meta;
    const colLeafNodes = this.spreadsheet.facet.layoutResult.colLeafNodes;

    return (
      isFrozenCol(colIndex, frozenColCount) ||
      isFrozenTrailingCol(colIndex, frozenTrailingColCount, colLeafNodes.length)
    );
  }

  protected getColResizeArea() {
    const isFrozenCell = this.isFrozenCell();

    if (!isFrozenCell) {
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
    if (this.isFrozenCell()) {
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

    const style = this.getStyle();
    const textStyle = get(style, 'bolderText');
    const padding = get(style, 'cell.padding');
    const iconSize = get(style, 'icon.size');
    const iconMarginRight = get(style, 'icon.margin.right');
    const rightPadding = padding?.right + iconSize;
    const leftPadding = padding?.left;

    const textAlign = get(textStyle, 'textAlign');
    const textBaseline = get(textStyle, 'textBaseline');

    const cellBoxCfg: CellBoxCfg = {
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
      label,
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
      x + cellWidth - iconSize - iconMarginRight,
      textY,
      key,
    );
  }

  protected initCell() {
    super.initCell();
    this.addExpandColumnIconShapes();
  }

  private hasHiddenColumnCell() {
    const {
      hiddenColumnFields = [],
      tooltip: { operation },
    } = this.spreadsheet.options;

    if (isEmpty(hiddenColumnFields) || !operation.hiddenColumns) {
      return false;
    }
    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );
    return !!hiddenColumnsDetail.find(
      ({ displaySiblingNode }) => displaySiblingNode?.field === this.meta.field,
    );
  }

  private getExpandIconTheme(): CellTheme {
    const cellTheme = this.getStyle();
    return cellTheme.cell.expandIcon;
  }

  private addExpandColumnSplitLine() {
    const { x, y, width, height } = this.meta;
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      horizontalBorderColorOpacity,
    } = this.theme.splitLine;
    const lineX = this.isLastColumn() ? x + width - horizontalBorderWidth : x;

    renderLine(
      this,
      {
        x1: lineX,
        y1: y,
        x2: lineX,
        y2: y + height,
      },
      {
        stroke: horizontalBorderColor,
        lineWidth: horizontalBorderWidth,
        strokeOpacity: horizontalBorderColorOpacity,
      },
    );
  }

  private addExpandColumnIconShapes() {
    if (!this.hasHiddenColumnCell()) {
      return;
    }
    this.addExpandColumnSplitLine();
    this.addExpandColumnIcon();
  }

  private addExpandColumnIcon() {
    const iconConfig = this.getExpandColumnIconConfig();
    const icon = renderIcon(this, {
      ...iconConfig,
      type: 'ExpandColIcon',
      cursor: 'pointer',
    });
    icon.on('click', () => {
      this.spreadsheet.emit(S2Event.LAYOUT_TABLE_COL_EXPANDED, this.meta);
    });
  }

  // 在隐藏的下一个兄弟节点的起始坐标显示隐藏提示线和展开按钮, 如果是尾元素, 则显示在前一个兄弟节点的结束坐标
  private getExpandColumnIconConfig() {
    const { size } = this.getExpandIconTheme();
    const { x, y, width, height } = this.getCellArea();

    const baseIconX = x - size / 2;
    const iconX = this.isLastColumn() ? baseIconX + width : baseIconX;
    const iconY = y + height / 2 - size / 4;

    return {
      x: iconX,
      y: iconY,
      width: size,
      height: size / 2,
    };
  }

  private isLastColumn() {
    const { field } = this.meta;
    const columnNodes = this.spreadsheet.getColumnNodes();
    const initColumnNodes = this.spreadsheet.getInitColumnNodes();
    return (
      last(columnNodes).field === field && last(initColumnNodes).field !== field
    );
  }
}
