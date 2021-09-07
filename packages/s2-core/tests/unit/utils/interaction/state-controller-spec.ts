import { RowCell } from '@/cell/row-cell';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { S2Options } from '@/common/interface';
import { Store } from '@/common/store';
import { RootInteraction } from '@/interaction/root';
import { SpreadSheet } from '@/sheet-type';
import { clearState, setState } from '@/utils/interaction/state-controller';

jest.mock('@/sheet-type');
jest.mock('@/interaction/event-controller');

const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;
describe('State Test', () => {
  const mockRowCell = {
    type: CellTypes.ROW_CELL,
    hideInteractionShape: jest.fn(),
    clearUnselectedState: jest.fn(),
  } as unknown as RowCell;

  let mockInstance: SpreadSheet;

  beforeEach(() => {
    MockSpreadSheet.mockClear();

    mockInstance = new MockSpreadSheet();
    mockInstance.options = { selectedCellsSpotlight: false } as S2Options;
    mockInstance.store = new Store();
    mockInstance.interaction = new RootInteraction(mockInstance);
  });
  test('should set select status correctly', () => {
    setState(
      {
        stateName: InteractionStateName.SELECTED,
        cells: [mockRowCell],
      },
      mockInstance,
    );
    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCell],
    });
  });

  test('should do nothing when state name is the same', () => {
    setState(
      {
        stateName: InteractionStateName.SELECTED,
        cells: [mockRowCell],
      },
      mockInstance,
    );

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCell],
    });

    mockInstance.interaction.setState({
      stateName: InteractionStateName.SELECTED,
      cells: [],
    });

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [mockRowCell],
    });
  });

  test('should clear existed state when call clearState function', () => {
    setState(
      {
        stateName: InteractionStateName.SELECTED,
        interactedCells: [mockRowCell],
      },
      mockInstance,
    );

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      stateName: InteractionStateName.SELECTED,
      interactedCells: [mockRowCell],
    });

    clearState(mockInstance);

    expect(mockInstance.store.get('interactionStateInfo')).toEqual({
      cells: [],
      force: false,
    });
  });
});
