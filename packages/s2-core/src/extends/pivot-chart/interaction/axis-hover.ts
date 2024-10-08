import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import {
  DataCell,
  HoverEvent,
  InteractionStateName,
  S2Event,
  type ViewMeta,
} from '@antv/s2';
import { isEmpty } from 'lodash';
import { AxisCellType } from '../cell/cell-type';
import { updateDataCellRelevantHeaderCells } from '../utils/handle-interaction';

export class AxisHover extends HoverEvent {
  public shouldSkipDataCellHoverEvent(event: CanvasEvent) {
    const cell = this.spreadsheet.getCell(event.target);

    if (isEmpty(cell)) {
      return true;
    }
  }

  public bindDataCellHover() {
    this.spreadsheet.on(
      S2Event.DATA_CELL_HOVER_TRIGGERED_PRIVATE,
      (cell: DataCell) => {
        const { options } = this.spreadsheet;
        const { interaction: interactionOptions } = options;
        const meta = cell?.getMeta() as ViewMeta;

        if (interactionOptions?.hoverHighlight) {
          updateDataCellRelevantHeaderCells(
            InteractionStateName.HOVER,
            meta,
            this.spreadsheet,
          );
        }
      },
    );
  }

  public bindHeaderCellHover() {
    this.spreadsheet.on(S2Event.GLOBAL_HOVER, (event) => {
      const cell = this.spreadsheet.getCell(event.target);

      if (!cell) {
        return;
      }

      if (
        cell.cellType === (AxisCellType.AXIS_ROW_CELL as any) ||
        cell.cellType === (AxisCellType.AXIS_COL_CELL as any)
      ) {
        this.handleHeaderHover(event);
      }
    });
  }
}
