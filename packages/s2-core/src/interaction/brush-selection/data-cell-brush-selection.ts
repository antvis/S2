import type { Event as CanvasEvent } from '@antv/g-canvas';
import { isEmpty, range } from 'lodash';
import type { DataCell } from '../../cell/data-cell';
import { InterceptType, S2Event } from '../../common/constant';
import {
  CellTypes,
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../../common/constant/interaction';
import type { BrushRange, CellMeta, ViewMeta } from '../../common/interface';
import { updateRowColCells } from '../../utils';
import { BaseBrushSelection } from './base-brush-selection';

/**
 * Panel area's brush data cell selection interaction
 */
export class DataCellBrushSelection extends BaseBrushSelection {
  public displayedCells: DataCell[] = [];

  public brushRangeCells: DataCell[] = [];

  protected bindMouseDown() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_DOWN, (event: CanvasEvent) => {
      super.mouseDown(event);
      this.resetScrollDelta();
    });
  }

  protected bindMouseMove() {
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_MOVE, (event) => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }

      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      const pointInCanvas = this.spreadsheet.container.getPointByEvent(event);

      this.clearAutoScroll();
      if (!this.isPointInCanvas(pointInCanvas)) {
        const deltaX = pointInCanvas.x - this.endBrushPoint.x;
        const deltaY = pointInCanvas.y - this.endBrushPoint.y;
        this.handleScroll(deltaX, deltaY);
        return;
      }

      this.renderPrepareSelected(pointInCanvas);
    });
  }

  protected isInBrushRange(meta: ViewMeta) {
    const { start, end } = this.getBrushRange();
    const { rowIndex, colIndex } = meta;
    return (
      rowIndex >= start.rowIndex &&
      rowIndex <= end.rowIndex &&
      colIndex >= start.colIndex &&
      colIndex <= end.colIndex
    );
  }

  public getSelectedCellMetas = (brushRange: BrushRange): CellMeta[] => {
    const metas: CellMeta[] = [];
    const { rowLeafNodes = [], colLeafNodes = [] } =
      this.spreadsheet.facet.layoutResult;

    const rowIndexRange = range(
      brushRange.start.rowIndex,
      brushRange.end.rowIndex + 1,
    );

    const colIndexRange = range(
      brushRange.start.colIndex,
      brushRange.end.colIndex + 1,
    );

    rowIndexRange.forEach((rowIndex) => {
      colIndexRange.forEach((colIndex) => {
        const colId = String(colLeafNodes[colIndex].id);
        const rowId = isEmpty(rowLeafNodes)
          ? String(rowIndex)
          : String(rowLeafNodes[rowIndex].id);

        metas.push({
          colIndex,
          rowIndex,
          id: `${rowId}-${colId}`,
          type: CellTypes.DATA_CELL,
          rowId,
          colId,
          spreadsheet: this.spreadsheet,
        });
      });
    });

    return metas;
  };

  // 最终刷选的cell
  protected updateSelectedCells() {
    const { interaction, options } = this.spreadsheet;

    const brushRange = this.getBrushRange();
    const selectedCellMetas = this.getSelectedCellMetas(brushRange);

    interaction.changeState({
      cells: selectedCellMetas,
      stateName: InteractionStateName.SELECTED,
    });

    if (options.interaction.selectedCellHighlight) {
      selectedCellMetas.forEach((meta) => {
        updateRowColCells(meta as unknown as ViewMeta);
      });
    }

    const selectedCellsLike = this.getScrollBrushRangeCells(selectedCellMetas);
    this.spreadsheet.emit(S2Event.DATA_CELL_BRUSH_SELECTION, selectedCellsLike);
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, selectedCellsLike);

    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }

  /**
   * @name 获取刷选 (含滚动后不再可视范围内) 的单元格
   * @description DataCell 存在滚动刷选, 由于按需加载的特性, 非可视范围内的单元格已被注销
   * 所以获取到的是 可视范围 (DataCell) + 非可视范围 (DataCellMeta) 的组合
   */
  private getScrollBrushRangeCells(selectedCellMetas: CellMeta[]) {
    return selectedCellMetas.map((meta) => {
      const visibleCell = this.brushRangeCells.find((cell) => {
        const visibleCellMeta = cell.getMeta();
        return visibleCellMeta?.id === meta.id;
      });

      return visibleCell ?? meta;
    });
  }

  protected bindMouseUp() {
    super.bindMouseUp(true);
  }
}
