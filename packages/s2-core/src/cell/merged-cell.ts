import { SimpleBBox } from '@antv/g-canvas';
import { isEmpty, isObject } from 'lodash';
import { CellTypes } from '../common/constant';
import { ViewMeta } from '../common/interface';
import { DataCell } from './data-cell';
import { getPolygonPoints } from '@/utils/interaction/merge-cells';
import { SpreadSheet } from '@/sheet-type';
import { S2CellType } from '@/common/interface/interaction';
import { renderPolygon } from '@/utils/g-renders';
import { drawObjectText } from '@/utils/text';

/**
 * Cell for panelGroup area
 */
export class MergedCell extends DataCell {
  public cells: S2CellType[];

  public constructor(
    spreadsheet: SpreadSheet,
    cells: S2CellType[],
    meta?: ViewMeta,
  ) {
    super(meta, spreadsheet, cells);
  }

  handleRestOptions(...[cells]: [S2CellType[]]) {
    this.cells = cells;
  }

  public get cellType() {
    return CellTypes.MERGED_CELLS;
  }

  public update() {}

  protected initCell() {
    // TODO：1、条件格式支持； 2、交互态扩展； 3、合并后的单元格文字布局及文字内容（目前参考Excel合并后只保留第一个单元格子的数据）
    this.drawBackgroundShape();
    // this.drawStateShapes();
    this.drawTextShape();
    // this.update();
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
  public drawTextShape() {
    if (isEmpty(this.meta)) return;
    if (isObject(this.meta.fieldValue)) {
      drawObjectText(this);
    } else {
      super.drawTextShape();
    }
  }
}
