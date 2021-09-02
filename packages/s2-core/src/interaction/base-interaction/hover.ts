import { ColCell, RowCell } from '@/cell';
import { S2Event } from '@/common/constant';
import {
  HOVER_FOCUS_TIME,
  InteractionStateName,
} from '@/common/constant/interaction';
import { S2CellType, ViewMeta, TooltipOptions } from '@/common/interface';
import { getActiveHoverRowColCells } from '@/utils/interaction/hover-event';
import { Event as CanvasEvent } from '@antv/g-canvas';
import { isEmpty, forEach } from 'lodash';
import { BaseEvent, BaseEventImplement } from '../base-event';

/**
 * @description Hover event for data cells, row cells and col cells
 */
export class HoverEvent extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
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
        cell.updateByState(InteractionStateName.HOVER, cell);
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
        cell.updateByState(InteractionStateName.HOVER);
      });
    }
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: CanvasEvent) => {
      const cell = this.spreadsheet.getCell(event.target) as S2CellType;
      if (isEmpty(cell)) {
        return;
      }

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
        }
        this.changeStateToHoverFocus(cell, event, meta);
      }
    });
  }

  private bindRowCellHover() {
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (event: CanvasEvent) => {
      this.handleHeaderHover(event);
    });
  }

  private bindColCellHover() {
    this.spreadsheet.on(S2Event.COL_CELL_HOVER, (event: CanvasEvent) => {
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
    event: CanvasEvent,
    meta: ViewMeta,
  ) {
    this.interaction.hoverTimer = window.setTimeout(() => {
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER_FOCUS,
      });
      const options: TooltipOptions = {
        isTotals: meta.isTotals,
        enterable: true,
        hideSummary: true,
      };
      const data = this.getCellInfo(meta);
      this.spreadsheet.showTooltipWithInfo(event, data, options);
    }, HOVER_FOCUS_TIME);
  }

  /**
   * @description handle the row or column header hover state
   * @param event
   */
  private handleHeaderHover(event: CanvasEvent) {
    const cell = this.spreadsheet.getCell(event.target) as S2CellType;
    if (isEmpty(cell)) {
      return;
    }

    const meta = cell.getMeta() as ViewMeta;
    this.interaction.changeState({
      cells: [cell],
      stateName: InteractionStateName.HOVER,
    });
    cell.update();
    const options: TooltipOptions = {
      isTotals: meta.isTotals,
      enterable: true,
      hideSummary: true,
      showSingleTips: true,
    };
    const data = this.getCellInfo(meta, true);
    this.spreadsheet.showTooltipWithInfo(event, data, options);
  }

  private getCellInfo(
    meta: ViewMeta = {} as ViewMeta,
    showSingleTips?: boolean,
  ) {
    const { data, query, value, rowQuery, colQuery } = meta;
    const currentCellMeta = data;

    const cellInfos = showSingleTips
      ? [{ ...query, value }]
      : [currentCellMeta || { ...rowQuery, ...colQuery }];

    return cellInfos;
  }
}
