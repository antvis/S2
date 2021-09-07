import { RowCell } from '@/cell/row-cell';
import { InteractionStateName } from '@/common/constant/interaction';
import { SpreadSheet } from '@/sheet-type';
import { Store } from '@/common/store';
import { setState, clearState } from '@/utils/interaction/state-controller';
import { InteractionStateInfo } from '@/index';

jest.mock('@/sheet-type');
jest.mock('@/cell/row-cell');

const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;
const MockRowCell = RowCell as unknown as jest.Mock<RowCell>;

describe('State Test', () => {
  let mockInstance: SpreadSheet;
  let mockRowCellInstance: RowCell;
  let cellState: InteractionStateInfo;

  beforeEach(() => {
    MockSpreadSheet.mockClear();
    MockRowCell.mockClear();

    mockInstance = new MockSpreadSheet();
    mockInstance.store = new Store();
    mockRowCellInstance = new MockRowCell();
    cellState = {
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance],
    };
  });
  test('should set select status correctly', () => {
    setState(mockInstance, cellState);
    expect(mockInstance.interaction.getState()).toEqual(cellState);
  });

  test("should push row cell in current interaction state when state doesn't include it", () => {
    setState(mockInstance, cellState);

    expect(mockInstance.interaction.getState()).toEqual(cellState);

    const other = new MockRowCell();
    setState(mockInstance, cellState);

    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance, other],
    });
  });

  test('should do nothing when state includes it', () => {
    setState(mockInstance, cellState);

    expect(mockInstance.interaction.getState()).toEqual(cellState);

    mockInstance.interaction.setState(cellState);

    expect(mockInstance.interaction.getState()).toEqual(cellState);
  });

  test('should clear existed state when call clearState function', () => {
    setState(mockInstance, cellState);

    expect(mockInstance.interaction.getState()).toEqual(cellState);

    clearState(mockInstance);

    expect(mockInstance.interaction.getState()).toEqual({});
  });
});
