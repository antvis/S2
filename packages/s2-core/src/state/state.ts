import { SpreadSheet } from 'src/sheet-type';
import { forEach, includes, isEmpty } from 'lodash';
import { S2CellType, SelectedState } from 'src/common/interface/interaction';
import { InteractionStateName } from '@/common/constant/interaction';

export class State {
  protected spreadsheet: SpreadSheet;

  // TODO: stateStore改为多例模式
  protected stateStore: SelectedState;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  // 设置state
  // 表格当前只能存在一种状态，当stateName与stateStore中的状态不一致时，要清空之前存储的状态
  public setState(cell: S2CellType, stateName: InteractionStateName) {
    if (stateName !== this.stateStore?.stateName) {
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
    if (!isEmpty(this.stateStore?.cells)) {
      forEach(this.stateStore.cells, (cell: S2CellType) => {
        cell.hideShapeUnderState();
      });
    }
    this.stateStore = {};
  }
}
