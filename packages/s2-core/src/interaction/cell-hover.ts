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
    this.addEventListener(
      this.spreadsheet.container.get('container'),
      'mouseleave',
      this.hideHoverBox.bind(this),
    );
  }

  protected start(ev: Event) {
    ev.preventDefault();
    this.isDragging = true;
  }

  protected end(ev: Event) {
    this.isDragging = false;
  }

  protected showHoverBox(cells: DataCell[]) {
    if (this.spreadsheet.isSpreadsheetType()) {
      super.showHoverBox(cells);
    } else {
      // 明细表
      if (!this.selectedCell?.destroyed) {
        this.selectedCell.getChildByIndex(0).attr({
          fill: '#fff ',
          opacity: 1.0,
        });
      }
      this.selectedCell = cells && cells[0];
      this.selectedCell.getChildByIndex(0).attr({
        fill: '#F5F7FA ',
        opacity: 1.0,
      });
      this.draw();
    }
  }

  private onMouseMove(ev) {
    if (this.isDragging) {
      // 处于拖拽过程中，如圈选时，不展示 hoverBox
      this.hideHoverBox();
      return;
    }
    const cell = ev.target.get('parent');
    if (cell instanceof DataCell) {
      this.showHoverBox([cell]);
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
