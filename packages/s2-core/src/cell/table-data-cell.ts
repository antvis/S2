import { DataCell } from '../cell/data-cell';
import type { CellMeta } from '../common';
import {
  CellType,
  FrozenGroupArea,
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
} from '../common/constant';
import { CustomRect, type SimpleBBox } from '../engine';
import type { FrozenFacet } from '../facet/frozen-facet';
import { isFrozenRow, isFrozenTrailingRow } from '../facet/utils';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
  shouldAddResizeArea,
} from '../utils/interaction/resize';

export class TableDataCell extends DataCell {
  protected getLinkFieldStyle() {
    return this.theme.rowCell!.text!.linkTextFill!;
  }

  protected shouldDrawResizeArea() {
    // 每一行直绘制一条贯穿式 resize 热区
    const id = `${this.meta.rowIndex}`;

    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    return !resizeArea?.getElementById(id);
  }

  public drawResizeArea() {
    if (!this.shouldDrawResizeArea()) {
      return;
    }

    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    if (!resizeArea) {
      return;
    }

    const { rowIndex } = this.getMeta();
    const cellRange = this.spreadsheet.facet.getCellRange();
    const { rowCount, trailingRowCount } = (
      this.spreadsheet.facet as FrozenFacet
    ).getFrozenOptions();

    const isFrozenHead = isFrozenRow(rowIndex, cellRange.start, rowCount);

    const isFrozenTrailing = isFrozenTrailingRow(
      rowIndex,
      cellRange.end,
      trailingRowCount,
    );

    const isFrozen = isFrozenHead || isFrozenTrailing;

    const { y, height } = this.getBBoxByType();

    const {
      x: panelBBoxX,
      y: panelBBoxY,
      viewportWidth,
      viewportHeight,
    } = this.spreadsheet.facet.panelBBox;

    const { scrollY } = this.spreadsheet.facet.getScrollOffset();
    const paginationSy = this.spreadsheet.facet.getPaginationScrollY();

    const frozenGroupAreas = (this.spreadsheet.facet as FrozenFacet)
      .frozenGroupAreas;
    const frozenRowGroup = frozenGroupAreas[FrozenGroupArea.Row];
    const frozenTrailingRowGroup =
      frozenGroupAreas[FrozenGroupArea.TrailingRow];

    const resizeStyle = this.getResizeAreaStyle();

    const width = panelBBoxX + viewportWidth;
    const resizeClipAreaBBox: SimpleBBox = {
      x: 0,
      y: isFrozen ? 0 : frozenRowGroup.height,
      width,
      height: isFrozen
        ? Number.POSITIVE_INFINITY
        : viewportHeight -
          frozenRowGroup.height -
          frozenTrailingRowGroup.height,
    };

    const resizeAreaBBox: SimpleBBox = {
      x: 0,
      y: y + height - resizeStyle.size!,
      width,
      height: resizeStyle.size!,
    };

    if (
      !shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
        scrollX: 0,
        scrollY: isFrozen ? 0 : paginationSy + scrollY,
      })
    ) {
      return;
    }

    let offsetY = panelBBoxY;

    if (isFrozenHead) {
      offsetY += y - frozenRowGroup.y;
    } else if (isFrozenTrailing) {
      offsetY +=
        viewportHeight -
        frozenTrailingRowGroup.height +
        y -
        frozenTrailingRowGroup.y;
    } else {
      offsetY += y - paginationSy - scrollY;
    }

    const attrs = getResizeAreaAttrs({
      theme: resizeStyle,
      type: ResizeDirectionType.Vertical,
      effect: ResizeAreaEffect.Cell,
      offsetX: 0,
      offsetY,
      width,
      height,
      meta: this.meta,
      cell: this,
    });

    resizeArea.appendChild(
      new CustomRect(
        {
          style: {
            ...attrs.style,
            x: 0,
            y: offsetY + height - resizeStyle!.size!,
            width,
          },
        },
        attrs.appendInfo,
      ),
    );
  }

  protected isDisableHover(cellMeta: CellMeta) {
    return cellMeta?.type === CellType.COL_CELL;
  }
}
