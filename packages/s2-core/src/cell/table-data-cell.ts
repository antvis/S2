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

  protected drawBorderShape() {
    super.drawBorderShape();
    if (this.meta.colIndex === 0) {
      this.drawLeftBorder();
    }
  }

  public shouldDrawResizeArea() {
    // 只有最左侧的单元格需要绘制resize区域
    return this.meta.colIndex === 0;
  }

  public drawResizeArea() {
    if (!this.shouldDrawResizeArea()) {
      return;
    }
    const { x, y, width, height } = this.getCellArea();
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
    const colHeight = this.spreadsheet.facet.layoutResult.colsHierarchy.height;
    const { scrollY: sy } = this.spreadsheet.facet.getScrollOffset();
    const paginationSy = this.spreadsheet.facet.getPaginationScrollY();
    const scrollY = sy + paginationSy;

    let yOffset = y + (isFrozenTrailingRow ? 0 : colHeight);

    if (!isFrozenTrailingRow) {
      yOffset -= isFrozenRow ? paginationSy : scrollY;
    }

    resizeArea?.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          id: String(this.meta.rowIndex),
          theme: resizeStyle,
          type: ResizeDirectionType.Vertical,
          effect: ResizeAreaEffect.Cell,
          offsetX: x,
          offsetY: yOffset,
          width,
          height,
          meta: this.meta,
        }),
        x,
        y: yOffset + height - resizeStyle.size! / 2,
        width,
      },
    });
  }
}
