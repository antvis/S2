import { Event as CanvasEvent } from '@antv/g-canvas';
import { forEach, get } from 'lodash';
import { getTooltipOptions, getTooltipVisibleOperator } from '@/utils/tooltip';
import {
  getCellMeta,
  getRowCellForSelectedCell,
} from '@/utils/interaction/select-event';
import { DataCell } from '@/cell/data-cell';
import {
  InteractionStateName,
  InterceptType,
  S2Event,
  TOOLTIP_OPERATOR_TREND_MENU,
} from '@/common/constant';
import {
  CellAppendInfo,
  TooltipData,
  TooltipOperatorOptions,
  ViewMeta,
} from '@/common/interface';
import { BaseEvent, BaseEventImplement } from '@/interaction/base-event';
import { getActiveHoverRowColCells } from '@/utils/interaction/hover-event';
import { ColCell } from '@/cell/col-cell';
import { RowCell } from '@/cell';

export class DataCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: CanvasEvent) => {
      event.stopPropagation();
      const { interaction, options } = this.spreadsheet;
      if (interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }

      interaction.clearHoverTimer();
      this.emitLinkFieldClickEvent(event);

      const cell: DataCell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();

      if (!meta) {
        return;
      }

      interaction.addIntercepts([InterceptType.HOVER]);
      if (interaction.isSelectedCell(cell)) {
        interaction.reset();
        return;
      }

      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.SELECTED,
      });
      this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, [cell]);
      this.showTooltip(event, meta);
      if (options.interaction.selectedCellHighlight) {
        this.updateRowColCells(meta);
      }
    });
  }

  public updateRowColCells(meta: ViewMeta) {
    const { rowId, colId } = meta;
    const { interaction } = this.spreadsheet;
    if (colId) {
      const allColHeaderCells = getActiveHoverRowColCells(
        colId,
        interaction.getAllColHeaderCells(),
      );
      forEach(allColHeaderCells, (cell: ColCell) => {
        cell.updateByState(InteractionStateName.SELECTED);
      });
    }

    if (rowId) {
      const allRowHeaderCells = getRowCellForSelectedCell(
        meta,
        this.spreadsheet,
      );
      forEach(allRowHeaderCells, (cell: RowCell) => {
        cell.updateByState(InteractionStateName.SELECTED);
      });
    }
  }

  private getTooltipOperator(
    event: CanvasEvent,
    meta: ViewMeta,
  ): TooltipOperatorOptions {
    const cell = this.spreadsheet.getCell(event.target);
    const { operation } = getTooltipOptions(this.spreadsheet, event);
    const trendMenu = operation.trend && {
      ...TOOLTIP_OPERATOR_TREND_MENU,
      onClick: () => {
        this.spreadsheet.emit(S2Event.DATA_CELL_TREND_ICON_CLICK, meta);
        this.spreadsheet.hideTooltip();
      },
    };

    return getTooltipVisibleOperator(operation, {
      defaultMenus: [trendMenu],
      cell,
    });
  }

  private showTooltip(event: CanvasEvent, meta: ViewMeta) {
    const {
      data,
      isTotals = false,
      value,
      fieldValue,
      field,
      valueField,
    } = meta;
    const currentCellMeta = data;
    const showSingleTips = this.spreadsheet.isTableMode();
    const cellData = showSingleTips
      ? {
          ...currentCellMeta,
          value: value || fieldValue,
          valueField: field || valueField,
        }
      : currentCellMeta;
    const cellInfos: TooltipData[] = [
      cellData || { ...meta.rowQuery, ...meta.colQuery },
    ];
    const operator = this.getTooltipOperator(event, meta);

    this.spreadsheet.showTooltipWithInfo(event, cellInfos, {
      isTotals,
      operator,
      enterable: true,
      hideSummary: true,
      showSingleTips,
    });
  }

  private emitLinkFieldClickEvent(event: CanvasEvent) {
    const appendInfo = get(
      event.target,
      'attrs.appendInfo',
      {},
    ) as CellAppendInfo<ViewMeta>;

    if (appendInfo.isRowHeaderText) {
      const { cellData } = appendInfo;
      const { valueField: key, data: record } = cellData;
      this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
        key,
        record,
      });
    }
  }
}
