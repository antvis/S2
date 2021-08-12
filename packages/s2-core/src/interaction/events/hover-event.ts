import { Event } from '@antv/g-canvas';
import { get } from 'lodash';
import { S2Event } from '@/common/constant';
import { BaseEvent } from './base-event';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { S2CellType, ViewMeta } from '@/common/interface';
import { getTooltipData } from '@/utils/tooltip';
import { HOVER_FOCUS_TIME } from '@/common/constant/interaction';

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
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target) as S2CellType;
      const meta = cell.getMeta() as ViewMeta;
      this.spreadsheet.clearState();
      this.changeState(cell, InteractionStateName.HOVER);
      if (this.spreadsheet.hoverTimer) {
        window.clearTimeout(this.spreadsheet.hoverTimer);
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
      this.spreadsheet.clearState();
      this.changeState(cell, InteractionStateName.HOVER);
      this.handleTooltip(ev, meta);
    });
  }

  private bindColCellHover() {
    this.spreadsheet.on(S2Event.COL_CELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target) as S2CellType;
      const meta = cell.getMeta() as ViewMeta;
      this.spreadsheet.clearState();
      this.changeState(cell, InteractionStateName.HOVER);
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
    this.spreadsheet.hoverTimer = window.setTimeout(() => {
      this.changeState(cell, InteractionStateName.HOVER_FOCUS);
      this.handleTooltip(ev, meta);
    }, HOVER_FOCUS_TIME);
  }

  /**
   * @description change the data cell state
   * @param cell
   * @param ev
   * @param meta
   */
  private changeState(cell: S2CellType, stateName: InteractionStateName) {
    this.spreadsheet.setState(cell, stateName);
    this.spreadsheet.updateCellStyleByState();
    this.spreadsheet.upDatePanelAllCellsStyle();
    this.draw();
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
