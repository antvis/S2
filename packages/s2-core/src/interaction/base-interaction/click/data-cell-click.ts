import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import type { DataCell } from '../../../cell/data-cell';
import {
  InteractionName,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '../../../common/constant';
import type {
  TooltipData,
  TooltipOperatorOptions,
  ViewMeta,
  ViewMetaData,
} from '../../../common/interface';
import {
  afterSelectDataCells,
  getCellMeta,
} from '../../../utils/interaction/select-event';
import {
  getTooltipOptions,
  getTooltipVisibleOperator,
} from '../../../utils/tooltip';
import { BaseEvent, type BaseEventImplement } from '../../base-event';

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

      const cell = this.spreadsheet.getCell<DataCell>(event.target)!;
      const meta = cell.getMeta();

      if (!meta) {
        return;
      }

      interaction.addIntercepts([InterceptType.HOVER]);

      if (interaction.isSelectedCell(cell)) {
        // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail，使用 detail 属性来判断是否是双击，双击时不触发选择态 reset
        if (
          event.detail === 1 ||
          event.nativeEvent?.detail === 1 ||
          event.originalEvent?.detail === 1
        ) {
          interaction.reset();

          // https://github.com/antvis/S2/issues/2447
          interaction.emitSelectEvent({
            targetCell: cell,
            interactionName: InteractionName.DATA_CELL_CLICK,
          });
        }

        return;
      }

      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.SELECTED,
        onUpdateCells: afterSelectDataCells,
      });
      interaction.emitSelectEvent({
        targetCell: cell,
        interactionName: InteractionName.DATA_CELL_CLICK,
        cells: [cell],
      });
      this.showTooltip(event, meta);

      // 点击单元格，高亮对应的行头、列头
      interaction.updateDataCellRelevantHeaderCells(
        InteractionStateName.SELECTED,
        meta,
      );
      this.spreadsheet.emit(S2Event.DATA_CELL_CLICK_TRIGGERED_PRIVATE, cell);
    });
  }

  private getTooltipOperator(event: CanvasEvent): TooltipOperatorOptions {
    const cell = this.spreadsheet.getCell(event.target)!;
    const { operation } = getTooltipOptions(this.spreadsheet, event)!;

    return getTooltipVisibleOperator(operation!, {
      defaultMenus: [],
      cell,
    });
  }

  private showTooltip(event: CanvasEvent, meta: ViewMeta) {
    const { data, isTotals = false, fieldValue, valueField } = meta;
    const onlyShowCellText = this.spreadsheet.isTableMode();
    const cellData = onlyShowCellText
      ? ({
          ...(data as ViewMetaData),
          value: fieldValue,
          valueField,
        } as unknown as TooltipData)
      : (data as TooltipData);
    const cellInfos: TooltipData[] = [
      cellData || { ...meta.rowQuery, ...meta.colQuery },
    ];
    const operator = this.getTooltipOperator(event);

    this.spreadsheet.showTooltipWithInfo(event, cellInfos, {
      isTotals,
      operator,
      hideSummary: true,
      onlyShowCellText,
    });
  }

  private emitLinkFieldClickEvent(event: CanvasEvent) {
    const { meta } = this.getCellAppendInfo(event.target);
    const { valueField: field, data: record } = meta!;

    this.spreadsheet.emit(S2Event.GLOBAL_LINK_FIELD_JUMP, {
      meta: meta!,
      field,
      record: Object.assign({ rowIndex: meta?.rowIndex }, record),
    });
  }
}
