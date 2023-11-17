import {
  KEY_GROUP_ROW_RESIZE_AREA,
  ResizeAreaEffect,
  ResizeDirectionType,
} from '../common/constant';
import {
  getOrCreateResizeAreaGroupById,
  getResizeAreaAttrs,
  shouldAddResizeArea,
} from '../utils/interaction/resize';
import type { BaseHeaderConfig } from '../facet/header/base';
import { RowCell } from './row-cell';

export class FrozenRowCell extends RowCell {
  private frozenRowHeight: number;

  protected handleRestOptions(
    ...[headerConfig, ...options]: [BaseHeaderConfig, number]
  ) {
    super.handleRestOptions(headerConfig, options);
    this.frozenRowHeight = options[0];
  }

  protected drawResizeAreaInLeaf(): void {
    if (
      !this.meta.isLeaf ||
      !this.shouldDrawResizeAreaByType('rowCellVertical', this)
    ) {
      return;
    }

    const { x, y, width, height } = this.getCellArea();
    const resizeStyle = this.getResizeAreaStyle();
    const resizeArea = getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    const {
      position,
      seriesNumberWidth,
      width: headerWidth,
      viewportHeight: headerHeight,
      scrollX,
      scrollY,
    } = this.headerConfig;

    // const frozenRowHeight = this.getFrozenRowHeight();
    const resizeAreaBBox = {
      // fix: When horizontally scrolling and closing the entire frozen header, the resize area is being removed prematurely.
      x: x + seriesNumberWidth,
      // packages/s2-core/src/facet/header/frozen-row.ts The y-coordinate has been decreased by the height of the frozen rows. need plus frozenRowHeight
      y: y + this.frozenRowHeight + height - resizeStyle.size / 2,
      width,
      height: resizeStyle.size,
    };

    const resizeClipAreaBBox = {
      x: 0,
      // There are frozen rows, so the clip should start from the position of the frozen rows.
      y: this.frozenRowHeight,
      width: headerWidth,
      height: headerHeight,
    };

    if (
      !shouldAddResizeArea(resizeAreaBBox, resizeClipAreaBBox, {
        scrollX,
        scrollY,
      })
    ) {
      return;
    }

    const offsetX = position?.x + x - scrollX + seriesNumberWidth;
    const offsetY = position?.y + y + this.frozenRowHeight - scrollY;

    const resizeAreaWidth = this.spreadsheet.isFrozenRowHeader()
      ? headerWidth - seriesNumberWidth - (x - scrollX)
      : width;

    resizeArea.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          id: this.meta.id,
          theme: resizeStyle,
          type: ResizeDirectionType.Vertical,
          effect: ResizeAreaEffect.Cell,
          offsetX,
          offsetY,
          width,
          height,
          meta: this.meta,
        }),
        x: offsetX,
        y: offsetY + height - resizeStyle.size / 2,
        width: resizeAreaWidth,
      },
    });
  }
}
