import type { Event as CanvasEvent } from '@antv/g-canvas';
import { forEach, isBoolean, isEmpty } from 'lodash';
import type { RowCell } from '../../cell';
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
    this.bindCornerCellHover();
    this.bindDataCellHover();
    this.bindRowCellHover();
    this.bindColCellHover();
  }

  public updateRowColCells(meta: ViewMeta) {
    const { rowId, colId } = meta;
    const { interaction } = this.spreadsheet;

    const { rowHeader, colHeader } = interaction.getHoverHighlight();

    if (colHeader) {
      updateAllColHeaderCellState(
        colId,
        interaction.getAllColHeaderCells(),
        InteractionStateName.HOVER,
      );
    }

    if (rowHeader && rowId) {
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
    const { hoverFocus } = interactionOptions;

    interaction.clearHoverTimer();

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
      const { rowHeader, colHeader } = interaction.getHoverHighlight();
      if (rowHeader || colHeader) {
        // highlight all the row and column cells which the cell belongs to
        this.updateRowColCells(meta);
      }
      const data = this.getCellData(meta, showSingleTips);
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

  private showEllipsisTooltip(event: CanvasEvent, cell: S2CellType) {
    if (!cell || !cell.isTextOverflowing()) {
      return;
    }

    const meta = cell.getMeta() as ViewMeta;
    const showSingleTips = true;
    const options: TooltipOptions = {
      isTotals: meta.isTotals,
      enterable: true,
      hideSummary: true,
      showSingleTips,
      enableFormat: true,
    };
    const data = this.getCellData(meta, showSingleTips);
    this.spreadsheet.showTooltipWithInfo(event, data, options);
  }

  private getCellData(
    meta: ViewMeta = {} as ViewMeta,
    showSingleTips?: boolean,
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

    const cellInfos = showSingleTips
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
      this.showEllipsisTooltip(event, cell);

      const { rowHeader, colHeader } = interaction.getHoverHighlight();
      if (rowHeader || colHeader) {
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

  public bindCornerCellHover() {
    this.spreadsheet.on(S2Event.CORNER_CELL_HOVER, (event: CanvasEvent) => {
      this.handleHeaderHover(event);
    });
  }
}
