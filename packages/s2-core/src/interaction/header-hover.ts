/* 表头 hover 显示操作 */

import { Event } from '@antv/g-canvas';
import { ColCell, RowCell } from '../cell';
import { HoverInteraction } from './hover-interaction';

/**
 * Change the rowHeader/colHeader background when hover happened
 */
export class HeaderHover extends HoverInteraction {
  public selectedHeaderCell: RowCell | ColCell;

  private target;

  public selectHeader(cell: RowCell | ColCell) {
    this.resetHeader();
    cell.setActive();
    this.selectedHeaderCell = cell;
  }

  public resetHeader() {
    if (this.selectedHeaderCell && !this.selectedHeaderCell.destroyed) {
      this.selectedHeaderCell.setInactive();
    }
    this.selectedHeaderCell = null;
  }

  protected start(ev: Event) {
    this.target = ev.target;
  }

  protected process(ev: Event) {
    const cell = ev.target.get('parent');
    if (cell && (cell instanceof RowCell || cell instanceof ColCell)) {
      if (cell.getMeta().x !== undefined && ev.target.type !== 'line') {
        this.selectHeader(cell);
      } else {
        this.resetHeader();
      }
      this.draw();
    }
  }
}
