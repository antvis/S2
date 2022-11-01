import type { Event as CanvasEvent } from '@antv/g-canvas';
import { find, head, isEmpty } from 'lodash';
import { InterceptType, S2Event } from '../../../common/constant';
import type { RawData } from '../../../common/interface';
import type { Node } from '../../../facet/layout/node';
import { BaseEvent, type BaseEventImplement } from '../../base-event';

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

      if (!this.isLinkFieldText(event.target)) {
        return;
      }

      const { cellData } = this.getCellAppendInfo(event.target);
      const key = cellData!.key;
      const rowData = this.getRowData(cellData!);

      this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
        key,
        record: rowData,
      });
    });
  }

  private getRowData = (cellData: Node): RawData => {
    let node = cellData;
    const nodeData: RawData = {};
    while (node.parent) {
      nodeData[node.key] = node.value;
      node = node.parent;
    }
    const rowIndex = this.getRowIndex(cellData);
    const originalRowData = this.getOriginalRowData(cellData, rowIndex);
    const rowData: RawData = {
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
      (row: RawData, index: number) =>
        row[cellData.key] === cellData.value && index === dataIndex,
    );
    return currentRowData;
  };

  private getRowIndex = (cellData: Node) => {
    const isTree = this.spreadsheet.options.hierarchyType === 'tree';
    if (isTree) {
      let child: Node | undefined = cellData;
      while (!isEmpty(child?.children)) {
        child = head(child?.children);
      }
      return cellData.rowIndex ?? child?.rowIndex;
    }
    // if current cell has no row index, return dynamic computed value
    const rowIndex = Math.floor(cellData.y / cellData.height);
    return cellData.rowIndex ?? rowIndex;
  };
}
