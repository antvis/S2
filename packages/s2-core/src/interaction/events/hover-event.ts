import { Event } from '@antv/g-canvas';
import { get } from 'lodash';
import { S2Event } from '@/common/constant';
import { BaseEvent } from './base-event';
import { InteractionStateName } from '@/common/constant/interaction';
import { ViewMeta } from '@/common/interface';
import { getTooltipData } from '@/utils/tooltip';
import { HOVER_FOCUS_TIME } from '@/common/constant/interaction';

/**
 * Row header click navigation interaction
 */
export class HoverEvent extends BaseEvent {
  protected bindEvents() {
    this.bindDataCellHover();
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target);
      const meta: ViewMeta = cell.getMeta();
      this.spreadsheet.clearState();
      this.changeState(cell, InteractionStateName.HOVER);
      if (this.spreadsheet.hoverTimer) {
        window.clearTimeout(this.spreadsheet.hoverTimer);
        this.changeStateToHoverKeep(cell, ev, meta);
      } else {
        this.changeStateToHoverKeep(cell, ev, meta);
      }
    });
  }

  private changeStateToHoverKeep(cell, ev, meta) {
    this.spreadsheet.hoverTimer = window.setTimeout(() => {
      this.changeState(cell, InteractionStateName.HOVER_FOCUS);
      this.handleTooltip(ev, meta);
    }, HOVER_FOCUS_TIME);
  }

  private changeState(cell, cellName) {
    this.spreadsheet.setState(cell, cellName);
    this.spreadsheet.updateCellStyleByState();
    this.spreadsheet.upDatePanelAllCellsStyle();
    this.draw();
  }

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
