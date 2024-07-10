import { Group } from '@antv/g';
import { corelib, renderToMountedElement, type G2Spec } from '@antv/g2';
import {
  CellBorderPosition,
  CellClipBox,
  CellType,
  ColCell,
  getOrCreateResizeAreaGroupById,
} from '@antv/s2';
import type { PivotChart } from '..';
import { KEY_GROUP_COL_AXIS_RESIZE_AREA } from '../constant';
import {
  getAxisStyle,
  getAxisXOptions,
  getAxisYOptions,
} from '../utils/chart-options';
import { waitForCellMounted } from '../utils/schedule';
import { AxisCellType } from './cell-type';

export class AxisColCell extends ColCell {
  protected spreadsheet: PivotChart;

  protected axisShape: Group;

  public get cellType() {
    return AxisCellType.AXIS_COL_CELL as any;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [
      CellBorderPosition.TOP,
      CellBorderPosition.BOTTOM,
      CellBorderPosition.RIGHT,
    ];
  }

  protected isBolderText(): boolean {
    return false;
  }

  protected getInteractedCells() {
    return this.spreadsheet.interaction?.getCells([
      CellType.COL_CELL,
      AxisCellType.AXIS_COL_CELL as any,
    ]);
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();
    this.drawInteractiveBorderShape();
    this.drawTextShape();
    this.drawBorders();
    this.drawResizeArea();
    this.update();
  }

  protected getColResizeArea() {
    return getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_COL_AXIS_RESIZE_AREA,
    );
  }

  protected isCrossColumnLeafNode() {
    return false;
  }

  public drawTextShape(): void {
    if (this.spreadsheet.isPolarChart()) {
      super.drawTextShape();

      return;
    }

    this.drawAxisShape();
  }

  getChartOptions(): G2Spec {
    const style = this.getStyle();

    const chartOptions = {
      ...this.getBBoxByType(CellClipBox.CONTENT_BOX),
      ...(this.spreadsheet.isValueInCols()
        ? getAxisYOptions(this.meta, this.spreadsheet)
        : getAxisXOptions(this.meta, this.spreadsheet)),

      ...getAxisStyle(style),
      coordinate: {
        transform: this.spreadsheet.isValueInCols()
          ? [{ type: 'transpose' }]
          : undefined,
      },
    } as G2Spec;

    return chartOptions;
  }

  drawAxisShape() {
    const chartOptions = this.getChartOptions();

    this.axisShape = this.appendChild(new Group({}));

    // delay 到实例被挂载到 parent 后，再渲染 chart
    waitForCellMounted(() => {
      if (this.destroyed) {
        return;
      }

      // https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2corelib
      renderToMountedElement(chartOptions, {
        group: this.axisShape,
        library: corelib(),
      });
    });
  }
}
