import type { Event as CanvasEvent } from '@antv/g-canvas';
import { isEmpty } from 'lodash';
import type { DataCell } from '../cell/data-cell';
import { InterceptType, S2Event } from '../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../common/constant/interaction';
import type { BrushRange, ViewMeta } from '../common/interface';
import { updateRowColCells } from '../utils';
import { BaseBrushSelection } from './base-brush-selection';

/**
 * Panel area's brush selection interaction
 */
export class DataCellBrushSelection extends BaseBrushSelection {
  public displayedCells: DataCell[] = [];

  public brushRangeCells: DataCell[] = [];

  protected bindMouseDown() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_DOWN, (event: CanvasEvent) => {
      super.mouseDown(event);
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

  public getSelectedCellMetas = (range: BrushRange) => {
    const metas = [];
    const colLeafNodes = this.spreadsheet.facet.layoutResult.colLeafNodes;
    const rowLeafNodes = this.spreadsheet.facet.layoutResult.rowLeafNodes ?? [];
    for (
      let rowIndex = range.start.rowIndex;
      rowIndex < range.end.rowIndex + 1;
      rowIndex++
    ) {
      for (
        let colIndex = range.start.colIndex;
        colIndex < range.end.colIndex + 1;
        colIndex++
      ) {
        const colId = String(colLeafNodes[colIndex].id);
        let rowId = String(rowIndex);
        if (rowLeafNodes.length) {
          rowId = String(rowLeafNodes[rowIndex].id);
        }
        metas.push({
          colIndex,
          rowIndex,
          id: `${rowId}-${colId}`,
          type: 'dataCell',
          rowId,
          colId,
          spreadsheet: this.spreadsheet,
        });
      }
    }
    return metas;
  };

  // 最终刷选的cell
  protected updateSelectedCells() {
    const { interaction, options } = this.spreadsheet;

    const range = this.getBrushRange();
    const selectedCellMetas = this.getSelectedCellMetas(range);

    interaction.changeState({
      cells: selectedCellMetas,
      stateName: InteractionStateName.SELECTED,
    });

    if (options.interaction.selectedCellHighlight) {
      selectedCellMetas.forEach((meta) => {
        updateRowColCells(meta);
      });
    }

    this.spreadsheet.emit(
      S2Event.DATA_CELL_BRUSH_SELECTION,
      this.brushRangeCells,
    );
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.brushRangeCells);
    // 未刷选到有效格子, 允许 hover
    if (isEmpty(this.brushRangeCells)) {
      interaction.removeIntercepts([InterceptType.HOVER]);
    }
  }
}
