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
import { Event as CanvasEvent, IShape, Point } from '@antv/g-canvas';
import { DataCell } from '@/cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX } from '@/common/constant';
import { BaseEvent } from './base-interaction';
import { BaseEventImplement } from './base-event';
import { getActiveCellsTooltipData } from '@/utils/tooltip';
import { isEmpty } from 'lodash';

/**
 * Panel area's brush selection interaction
 */
export class BrushSelection extends BaseEvent implements BaseEventImplement {
  public displayedDataCells: DataCell[] = [];

  public prepareSelectMaskShape: IShape;

  private startBrushPoint: BrushPoint;

  private endBrushPoint: BrushPoint;

  private brushRangeDataCells: DataCell[] = [];

  private brushSelectionStage = InteractionBrushSelectionStage.UN_DRAGGED;

  public bindEvents() {
    this.bindMouseDown();
    this.bindMouseMove();
    this.bindMouseUp();
  }

  private getPrepareSelectMaskTheme() {
    return this.spreadsheet.theme.prepareSelectMask;
  }

  private initPrepareSelectMaskShape() {
    const { foregroundGroup } = this.spreadsheet;
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
      this.setBrushSelectionStage(InteractionBrushSelectionStage.CLICK);
      this.initPrepareSelectMaskShape();
      this.setDisplayedDataCells();
      this.startBrushPoint = this.getBrushPoint(event);
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_MOVE, (event: CanvasEvent) => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }

      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      this.interaction.addIntercepts([InterceptType.HOVER]);
      this.endBrushPoint = this.getBrushPoint(event);
      this.interaction.clearStyleIndependent();
      this.updatePrepareSelectMask();
      this.showPrepareSelectedCells();
    });
  }

  private bindMouseUp() {
    // The constant 'GLOBAL_MOUSE_UP' is used to monitor the event of the mouse moving off the table.
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_UP, (event) => {
      event.preventDefault();

      if (this.brushSelectionStage === InteractionBrushSelectionStage.DRAGGED) {
        this.interaction.addIntercepts([InterceptType.BRUSH_SELECTION]);
        this.hidePrepareSelectMaskShape();
        this.updateSelectedCells();
        this.spreadsheet.showTooltipWithInfo(
          event,
          getActiveCellsTooltipData(this.spreadsheet),
        );
      }
      this.setBrushSelectionStage(InteractionBrushSelectionStage.UN_DRAGGED);
    });
  }

  private setDisplayedDataCells() {
    this.displayedDataCells = this.interaction.getPanelGroupAllDataCells();
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

  private hidePrepareSelectMaskShape() {
    this.prepareSelectMaskShape.hide();
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
    this.interaction.changeState({
      cells: brushRangeDataCells,
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
    this.interaction.changeState({
      cells: this.brushRangeDataCells,
      stateName: InteractionStateName.SELECTED,
    });
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeDataCells)) {
      this.interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }
}
