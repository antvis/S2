import { S2Event } from '@/common/constant';
import {
  HOVER_FOCUS_TIME,
  InteractionStateName,
} from '@/common/constant/interaction';
import { S2CellType, ViewMeta } from '@/common/interface';
import { getTooltipData } from '@/utils/tooltip';
import { Event } from '@antv/g-canvas';
import { get, isEmpty } from 'lodash';
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

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: Event) => {
      const cell = this.spreadsheet.getCell(event.target) as S2CellType;
      if (isEmpty(cell)) return;
      const meta = cell.getMeta() as ViewMeta;
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER,
      });
      if (this.interaction.hoverTimer) {
        window.clearTimeout(this.interaction.hoverTimer);
        this.changeStateToHoverFocus(cell, event, meta);
      } else {
        this.changeStateToHoverFocus(cell, event, meta);
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
    this.handleTooltip(event, meta);
  }

  /**
   * @description handle the the tooltip
   * @param event
   * @param meta
   */
  private handleTooltip(event: Event, meta: ViewMeta) {
    const position = {
      x: event.clientX,
      y: event.clientY,
    };
    const currentCellMeta = get(meta, 'data.0');
    const isTotals = get(meta, 'isTotals', false);
    if (isTotals) {
      return;
    }

    const options = {
      isTotals,
      enterable: true,
      hideSummary: true,
    };

    const tooltipData = getTooltipData(
      this.spreadsheet,
      [currentCellMeta],
      options,
    );
    const showOptions = {
      position,
      data: tooltipData,
      options,
    };
    this.spreadsheet.showTooltip(showOptions);
  }
}
