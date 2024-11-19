import { Group } from '@antv/g-lite';
import { corelib, renderToMountedElement } from '@antv/g2';
import {
  CellClipBox,
  DataCell,
  waitForCellMounted,
  type BaseChartData,
  type MultiData,
} from '@antv/s2';
import { isPlainObject } from 'lodash';
import { getTheme } from '../utils/chart-options';

export class ChartDataCell extends DataCell {
  chartShape: Group;

  public drawTextShape() {
    // 普通数值单元格正常展示
    if (!this.isChartData()) {
      super.drawTextShape();

      return;
    }

    this.chartShape = this.appendChild(new Group({ style: { zIndex: 1 } }));

    const chartOptions = this.getChartOptions();

    waitForCellMounted(() => {
      if (this.destroyed) {
        return;
      }

      // https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2corelib
      renderToMountedElement(chartOptions, {
        group: this.chartShape,
        library: corelib(),
      });
    });
  }

  public isChartData() {
    const fieldValue = this.getFieldValue();

    return isPlainObject(
      (fieldValue as unknown as MultiData<BaseChartData>)?.values,
    );
  }

  public getChartData(): BaseChartData {
    const { fieldValue } = this.meta;

    return (fieldValue as MultiData)?.values as BaseChartData;
  }

  public getChartOptions() {
    const chartData = this.getChartData();
    const cellArea = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return {
      autoFit: true,
      ...getTheme(this.spreadsheet),
      ...cellArea,
      ...chartData,
    };
  }
}
