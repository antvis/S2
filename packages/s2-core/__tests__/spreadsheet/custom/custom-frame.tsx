import { Frame } from '@/facet/header';

export class CustomFrame extends Frame {
  layout() {
    super.layout();
    // corner右边的竖线条
    this.addCornerRightBorder();
  }

  addCornerRightBorder() {
    const {
      width,
      height,
      viewportHeight,
      position,
      spreadsheet,
      lineConfigStyle,
    } = this.cfg;
    const {
      verticalBorderColor,
      verticalBorderWidth,
      verticalBorderColorOpacity,
    } = spreadsheet.theme?.splitLine || {};
    const x = position.x + width;
    const y1 = position.y;
    const y2 = position.y + height + viewportHeight;
    if (spreadsheet.store.get('scrollX') > 0) {
      // 滚动时使用默认的颜色
      this.addShape('line', {
        attrs: {
          x1: x,
          y1: y1 + height / 2,
          x2: x,
          y2,
          stroke: verticalBorderColor,
          lineWidth: verticalBorderWidth,
          opacity: verticalBorderColorOpacity,
        },
      });
    } else {
      this.addShape('line', {
        attrs: {
          x1: x,
          y1: y1 + height / 2,
          x2: x,
          y2,
          stroke: lineConfigStyle?.stroke || verticalBorderColor,
          lineWidth: lineConfigStyle?.lineWidth || verticalBorderWidth,
        },
      });
    }
  }

  addSplitLineRightShadow() {
    const {
      width,
      height,
      viewportHeight,
      position,
      isPivotMode,
      spreadsheet,
      showViewPortRightShadow,
    } = this.cfg;
    if (!isPivotMode || spreadsheet.store.get('scrollX') === 0) {
      return;
    }
    // 滚动时使用默认的颜色
    const { showRightShadow, shadowWidth, shadowColors } =
      spreadsheet.theme?.splitLine || {};
    if (
      showRightShadow &&
      showViewPortRightShadow &&
      spreadsheet.isFreezeRowHeader()
    ) {
      const x = position.x + width;
      const y = position.y;
      this.addShape('rect', {
        attrs: {
          x,
          y: y + height / 2,
          width: shadowWidth,
          height: viewportHeight + height - height / 2,
          fill: `l (0) 0:${shadowColors?.left} 1:${shadowColors?.right}`,
        },
      });
    }
  }
}
