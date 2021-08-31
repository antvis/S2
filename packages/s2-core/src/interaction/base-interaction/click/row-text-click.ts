import { Event } from '@antv/g-canvas';
import { get, isEmpty, find, head } from 'lodash';
import { KEY_JUMP_HREF } from '../../../common/constant';
import { S2Event, InterceptInteractionType } from '@/common/constant';
import { BaseEvent, BaseEventImplement } from '../../base-event';
import { Data } from '../../../common/interface/s2DataConfig';
import { CellAppendInfo } from '../../../common/interface';
import { Node } from '../../../facet/layout/node';

/**
 * Row header click navigation interaction
 */
export class RowTextClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindRowCellClick();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (ev: Event) => {
      if (
        this.spreadsheet.interaction.interceptInteraction.has(
          InterceptInteractionType.CLICK,
        )
      ) {
        return;
      }
      const appendInfo = get(
        ev.target,
        'attrs.appendInfo',
        {},
      ) as CellAppendInfo;

      if (appendInfo.isRowHeaderText) {
        const { cellData } = appendInfo;
        const key = cellData.key;
        const rowData = this.getRowData(cellData);

        this.spreadsheet.emit(KEY_JUMP_HREF, {
          key,
          record: rowData,
        });
      }
    });
  }

  private getRowData = (cellData: Node): Data => {
    let node = cellData;
    const nodeData: Data = {};
    while (node.parent) {
      nodeData[node.key] = node.value;
      node = node.parent;
    }
    const rowIndex = this.getRowIndex(cellData);
    const originalRowData = this.getOriginalRowData(cellData, rowIndex);
    const rowData: Data = {
      ...originalRowData,
      ...nodeData,
      rowIndex,
    };

    return rowData;
  };

  private getOriginalRowData = (cellData: Node, rowIndex: number) => {
    const { options } = this.spreadsheet;
    const { showGrandTotals, showSubTotals, reverseLayout, reverseSubLayout } =
      options?.totals?.row || {};

    // If grand totals, sub totals enabled and in the table head
    const grandTotalsRowIndexDiff = showGrandTotals && reverseLayout ? 1 : 0;
    const subTotalsRowIndexDiff = showSubTotals && reverseSubLayout ? 1 : 0;

    const dataIndex = Math.max(
      0,
      rowIndex - grandTotalsRowIndexDiff - subTotalsRowIndexDiff,
    );

    const currentRowData = find(
      this.spreadsheet.dataCfg.data,
      (row: Data, index: number) =>
        row[cellData.key] === cellData.value && index === dataIndex,
    );
    return currentRowData;
  };

  private getRowIndex = (cellData: Node) => {
    const isTree = this.spreadsheet?.options?.hierarchyType === 'tree';
    if (isTree) {
      let child = cellData;
      while (!isEmpty(child.children)) {
        child = head(child.children);
      }
      return cellData.rowIndex ?? child.rowIndex;
    }
    // if current cell has no row index, return dynamic computed value
    const rowIndex = Math.floor(cellData.y / cellData.height);
    return cellData.rowIndex ?? rowIndex;
  };
}
