import { DataCell, ColCell, CornerCell, RowCell } from "../cell";
import BaseSpreadSheet  from '../sheet-type/base-spread-sheet';
import _ from 'lodash';

type S2AllCellType = DataCell | ColCell | CornerCell | RowCell;

export default class State {
  protected spreadsheet: BaseSpreadSheet;
  protected stateStore = {
    stateName: '',
    cells: [],
  };

  constructor(spreadsheet: BaseSpreadSheet) {
    this.spreadsheet = spreadsheet;
  }
  // 设置state
  // 表格当前只能存在一种状态，当stateName与stateStore中的状态不一致时，要清空之前存储的状态
  public setState(cell: S2AllCellType, stateName: string) {
    if(stateName !== this.stateStore.stateName) {
      // 当stateName与stateStore中的状态不一致时
      this.stateStore = {
        stateName,
        cells: [cell]
      }
    } else {
      const currentStateCells = this.stateStore.cells;
      if(currentStateCells.indexOf(cell) === -1) {
        currentStateCells.push(cell)
      }
    }
  }

  public getCurrentState() {
    return this.stateStore;
  }

  public clearState() {
    _.forEach(this.stateStore.cells, cell => cell.setFillOpacity(cell.interactiveBgShape, 0));
    this.stateStore = {
      stateName: '',
      cells: [],
    }
  }
}