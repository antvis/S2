import type { Event as CanvasEvent } from '@antv/g-canvas';
import { isEmpty, map } from 'lodash';
import type { ColCell } from '../../cell/col-cell';
import { InterceptType, S2Event } from '../../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../../common/constant/interaction';
import type { ViewMeta } from '../../common/interface';
import type { Node } from '../../facet/layout/node';
import { getCellMeta } from '../../utils/interaction/select-event';
import type { OnUpdateCells } from '../../common/interface';
import { BaseBrushSelection } from './base-brush-selection';

export class ColBrushSelection extends BaseBrushSelection {
  public displayedCells: ColCell[] = [];

  public brushRangeCells: ColCell[] = [];

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  protected bindMouseDown() {
    this.spreadsheet.on(S2Event.COL_CELL_MOUSE_DOWN, (event) => {
      if (!this.spreadsheet.interaction.getBrushSelection().col) {
        return;
      }

      super.mouseDown(event);
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

      if (!this.isPointInCanvas(pointInCanvas)) {
        return;
      }

      this.renderPrepareSelected(pointInCanvas);
    });
  }

  protected setDisplayedCells() {
    this.displayedCells = this.spreadsheet.interaction.getAllColHeaderCells();
  }

  /**
   * 用户判断 colCell 是否在当前刷选的范围内
   * @param meta colCell 位置等属性存储的对象
   * @returns boolean
   */
  protected isInBrushRange(meta: ViewMeta | Node) {
    const { start, end } = this.getBrushRange();
    const { scrollX } = this.spreadsheet.facet.getScrollOffset();

    const cornerBBox = this.spreadsheet.facet.cornerBBox;
    const { x = 0, y = 0, width = 0, height = 0 } = meta;

    return this.rectanglesIntersect(
      {
        // 由于刷选的时候，是以列头的左上角为起点，所以需要减去角头的宽度，在滚动后需要加上滚动条的偏移量
        minX: start.x - cornerBBox.width + scrollX,
        minY: start.y,
        maxX: end.x - cornerBBox.width + scrollX,
        maxY: end.y,
      },
      {
        minX: x,
        maxX: x + width,
        minY: y,
        maxY: y + height,
      },
    );
  }

  // 最终刷选的 cell
  protected updateSelectedCells() {
    const { interaction } = this.spreadsheet;

    interaction.changeState({
      cells: map(this.brushRangeCells, getCellMeta),
      stateName: InteractionStateName.BRUSH_SELECTED,
      onUpdateCells: this.onUpdateCells,
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

  protected addBrushIntercepts() {
    this.spreadsheet.interaction.addIntercepts([
      InterceptType.COL_BRUSH_SELECTION,
    ]);
  }

  protected onUpdateCells: OnUpdateCells = (root) => {
    return root.updateCells(root.getAllColHeaderCells());
  };
}
