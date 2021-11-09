import { get, isEmpty } from 'lodash';
import { isFrozenCol, isFrozenTrailingCol } from 'src/facet/utils';
import { Group, SimpleBBox } from '@antv/g-canvas';
import { isLastColumnAfterHidden } from '@/utils/hide-columns';
import {
  S2Event,
  TABLE_COL_HORIZONTAL_RESIZE_AREA_KEY,
  KEY_GROUP_COL_HORIZONTAL_RESIZE_AREA,
  ResizeAreaType,
  ResizeAreaEffect,
} from '@/common/constant';
import { renderDetailTypeSortIcon } from '@/utils/layout/add-detail-type-sort-icon';
import { getEllipsisText } from '@/utils/text';
import { renderIcon, renderLine, renderText } from '@/utils/g-renders';
import { ColCell } from '@/cell/col-cell';
import { DefaultCellTheme, IconTheme } from '@/common/interface';
import { KEY_GROUP_FROZEN_COL_RESIZE_AREA } from '@/common/constant';
import {
  getResizeAreaAttrs,
  getResizeAreaGroupById,
} from '@/utils/interaction/resize';
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
    return getResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_FROZEN_COL_RESIZE_AREA,
    ) as Group;
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
        x + cellWidth - iconSize - iconMargin?.right,
        textY,
        iconMargin?.top,
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

  private getHorizontalResizeArea() {
    return getResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_COL_HORIZONTAL_RESIZE_AREA,
    );
  }

  protected drawHorizontalResizeArea() {
    const { viewportWidth } = this.headerConfig;
    const { height: cellHeight } = this.meta;
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = this.getHorizontalResizeArea();

    const prevHorizontalResizeArea = resizeArea.find(
      (element) => element.attrs.name === TABLE_COL_HORIZONTAL_RESIZE_AREA_KEY,
    );

    // 如果已经绘制当前列高调整热区热区，则不再绘制
    if (!prevHorizontalResizeArea) {
      // 列高调整热区
      resizeArea.addShape('rect', {
        attrs: {
          ...getResizeAreaAttrs({
            theme: resizeStyle,
            type: ResizeAreaType.Row,
            id: this.getColResizeAreaKey(),
            effect: ResizeAreaEffect.Filed,
            offsetX: 0,
            offsetY: 0,
            width: viewportWidth,
            height: cellHeight,
          }),
          name: TABLE_COL_HORIZONTAL_RESIZE_AREA_KEY,
          x: 0,
          y: cellHeight - resizeStyle.size,
          width: viewportWidth,
        },
      });
    }
  }
}
