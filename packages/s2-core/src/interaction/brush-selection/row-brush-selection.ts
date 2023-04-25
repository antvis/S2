import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { isEmpty, map } from 'lodash';
import type { RowCell } from '../../cell';
import { InterceptType, S2Event } from '../../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../../common/constant/interaction';
import type { ViewMeta } from '../../common/interface';
import type { Node } from '../../facet/layout/node';
import { getCellMeta } from '../../utils/interaction/select-event';
import type { OnUpdateCells } from '../../common/interface';
import type { BBox } from '../../engine';
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
    const { height: maxY } = this.spreadsheet.facet.getCanvasSize();
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

      const pointInCanvas = this.spreadsheet.container.client2Viewport({
        x: event.clientX,
        y: event.clientY,
      });

      if (!this.isPointInCanvas(pointInCanvas)) {
        return;
      }

      this.renderPrepareSelected(pointInCanvas);
    });
  }

  protected setDisplayedCells() {
    this.displayedCells = this.spreadsheet.interaction.getAllRowHeaderCells();
  }

  protected isInBrushRange = (meta: ViewMeta | Node) => {
    // start、end 都是相对位置
    const { start, end } = this.getBrushRange();
    const { scrollY, hRowScrollX } = this.spreadsheet.facet.getScrollOffset();

    const { cornerBBox } = this.spreadsheet.facet;
    // 绝对位置，不随滚动条变化
    const { x = 0, y = 0, width = 0, height = 0 } = meta;

    return this.rectanglesIntersect(
      {
        // 行头过长时，可以单独进行滚动，所以需要加上滚动的距离
        minX: start.x + hRowScrollX,
        // 由于刷选的时候，是以列头的左上角为起点，所以需要减去角头的宽度，在滚动后需要加上滚动条的偏移量
        minY: start.y - cornerBBox.height + scrollY,
        maxX: end.x + hRowScrollX,
        maxY: end.y - cornerBBox.height + scrollY,
      } as BBox,
      {
        minX: x,
        maxX: x + width,
        minY: y,
        maxY: y + height,
      } as BBox,
    );
  };

  // 最终刷选的cell
  protected updateSelectedCells() {
    const { interaction } = this.spreadsheet;

    interaction.changeState({
      cells: map(this.brushRangeCells, getCellMeta),
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
      InterceptType.ROW_CELL_BRUSH_SELECTION,
    ]);
  }

  protected onUpdateCells: OnUpdateCells = (root) =>
    root.updateCells(root.getAllRowHeaderCells());
}
