import { get, isEmpty } from 'lodash';
import { isLastColumnAfterHidden } from '@/utils/hide-columns';
import { S2Event } from '@/common/constant';
import { renderDetailTypeSortIcon } from '@/utils/layout/add-detail-type-sort-icon';
import { getEllipsisText, getTextPosition } from '@/utils/text';
import { renderIcon, renderLine, renderText } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import { CellBoxCfg, DefaultCellTheme, IconTheme } from '@/common/interface';

export class TableColCell extends ColCell {
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

    if (spreadsheet.options.showDefaultHeaderActionIcon) {
      renderDetailTypeSortIcon(
        this,
        spreadsheet,
        x + cellWidth - iconSize - iconMarginRight,
        textY,
        key,
      );
    }
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
      (column) => column?.displaySiblingNode?.field === this.meta?.field,
    );
  }

  private getExpandIconTheme(): IconTheme {
    const themeCfg = this.getStyle() as DefaultCellTheme;
    return themeCfg.icon;
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
      name: 'ExpandColIcon',
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

    const baseIconX = x - size;
    const iconX = this.isLastColumn() ? baseIconX + width : baseIconX;
    const iconY = y + height / 2 - size / 2;

    return {
      x: iconX,
      y: iconY,
      width: size * 2,
      height: size,
    };
  }

  private isLastColumn() {
    return isLastColumnAfterHidden(this.spreadsheet, this.meta.field);
  }
}
