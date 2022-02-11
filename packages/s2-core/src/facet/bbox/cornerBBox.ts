import { BaseBBox } from './baseBBox';
import { CORNER_MAX_WIDTH_RATIO } from '@/common/constant';

export class CornerBBox extends BaseBBox {
  calculateBBox() {
    const width = this.getCornerBBoxWidth();
    const height = this.getCornerBBoxHeight();

    this.width = width;
    this.height = height;
    this.maxX = width;
    this.maxY = height;
  }

  private getCornerBBoxHeight() {
    const { colsHierarchy } = this.layoutResult;
    this.originalHeight = Math.floor(colsHierarchy.height);

    return this.originalHeight;
  }

  private getCornerBBoxWidth() {
    const { rowsHierarchy } = this.layoutResult;
    this.originalWidth = Math.floor(
      rowsHierarchy.width + this.facet.getSeriesNumberWidth(),
    );

    // 在行头不固定时，无需对角头 BBox 进行裁剪
    if (this.spreadsheet.isScrollContainsRowHeader()) {
      return this.originalWidth;
    }

    return this.adjustCornerBBoxWidth();
  }

  private adjustCornerBBoxWidth() {
    const { colsHierarchy } = this.layoutResult;
    const { width: canvasWidth } = this.spreadsheet.options;

    const maxCornerBBoxWidth = canvasWidth * CORNER_MAX_WIDTH_RATIO;
    const colsHierarchyWidth = colsHierarchy?.width;
    const panelWidthWidthUnClippedCorner = canvasWidth - this.originalWidth;

    // 不需要裁剪条件：
    // 1. 角头的宽度没有超过最大的角头范围
    // 2. 列头的宽度没有超过在不裁剪角头前提下的剩余范围
    if (
      this.originalWidth <= maxCornerBBoxWidth ||
      colsHierarchyWidth <= panelWidthWidthUnClippedCorner
    ) {
      return this.originalWidth;
    }

    let clippedWidth = 0;
    const maxPanelWidth = canvasWidth - maxCornerBBoxWidth;

    // 列头宽度超过了剩余宽度，但是小于 Panel 的最大宽度
    if (colsHierarchyWidth <= maxPanelWidth) {
      clippedWidth =
        this.originalWidth -
        (colsHierarchyWidth - panelWidthWidthUnClippedCorner);
    } else {
      clippedWidth = maxCornerBBoxWidth;
    }

    return Math.floor(clippedWidth);
  }
}
