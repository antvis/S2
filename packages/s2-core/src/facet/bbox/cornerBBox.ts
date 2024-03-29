import { CORNER_MAX_WIDTH_RATIO } from '../../common/constant';
import { BaseBBox } from './baseBBox';

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
    const { colCfg } = this.spreadsheet.options.style;

    /**
     * 角头分为两部分, 一部分对应行头, 一部分对应列头, 角头的叶子节点对应行头节点, 以下极端情况让没有列头的时候也能 [行头对应的角头] 正常显示
     * 1. 只配置了 rows, 而 columns, values 都为空, 此时列头为空
     * 2. 配置了 rows, values, 此时存在一级列头 (即 EXTRA_FIELD 数值节点), 但是隐藏了数值 (hideMeasureColumn), 此时列头为空
     */
    if (!colsHierarchy.sampleNodeForLastLevel) {
      return colCfg?.height;
    }
    return Math.floor(colsHierarchy.height);
  }

  private getCornerBBoxHeight() {
    this.originalHeight = this.getCornerBBoxOriginalHeight();

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
