import type { Event as CanvasEvent, Point } from '@antv/g-canvas';
import { isEmpty, map } from 'lodash';
import { RowCell } from '../cell';
import { InterceptType, S2Event } from '../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../common/constant/interaction';
import type {
  BrushPoint,
  BrushRange,
  OriginalEvent,
  ViewMeta,
} from '../common/interface';
import type { Node } from '../facet/layout/node';
import { getCellMeta } from '../utils/interaction/select-event';
import { getActiveCellsTooltipData } from '../utils/tooltip';
import { BaseBrushSelection } from './base-brush-selection';

/**
 * Panel area's brush selection interaction
 */
export class RowBrushSelection extends BaseBrushSelection {
  public displayedDataCells: RowCell[] = [];

  public brushRangeDataCells: RowCell[] = [];

  protected bindMouseDown() {
    const mouseDown = (event: CanvasEvent) => {
      event?.preventDefault?.();
      if (this.spreadsheet.interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }
      this.setBrushSelectionStage(InteractionBrushSelectionStage.CLICK);
      this.initPrepareSelectMaskShape();
      this.setDisplayedDataCells();
      this.startBrushPoint = this.getBrushPoint(event);
      this.resetScrollDelta();
    };

    [S2Event.ROW_CELL_MOUSE_DOWN].forEach((e: S2Event) => {
      this.spreadsheet.on(e, (event: CanvasEvent) => {
        mouseDown(event);
      });
    });
  }

  protected isPointInCanvas(point: { x: number; y: number }) {
    const { height, width } = this.spreadsheet.facet.getCanvasHW();
    // row
    const { minX, height: minY } = this.spreadsheet.facet.cornerBBox;

    return (
      point.x > minX && point.x < width && point.y > minY && point.y < height
    );
  }

  protected renderPrepareSelected = (point: Point) => {
    const { x, y } = point;
    const target = this.spreadsheet.container.getShape(x, y);

    const cell = this.spreadsheet.getCell(target);

    if (!cell || !(cell instanceof RowCell)) {
      return;
    }
    const { rowIndex, colIndex, x: NodeX, y: NodeY } = cell.getMeta();

    this.endBrushPoint = {
      x,
      y,
      rowIndex,
      colIndex,
      NodeY,
      NodeX,
    };

    const { interaction } = this.spreadsheet;
    interaction.addIntercepts([InterceptType.HOVER]);
    interaction.clearStyleIndependent();
    this.updatePrepareSelectMask();
    this.showPrepareSelectedCells();
  };

  protected bindMouseMove() {
    this.spreadsheet.on(S2Event.ROW_CELL_MOUSE_MOVE, (event) => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }

      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      const pointInCanvas = this.spreadsheet.container.getPointByEvent(event);

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

  protected bindMouseUp() {
    // 使用全局的 mouseup, 而不是 canvas 的 mouse up 防止刷选过程中移出表格区域时无法响应事件
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, (event) => {
      if (this.brushSelectionStage !== InteractionBrushSelectionStage.DRAGGED) {
        this.resetDrag();
        return;
      }
      this.clearAutoScroll();

      if (this.isValidBrushSelection()) {
        this.spreadsheet.interaction.addIntercepts([
          InterceptType.BRUSH_SELECTION,
        ]);
        this.updateSelectedCells();
        // todo-zc: 这里可以展示一个 圈选了多少项的
        this.spreadsheet.showTooltipWithInfo(
          event,
          getActiveCellsTooltipData(this.spreadsheet),
        );
      }
      if (
        this.spreadsheet.interaction.getCurrentStateName() ===
        InteractionStateName.PREPARE_SELECT
      ) {
        this.spreadsheet.interaction.reset();
      }

      this.resetDrag();
    });

    // 刷选过程中右键弹出系统菜单时, 应该重置刷选, 防止系统菜单关闭后 mouse up 未相应依然是刷选状态
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, () => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }
      this.spreadsheet.interaction.removeIntercepts([InterceptType.HOVER]);
      this.resetDrag();
    });
  }

  protected setDisplayedDataCells() {
    this.displayedDataCells =
      this.spreadsheet.interaction.getAllRowHeaderCells();
  }

  protected getBrushPoint(event: CanvasEvent): BrushPoint {
    const { scrollY, scrollX } = this.spreadsheet.facet.getScrollOffset();
    const originalEvent = event.originalEvent as unknown as OriginalEvent;
    const point: Point = {
      x: event?.x ?? originalEvent?.layerX,
      y: event?.y ?? originalEvent?.layerY,
    };
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell.getMeta();
    const { colIndex, rowIndex } = meta;
    const { x: NodeX, y: NodeY } = meta;
    return {
      ...point,
      rowIndex,
      colIndex,
      scrollY,
      scrollX,
      NodeX,
      NodeY,
    };
  }

  // 四个刷选方向: 左 => 右, 右 => 左, 上 => 下, 下 => 上, 将最终结果进行重新排序, 获取真实的 row, col index
  public getBrushRange(): BrushRange {
    const { scrollX, scrollY } = this.spreadsheet.facet.getScrollOffset();
    const minRowIndex = Math.min(
      this.startBrushPoint.rowIndex,
      this.endBrushPoint?.rowIndex,
    );
    const maxRowIndex = Math.max(
      this.startBrushPoint.rowIndex,
      this.endBrushPoint?.rowIndex,
    );
    const minColIndex = Math.min(
      this.startBrushPoint.colIndex,
      this.endBrushPoint?.colIndex,
    );
    const maxColIndex = Math.max(
      this.startBrushPoint.colIndex,
      this.endBrushPoint?.colIndex,
    );
    const startXInView =
      this.startBrushPoint.x + this.startBrushPoint.scrollX - scrollX;
    const startYInView =
      this.startBrushPoint.y + this.startBrushPoint.scrollY - scrollY;
    // startBrushPoint 和 endBrushPoint 加上当前 offset
    const minX = Math.min(startXInView, this.endBrushPoint?.x);
    const maxX = Math.max(startXInView, this.endBrushPoint?.x);
    const minY = Math.min(startYInView, this.endBrushPoint?.y);
    const maxY = Math.max(startYInView, this.endBrushPoint?.y);

    const minNodeX = Math.min(
      this.startBrushPoint?.NodeX,
      this.endBrushPoint?.NodeX,
    );
    const maxNodeX = Math.max(
      this.startBrushPoint?.NodeX,
      this.endBrushPoint?.NodeX,
    );
    const minNodeY = Math.min(
      this.startBrushPoint?.NodeY,
      this.endBrushPoint?.NodeY,
    );
    const maxNodeY = Math.max(
      this.startBrushPoint?.NodeY,
      this.endBrushPoint?.NodeY,
    );
    // x, y: 表示从整个表格（包含表头）从左上角作为 (0, 0) 的画布区域。
    // 这个 x, y 只有在绘制虚拟画布 和 是否有效移动时有效。
    return {
      start: {
        rowIndex: minRowIndex,
        colIndex: minColIndex,
        x: minX,
        y: minY,
        NodeX: minNodeX,
        NodeY: minNodeY,
      },
      end: {
        rowIndex: maxRowIndex,
        colIndex: maxColIndex,
        x: maxX,
        y: maxY,
        NodeX: maxNodeX,
        NodeY: maxNodeY,
      },
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  protected isInBrushRange = (meta: ViewMeta | Node) => {
    const { start, end } = this.getBrushRange();
    const { x = 0, y = 0 } = meta;

    return (
      x >= start.NodeX && x <= end.NodeX && y >= start.NodeY && y <= end.NodeY
    );
  };

  // 获取对角线的两个坐标, 得到对应矩阵并且有数据的单元格
  protected getBrushRangeDataCells(): RowCell[] {
    this.setDisplayedDataCells();
    return this.displayedDataCells.filter((cell) => {
      const meta = cell.getMeta();

      return this.isInBrushRange(meta);
    });
  }

  // 刷选过程中高亮的cell
  protected showPrepareSelectedCells = () => {
    this.brushRangeDataCells = this.getBrushRangeDataCells();

    this.spreadsheet.interaction.changeHeaderState({
      // interactedCells: this.brushRangeDataCells,
      cells: map(this.brushRangeDataCells, (cell) => getCellMeta(cell)),
      stateName: InteractionStateName.PREPARE_SELECT,
      force: true,
    });
  };

  // 最终刷选的cell
  private updateSelectedCells() {
    const { interaction } = this.spreadsheet;

    interaction.changeHeaderState({
      cells: map(this.brushRangeDataCells, (cell) => getCellMeta(cell)),
      stateName: InteractionStateName.SELECTED,
    });

    // todo-zc: emit header cell;
    // this.spreadsheet.emit(
    //   S2Event.DATA_CELL_BRUSH_SELECTION,
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   this.brushRangeDataCells,
    // );
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.brushRangeDataCells);
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeDataCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }
}
