import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { InterceptType, S2Event } from '../../../common/constant';
import type { RawData } from '../../../common/interface';
import { CellData } from '../../../data-set/cell-data';
import type { Node } from '../../../facet/layout/node';
import { BaseEvent, type BaseEventImplement } from '../../base-event';
import type { Data } from '../../../common/interface';

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
      const field = cellData!.field;
      const rowData = this.getRowData(cellData!);

      this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
        field,
        cellData: cellData!,
        record: rowData as Data,
      });
    });
  }

  private getRowData = (cellData: Node): RawData => {
    const leafNode = cellData.getHeadLeafChild();

    const data = this.spreadsheet.dataSet.getCellMultiData({
      query: leafNode?.query!,
    })[0];

    const originalData = CellData.getFieldValue(data) as RawData;

    return {
      ...originalData,
      rowIndex: cellData.rowIndex ?? leafNode?.rowIndex,
    };
  };
}
