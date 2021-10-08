import { Event as CanvasEvent } from '@antv/g-canvas';
import { get } from 'lodash';
import { getCellMeta } from '@/utils/interaction/select-event';
import { DataCell } from '@/cell/data-cell';
import {
  InteractionStateName,
  TOOLTIP_OPERATOR_MENUS,
  InterceptType,
  S2Event,
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
      if (this.interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }

      this.emitLinkFieldClickEvent(event);

      const cell: DataCell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();

      if (!meta) {
        return;
      }

      this.interaction.addIntercepts([InterceptType.HOVER]);
      if (this.interaction.isSelectedCell(cell)) {
        this.interaction.reset();
        return;
      }

      this.interaction.clearState();
      this.interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.SELECTED,
      });
      this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, [cell]);
      this.showTooltip(event, meta);
    });
  }

  private getTooltipOperator(meta: ViewMeta): TooltipOperatorOptions {
    const cellOperator = this.spreadsheet.options
      ?.cellOperator as TooltipOperatorOptions;

    if (cellOperator) {
      return cellOperator;
    }

    const operator: TooltipOperatorOptions = this.spreadsheet.options.tooltip
      .operation.trend && {
      onClick: () => {
        this.spreadsheet.emit(S2Event.DATA_CELL_TREND_ICON_CLICK, meta);
        this.spreadsheet.hideTooltip();
      },
      menus: TOOLTIP_OPERATOR_MENUS.Trend,
    };

    return operator;
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
    const operator = this.getTooltipOperator(meta);

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
