import { getPolygonPoints } from '@/utils/interaction/merge-cells';
import { IShape, SimpleBBox } from '@antv/g-canvas';
import { isEmpty, isObject } from 'lodash';
import { S2CellType } from 'src/common/interface/interaction';
import { renderPolygon } from 'src/utils/g-renders';
import { drawObjectText, drawStringText } from 'src/utils/text';
import { CellTypes } from '../common/constant';
import { ViewMeta } from '../common/interface';
import { DataItem } from '../common/interface/s2DataConfig';
import { BaseCell } from './base-cell';

/**
 * Cell for panelGroup area
 */
export class MergedCells extends BaseCell<ViewMeta> {
  public cells: S2CellType[];

  protected textShape: IShape;

  public update() {}

  public getData(): { value: DataItem; formattedValue: DataItem } {
    const rowField = this.meta.rowId;
    const rowMeta = this.spreadsheet.dataSet.getFieldMeta(rowField);
    let formatter;
    if (rowMeta) {
      // format by row field
      formatter = this.spreadsheet.dataSet.getFieldFormatter(rowField);
    } else {
      // format by value field
      formatter = this.spreadsheet.dataSet.getFieldFormatter(
        this.meta.valueField,
      );
    }
    const formattedValue = formatter(this.meta.fieldValue);
    return {
      value: this.meta.fieldValue as DataItem,
      formattedValue,
    };
  }

  handleRestOptions(...options: S2CellType[][]) {
    this.cells = options[0];
  }

  protected initCell() {
    // TODO：1、条件格式支持； 2、交互态扩展； 3、合并后的单元格文字布局及文字内容（目前参考Excel合并后只保留第一个单元格子的数据）
    this.drawBackgroundShape();
    // this.drawStateShapes();
    this.drawTextShape();
    // this.update();
  }

  public get cellType() {
    return CellTypes.MERGED_CELLS;
  }

  /**
   * Get left rest area size by icon condition
   * @protected
   */
  protected getLeftAreaBBox(): SimpleBBox {
    const { x, y, height, width } = this.meta;
    return {
      x,
      y,
      width,
      height,
    };
  }

  /**
   * Draw merged cells background
   */
  protected drawBackgroundShape() {
    const allPoints = getPolygonPoints(this.cells);
    const cellTheme = this.theme.dataCell.cell;
    this.backgroundShape = renderPolygon(this, {
      points: allPoints,
      stroke: cellTheme.horizontalBorderColor,
      fill: cellTheme.backgroundColor,
      lineHeight: cellTheme.horizontalBorderWidth,
    });
  }

  /**
   * Render data text
   */
  protected drawTextShape() {
    if (isEmpty(this.meta)) return;
    const { formattedValue: text } = this.getData();
    if (isObject(text)) {
      drawObjectText(this);
    } else {
      drawStringText(this);
    }
  }
}
