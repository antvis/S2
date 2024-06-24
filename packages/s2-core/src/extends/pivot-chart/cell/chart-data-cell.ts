import { DataCell } from '@antv/s2';

export class ChartDataCell extends DataCell {
  public getChartData() {}

  public drawTextShape(): void {
    super.drawTextShape();
    this.getChartData();
  }
}
