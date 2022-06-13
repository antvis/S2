import type { Event as CanvasEvent } from '@antv/g-canvas';
import { forEach, isBoolean, isEmpty } from 'lodash';
import type { ColCell, RowCell } from '../../cell';
import { S2Event } from '../../common/constant';
import {
  HOVER_FOCUS_DURATION,
  InteractionStateName,
  InterceptType,
} from '../../common/constant/interaction';
import type {
  S2CellType,
  TooltipOptions,
  ViewMeta,
} from '../../common/interface';
import {
  getActiveHoverRowColCells,
  updateAllColHeaderCellState,
} from '../../utils/interaction/hover-event';
import { getCellMeta } from '../../utils/interaction/select-event';
import { BaseEvent, type BaseEventImplement } from '../base-event';

/**
 * @description Hover event for data cells, row cells and col cells
 */
export class HoverEvent extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellHover();
    this.bindRowCellHover();
    this.bindColCellHover();
  }

  public updateRowColCells(meta: ViewMeta) {
    const { rowId, colId } = meta;
    const { interaction } = this.spreadsheet;
    updateAllColHeaderCellState(
      colId,
      interaction.getAllColHeaderCells(),
      InteractionStateName.HOVER,
    );

    if (rowId) {
      // update rowHeader cells
      const allRowHeaderCells = getActiveHoverRowColCells(
        rowId,
        interaction.getAllRowHeaderCells(),
        this.spreadsheet.isHierarchyTreeType(),
      );
      forEach(allRowHeaderCells, (cell: RowCell) => {
        cell.updateByState(InteractionStateName.HOVER);
      });
    }
  }

  /**
   * @description change the data cell state from hover to hover focus
   * @param cell
   * @param event
   * @param meta
   */
  private changeStateToHoverFocus(
    cell: S2CellType,
    event: CanvasEvent,
    meta: ViewMeta,
  ) {
    const { interaction } = this.spreadsheet;
    const { interaction: interactionOptions } = this.spreadsheet.options;
    interaction.clearHoverTimer();
    const { hoverFocus } = interactionOptions;

    const handleHoverFocus = () => {
      if (interaction.hasIntercepts([InterceptType.HOVER])) {
        return;
      }
      interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.HOVER_FOCUS,
      });
      const showSingleTips = this.spreadsheet.isTableMode();
      const options: TooltipOptions = {
        isTotals: meta.isTotals,
        enterable: true,
        hideSummary: true,
        showSingleTips,
      };
      if (interactionOptions.hoverHighlight) {
        // highlight all the row and column cells which the cell belongs to
        this.updateRowColCells(meta);
      }
      const data = this.getCellInfo(meta, showSingleTips);
      this.spreadsheet.showTooltipWithInfo(event, data, options);
    };
    let hoverFocusDuration = HOVER_FOCUS_DURATION;
    if (!isBoolean(hoverFocus)) {
      hoverFocusDuration = hoverFocus?.duration ?? HOVER_FOCUS_DURATION;
    }

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

    const meta = cell.getMeta() as ViewMeta;
    // 避免在同一单元格内鼠标移动造成的多次渲染
    if (interaction.isActiveCell(cell)) {
      return;
    }

    interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.HOVER,
    });
    cell.update();

    if (cell.getActualText() !== cell.getFieldValue()) {
      const showSingleTips = true;
      const options: TooltipOptions = {
        isTotals: meta.isTotals,
        enterable: true,
        hideSummary: true,
        showSingleTips,
        enableFormat: this.spreadsheet.isPivotMode(),
      };
      const data = this.getCellInfo(meta, showSingleTips);
      this.spreadsheet.showTooltipWithInfo(event, data, options);
    }
  }

  private getCellInfo(
    meta: ViewMeta = {} as ViewMeta,
    showSingleTips?: boolean,
  ) {
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

    const cellInfos = showSingleTips
      ? [
          {
            ...query,
            value: value || fieldValue,
            valueField: field || valueField,
          },
        ]
      : [currentCellMeta || { ...rowQuery, ...colQuery }];

    return cellInfos;
  }

  public bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: CanvasEvent) => {
      const cell = this.spreadsheet.getCell(event.target) as S2CellType;
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

      if (interactionOptions.hoverHighlight) {
        // highlight all the row and column cells which the cell belongs to
        this.updateRowColCells(meta);
      }
      if (interactionOptions.hoverFocus) {
        this.changeStateToHoverFocus(cell, event, meta);
      }
    });
  }

  public bindRowCellHover() {
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (event: CanvasEvent) => {
      this.handleHeaderHover(event);
    });
  }

  public bindColCellHover() {
    this.spreadsheet.on(S2Event.COL_CELL_HOVER, (event: CanvasEvent) => {
      this.handleHeaderHover(event);
    });
  }
}
