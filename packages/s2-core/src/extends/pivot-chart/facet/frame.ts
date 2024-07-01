import { Frame as OriginFrame } from '@antv/s2';

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
}
