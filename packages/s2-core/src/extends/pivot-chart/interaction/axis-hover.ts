import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import {
  HoverEvent,
  InteractionStateName,
  S2Event,
  updateAllHeaderCellState,
  type ViewMeta,
} from '@antv/s2';
import { isEmpty } from 'lodash';
import { AxisCellType } from '../cell/cell-type';
import type { PivotChartFacet } from '../facet/pivot-chart-facet';

export class AxisHover extends HoverEvent {
  public bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: CanvasEvent) => {
      const cell = this.spreadsheet.getCell(event.target);

      if (isEmpty(cell)) {
        return;
      }

      const { options } = this.spreadsheet;
      const { interaction: interactionOptions } = options;
      const meta = cell?.getMeta() as ViewMeta;

      if (interactionOptions?.hoverHighlight) {
        this.updateDataCellRelevantHeaderCells(
          InteractionStateName.HOVER,
          meta,
        );
      }
    });
  }

  public updateDataCellRelevantHeaderCells(
    stateName: InteractionStateName,
    meta: ViewMeta,
  ) {
    this.updateDataCellRelevantAxisRowCells(stateName, meta);
    this.updateDataCellRelevantAxisColCells(stateName, meta);
  }

  updateDataCellRelevantAxisRowCells(
    stateName: InteractionStateName,
    meta: ViewMeta,
  ) {
    const { rowId } = meta;
    const { facet, interaction } = this.spreadsheet;
    const { rowHeader } = interaction.getHoverHighlight();

    if (rowHeader && rowId) {
      updateAllHeaderCellState(
        rowId,
        (facet as PivotChartFacet).getAxisRowCells(),
        stateName,
      );
    }
  }

  updateDataCellRelevantAxisColCells(
    stateName: InteractionStateName,
    meta: ViewMeta,
  ) {
    const { colId } = meta;
    const { facet, interaction } = this.spreadsheet;
    const { colHeader } = interaction.getHoverHighlight();

    if (colHeader && colId) {
      updateAllHeaderCellState(
        colId,
        (facet as PivotChartFacet).getAxisColCells(),
        stateName,
      );
    }
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
