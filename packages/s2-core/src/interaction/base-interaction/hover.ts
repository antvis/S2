import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { isBoolean, isEmpty } from 'lodash';
import { S2Event } from '../../common/constant';
import {
  HOVER_FOCUS_DURATION,
  InteractionStateName,
  InterceptType,
} from '../../common/constant/interaction';
import type {
  S2CellType,
  TooltipData,
  TooltipOptions,
  ViewMeta,
} from '../../common/interface';
import type { Node } from '../../facet/layout/node';
import { getCellMeta } from '../../utils/interaction/select-event';
import { BaseEvent, type BaseEventImplement } from '../base-event';

/**
 * @description Hover event for data cells, row cells and col cells
 */
export class HoverEvent extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellHover();
    this.bindHeaderCellHover();
  }

  /**
   * @description change the data cell state from hover to hover focus
   * @param cell
   * @param event
   * @param meta
   */
  private changeStateToHoverFocus(cell: S2CellType, event: CanvasEvent) {
    if (!cell) {
      return;
    }

    const meta = cell.getMeta() as ViewMeta;
    const { interaction } = this.spreadsheet;
    const { interaction: interactionOptions } = this.spreadsheet.options;
    const { hoverFocus } = interactionOptions!;

    interaction.clearHoverTimer();

    const handleHoverFocus = () => {
      if (interaction.hasIntercepts([InterceptType.HOVER])) {
        return;
      }

      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.HOVER_FOCUS,
      });
      const onlyShowCellText = this.spreadsheet.isTableMode();
      const options: TooltipOptions = {
        isTotals: meta.isTotals,
        hideSummary: true,
        onlyShowCellText,
      };

      if (interactionOptions?.hoverHighlight) {
        interaction.updateDataCellRelevantHeaderCells(
          InteractionStateName.HOVER,
          meta,
        );
      }

      const data = this.getCellData(meta, onlyShowCellText);

      this.spreadsheet.showTooltipWithInfo(event, data, options);
    };

    const hoverFocusDuration = !isBoolean(hoverFocus)
      ? hoverFocus?.duration ?? HOVER_FOCUS_DURATION
      : HOVER_FOCUS_DURATION;

    if (hoverFocusDuration === 0) {
      handleHoverFocus();
    } else {
      const hoverTimer: number = window.setTimeout(
        () => handleHoverFocus(),
        hoverFocusDuration,
      );

      interaction.setHoverTimer(hoverTimer);
    }
  }

  /**
   * @description handle the row or column header hover state
   * @param event
   */
  private handleHeaderHover(event: CanvasEvent) {
    const cell = this.spreadsheet.getCell(event.target) as S2CellType;

    if (isEmpty(cell)) {
      return;
    }

    const { interaction } = this.spreadsheet;

    interaction.clearHoverTimer();

    // 避免在同一单元格内鼠标移动造成的多次渲染
    if (interaction.isActiveCell(cell)) {
      return;
    }

    interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.HOVER,
    });

    cell.update();
    this.showEllipsisTooltip(event, cell);
  }

  private showEllipsisTooltip(event: CanvasEvent, cell: S2CellType | null) {
    if (!cell || !cell.isTextOverflowing()) {
      this.spreadsheet.hideTooltip();

      return;
    }

    const meta = cell.getMeta() as ViewMeta;
    const options: TooltipOptions = {
      isTotals: meta.isTotals,
      hideSummary: true,
      onlyShowCellText: true,
      enableFormat: true,
    };
    const data = this.getCellData(meta, options.onlyShowCellText);

    this.spreadsheet.showTooltipWithInfo(event, data, options);
  }

  private getCellData(
    meta: ViewMeta | Node = {} as ViewMeta,
    onlyShowCellText?: boolean,
  ): TooltipData[] {
    const {
      data,
      query,
      value,
      field,
      fieldValue,
      valueField,
      rowQuery,
      colQuery,
    } = meta;
    const currentCellMeta = data;

    const cellInfos = onlyShowCellText
      ? [
          {
            ...query,
            value: value || fieldValue,
            valueField: field || valueField,
          },
        ]
      : [currentCellMeta || { ...rowQuery, ...colQuery }];

    return cellInfos as TooltipData[];
  }

  public bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: CanvasEvent) => {
      // FIXME: 趋势分析表 hover 的时候拿到的 event target 是错误的
      const cell = this.spreadsheet.getCell(event.target);

      if (isEmpty(cell)) {
        return;
      }

      const { interaction, options } = this.spreadsheet;
      const { interaction: interactionOptions } = options;
      const meta = cell?.getMeta() as ViewMeta;

      // 避免在同一单元格内鼠标移动造成的多次渲染
      if (interaction.isActiveCell(cell)) {
        return;
      }

      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.HOVER,
      });

      if (interactionOptions?.hoverHighlight) {
        interaction.updateDataCellRelevantHeaderCells(
          InteractionStateName.HOVER,
          meta,
        );
      }

      if (interactionOptions?.hoverFocus) {
        this.changeStateToHoverFocus(cell, event);
      }
    });
  }

  public bindHeaderCellHover() {
    [
      S2Event.ROW_CELL_HOVER,
      S2Event.COL_CELL_HOVER,
      S2Event.CORNER_CELL_HOVER,
    ].forEach((eventName) => {
      this.spreadsheet.on(eventName, (event: CanvasEvent) => {
        this.handleHeaderHover(event);
      });
    });
  }
}
