import { PivotFacet, type LayoutResult } from '@antv/s2';
import { separateRowColLeafNodes } from './utils/axis';

export class PivotChartFacet extends PivotFacet {
  protected doLayout(): LayoutResult {
    const layoutResult = super.doLayout();

    return separateRowColLeafNodes(layoutResult, this.spreadsheet);
  }
}
