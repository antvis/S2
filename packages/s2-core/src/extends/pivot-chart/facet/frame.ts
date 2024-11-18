import { Frame as OriginFrame, renderLine } from '@antv/s2';

export class Frame extends OriginFrame {
  protected override getCornerRightBorderSizeForPivotMode() {
    const { cornerHeight, viewportHeight, position, spreadsheet } = this.cfg;

    const { horizontalBorderWidth } = spreadsheet.theme?.splitLine!;

    const y = position.y;
    const axisColsHierarchy =
      spreadsheet.facet.getLayoutResult().axisColsHierarchy;

    const height =
      cornerHeight +
      horizontalBorderWidth! +
      viewportHeight +
      (axisColsHierarchy?.height ?? 0);

    return { y, height };
  }

  protected addCornerRightBottomHeaderBorder() {
    // 为底部坐标轴执行一样的逻辑绘制分割线
    const axisColsHierarchy =
      this.cfg.spreadsheet.facet.getLayoutResult().axisColsHierarchy;

    if (!axisColsHierarchy?.height) {
      return;
    }

    const { cornerWidth, cornerHeight, viewportHeight, position, spreadsheet } =
      this.cfg;
    const { verticalBorderColor, verticalBorderColorOpacity } =
      spreadsheet.theme?.splitLine!;
    const frameVerticalWidth = Frame.getVerticalBorderWidth(spreadsheet);
    const frameHorizontalWidth = Frame.getVerticalBorderWidth(spreadsheet);
    const x = position.x + cornerWidth + frameVerticalWidth! / 2;

    // 表头和表身的单元格背景色不同, 分割线不能一条线拉通, 不然视觉不协调.
    // 分两条线绘制, 默认和分割线所在区域对应的单元格边框颜色保持一致
    const {
      verticalBorderColor: headerVerticalBorderColor,
      verticalBorderColorOpacity: headerVerticalBorderColorOpacity,
      backgroundColor,
      backgroundColorOpacity,
    } = spreadsheet.theme.cornerCell!.cell!;

    const y1 =
      position.y + cornerHeight + frameHorizontalWidth + viewportHeight;

    /**
     * G 6.0 颜色混合模式有调整, 相同颜色的 Line 在不同背景色绘制, 实际渲染的颜色会不一致
     * 在绘制分割线前, 先填充一个和单元格相同的底色, 保证分割线和单元格边框表现一致
     */
    [
      { stroke: backgroundColor, strokeOpacity: backgroundColorOpacity },
      {
        stroke: verticalBorderColor || headerVerticalBorderColor,
        strokeOpacity:
          verticalBorderColorOpacity || headerVerticalBorderColorOpacity,
      },
    ].forEach(({ stroke, strokeOpacity }) => {
      renderLine(this, {
        x1: x,
        y1,
        x2: x,
        y2: y1 + axisColsHierarchy.height,
        lineWidth: frameVerticalWidth,
        stroke,
        strokeOpacity,
      });
    });
  }

  protected addCornerRightBorder() {
    super.addCornerRightBorder();
    this.addCornerRightBottomHeaderBorder();
  }
}
