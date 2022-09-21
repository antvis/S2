import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import type { DataCell } from '../../../cell/data-cell';
import {
  InteractionStateName,
  InterceptType,
  S2Event,
  getTooltipOperatorTrendMenu,
} from '../../../common/constant';
import type {
  TooltipData,
  TooltipOperatorMenu,
  TooltipOperatorOptions,
  ViewMeta,
} from '../../../common/interface';
import {
  getCellMeta,
  updateRowColCells,
} from '../../../utils/interaction/select-event';
import {
  getTooltipOptions,
  getTooltipVisibleOperator,
} from '../../../utils/tooltip';
import { BaseEvent, type BaseEventImplement } from '../../base-event';

export class DataCellClick extends BaseEvent implements BaseEventImplement {
  private clickTimer: number;

  private clickCount = 0;

  public bindEvents() {
    this.bindDataCellClick();
  }

  // TODO: 抽公共逻辑
  private countClick() {
    window.clearTimeout(this.clickTimer);
    this.clickTimer = window.setTimeout(() => {
      this.clickCount = 0;
    }, 200);
    this.clickCount++;
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: CanvasEvent) => {
      this.countClick();

      event.stopPropagation();

      const { interaction, options } = this.spreadsheet;
      interaction.clearHoverTimer();

      if (interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }

      if (this.isLinkFieldText(event.target)) {
        this.emitLinkFieldClickEvent(event);
        return;
      }

      const cell = this.spreadsheet.getCell(event.target) as DataCell;
      const meta = cell.getMeta();

      if (!meta) {
        return;
      }

      interaction.addIntercepts([InterceptType.HOVER]);

      if (interaction.isSelectedCell(cell)) {
        // 双击时不触发选择态reset
        // g5.0 mouseup 底层监听的是 pointerup，detail为0，需自行判断是否双击
        if (this.clickCount <= 1) {
          interaction.reset();
        }
        return;
      }

      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.SELECTED,
      });
      this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, [cell]);
      this.showTooltip(event, meta);

      if (options.interaction!.selectedCellHighlight) {
        updateRowColCells(meta);
      }
    });
  }

  private getTooltipOperator(
    event: CanvasEvent,
    meta: ViewMeta,
  ): TooltipOperatorOptions {
    const TOOLTIP_OPERATOR_TREND_MENU = getTooltipOperatorTrendMenu();
    const cell = this.spreadsheet.getCell(event.target)!;
    const { operation } = getTooltipOptions(this.spreadsheet, event)!;
    const trendMenu: TooltipOperatorMenu = {
      ...TOOLTIP_OPERATOR_TREND_MENU,
      onClick: () => {
        this.spreadsheet.emit(S2Event.DATA_CELL_TREND_ICON_CLICK, {
          ...meta,
          // record 只有明细模式下存在
          record: this.spreadsheet.isTableMode()
            ? this.spreadsheet.dataSet.getCellData({
                query: { rowIndex: meta.rowIndex },
              })
            : undefined,
        });
        this.spreadsheet.hideTooltip();
      },
    };

    return getTooltipVisibleOperator(operation!, {
      defaultMenus: operation?.trend ? [trendMenu] : [],
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
      ? ({
          ...currentCellMeta,
          value: value || fieldValue,
          valueField: field || valueField,
        } as TooltipData)
      : (currentCellMeta as TooltipData);
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
    const { cellData } = this.getCellAppendInfo(event.target);
    const { valueField: key, data: record } = cellData!;

    this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
      key,
      record: Object.assign({ rowIndex: cellData!.rowIndex }, record),
    });
  }
}
