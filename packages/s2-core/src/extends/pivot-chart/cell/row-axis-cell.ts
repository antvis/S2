import { Group, type PointLike } from '@antv/g';
import { corelib, renderToMountedElement, type G2Spec } from '@antv/g2';
import {
  CellBorderPosition,
  CellClipBox,
  CellType,
  HeaderCell,
} from '@antv/s2';
import { map } from 'lodash';
import { AxisCellType } from '../constant';
import type { AxisHeaderConfig } from '../interface';
import { waitForCellMounted } from '../utils/schedule';

export class RowAxisCell extends HeaderCell<AxisHeaderConfig> {
  axisShape: Group;

  public get cellType() {
    return AxisCellType.ROW_AXIS_CELL as unknown as CellType;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.LEFT];
  }

  protected isBolderText(): boolean {
    return false;
  }

  public getMaxTextWidth(): number {
    return 0;
  }

  protected getTextPosition(): PointLike {
    return {
      x: 0,
      y: 0,
    };
  }

  protected initCell(): void {
    this.drawBackgroundShape();
    // 绘制交互背景
    this.drawInteractiveBgShape();
    // 绘制交互边框
    this.drawInteractiveBorderShape();
    // 绘制单元格文本
    this.drawAxisShape();
    // 绘制字段和 action标记 -- icon 和 action
    this.drawActionAndConditionIcons();
    // 绘制单元格边框
    this.drawBorders();
    // 绘制 resize 热区
    // this.drawResizeAreaInLeaf();
    this.update();
  }

  getAxisXOptions() {
    const domain = map(this.meta.children, (child) => {
      const formatter = this.spreadsheet.dataSet.getFieldFormatter(child.field);

      return !child.isTotalRoot && formatter
        ? formatter(child.value, undefined, child)
        : child.value;
    });

    return {
      type: 'axisX',
      scale: {
        x: {
          type: 'band',
          domain,
          range: [0, 1],
        },
      },
    };
  }

  getAxisYOptions() {
    const { field, value } = this.meta;

    const range = this.spreadsheet.dataSet.getValueRangeByField(value);

    return {
      type: 'axisY',
      title: this.spreadsheet.dataSet.getFieldFormatter(field)?.(value),
      scale: {
        y: {
          type: 'linear',
          domain: [range.minValue, range.maxValue],
          range: [1, 0],
        },
      },
    };
  }

  getChartOptions(): G2Spec {
    const chartOptions = {
      ...this.getBBoxByType(CellClipBox.PADDING_BOX),
      ...(this.spreadsheet.isValueInCols()
        ? this.getAxisXOptions()
        : this.getAxisYOptions()),
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
      // https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2corelib
      renderToMountedElement(chartOptions, {
        group: this.axisShape,
        library: corelib(),
      });
    });
  }
}
