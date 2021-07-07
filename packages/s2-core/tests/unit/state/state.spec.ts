import { RowCell } from '@/cell/row-cell';
import { SelectedStateName } from '@/common/constant/interatcion';
import { SpreadSheet } from '@/sheet-type';
import { State } from '@/state/state';

jest.mock('@/sheet-type');
jest.mock('@/cell/row-cell');
const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;
const MockRowCell = RowCell as any as jest.Mock<RowCell>;
describe('State Test', () => {
  let state: State;
  let mockInstance;
  let mockRowCellInstance;

  beforeEach(() => {
    MockSpreadSheet.mockClear();
    MockRowCell.mockClear();

    mockInstance = new MockSpreadSheet();
    mockRowCellInstance = new MockRowCell();

    state = new State(mockInstance);
  });
  test('should set select status correctly', () => {
    expect(state.getCurrentState()).toEqual({
      stateName: '',
      cells: [],
    });

    state.setState(mockRowCellInstance, SelectedStateName.ROW_SELECTED);

    expect(state.getCurrentState()).toEqual({
      stateName: SelectedStateName.ROW_SELECTED,
      cells: [mockRowCellInstance],
    });
  });

  test("should push row cell in current state when state doestn't include it", () => {
    state.setState(mockRowCellInstance, SelectedStateName.ROW_SELECTED);

    expect(state.getCurrentState()).toEqual({
      stateName: SelectedStateName.ROW_SELECTED,
      cells: [mockRowCellInstance],
    });

    const other = new MockRowCell();
    state.setState(other, SelectedStateName.ROW_SELECTED);

    expect(state.getCurrentState()).toEqual({
      stateName: SelectedStateName.ROW_SELECTED,
      cells: [mockRowCellInstance, other],
    });
  });

  test('should do nothing when state includes it', () => {
    state.setState(mockRowCellInstance, SelectedStateName.ROW_SELECTED);

    expect(state.getCurrentState()).toEqual({
      stateName: SelectedStateName.ROW_SELECTED,
      cells: [mockRowCellInstance],
    });

    state.setState(mockRowCellInstance, SelectedStateName.ROW_SELECTED);

    expect(state.getCurrentState()).toEqual({
      stateName: SelectedStateName.ROW_SELECTED,
      cells: [mockRowCellInstance],
    });
  });

  test('should clear existed state when call clearState function', () => {
    state.setState(mockRowCellInstance, SelectedStateName.ROW_SELECTED);

    expect(state.getCurrentState()).toEqual({
      stateName: SelectedStateName.ROW_SELECTED,
      cells: [mockRowCellInstance],
    });

    state.clearState();

    expect(state.getCurrentState()).toEqual({
      stateName: '',
      cells: [],
    });
  });
});
