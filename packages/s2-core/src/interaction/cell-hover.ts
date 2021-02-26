import { Event, Group } from '@antv/g-canvas';
import * as _ from 'lodash';
import { DataCell } from '../cell';
import { BaseSpreadSheet } from '../index';
import { HoverInteraction } from './hover-interaction';

/**
 * Panel Areas's cell hover interaction
 */
export class CellHover extends HoverInteraction {
  private isDragging: boolean;

  private selectedCell: DataCell;

  constructor(spreadsheet: BaseSpreadSheet) {
    super(spreadsheet);
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEvent(
      this.spreadsheet.panelGroup,
      'mousemove',
      this.onMouseMove.bind(this),
    );
  }

  protected start(ev: Event) {
    ev.preventDefault();
    this.isDragging = true;
  }

  protected end(ev: Event) {
    this.isDragging = false;
  }

  private onMouseMove(ev) {
    if (this.isDragging) {
      return;
    }
    const cell = ev.target.get('parent');
    if (cell instanceof DataCell) {
      // 目前只有交叉表才有tooltips,明细表暂时木有
      if (this.spreadsheet.isSpreadsheetType()) {
        const position = {
          x: ev.clientX,
          y: ev.clientY,
        };
        const hoveringCellData = _.get(cell, 'meta.data.0');
        this.showTooltip(position, hoveringCellData, {
          actionType: 'cellHover',
          isTotals: _.get(cell, 'meta.isTotals', false),
        });
      }
    } else {
      this.hide();
    }

    this.draw();
  }

  protected process(ev: Event) {}
}
