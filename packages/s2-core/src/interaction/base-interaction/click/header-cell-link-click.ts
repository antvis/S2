import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { InterceptType, S2Event } from '../../../common/constant';
import type { Data, RawData } from '../../../common/interface';
import { CellData } from '../../../data-set/cell-data';
import type { Node } from '../../../facet/layout/node';
import { BaseEvent, type BaseEventImplement } from '../../base-event';

export class HeaderCellLinkClick
  extends BaseEvent
  implements BaseEventImplement
{
  public bindEvents() {
    this.bindRowCellClick();
    this.bindColCellClick();
  }

  private onHeaderCellClick(event: CanvasEvent) {
    if (this.spreadsheet.interaction.hasIntercepts([InterceptType.CLICK])) {
      return;
    }

    if (!this.isLinkFieldText(event.target)) {
      return;
    }

    const { meta } = this.getCellAppendInfo(event.target);
    const field = meta!.field;
    const rowData = this.getCellData(meta!);

    this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
      field,
      meta: meta!,
      record: rowData as Data,
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event) => {
      this.onHeaderCellClick(event);
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event) => {
      this.onHeaderCellClick(event);
    });
  }

  private getCellData = (node: Node): RawData => {
    const leafNode = node.getHeadLeafChild();

    const data = this.spreadsheet.dataSet.getCellMultiData({
      query: leafNode?.query!,
    })[0];

    const originalData = CellData.getFieldValue(data) as RawData;

    return {
      ...originalData,
      rowIndex: node.rowIndex ?? leafNode?.rowIndex,
      colIndex: node.colIndex ?? leafNode?.colIndex,
    };
  };
}
