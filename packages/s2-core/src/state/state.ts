import { DataCell, ColCell, CornerCell, RowCell } from '../cell';
import { forEach, includes } from 'lodash';
import { SpreadSheet } from "src/sheet-type";

type S2AllCellType = DataCell | ColCell | CornerCell | RowCell;

export enum StateName {
  SELECTED = 'selected',
  HOVER = 'hover',
  HOVER_LINKAGE = 'hoverLinkage', // hover时，同列和同行有联动的十字选中效果
  KEEP_HOVER = 'keepHover',
  PREPARE_SELECT = 'prepareSelect',
  COL_SELECTED = 'colSelected',
  ROW_SELECTED = 'rowSelected',
}
export default class State {
  protected spreadsheet: SpreadSheet;

  // TODO: stateStore改为多例模式
  protected stateStore = {
    stateName: '',
    cells: [],
  };

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  // 设置state
  // 表格当前只能存在一种状态，当stateName与stateStore中的状态不一致时，要清空之前存储的状态
  public setState(cell: S2AllCellType, stateName: StateName | string) {
    if (stateName !== this.stateStore.stateName) {
      // 当stateName与stateStore中的状态不一致时
      this.clearState();
      this.spreadsheet.hideTooltip();
      this.stateStore = {
        stateName,
        cells: [cell],
      };
    } else {
      const currentStateCells = this.stateStore.cells;
      if (!includes(currentStateCells, cell)) {
        currentStateCells.push(cell);
      }
    }
  }

  public getCurrentState() {
    return this.stateStore;
  }

  public clearState() {
    if (this.stateStore.cells && this.stateStore.cells.length) {
      forEach(this.stateStore.cells, (cell: S2AllCellType) => {
        cell.hideShapeUnderState();
      });
    }
    this.stateStore = {
      stateName: '',
      cells: [],
    };
  }
}
