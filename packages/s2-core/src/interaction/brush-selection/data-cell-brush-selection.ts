import { isEmpty, range } from 'lodash';
import type { Point } from '@antv/g-canvas';
import { DataCell } from '../../cell/data-cell';
import { S2Event } from '../../common/constant';
import {
  CellTypes,
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../../common/constant/interaction';
import type { BrushRange, CellMeta, ViewMeta } from '../../common/interface';
import { afterSelectDataCells } from '../../utils/interaction/select-event';
import { TableDataCell } from '../../cell/table-data-cell';
import { BaseBrushSelection } from './base-brush-selection';

export class DataCellBrushSelection extends BaseBrushSelection {
  public displayedCells: DataCell[] = [];

  public brushRangeCells: DataCell[] = [];

  protected bindMouseDown() {
    this.spreadsheet.on(S2Event.DATA_CELL_MOUSE_DOWN, (event) => {
      if (!this.spreadsheet.interaction.getBrushSelection().data) {
        return;
      }

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

      if (this.autoBrushScroll(pointInCanvas)) {
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

  // 最终刷选的 cell
  protected updateSelectedCells() {
    const brushRange = this.getBrushRange();
    const selectedCellMetas = this.getSelectedCellMetas(brushRange);

    this.spreadsheet.interaction.changeState({
      cells: selectedCellMetas,
      // TODO: 怕上层有直接消费 stateName, 暂时保留, 2.0 版本改成 InteractionStateName.BRUSH_SELECTED
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: afterSelectDataCells,
    });

    const scrollBrushRangeCells =
      this.getScrollBrushRangeCells(selectedCellMetas);

    this.emitBrushSelectionEvent(
      S2Event.DATA_CELL_BRUSH_SELECTION,
      scrollBrushRangeCells,
    );
  }

  /**
   * @name 获取刷选 (含滚动后不再可视范围内) 的单元格
   * @description DataCell 存在滚动刷选, 由于按需加载的特性, 非可视范围内的单元格已被注销
   * 如果在可视范围, 直接返回 DataCell, 非可视范围, 由于实例已被销毁, 构造实例后返回
   */
  private getScrollBrushRangeCells(selectedCellMetas: CellMeta[]) {
    return selectedCellMetas.map((meta) => {
      const visibleCell = this.getVisibleBrushRangeCells(meta.id);

      if (visibleCell) {
        return visibleCell;
      }

      const viewMeta = this.spreadsheet.facet.layoutResult.getCellMeta(
        meta.rowIndex,
        meta.colIndex,
      );
      // TODO: next 分支把这些单元格 (包括自定义单元格) 都放在了 s2.options.dataCell 里, 合并后不需要判断是不是明细表了
      const Cell = this.spreadsheet.isTableMode() ? TableDataCell : DataCell;
      return new Cell(viewMeta, this.spreadsheet);
    });
  }

  protected bindMouseUp() {
    super.bindMouseUp(true);
  }

  protected getPrepareSelectMaskPosition(brushRange: BrushRange): Point {
    const { minX, minY } = this.spreadsheet.facet.panelBBox;
    const x = Math.max(brushRange.start.x, minX);
    const y = Math.max(brushRange.start.y, minY);

    return {
      x,
      y,
    };
  }
}
