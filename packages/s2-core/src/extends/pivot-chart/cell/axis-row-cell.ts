import { Group } from '@antv/g';
import { corelib, renderToMountedElement, type G2Spec } from '@antv/g2';
import {
  CellBorderPosition,
  CellClipBox,
  CellType,
  RowCell,
  getOrCreateResizeAreaGroupById,
} from '@antv/s2';
import { AxisCellType, KEY_GROUP_ROW_AXIS_RESIZE_AREA } from '../constant';
import { getAxisXOptions, getAxisYOptions } from '../utils/chart-options';
import { waitForCellMounted } from '../utils/schedule';

export class AxisRowCell extends RowCell {
  axisShape: Group;

  public get cellType() {
    return AxisCellType.AXIS_ROW_CELL as unknown as CellType;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.LEFT];
  }

  protected isBolderText(): boolean {
    return false;
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();
    this.drawInteractiveBorderShape();
    this.drawAxisShape();
    this.drawBorders();
    this.drawResizeAreaInLeaf();
  }

  protected getResizesArea() {
    return getOrCreateResizeAreaGroupById(
      this.spreadsheet,
      KEY_GROUP_ROW_AXIS_RESIZE_AREA,
    );
  }

  getChartOptions(): G2Spec {
    const chartOptions = {
      autoFit: true,
      animate: false,
      ...this.getBBoxByType(CellClipBox.PADDING_BOX),
      ...(this.spreadsheet.isValueInCols()
        ? getAxisXOptions(this.meta, this.spreadsheet)
        : getAxisYOptions(this.meta, this.spreadsheet)),
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
