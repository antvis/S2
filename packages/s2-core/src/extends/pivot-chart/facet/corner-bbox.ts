import { CornerBBox as OriginCornerBBox, floor } from '@antv/s2';

export class CornerBBox extends OriginCornerBBox {
  protected calculateOriginWidth(): void {
    const { rowsHierarchy, axisRowsHierarchy } = this.layoutResult;

    const rowAxisWidth = axisRowsHierarchy?.width ?? 0;

    this.originalWidth = floor(
      this.facet.getSeriesNumberWidth() + rowsHierarchy.width + rowAxisWidth,
    );
  }
}
