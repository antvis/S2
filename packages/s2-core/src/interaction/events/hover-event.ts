import { S2Event } from '@/common/constant';
import {
  HOVER_FOCUS_TIME,
  InteractionStateName,
} from '@/common/constant/interaction';
import { S2CellType, ViewMeta } from '@/common/interface';
import { getTooltipData } from '@/utils/tooltip';
import { Event } from '@antv/g-canvas';
import { get } from 'lodash';
import { BaseEvent } from './base-event';

/**
 * @description Hover event for data cells, row cells and col cells
 */
export class HoverEvent extends BaseEvent {
  protected bindEvents() {
    // this.bindDataCellHover();
    // this.bindRowCellHover();
    // this.bindColCellHover();
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target) as S2CellType;
      const meta = cell.getMeta() as ViewMeta;
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER,
      });
      if (this.interaction.hoverTimer) {
        window.clearTimeout(this.interaction.hoverTimer);
        this.changeStateToHoverFocus(cell, ev, meta);
      } else {
        this.changeStateToHoverFocus(cell, ev, meta);
      }
    });
  }

  private bindRowCellHover() {
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target) as S2CellType;
      const meta = cell.getMeta() as ViewMeta;
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER,
      });
      this.handleTooltip(ev, meta);
    });
  }

  private bindColCellHover() {
    this.spreadsheet.on(S2Event.COL_CELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target) as S2CellType;
      const meta = cell.getMeta() as ViewMeta;
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER,
      });
      this.handleTooltip(ev, meta);
    });
  }

  /**
   * @description change the data cell state from hover to hover focus
   * @param cell
   * @param ev
   * @param meta
   */
  private changeStateToHoverFocus(cell: S2CellType, ev: Event, meta: ViewMeta) {
    this.interaction.hoverTimer = window.setTimeout(() => {
      this.interaction.changeState({
        cells: [cell],
        stateName: InteractionStateName.HOVER_FOCUS,
      });
      this.handleTooltip(ev, meta);
    }, HOVER_FOCUS_TIME);
  }

  /**
   * @description handle the the tooltip
   * @param ev
   * @param meta
   */
  private handleTooltip(ev: Event, meta: ViewMeta) {
    const position = {
      x: ev.clientX,
      y: ev.clientY,
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
