import type { Event as CanvasEvent } from '@antv/g-canvas';
import { forEach } from 'lodash';
import type { DataCell } from '../../../cell/data-cell';
import type { RowCell } from '../../../cell/row-cell';
import {
  InteractionStateName,
  InterceptType,
  S2Event,
  getTooltipOperatorTrendMenu,
} from '../../../common/constant';
import type {
  TooltipData,
  TooltipOperatorOptions,
  ViewMeta,
} from '../../../common/interface';
import {
  getCellMeta,
  afterSelectDataCells,
  getRowCellForSelectedCell,
} from '../../../utils/interaction/select-event';
import {
  getTooltipOptions,
  getTooltipVisibleOperator,
} from '../../../utils/tooltip';
import { BaseEvent, type BaseEventImplement } from '../../base-event';
import { updateAllColHeaderCellState } from '../../../utils/interaction';

export class DataCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: CanvasEvent) => {
      event.stopPropagation();

      const { interaction } = this.spreadsheet;
      interaction.clearHoverTimer();

      if (interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }

      if (this.isLinkFieldText(event.target)) {
        this.emitLinkFieldClickEvent(event);
        return;
      }

      const cell: DataCell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();

      if (!meta) {
        return;
      }

      interaction.addIntercepts([InterceptType.HOVER]);

      if (interaction.isSelectedCell(cell)) {
        // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail，使用 detail属性来判断是否是双击，双击时不触发选择态reset
        if ((event.originalEvent as UIEvent)?.detail === 1) {
          interaction.reset();
        }
        return;
      }

      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.SELECTED,
        onUpdateCells: afterSelectDataCells,
      });
      this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, [cell]);
      this.showTooltip(event, meta);

      // 点击单元格，高亮对应的行头、列头
      const { rowId, colId, spreadsheet } = meta;
      const { colHeader, rowHeader } = interaction.getSelectedCellHighlight();
      if (colHeader) {
        updateAllColHeaderCellState(
          colId,
          interaction.getAllColHeaderCells(),
          InteractionStateName.SELECTED,
        );
      }
      if (rowHeader) {
        if (rowId) {
          const allRowHeaderCells = getRowCellForSelectedCell(
            meta,
            spreadsheet,
          );
          forEach(allRowHeaderCells, (cell: RowCell) => {
            cell.updateByState(InteractionStateName.SELECTED);
          });
        }
      }
    });
  }

  private getTooltipOperator(
    event: CanvasEvent,
    meta: ViewMeta,
  ): TooltipOperatorOptions {
    const TOOLTIP_OPERATOR_TREND_MENU = getTooltipOperatorTrendMenu();
    const cell = this.spreadsheet.getCell(event.target);
    const { operation } = getTooltipOptions(this.spreadsheet, event);
    const trendMenu = operation.trend && {
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
    const cellData: TooltipData = showSingleTips
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
    const { cellData } = this.getCellAppendInfo(event.target);
    const { valueField: key, data: record } = cellData;

    this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
      key,
      cellData,
      record: Object.assign({ rowIndex: cellData.rowIndex }, record),
    });
  }
}
