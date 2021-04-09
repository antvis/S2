import { Event, Point } from '@antv/g-canvas';
import { isMobile } from '../utils/is-mobile';
import { KEY_JUMP_HREF } from '../common/constant';
import { HoverInteraction } from './hover-interaction';
import { ViewMeta } from '../common/interface';
import { head, isEmpty, get, each, set } from 'lodash';

/**
 * Row header click navigation interaction
 */
export class RowHeaderTextClick extends HoverInteraction {
  private targetPoint: Point;

  protected getStarEvent(): string {
    return isMobile() ? 'touchstart' : 'mousedown';
  }

  protected getEndEvent(): string {
    return isMobile() ? 'touchend' : 'mouseup';
  }

  protected start(ev: Event) {
    this.targetPoint = get(ev, 'target.cfg.startPoint');
  }

  protected end(ev: Event) {
    if (this.targetPoint !== get(ev, 'target.cfg.startPoint')) {
      return;
    }
    const appendInfo = get(ev.target, 'attrs.appendInfo', {}) as {
      isRowHeaderText: boolean;
      cellData: ViewMeta;
    };
    if (appendInfo.isRowHeaderText) {
      const { cellData } = appendInfo;
      const key = cellData.key;
      // get current root data, eg. { province: 'A', city: 'B', area: 'C' }
      let node = cellData;
      const record = {};
      while (node.parent) {
        record[node.key] = node.value;
        node = node.parent;
      }
      const rowIndex = this.getRowIndex(cellData);
      const currentRowData = get(this.spreadsheet.dataCfg.data, rowIndex);
      if (!isEmpty(currentRowData)) {
        each(currentRowData, (v, k) => {
          record[k] = v;
        });
      }
      // list view need row index
      if (!this.spreadsheet?.options?.spreadsheetType) {
        set(record, 'rowIndex', rowIndex);
      }
      this.spreadsheet.emit(KEY_JUMP_HREF, {
        key,
        record,
      });
    }
  }

  private getRowIndex = (cellData: ViewMeta) => {
    const isTree = this.spreadsheet?.options.hierarchyType === 'tree';
    if (isTree) {
      let child = cellData;
      while (!isEmpty(child.children)) {
        child = head(child.children);
      }
      return cellData.rowIndex ?? child.rowIndex;
    }
    // It is possible for a list view to get a cell row index
    const rowIndex = Math.floor(cellData.y / cellData.height);
    return cellData.rowIndex ?? rowIndex;
  };
}
