import { Event, LooseObject } from '@antv/g-canvas';
import { get, isEmpty, set, each, find } from 'lodash';
import { S2Event, DefaultInterceptEventType } from './types';
import { BaseEvent } from './base-event';
import { StateName } from '../../state/state';
import { ViewMeta } from '../../common/interface';
import { getTooltipData } from '../../utils/tooltip';

/**
 * Row header click navigation interaction
 */
export class HoverEvent extends BaseEvent {

  private hoverTimer: number = null;

  protected bindEvents() {
    this.bindDataCellHover();
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATACELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target);
      const meta: ViewMeta = cell.getMeta();
      this.spreadsheet.clearState();
      this.changeState(cell, StateName.HOVER);
      if(this.hoverTimer) {
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = window.setTimeout(() => {
          this.changeState(cell, StateName.KEEP_HOVER);
          this.handleTooltip(ev, meta)
        }, 800);
      } else {
        this.hoverTimer = window.setTimeout(() => {
          this.changeState(cell, StateName.KEEP_HOVER);
          this.handleTooltip(ev, meta)
        }, 800);
      }
    })
  }

  private changeState(cell, cellName) {
    this.spreadsheet.setState(cell, cellName);
    this.spreadsheet.updateCellStyleByState();
    this.spreadsheet.getPanelAllCells().forEach((cell) => {
      cell.update();
    });
    this.spreadsheet.container.draw();
  }

  private handleTooltip(ev: Event, meta: ViewMeta) {
    const position = {
      x: ev.clientX,
      y: ev.clientY,
    };
    const currentCellMeta = get(meta, 'data.0');
    const isTotals = get(meta, 'isTotals', false);
    if (isTotals && this.spreadsheet.isStrategyMode()) {
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
