import { Event } from '@antv/g-canvas';
import { get } from 'lodash';
import { S2Event } from './types';
import { BaseEvent } from './base-event';
import { SelectedStateName } from '@/common/constant/interatcion';
import { ViewMeta } from '@/common/interface';
import { getTooltipData } from '@/utils/tooltip';
import { KEEP_HOVER_TIME } from '@/common/constant/interatcion';

/**
 * Row header click navigation interaction
 */
export class HoverEvent extends BaseEvent {
  protected bindEvents() {
    this.bindDataCellHover();
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATACELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target);
      const meta: ViewMeta = cell.getMeta();
      this.spreadsheet.clearState();
      console.info('hover cell', cell);
      this.changeState(cell, SelectedStateName.HOVER);
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
      this.changeState(cell, SelectedStateName.KEEP_HOVER);
      this.handleTooltip(ev, meta);
    }, KEEP_HOVER_TIME);
  }

  private changeState(cell, cellName) {
    this.spreadsheet.setState(cell, cellName);
    console.info('start updateCellStyleByState');
    this.spreadsheet.updateCellStyleByState();
    console.info('end updateCellStyleByState');
    console.info('start upDatePanelAllCellsStyle');
    this.spreadsheet.upDatePanelAllCellsStyle();
    console.info('end upDatePanelAllCellsStyle');
    console.info('start draw');
    this.draw();
    console.info('draw end');
  }

  private handleTooltip(ev: Event, meta: ViewMeta) {
    if (!this.spreadsheet.options?.tooltip?.showTooltip) {
      return;
    }
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
