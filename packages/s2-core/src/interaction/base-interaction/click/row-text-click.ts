import { Event as CanvasEvent } from '@antv/g-canvas';
import { get, isEmpty, find, head } from 'lodash';
import { BaseEvent, BaseEventImplement } from '../../base-event';
import { S2Event, InterceptType } from '@/common/constant';
import { CellAppendInfo, Data } from '@/common/interface';
import { Node } from '@/facet/layout/node';

/**
 * Row header click navigation interaction
 */
export class RowTextClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindRowCellClick();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: CanvasEvent) => {
      if (this.spreadsheet.interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }
      const appendInfo = get(
        event.target,
        'attrs.appendInfo',
        {},
      ) as CellAppendInfo;

      if (appendInfo.isRowHeaderText) {
        const { cellData } = appendInfo;
        const key = cellData.key;
        const rowData = this.getRowData(cellData);

        this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
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
    const isTree = this.spreadsheet.options.hierarchyType === 'tree';
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
