import { Event } from '@antv/g-canvas';
import { Cell, ColCell, CornerCell, RowCell } from '../cell';
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
    const currentCellData = ev.target?.attrs?.appendInfo?.cellData;
    const target = ev.target.get('parent');
    if (!target && !currentCellData) {
      return;
    }

    const meta = target?.getMeta?.() || currentCellData;

    const baseCellData = {
      viewMeta: meta,
      event: ev,
    };

    if (target instanceof Cell) {
      // cell area's cell
      this.spreadsheet.emit(KEY_SINGLE_CELL_CLICK, {
        ...baseCellData,
        rowQuery: meta.rowQuery,
        colQuery: meta.colQuery,
      });
      return;
    }

    if (target instanceof RowCell) {
      this.spreadsheet.emit(KEY_ROW_CELL_CLICK, {
        ...baseCellData,
        query: meta.query,
      });
      return;
    }

    if (target instanceof ColCell) {
      this.spreadsheet.emit(KEY_COLUMN_CELL_CLICK, {
        ...baseCellData,
        query: meta.query,
      });
      return;
    }

    if (target instanceof CornerCell || currentCellData) {
      this.spreadsheet.emit(KEY_CORNER_CELL_CLICK, baseCellData);
    }
  }
}
