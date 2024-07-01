import { Group } from '@antv/g';
import { corelib, renderToMountedElement, type G2Spec } from '@antv/g2';
import { CellClipBox, DataCell, G2_THEME_TYPE } from '@antv/s2';
import { waitForCellMounted } from '../utils/schedule';

export class ChartDataCell extends DataCell {
  chartShape: Group;

  public getChartData() {
    const { data, xField, yField } = this.meta;

    return {
      data,
      encode: {
        x: xField,
        y: yField,
        color: xField,
      },
    };
  }

  public getChartOptions(): G2Spec {
    const { yField } = this.meta;
    const themeName = this.spreadsheet.getThemeName();
    const range = this.spreadsheet.dataSet.getValueRangeByField(yField!);

    return {
      type: 'interval',
      autoFit: true,
      theme: { type: G2_THEME_TYPE[themeName] },
      coordinate: {
        transform: this.spreadsheet.isValueInCols()
          ? [{ type: 'transpose' }]
          : undefined,
      },
      axis: false,
      legend: false,
      padding: 0,
      marginTop: 0,
      marginBottom: 0,
      marginRight: 0,
      marginLeft: 0,
      scale: {
        y: {
          domain: [range.minValue, range.maxValue],
        },
      },
      animate: false,
      ...this.getChartData(),
      ...this.getBBoxByType(CellClipBox.PADDING_BOX),
    } as G2Spec;
  }

  public drawTextShape(): void {
    const chartOptions = this.getChartOptions();

    this.chartShape = this.appendChild(new Group({}));

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
}
