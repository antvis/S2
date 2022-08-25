import type { Event as CanvasEvent } from '@antv/g-canvas';
import { isEmpty, map } from 'lodash';
import type { RowCell } from '../../cell';
import { InterceptType, S2Event } from '../../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../../common/constant/interaction';
import type { BrushPoint, ViewMeta } from '../../common/interface';
import type { Node } from '../../facet/layout/node';
import { getCellMeta } from '../../utils/interaction/select-event';
import type { OnUpdateCells } from '../../common/interface';
import { BaseBrushSelection } from './base-brush-selection';

/**
 * Panel area's brush selection interaction
 */
export class RowBrushSelection extends BaseBrushSelection {
  public displayedCells: RowCell[] = [];

  public brushRangeCells: RowCell[] = [];

  protected bindMouseDown() {
    [S2Event.ROW_CELL_MOUSE_DOWN].forEach((e: S2Event) => {
      this.spreadsheet.on(e, (event: CanvasEvent) => {
        super.mouseDown(event);
      });
    });
  }

  protected isPointInCanvas(point: { x: number; y: number }) {
    // 获取行头的区域范围
    const { height: maxY } = this.spreadsheet.facet.getCanvasHW();
    const { minX, height: minY, maxX } = this.spreadsheet.facet.cornerBBox;

    return (
      point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
    );
  }

  protected bindMouseMove() {
    this.spreadsheet.on(S2Event.ROW_CELL_MOUSE_MOVE, (event) => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }

      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      const pointInCanvas = this.spreadsheet.container.getPointByEvent(
        event.originalEvent,
      );

      if (!this.isPointInCanvas(pointInCanvas)) {
        return;
      }

      this.renderPrepareSelected(pointInCanvas);
    });
  }

  protected setDisplayedCells() {
    this.displayedCells = this.spreadsheet.interaction.getAllRowHeaderCells();
  }

  protected getBrushPoint(event: CanvasEvent): BrushPoint {
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell.getMeta();
    const { x: headerX, y: headerY } = meta;
    return {
      ...super.getBrushPoint(event),
      headerX,
      headerY,
    };
  }

  protected isInBrushRange = (meta: ViewMeta | Node) => {
    const { start, end } = this.getBrushRange();
    const { x = 0, y = 0 } = meta;

    return (
      x >= start.headerX &&
      x <= end.headerX &&
      y >= start.headerY &&
      y <= end.headerY
    );
  };

  // 最终刷选的cell
  protected updateSelectedCells() {
    const { interaction } = this.spreadsheet;

    interaction.changeState({
      cells: map(this.brushRangeCells, (cell) => getCellMeta(cell)),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllRowHeaderCells());
      },
    });

    this.spreadsheet.emit(
      S2Event.ROW_CELL_BRUSH_SELECTION,
      this.brushRangeCells,
    );
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.brushRangeCells);
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }

  protected addBrushIntercepts() {
    this.spreadsheet.interaction.addIntercepts([
      InterceptType.ROW_BRUSH_SELECTION,
    ]);
  }

  protected onUpdateCells: OnUpdateCells = (root) => {
    return root.updateCells(root.getAllRowHeaderCells());
  };
}
