import { Event as CanvasEvent, IShape, Point } from '@antv/g-canvas';
import { getCellMeta } from 'src/utils/interaction/select-event';
import { isEmpty } from 'lodash';
import { BaseEventImplement } from './base-event';
import { BaseEvent } from './base-interaction';
import { InterceptType, S2Event } from '@/common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '@/common/constant/interaction';
import {
  BrushPoint,
  BrushRange,
  OriginalEvent,
  ViewMeta,
} from '@/common/interface';
import { DataCell } from '@/cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX } from '@/common/constant';
import { getActiveCellsTooltipData } from '@/utils/tooltip';

/**
 * Panel area's brush selection interaction
 */
export class BrushSelection extends BaseEvent implements BaseEventImplement {
  public displayedDataCells: DataCell[] = [];

  public prepareSelectMaskShape: IShape;

  public startBrushPoint: BrushPoint;

  public endBrushPoint: BrushPoint;

  public brushRangeDataCells: DataCell[] = [];

  public brushSelectionStage = InteractionBrushSelectionStage.UN_DRAGGED;

  private brushSelectionMinimumMoveDistance = 5;

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private getPrepareSelectMaskTheme() {
    return this.spreadsheet.theme?.prepareSelectMask;
  }

  private initPrepareSelectMaskShape() {
    const { foregroundGroup } = this.spreadsheet;
    if (!foregroundGroup) {
      return;
    }
    foregroundGroup.removeChild(this.prepareSelectMaskShape);
    const prepareSelectMaskTheme = this.getPrepareSelectMaskTheme();
    this.prepareSelectMaskShape = foregroundGroup.addShape('rect', {
      visible: false,
      attrs: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        fill: prepareSelectMaskTheme?.backgroundColor,
        fillOpacity: prepareSelectMaskTheme?.backgroundOpacity,
        zIndex: FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX,
      },
      capture: false,
    });
  }

  private setBrushSelectionStage(stage: InteractionBrushSelectionStage) {
    this.brushSelectionStage = stage;
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_DOWN, (event: CanvasEvent) => {
      event.preventDefault();
      if (this.spreadsheet.interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }
      this.setBrushSelectionStage(InteractionBrushSelectionStage.CLICK);
      this.initPrepareSelectMaskShape();
      this.setDisplayedDataCells();
      this.startBrushPoint = this.getBrushPoint(event);
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_MOVE, (event: CanvasEvent) => {
      event.preventDefault();

      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }
      const { interaction } = this.spreadsheet;
      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      this.endBrushPoint = this.getBrushPoint(event);
      interaction.addIntercepts([InterceptType.HOVER]);
      interaction.clearStyleIndependent();
      this.updatePrepareSelectMask();
      this.showPrepareSelectedCells();
    });
  }

  private bindMouseUp() {
    // 使用全局的 mouseup, 而不是 canvas 的 mouse up 防止刷选过程中移出表格区域时无法响应事件
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, (event) => {
      event.preventDefault();

      if (this.isValidBrushSelection()) {
        this.spreadsheet.interaction.addIntercepts([
          InterceptType.BRUSH_SELECTION,
        ]);
        this.updateSelectedCells();
        this.spreadsheet.showTooltipWithInfo(
          event,
          getActiveCellsTooltipData(this.spreadsheet),
        );
      }
      this.resetDrag();
    });

    // 刷选过程中右键弹出系统菜单时, 应该重置刷选, 防止系统菜单关闭后 mouse up 未相应依然是刷选状态
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, () => {
      this.spreadsheet.interaction.removeIntercepts([InterceptType.HOVER]);
      this.resetDrag();
    });
  }

  private resetDrag() {
    this.hidePrepareSelectMaskShape();
    this.setBrushSelectionStage(InteractionBrushSelectionStage.UN_DRAGGED);
  }

  private isValidBrushSelection() {
    if (this.brushSelectionStage !== InteractionBrushSelectionStage.DRAGGED) {
      return false;
    }
    const { start, end } = this.getBrushRange();
    const isMovedEnoughDistance =
      end.x - start.x > this.brushSelectionMinimumMoveDistance ||
      end.y - start.y > this.brushSelectionMinimumMoveDistance;

    return isMovedEnoughDistance;
  }

  private setDisplayedDataCells() {
    this.displayedDataCells =
      this.spreadsheet.interaction.getPanelGroupAllDataCells();
  }

  private updatePrepareSelectMask() {
    const brushRange = this.getBrushRange();
    this.prepareSelectMaskShape.attr({
      x: brushRange.start.x,
      y: brushRange.start.y,
      width: brushRange.width,
      height: brushRange.height,
    });
    this.prepareSelectMaskShape.show();
  }

  public hidePrepareSelectMaskShape() {
    this.prepareSelectMaskShape?.hide();
  }

  private getBrushPoint(event: CanvasEvent): BrushPoint {
    const originalEvent = event.originalEvent as unknown as OriginalEvent;
    const point: Point = {
      x: originalEvent.layerX,
      y: originalEvent.layerY,
    };
    const cell = this.spreadsheet.getCell(event.target);
    const { colIndex, rowIndex } = cell.getMeta();

    return {
      ...point,
      rowIndex,
      colIndex,
    };
  }

  // 四个刷选方向: 左 => 右, 右 => 左, 上 => 下, 下 => 上, 将最终结果进行重新排序, 获取真实的 row, col index
  private getBrushRange(): BrushRange {
    const minRowIndex = Math.min(
      this.startBrushPoint.rowIndex,
      this.endBrushPoint.rowIndex,
    );
    const maxRowIndex = Math.max(
      this.startBrushPoint.rowIndex,
      this.endBrushPoint.rowIndex,
    );
    const minColIndex = Math.min(
      this.startBrushPoint.colIndex,
      this.endBrushPoint.colIndex,
    );
    const maxColIndex = Math.max(
      this.startBrushPoint.colIndex,
      this.endBrushPoint.colIndex,
    );
    const minX = Math.min(this.startBrushPoint.x, this.endBrushPoint.x);
    const maxX = Math.max(this.startBrushPoint.x, this.endBrushPoint.x);
    const minY = Math.min(this.startBrushPoint.y, this.endBrushPoint.y);
    const maxY = Math.max(this.startBrushPoint.y, this.endBrushPoint.y);

    return {
      start: {
        rowIndex: minRowIndex,
        colIndex: minColIndex,
        x: minX,
        y: minY,
      },
      end: {
        rowIndex: maxRowIndex,
        colIndex: maxColIndex,
        x: maxX,
        y: maxY,
      },
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  private isInBrushRange(meta: ViewMeta) {
    const { start, end } = this.getBrushRange();
    const { rowIndex, colIndex } = meta;
    return (
      rowIndex >= start.rowIndex &&
      rowIndex <= end.rowIndex &&
      colIndex >= start.colIndex &&
      colIndex <= end.colIndex
    );
  }

  // 获取对角线的两个坐标, 得到对应矩阵并且有数据的单元格
  private getBrushRangeDataCells(): DataCell[] {
    return this.displayedDataCells.filter((cell) => {
      const meta = cell.getMeta();
      return this.isInBrushRange(meta);
    });
  }

  // 刷选过程中高亮的cell
  private showPrepareSelectedCells = () => {
    const brushRangeDataCells = this.getBrushRangeDataCells();
    this.spreadsheet.interaction.changeState({
      cells: brushRangeDataCells.map((item) => getCellMeta(item)),
      stateName: InteractionStateName.PREPARE_SELECT,
      // 刷选首先会经过 hover => mousedown => mousemove, hover时会将当前行全部高亮 (row cell + data cell)
      // 如果是有效刷选, 更新时会重新渲染, hover 高亮的格子 会正常重置
      // 如果是无效刷选(全部都是没数据的格子), brushRangeDataCells = [], 更新时会跳过, 需要强制重置 hover 高亮
      force: true,
    });
    this.brushRangeDataCells = brushRangeDataCells;
  };

  // 最终刷选的cell
  private updateSelectedCells() {
    const { interaction } = this.spreadsheet;
    interaction.changeState({
      cells: this.brushRangeDataCells.map((item) => getCellMeta(item)),
      stateName: InteractionStateName.SELECTED,
    });
    this.spreadsheet.emit(
      S2Event.DATE_CELL_BRUSH_SELECTION,
      this.brushRangeDataCells,
    );
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.brushRangeDataCells);
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeDataCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }
}
