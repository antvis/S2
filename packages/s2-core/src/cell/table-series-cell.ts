import {
  isFrozenRow as isFrozenRowUtil,
  isFrozenTrailingRow as isFrozenTrailingRowUtil,
} from 'src/facet/utils';
import { DataCell } from '@/cell/data-cell';
import {
  CellTypes,
  KEY_GROUP_ROW_RESIZE_AREA,
  KEY_GROUP_FROZEN_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
} from '@/common/constant';
import { TextTheme } from '@/common/interface';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
} from '@/utils/interaction/resize';

export class TableRowCell extends DataCell {
  public get cellType() {
    return CellTypes.ROW_CELL;
  }

  protected getTextStyle(): TextTheme {
    return this.theme.rowCell.text;
  }

  protected drawBorderShape() {
    super.drawBorderShape();
    if (this.meta.colIndex === 0) {
      this.drawLeftBorder();
    }
  }

  public drawResizeArea() {
    const { x, y, width, height } = this.getCellArea();
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
    const colHeight = this.spreadsheet.facet.layoutResult.colsHierarchy.height;
    const { scrollY: sy } = this.spreadsheet.facet.getScrollOffset();
    const paginationSy = this.spreadsheet.facet.getPaginationScrollY();
    const scrollY = sy + paginationSy;

    let yOffset = y + (isFrozenTrailingRow ? 0 : colHeight);

    if (!isFrozenTrailingRow) {
      yOffset -= isFrozenRow ? paginationSy : scrollY;
    }

    resizeArea.addShape('rect', {
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
        }),
        x: x,
        y: yOffset + height - resizeStyle.size / 2,
        width,
      },
    });
  }
}
