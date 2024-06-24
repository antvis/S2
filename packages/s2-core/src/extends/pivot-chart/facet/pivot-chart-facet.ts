import { PivotFacet, type LayoutResult } from '@antv/s2';
import { CornerHeader } from '../header/corner';
import { RowAxisHeader } from '../header/row-axis';
import { separateRowColLeafNodes } from '../utils/axis';
import { CornerBBox } from './corner-bbox';
import { PanelBBox } from './panel-bbox';

export class PivotChartFacet extends PivotFacet {
  rowAxisHeader: RowAxisHeader | null;

  protected override doLayout(): LayoutResult {
    const layoutResult = super.doLayout();

    return separateRowColLeafNodes(layoutResult, this.spreadsheet);
  }

  protected override calculateCornerBBox(): void {
    this.cornerBBox = new CornerBBox(this, true);
  }

  protected override calculatePanelBBox = () => {
    this.panelBBox = new PanelBBox(this, true);
  };

  protected renderHeaders(): void {
    super.renderHeaders();
    this.rowAxisHeader = this.getRowAxisHeader();

    if (this.rowAxisHeader) {
      this.foregroundGroup.appendChild(this.rowAxisHeader);
    }
  }

  protected getCornerHeader(): CornerHeader {
    return (
      this.cornerHeader ||
      CornerHeader.getCornerHeader({
        panelBBox: this.panelBBox,
        cornerBBox: this.cornerBBox,
        seriesNumberWidth: this.getSeriesNumberWidth(),
        layoutResult: this.layoutResult,
        spreadsheet: this.spreadsheet,
      })
    );
  }

  protected getRowAxisHeader(): RowAxisHeader | null {
    if (this.rowAxisHeader) {
      return this.rowAxisHeader;
    }

    const { y, viewportHeight, viewportWidth, height } = this.panelBBox;
    const { rowsHierarchy, rowAxisNodes = [] } = this.layoutResult;
    const seriesNumberWidth = this.getSeriesNumberWidth();

    return new RowAxisHeader({
      width: this.cornerBBox.width,
      height,
      viewportWidth,
      viewportHeight,
      position: { x: seriesNumberWidth + rowsHierarchy.width, y },
      nodes: rowAxisNodes,
      spreadsheet: this.spreadsheet,
    });
  }

  protected override translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ): void {
    super.translateRelatedGroups(scrollX, scrollY, hRowScroll);

    this.rowAxisHeader?.onScrollXY(
      this.getRealScrollX(scrollX, hRowScroll),
      scrollY,
    );
  }
}
