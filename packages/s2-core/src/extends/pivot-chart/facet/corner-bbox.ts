import { CornerBBox as OriginCornerBBox, floor } from '@antv/s2';
import { head } from 'lodash';

export class CornerBBox extends OriginCornerBBox {
  protected calculateOriginWidth(): void {
    const { rowsHierarchy, rowAxisNodes } = this.layoutResult;

    const rowAxisWidth = head(rowAxisNodes)?.width ?? 0;

    this.originalWidth = floor(
      this.facet.getSeriesNumberWidth() + rowsHierarchy.width + rowAxisWidth,
    );
  }
}
