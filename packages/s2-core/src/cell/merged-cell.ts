import { isEmpty, isObject } from 'lodash';
import { CellType } from '../common/constant';
import type { RenderTextShapeOptions, ViewMeta } from '../common/interface';
import type { S2CellType } from '../common/interface/interaction';
import type { SpreadSheet } from '../sheet-type';
import { renderPolygon } from '../utils/g-renders';
import { getPolygonPoints } from '../utils/interaction/merge-cell';
import { drawObjectText } from '../utils/text';
import { DataCell } from './data-cell';

/**
 * Cell for panelGroup area
 */
export class MergedCell extends DataCell {
  public cells: S2CellType[];

  public get cellType() {
    return CellType.MERGED_CELL;
  }

  public constructor(
    spreadsheet: SpreadSheet,
    cells: S2CellType[],
    meta?: ViewMeta,
  ) {
    super(meta!, spreadsheet, cells);
  }

  handleRestOptions(...[cells]: [S2CellType[]]) {
    this.cells = cells;
  }

  public update() {}

  protected initCell() {
    this.resetTextAndConditionIconShapes();
    // TODO：1、交互态扩展； 2、合并后的单元格文字布局及文字内容（目前参考Excel合并后只保留第一个单元格子的数据）
    this.conditions = this.spreadsheet.options.conditions!;
    this.drawBackgroundShape();
    this.drawTextShape();
  }

  /**
   * Draw merged cells background
   */
  protected drawBackgroundShape() {
    const allPoints = getPolygonPoints(this.cells);
    const cellTheme = this.theme.dataCell!.cell;

    this.backgroundShape = renderPolygon(this, {
      points: allPoints,
      stroke: cellTheme!.horizontalBorderColor,
      fill: cellTheme!.backgroundColor,
    });
  }

  public drawTextShape(options?: RenderTextShapeOptions) {
    if (isEmpty(this.meta)) {
      return;
    }

    if (isObject(this.meta.fieldValue)) {
      drawObjectText(this);
    } else {
      super.drawTextShape(options);
    }
  }
}
