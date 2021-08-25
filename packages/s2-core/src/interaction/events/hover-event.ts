import { ColCell, RowCell } from '@/cell';
import { S2Event } from '@/common/constant';
import {
  HOVER_FOCUS_TIME,
  InteractionStateName,
} from '@/common/constant/interaction';
import { S2CellType, ViewMeta } from '@/common/interface';
import { getTooltipData } from '@/utils/tooltip';
import { getActiveHoverRowColCells } from '@/utils/interaction/hover-event';
import { Event } from '@antv/g-canvas';
import { get, isEmpty, forEach } from 'lodash';
import { BaseEvent } from './base-event';

/**
 * @description Hover event for data cells, row cells and col cells
 */
export class HoverEvent extends BaseEvent {
  protected bindEvents() {
    this.bindDataCellHover();
    this.bindRowCellHover();
    this.bindColCellHover();
  }

  private updateRowColCells(meta: ViewMeta) {
    const { rowId, colId } = meta;
    if (colId) {
      // update colHeader cells
      const allColHeaderCells = getActiveHoverRowColCells(
        colId,
        this.interaction.getAllColHeaderCells(),
      );
      forEach(allColHeaderCells, (cell: ColCell) => {
        cell.update();
      });
    }

    if (rowId) {
      // update rowHeader cells
      const allRowHeaderCells = getActiveHoverRowColCells(
        rowId,
        this.interaction.getAllRowHeaderCells(),
        this.spreadsheet.isHierarchyTreeType(),
      );
      forEach(allRowHeaderCells, (cell: RowCell) => {
        cell.update();
      });
    }
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: Event) => {
      const cell = this.spreadsheet.getCell(event.target) as S2CellType;
      if (isEmpty(cell)) return;
      const meta = cell.getMeta() as ViewMeta;
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER,
      });

      if (this.spreadsheet.options.hoverHighlight) {
        // highlight all the row and column cells which the cell belongs to
        this.updateRowColCells(meta);
        if (this.interaction.hoverTimer) {
          window.clearTimeout(this.interaction.hoverTimer);
          this.changeStateToHoverFocus(cell, event, meta);
        } else {
          this.changeStateToHoverFocus(cell, event, meta);
        }
      }
    });
  }

  private bindRowCellHover() {
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (event: Event) => {
      this.handleHeaderHover(event);
    });
  }

  private bindColCellHover() {
    this.spreadsheet.on(S2Event.COL_CELL_HOVER, (event: Event) => {
      this.handleHeaderHover(event);
    });
  }

  /**
   * @description change the data cell state from hover to hover focus
   * @param cell
   * @param event
   * @param meta
   */
  private changeStateToHoverFocus(
    cell: S2CellType,
    event: Event,
    meta: ViewMeta,
  ) {
    this.interaction.hoverTimer = window.setTimeout(() => {
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER_FOCUS,
      });
      this.handleTooltip(event, meta);
    }, HOVER_FOCUS_TIME);
  }

  /**
   * @description handle the row or column header hover state
   * @param event
   */
  private handleHeaderHover(event: Event) {
    const cell = this.spreadsheet.getCell(event.target) as S2CellType;
    if (isEmpty(cell)) return;
    const meta = cell.getMeta() as ViewMeta;
    this.interaction.changeState({
      cells: [cell],
      stateName: InteractionStateName.HOVER,
    });
    cell.update();
    this.handleTooltip(event, meta, true);
  }

  /**
   * @description handle the the tooltip
   * @param event
   * @param meta
   */
  private handleTooltip(event: Event, meta: ViewMeta, isHeader?: boolean) {
    const position = {
      x: event.clientX,
      y: event.clientY,
    };
    const currentCellMeta = get(meta, 'data');
    const isTotals = get(meta, 'isTotals', false);
    const options = {
      isTotals,
      enterable: true,
      hideSummary: true,
      showSingleTips: isHeader,
    };
    const cellInfos = isHeader
      ? [{ ...get(meta, 'query'), value: get(meta, 'value') }]
      : [
          currentCellMeta || {
            ...get(meta, 'rowQuery'),
            ...get(meta, 'colQuery'),
          },
        ];
    const tooltipData = getTooltipData({
      spreadsheet: this.spreadsheet,
      cellInfos,
      isHeader,
      options,
    });
    const showOptions = {
      position,
      data: tooltipData,
      cellInfos,
      options,
    };
    this.spreadsheet.showTooltip(showOptions);
  }
}
