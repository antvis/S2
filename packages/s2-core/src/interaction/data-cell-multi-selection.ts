import type { Event } from '@antv/g-canvas';
import { isEmpty, isNil } from 'lodash';
import type { DataCell } from '../cell';
import {
  InteractionStateName,
  InterceptType,
  S2Event,
  InteractionCellSelectedHighlightType,
} from '../common/constant';
import type { CellMeta, S2CellType, ViewMeta } from '../common/interface';
import {
  getCellMeta,
  isMultiSelectionKey,
  getHeaderCellMeta,
} from '../utils/interaction/select-event';
import { getCellsTooltipData } from '../utils/tooltip';
import type { Node } from '../facet/layout/node';
import { BaseEvent, type BaseEventImplement } from './base-interaction';

export class DataCellMultiSelection
  extends BaseEvent
  implements BaseEventImplement
{
  private isMultiSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindDataCellClick();
    this.bindKeyboardUp();
  }

  public reset() {
    this.isMultiSelection = false;
    this.spreadsheet.interaction.removeIntercepts([InterceptType.CLICK]);
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        if (isMultiSelectionKey(event)) {
          this.isMultiSelection = true;
          this.spreadsheet.interaction.addIntercepts([InterceptType.CLICK]);
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (isMultiSelectionKey(event)) {
        this.reset();
      }
    });
  }

  private getSelectedCells(cell: S2CellType<ViewMeta>) {
    const id = cell.getMeta().id;
    const { interaction } = this.spreadsheet;
    let selectedCells = interaction.getCells();
    let cells: CellMeta[] = [];
    if (interaction.getCurrentStateName() !== InteractionStateName.SELECTED) {
      selectedCells = [];
    }
    if (selectedCells.find((meta) => meta.id === id)) {
      cells = selectedCells.filter((item) => item.id !== id);
    } else {
      cells = [...selectedCells, getCellMeta(cell)];
    }

    return cells;
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      const cell: DataCell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();
      const { interaction } = this.spreadsheet;

      if (this.isMultiSelection && meta) {
        const selectedCells = this.getSelectedCells(cell);

        if (isEmpty(selectedCells)) {
          interaction.clearState();
          this.spreadsheet.hideTooltip();
          return;
        }

        interaction.addIntercepts([InterceptType.CLICK, InterceptType.HOVER]);
        this.spreadsheet.hideTooltip();
        let headerSelectedNode: Node[] = [];
        const { selectedCellHighlight } = this.spreadsheet.options.interaction;
        if (!isNil(selectedCellHighlight)) {
          const colNodes = this.spreadsheet.getColumnNodes();
          const rowNodes = this.spreadsheet.getRowNodes();
          const { ROW, CROSS, ONLY_HEADER } =
            InteractionCellSelectedHighlightType;
          if ([true, CROSS, ONLY_HEADER].includes(selectedCellHighlight)) {
            headerSelectedNode = [...colNodes, ...rowNodes];
          } else if (
            [ROW].includes(
              selectedCellHighlight as InteractionCellSelectedHighlightType,
            )
          ) {
            headerSelectedNode = [...rowNodes];
          }
        }
        headerSelectedNode = headerSelectedNode.filter((headerNode) =>
          selectedCells.find((selectedCell) =>
            selectedCell.id.includes(headerNode.id),
          ),
        );

        interaction.changeState({
          cells: selectedCells,
          headerCells: headerSelectedNode.map((_cell) =>
            getHeaderCellMeta(_cell.belongsCell),
          ),
          stateName: InteractionStateName.SELECTED,
        });
        this.spreadsheet.emit(
          S2Event.GLOBAL_SELECTED,
          interaction.getActiveCells(),
        );
        this.spreadsheet.showTooltipWithInfo(
          event,
          getCellsTooltipData(this.spreadsheet),
        );
      }
    });
  }
}
