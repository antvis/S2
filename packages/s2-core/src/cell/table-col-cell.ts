import { get, isEmpty } from 'lodash';
import { isFrozenCol, isFrozenTrailingCol } from 'src/facet/utils';
import { Group, SimpleBBox } from '@antv/g-canvas';
import { isLastColumnAfterHidden } from '@/utils/hide-columns';
import { S2Event, HORIZONTAL_RESIZE_AREA_KEY_PRE } from '@/common/constant';
import { renderDetailTypeSortIcon } from '@/utils/layout/add-detail-type-sort-icon';
import { getEllipsisText } from '@/utils/text';
import { renderIcon, renderLine, renderText } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import { DefaultCellTheme, IconTheme } from '@/common/interface';
import { KEY_GROUP_FROZEN_COL_RESIZE_AREA } from '@/common/constant';
import { getOrCreateResizeAreaGroupById } from '@/utils/interaction/resize';
import { getTextPosition } from '@/utils/cell/cell';

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
    return getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_FROZEN_COL_RESIZE_AREA,
    ) as Group;
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
    const iconMargin = get(style, 'icon.margin');
    const rightPadding = padding?.right + iconSize;
    const leftPadding = padding?.left;

    const textAlign = get(textStyle, 'textAlign');
    const textBaseline = get(textStyle, 'textBaseline');

    const cellBoxCfg: SimpleBBox = {
      x,
      y,
      width: cellWidth,
      height: cellHeight,
    };
    const position = getTextPosition(cellBoxCfg, { textAlign, textBaseline });

    const expandIconMargin = this.getExpandIconMargin();

    const text = getEllipsisText({
      text: label,
      maxWidth:
        cellWidth -
        leftPadding -
        rightPadding -
        expandIconMargin -
        iconMargin?.left,
      fontParam: textStyle,
      placeholder: this.spreadsheet.options.placeholder,
    });

    this.textShape = renderText(
      this,
      [this.textShape],
      position.x,
      position.y,
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
        x + cellWidth - iconSize - iconMargin?.right - expandIconMargin,
        position.y,
        iconMargin?.top,
        key,
      );
    }
  }

  protected initCell() {
    super.initCell();
    this.addExpandColumnIconShapes();
  }

  // 有展开图标时, 需要将文字和排序图标向左移动, 空出图标的位置, 避免遮挡
  private getExpandIconMargin() {
    const style = this.getStyle();
    const iconMarginLeft = style.icon.margin?.left || 0;
    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );
    const expandIconPrevSiblingCell = hiddenColumnsDetail.find(
      (column) => column?.displaySiblingNode?.prev?.field === this.meta?.field,
    );
    const { size } = this.getExpandIconTheme();

    // 图标本身宽度 + 主题配置的 icon margin
    return expandIconPrevSiblingCell ? size / 2 + iconMarginLeft : 0;
  }

  private hasHiddenColumnCell() {
    const {
      interaction: { hiddenColumnFields = [] },
      tooltip: { operation },
    } = this.spreadsheet.options;

    if (isEmpty(hiddenColumnFields) || !operation.hiddenColumns) {
      return false;
    }
    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );
    return !!hiddenColumnsDetail.find((column) => {
      const { prev, next } = column?.displaySiblingNode || {};
      const hiddenSiblingNode = next || prev;
      return hiddenSiblingNode?.field === this.meta?.field;
    });
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

  protected getHorizontalResizeAreaName() {
    return `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${'table-col-cell'}`;
  }
}
