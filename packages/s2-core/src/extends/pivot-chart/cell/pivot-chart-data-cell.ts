import { Group } from '@antv/g';
import { corelib, renderToMountedElement, type G2Spec } from '@antv/g2';
import {
  CellClipBox,
  customMerge,
  waitForCellMounted,
  type CellMeta,
} from '@antv/s2';
import { isFunction } from 'lodash';
import { DEFAULT_CHART_SPEC } from '../constant';
import type { PivotChartSheet } from '../pivot-chart-sheet';
import {
  getCoordinate,
  getScaleY,
  getTheme,
  getTooltip,
} from '../utils/chart-options';
import { AxisCellType } from './cell-type';
import { ChartDataCell } from './chart-data-cell';

export class PivotChartDataCell extends ChartDataCell {
  public isChartData(): boolean {
    return true;
  }

  public getChartData(): any {
    const { data, xField, yField } = this.meta;

    return {
      data,
      encode: {
        x: (this.spreadsheet as unknown as PivotChartSheet).isPolarCoordinate()
          ? null
          : xField,
        y: yField,
        color: xField,
      },
    };
  }

  public getChartOptions(): any {
    const { yField } = this.meta;

    let customSpec = this.spreadsheet.options.chart?.dataCellSpec;

    if (isFunction(customSpec)) {
      customSpec = customSpec(this);
    }

    return customMerge(
      {
        ...DEFAULT_CHART_SPEC,
        ...this.getBBoxByType(CellClipBox.CONTENT_BOX),
        ...getCoordinate(this.spreadsheet),
        ...this.getChartData(),
        ...getScaleY(yField!, this.spreadsheet),

        ...getTooltip(this.meta, this.spreadsheet),
        ...getTheme(this.spreadsheet),
      } as G2Spec,
      customSpec,
    );
  }

  public drawTextShape(): void {
    const chartOptions = this.getChartOptions();

    this.chartShape = this.appendChild(new Group({ style: { zIndex: 1 } }));

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

  protected handleSelect(cells: CellMeta[]) {
    super.handleSelect(cells);

    const currentCellType = cells?.[0]?.type as unknown as AxisCellType;

    switch (currentCellType) {
      // 列多选
      case AxisCellType.AXIS_COL_CELL:
        this.changeRowColSelectState('colIndex');
        break;
      // 行多选
      case AxisCellType.AXIS_ROW_CELL:
        this.changeRowColSelectState('rowIndex');
        break;

      default:
        break;
    }
  }
}
