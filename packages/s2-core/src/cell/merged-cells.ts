import { renderPolygon } from '../utils/g-renders';
import { getPolygonPoints } from '../utils/interactions/merge-cells';
import { drawObjectText, drawStringText } from '../utils/text';
import { SimpleBBox, IShape } from '@antv/g-canvas';
import { BaseCell } from './base-cell';
import { isEmpty, isObject } from 'lodash';
import { DataItem } from '../common/interface/S2DataConfig';
import { S2CellType } from '../common/interface/interaction';
import { ViewMeta } from '../common/interface';

/**
 * Cell for panelGroup area
 */
export class MergedCells extends BaseCell<ViewMeta> {
  public cells: S2CellType[];

  protected textShape: IShape;

  protected initCell() {
    // TODO：1、条件格式支持； 2、交互态扩展； 3、合并后的单元格文字布局及文字内容（目前参考Excel合并后只保留第一个单元格子的数据）
    this.drawBackgroundShape();
    // this.drawStateShapes();
    this.drawTextShape();
    // this.update();
  }

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
    const cellTheme = this.theme.view.cell;
    this.backgroundShape = renderPolygon(
      allPoints,
      cellTheme.borderColor[0],
      cellTheme.backgroundColor,
      cellTheme.borderWidth[0],
      this,
    );
  }

  handleRestOptions(...options: S2CellType[][]) {
    this.cells = options[0];
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
