import type { PointLike } from '@antv/g-lite';
import {
  corelib,
  renderToMountedElement,
  type BandScale,
  type G2Spec,
} from '@antv/g2';
import {
  CellBorderPosition,
  CellClipBox,
  CellType,
  HeaderCell,
} from '@antv/s2';
import { map } from 'lodash';
import { AxisCellType } from '../constant';
import type { ColAxisHeaderConfig } from '../interface';

export class ColAxisCell extends HeaderCell<ColAxisHeaderConfig> {
  public get cellType() {
    return AxisCellType.ROW_AXIS_CELL as unknown as CellType;
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.TOP, CellBorderPosition.LEFT];
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

  getLabelScale(): BandScale {
    const { children } = this.meta;
    const domain = map(children, (child) => {
      const formatter = this.spreadsheet.dataSet.getFieldFormatter(child.field);

      return !child.isTotalRoot && formatter
        ? formatter(child.value, undefined, child)
        : child.value;
    });

    return {
      type: 'band',
      domain,
      range: [0, 1],
    };
  }

  drawAxisShape() {
    // const { field, query } = this.meta;

    const chartOptions: G2Spec = {
      autoFit: true,
      type: 'axisX',
      scale: {
        x: this.getLabelScale(),
      },
      coordinate: { transform: [{ type: 'transpose' }] },
      // title: this.spreadsheet.dataSet.getFieldName(field),
      // padding: 0,
      // margin: 0,
      // tick: false,
      // labelFormatter: (...v) => {
      //   console.log(v);

      //   return v[0];
      // },
      labelDirection: 'negative',
      ...this.getBBoxByType(CellClipBox.PADDING_BOX),
    };

    // delay 到实例被挂载到 parent 后，再渲染 chart
    Promise.resolve().then(() => {
      // https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2corelib
      renderToMountedElement(chartOptions, {
        group: this,
        library: corelib(),
      });
    });
  }
}
