import type { FederatedPointerEvent as CanvasEvent } from '@antv/g-lite';
import { InteractionStateName, RowColumnClick, S2Event } from '@antv/s2';
import { AxisCellType } from '../cell/cell-type';
import { updateDataCellRelevantHeaderCells } from '../utils/handle-interaction';

export class AxisRowColumnClick extends RowColumnClick {
  public bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindAxisCellClick();
    this.bindDataCellClick();
    this.bindMouseMove();
  }

  protected bindAxisCellClick() {
    this.spreadsheet.on(S2Event.GLOBAL_CLICK, (event: CanvasEvent) => {
      const cell = this.spreadsheet.getCell(event.target);

      if (!cell) {
        return;
      }

      // axis col cell 在底部，点击后再往上选择 data cell 有点奇怪，暂时不处理
      if (cell.cellType === (AxisCellType.AXIS_ROW_CELL as any)) {
        this.handleRowColClick(event);
      }
    });
  }

  protected bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK_TRIGGERED_PRIVATE, (cell) => {
      const meta = cell.getMeta();

      if (this.spreadsheet.options.interaction?.selectedCellHighlight) {
        updateDataCellRelevantHeaderCells(
          InteractionStateName.SELECTED,
          meta,
          this.spreadsheet,
        );
      }
    });
  }
}
