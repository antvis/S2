import { isEmpty } from 'lodash';
import { CellType } from '../common/constant';
import { CellBorderPosition, type ViewMeta } from '../common/interface';
import type { SpreadSheet } from '../sheet-type';
import { getBorderPositionAndStyle } from '../utils';
import { renderLine, renderPolygon } from '../utils/g-renders';
import {
  getPolygonPoints,
  getRightAndBottomCells,
} from '../utils/interaction/merge-cell';
import { drawCustomContent } from '../utils/text';
import { DataCell } from './data-cell';

/**
 * Cell for panelGroup area
 */
export class MergedCell extends DataCell {
  public cells: DataCell[];

  public get cellType() {
    return CellType.MERGED_CELL;
  }

  public constructor(
    spreadsheet: SpreadSheet,
    cells: DataCell[],
    meta?: ViewMeta,
  ) {
    super(meta!, spreadsheet, cells);
  }

  handleRestOptions(...[cells]: [DataCell[]]) {
    this.cells = cells;
  }

  public update() {}

  protected initCell() {
    this.resetTextAndConditionIconShapes();
    // TODO：1、交互态扩展； 2、合并后的单元格文字布局及文字内容（目前参考Excel合并后只保留第一个单元格子的数据）
    this.drawBackgroundShape();
    this.drawTextShape();
    this.drawBorders();
  }

  /**
   * Draw merged cells background
   */
  protected drawBackgroundShape() {
    const allPoints = getPolygonPoints(this.cells);
    const cellTheme = this.theme.dataCell!.cell;

    this.backgroundShape = renderPolygon(this, {
      points: allPoints,
      fill: cellTheme!.backgroundColor,
    });
  }

  public drawTextShape() {
    if (isEmpty(this.meta)) {
      return;
    }

    if (this.isMultiData()) {
      return drawCustomContent(this);
    }

    super.drawTextShape();
  }

  override drawBorders(): void {
    const { right, bottom, bottomRightCornerCell } = getRightAndBottomCells(
      this.cells,
    );

    right.forEach((cell) => {
      const { position, style } = getBorderPositionAndStyle(
        CellBorderPosition.RIGHT,
        cell.getBBoxByType(),
        cell.getStyle()?.cell!,
      );

      renderLine(this, { ...position, ...style });
    });

    bottom.forEach((cell) => {
      const { position, style } = getBorderPositionAndStyle(
        CellBorderPosition.BOTTOM,
        cell.getBBoxByType(),
        cell.getStyle()?.cell!,
      );

      renderLine(this, { ...position, ...style });
    });

    bottomRightCornerCell.forEach((cell) => {
      const { x, y, width, height } = cell.getBBoxByType();
      const {
        horizontalBorderWidth = 0,
        verticalBorderWidth = 0,
        verticalBorderColor,
      } = cell.getStyle()?.cell!;

      const x1 = x + width - verticalBorderWidth / 2;
      const x2 = x1;
      const y1 = y + height - horizontalBorderWidth;
      const y2 = y + height;

      renderLine(this, {
        x1,
        x2,
        y1,
        y2,
        lineWidth: verticalBorderWidth,
        stroke: verticalBorderColor,
        strokeOpacity: verticalBorderWidth,
      });
    });
  }
}
