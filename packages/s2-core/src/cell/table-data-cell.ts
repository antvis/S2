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
    const { linkFields = [] } = this.spreadsheet.options.interaction!;
    const linkTextFill = this.theme.rowCell!.text!.linkTextFill!;

    super.drawLinkFieldShape(
      linkFields.includes(this.meta.valueField),
      linkTextFill,
    );
  }

  public override drawBorders() {
    if (!this.meta.isFrozenCorner) {
      return;
    }
    BaseCell.prototype.drawBorders.call(this);
  }

  protected shouldDrawResizeArea() {
    // 每一行直绘制一条贯穿式 resize 热区
    const id = String(this.meta.rowIndex);

    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_RESIZE_AREA,
    );
    const frozenResizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
    );

    return !resizeArea?.findById(id) && !frozenResizeArea?.findById(id);
  }

  public drawResizeArea() {
    if (!this.shouldDrawResizeArea()) {
      return;
    }
    const { y, height } = this.getBBoxByType();
    const rowIndex = this.meta.rowIndex;
    const resizeStyle = this.getResizeAreaStyle();
    const { frozenRowCount = 0, frozenTrailingRowCount = 0 } =
      this.spreadsheet.options;
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

    const resizeWidth =
      headerWidth + Frame.getVerticalBorderWidth(this.spreadsheet);

    resizeArea.addShape('rect', {
      id: String(this.meta.rowIndex),
      attrs: {
        ...getResizeAreaAttrs({
          id: String(this.meta.rowIndex),
          theme: resizeStyle,
          type: ResizeDirectionType.Vertical,
          effect: ResizeAreaEffect.Cell,
          offsetX: 0,
          offsetY,
          width: resizeWidth,
          height,
          meta: this.meta,
        }),
        x: 0,
        y: offsetY + height - resizeStyle.size,
        width: resizeWidth,
      },
    });
  }
}
