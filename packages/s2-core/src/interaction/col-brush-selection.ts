import type { Event as CanvasEvent, Point } from '@antv/g-canvas';
import { isEmpty, map } from 'lodash';
import type { ColCell } from '../cell/col-cell';
import { InterceptType, S2Event } from '../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../common/constant/interaction';
import type { BrushPoint, ViewMeta } from '../common/interface';
import type { Node } from '../facet/layout/node';
import { getCellMeta } from '../utils/interaction/select-event';
import { BaseBrushSelection } from './base-brush-selection';

/**
 * Panel area's brush selection interaction
 */
export class ColBrushSelection extends BaseBrushSelection {
  public displayedCells: ColCell[] = [];

  public brushRangeCells: ColCell[] = [];

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  protected bindMouseDown() {
    [S2Event.COL_CELL_MOUSE_DOWN].forEach((e: S2Event) => {
      this.spreadsheet.on(e, (event: CanvasEvent) => {
        super.mouseDown(event);
      });
    });
  }

  protected isPointInCanvas(point: { x: number; y: number }) {
    // 获取列头的区域范围
    const { width: maxX } = this.spreadsheet.facet.getCanvasHW();
    const { width: minX, minY, maxY } = this.spreadsheet.facet.cornerBBox;
    return (
      point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
    );
  }

  protected bindMouseMove() {
    this.spreadsheet.on(S2Event.COL_CELL_MOUSE_MOVE, (event: CanvasEvent) => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }

      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      const pointInCanvas = this.spreadsheet.container.getPointByEvent(
        event.originalEvent,
      );

      this.clearAutoScroll();
      if (!this.isPointInCanvas(pointInCanvas)) {
        const deltaX = pointInCanvas.x - this.endBrushPoint?.x;
        const deltaY = pointInCanvas.y - this.endBrushPoint?.y;
        this.handleScroll(deltaX, deltaY);
        return;
      }

      this.renderPrepareSelected(pointInCanvas);
    });
  }

  protected setDisplayedCells() {
    this.displayedCells = this.spreadsheet.interaction.getAllColHeaderCells();
  }

  protected getBrushPoint(event: CanvasEvent): BrushPoint {
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell.getMeta();
    const { x: NodeX, y: NodeY } = meta;
    return {
      ...super.getBrushPoint(event),
      NodeX,
      NodeY,
    };
  }

  protected isInBrushRange = (meta: ViewMeta | Node) => {
    const { start, end } = this.getBrushRange();
    const { x = 0, y = 0 } = meta;

    return (
      x >= start.NodeX && x <= end.NodeX && y >= start.NodeY && y <= end.NodeY
    );
  };

  // 最终刷选的cell
  protected updateSelectedCells() {
    const { interaction } = this.spreadsheet;

    interaction.changeState({
      cells: map(this.brushRangeCells, (cell) => getCellMeta(cell)),
      stateName: InteractionStateName.SELECTED,
    });

    this.spreadsheet.emit(
      S2Event.COL_CELL_BRUSH_SELECTION,
      this.brushRangeCells,
    );
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.brushRangeCells);
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }
}
