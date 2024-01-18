import { clamp, isBoolean } from 'lodash';
import { DEFAULT_CORNER_MAX_WIDTH_RATIO } from '../../common/constant';
import { floor } from '../../utils/math';
import { BaseBBox } from './base-bbox';

export class CornerBBox extends BaseBBox {
  calculateBBox() {
    const width = this.getCornerBBoxWidth();
    const height = this.getCornerBBoxHeight();

    this.width = width;
    this.height = height;
    this.maxX = width;
    this.maxY = height;
  }

  private getCornerBBoxOriginalHeight() {
    const { colsHierarchy } = this.layoutResult;
    const { colCell } = this.spreadsheet.options.style!;

    /**
     * 角头分为两部分, 一部分对应行头, 一部分对应列头, 角头的叶子节点对应行头节点, 以下极端情况让没有列头的时候也能 [行头对应的角头] 正常显示
     * 1. 只配置了 rows, 而 columns, values 都为空, 此时列头为空
     * 2. 配置了 rows, values, 此时存在一级列头 (即 EXTRA_FIELD 数值节点), 但是隐藏了数值 (hideMeasureColumn), 此时列头为空
     */
    if (!colsHierarchy.sampleNodeForLastLevel) {
      return colCell?.height;
    }

    return floor(colsHierarchy.height);
  }

  private getCornerBBoxHeight() {
    this.originalHeight = this.getCornerBBoxOriginalHeight() as number;

    return this.originalHeight;
  }

  private getCornerBBoxWidth() {
    const { rowsHierarchy } = this.layoutResult;

    this.originalWidth = floor(
      rowsHierarchy.width + this.facet.getSeriesNumberWidth(),
    );

    // 在行头固定时，需对角头 BBox 进行裁剪
    if (this.spreadsheet.isFrozenRowHeader()) {
      return this.adjustCornerBBoxWidth();
    }

    return this.originalWidth;
  }

  private adjustCornerBBoxWidth() {
    const { colsHierarchy } = this.layoutResult;
    const { width: canvasWidth, frozen } = this.spreadsheet.options;

    const rowHeader = frozen?.rowHeader!;
    const ratio = isBoolean(rowHeader)
      ? DEFAULT_CORNER_MAX_WIDTH_RATIO
      : clamp(rowHeader, 0, 1);

    const maxCornerBBoxWidth = canvasWidth! * ratio;
    const colsHierarchyWidth = colsHierarchy?.width;
    const panelWidthWidthUnClippedCorner = canvasWidth! - this.originalWidth;

    /*
     * 不需要裁剪条件：
     * 1. 角头的宽度没有超过最大的角头范围
     * 2. 列头的宽度没有超过在不裁剪角头前提下的剩余范围
     */
    if (
      this.originalWidth <= maxCornerBBoxWidth ||
      colsHierarchyWidth <= panelWidthWidthUnClippedCorner
    ) {
      return this.originalWidth;
    }

    let clippedWidth = 0;
    const maxPanelWidth = canvasWidth! - maxCornerBBoxWidth;

    // 列头宽度超过了剩余宽度，但是小于 Panel 的最大宽度
    if (colsHierarchyWidth <= maxPanelWidth) {
      clippedWidth =
        this.originalWidth -
        (colsHierarchyWidth - panelWidthWidthUnClippedCorner);
    } else {
      clippedWidth = maxCornerBBoxWidth;
    }

    return floor(clippedWidth);
  }
}
