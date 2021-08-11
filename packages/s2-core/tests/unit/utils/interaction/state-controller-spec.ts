import { RowCell } from '@/cell/row-cell';
import { InteractionStateName } from '@/common/constant/interaction';
import { SpreadSheet } from '@/sheet-type';
import { Store } from '@/common/store';
import { setState, clearState } from '@/utils/interaction/state-controller';

jest.mock('@/sheet-type');
jest.mock('@/cell/row-cell');
const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;
const MockRowCell = RowCell as any as jest.Mock<RowCell>;
describe('State Test', () => {
  let mockInstance: SpreadSheet;
  let mockRowCellInstance: RowCell;

  beforeEach(() => {
    MockSpreadSheet.mockClear();
    MockRowCell.mockClear();

    mockInstance = new MockSpreadSheet();
    mockInstance.store = new Store();
    mockRowCellInstance = new MockRowCell();
  });
  test('should set select status correctly', () => {
    setState(mockRowCellInstance, InteractionStateName.SELECTED, mockInstance);
    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance],
    });
  });

  test("should push row cell in current interaction state when state doesn't include it", () => {
    setState(mockRowCellInstance, InteractionStateName.SELECTED, mockInstance);

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance],
    });

    const other = new MockRowCell();
    setState(other, InteractionStateName.SELECTED, mockInstance);

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance, other],
    });
  });

  test('should do nothing when state includes it', () => {
    setState(mockRowCellInstance, InteractionStateName.SELECTED, mockInstance);

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance],
    });

    mockInstance.setState(mockRowCellInstance, InteractionStateName.SELECTED);

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance],
    });
  });

  test('should clear existed state when call clearState function', () => {
    setState(mockRowCellInstance, InteractionStateName.SELECTED, mockInstance);

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCellInstance],
    });

    clearState(mockInstance);

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({});
  });
});
