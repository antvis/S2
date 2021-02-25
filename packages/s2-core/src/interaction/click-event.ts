import { Event } from '@antv/g-canvas';
import { DataCell, ColCell, CornerCell, RowCell } from '../cell';
import {
  KEY_COLUMN_CELL_CLICK,
  KEY_CORNER_CELL_CLICK,
  KEY_ROW_CELL_CLICK,
  KEY_SINGLE_CELL_CLICK,
} from '../common/constant';
import { BaseInteraction } from './base';

/**
 * Create By Bruce Too
 * On 2019-11-01
 * Base click event in detail area
 * 1、click corner cell
 * 2、click row header cell
 * 3、click col header cell
 * 4、click cell area's cell
 */
export class ClickEvent extends BaseInteraction {
  private target;

  constructor(props) {
    super(props);
  }

  protected start(ev: Event) {
    this.target = ev.target;
  }

  protected end(ev: Event) {
    ev.stopPropagation();
    if (this.target !== ev.target) {
      return;
    }
    const target = ev.target.get('parent');
    if (!target) {
      return;
    }

    if (target instanceof DataCell) {
      // cell area's cell
      const meta = target.getMeta();
      // console.log(JSON.stringify(meta.rowQuery), JSON.stringify(meta.colQuery));
      this.spreadsheet.emit(KEY_SINGLE_CELL_CLICK, {
        viewMeta: meta,
        rowQuery: meta.rowQuery,
        colQuery: meta.colQuery,
      });
      // this.spreadsheet.panelGroup.translate(0, meta.rowIndex%2 === 0 ? 10 : -10);
    } else if (target instanceof RowCell) {
      this.spreadsheet.emit(KEY_ROW_CELL_CLICK, {
        viewMeta: target.getMeta(),
        query: target.getMeta().query,
      });
    } else if (target instanceof ColCell) {
      this.spreadsheet.emit(KEY_COLUMN_CELL_CLICK, {
        viewMeta: target.getMeta(),
        query: target.getMeta().query,
      });
    } else if (target instanceof CornerCell) {
      this.spreadsheet.emit(KEY_CORNER_CELL_CLICK, {
        viewMeta: target.getMeta(),
      });
    }
  }
}
