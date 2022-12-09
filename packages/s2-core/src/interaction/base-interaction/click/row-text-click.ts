import type { Event as CanvasEvent } from '@antv/g-canvas';
import { InterceptType, S2Event } from '../../../common/constant';
import type { Data } from '../../../common/interface';
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
      const key = cellData.key;
      const id = cellData.id;
      const rowData = this.getRowData(cellData);

      this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
        key,
        id,
        record: rowData,
      });
    });
  }

  private getRowData = (cellData: Node): Data => {
    const leafNode = cellData.getHeadLeafChild();

    const data = this.spreadsheet.dataSet.getMultiData(
      leafNode?.query,
      leafNode?.isTotals,
      true,
    )[0];

    return {
      ...data,
      rowIndex: cellData.rowIndex ?? leafNode.rowIndex,
    };
  };
}
