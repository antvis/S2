import { Group } from '@antv/g';
import { corelib, renderToMountedElement, type G2Spec } from '@antv/g2';
import {
  CellBorderPosition,
  CellClipBox,
  CellType,
  RowCell,
  getOrCreateResizeAreaGroupById,
} from '@antv/s2';
import { DEFAULT_G2_SPEC, KEY_GROUP_ROW_AXIS_RESIZE_AREA } from '../constant';
import type { PivotChart } from '../index';
import {
  getAxisStyle,
  getAxisXOptions,
  getAxisYOptions,
} from '../utils/chart-options';
import { waitForCellMounted } from '../utils/schedule';
import { AxisCellType } from './cell-type';

export class AxisRowCell extends RowCell {
  protected spreadsheet: PivotChart;

  protected axisShape: Group;

  public get cellType() {
    return AxisCellType.AXIS_ROW_CELL as any;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.LEFT];
  }

  protected isBolderText(): boolean {
    return false;
  }

  protected getInteractedCells() {
    return this.spreadsheet.interaction?.getCells([
      CellType.ROW_CELL,
      AxisCellType.AXIS_ROW_CELL as any,
    ]);
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();
    this.drawInteractiveBorderShape();
    this.drawTextShape();
    this.drawBorders();
    this.drawResizeAreaInLeaf();
    this.update();
  }

  protected getResizesArea() {
    return getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_AXIS_RESIZE_AREA,
    );
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
      ...DEFAULT_G2_SPEC,
      ...this.getBBoxByType(CellClipBox.CONTENT_BOX),

      ...(this.spreadsheet.isValueInCols()
        ? getAxisXOptions(this.meta, this.spreadsheet)
        : getAxisYOptions(this.meta, this.spreadsheet)),

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
