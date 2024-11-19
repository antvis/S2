import { Group } from '@antv/g';
import { corelib, renderToMountedElement, type AxisComponent } from '@antv/g2';
import {
  CellBorderPosition,
  CellClipBox,
  CellType,
  RowCell,
  customMerge,
  getOrCreateResizeAreaGroupById,
  waitForCellMounted,
} from '@antv/s2';
import { isFunction } from 'lodash';
import { DEFAULT_G2_SPEC, KEY_GROUP_ROW_AXIS_RESIZE_AREA } from '../constant';
import type { PivotChartSheet } from '../pivot-chart-sheet';
import {
  getAxisStyle,
  getAxisXOptions,
  getAxisYOptions,
  getCoordinate,
  getTheme,
} from '../utils/chart-options';
import { AxisCellType } from './cell-type';

export class AxisRowCell extends RowCell {
  protected declare spreadsheet: PivotChartSheet;

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
    if (this.spreadsheet.isPolarCoordinate()) {
      super.drawTextShape();

      return;
    }

    this.drawAxisShape();
  }

  getChartOptions(): AxisComponent {
    const style = this.getStyle();

    let customSpec = this.spreadsheet.options.chart?.axisRowCellSpec;

    if (isFunction(customSpec)) {
      customSpec = customSpec(this);
    }

    return customMerge(
      {
        ...DEFAULT_G2_SPEC,
        ...this.getBBoxByType(CellClipBox.CONTENT_BOX),

        ...getCoordinate(this.spreadsheet),
        ...(this.spreadsheet.isValueInCols()
          ? getAxisXOptions(this.meta, this.spreadsheet)
          : getAxisYOptions(this.meta, this.spreadsheet)),

        ...getAxisStyle(style),
        ...getTheme(this.spreadsheet),
      } as AxisComponent,
      customSpec,
    );
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
