import { Event as CanvasEvent } from '@antv/g-canvas';
import { get } from 'lodash';
import {
  getTooltipOptions,
  getTooltipVisibleOperator,
} from '../../../utils/tooltip';
import { getCellMeta } from '@/utils/interaction/select-event';
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

export class DataCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: CanvasEvent) => {
      event.stopPropagation();
      const { interaction } = this.spreadsheet;
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

      interaction.clearState();
      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.SELECTED,
      });
      this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, [cell]);
      this.showTooltip(event, meta);
    });
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
