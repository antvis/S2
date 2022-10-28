import { Frame } from '../facet/header/frame';
import { DataCell } from '../cell/data-cell';
import {
  KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
} from '../common/constant';
import {
  isFrozenRow as isFrozenRowUtil,
  isFrozenTrailingRow as isFrozenTrailingRowUtil,
} from '../facet/utils';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '../utils/interaction/resize';
import { BaseCell } from './base-cell';
export class TableDataCell extends DataCell {
  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkFieldShape();
  }

  protected drawLinkFieldShape() {
    const { linkFields = [] } = this.spreadsheet.options.interaction;
    const linkTextFill = this.theme.rowCell.text.linkTextFill;

    super.drawLinkFieldShape(
      linkFields.includes(this.meta.valueField),
      linkTextFill,
    );
  }

  protected override drawBorders() {
    if (!this.meta.isFrozenCorner) {
      return;
    }
    BaseCell.prototype.drawBorders.call(this);
  }

  protected shouldDrawResizeArea() {
    // 只有最左侧的单元格需要绘制resize区域
    return this.meta.colIndex === 0;
  }

  public drawResizeArea() {
    if (!this.shouldDrawResizeArea()) {
      return;
    }
    const { y, height } = this.getBBoxByType();
    const rowIndex = this.meta.rowIndex;
    const resizeStyle = this.getResizeAreaStyle();
    const { frozenRowCount, frozenTrailingRowCount } = this.spreadsheet.options;
    const cellRange = this.spreadsheet.facet.getCellRange();
    const isFrozenRow = isFrozenRowUtil(
      rowIndex,
      cellRange.start,
      frozenRowCount,
    );
    const isFrozenTrailingRow = isFrozenTrailingRowUtil(
      rowIndex,
      cellRange.end,
      frozenTrailingRowCount,
    );
    const isFrozen = isFrozenRow || isFrozenTrailingRow;

    const resizeAreaId = isFrozen
      ? KEY_GROUP_FROZEN_ROW_RESIZE_AREA
      : KEY_GROUP_ROW_RESIZE_AREA;

    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      resizeAreaId,
    );

    if (!resizeArea) {
      return;
    }
    const { height: headerHeight, viewportWidth: headerWidth } =
      this.spreadsheet.facet.columnHeader.cfg;

    const { scrollY } = this.spreadsheet.facet.getScrollOffset();
    const paginationSy = this.spreadsheet.facet.getPaginationScrollY();

    let offsetY =
      y + headerHeight + Frame.getHorizontalBorderWidth(this.spreadsheet);

    if (!isFrozen) {
      offsetY -= scrollY + paginationSy;
    }

    resizeArea.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          id: String(this.meta.rowIndex),
          theme: resizeStyle,
          type: ResizeDirectionType.Vertical,
          effect: ResizeAreaEffect.Cell,
          offsetX: 0,
          offsetY,
          width: headerWidth,
          height,
          meta: this.meta,
        }),
        x: 0,
        y: offsetY + height - resizeStyle.size,
        width: headerWidth,
      },
    });
  }
}
