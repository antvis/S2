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
    const { id, colIndex, rowIndex } = mockRowCell.getMeta();
    const meta = {
      id,
      colIndex,
      rowIndex,
      type: mockRowCell.cellType,
    };

    setState(mockInstance, {
      stateName: InteractionStateName.SELECTED,
      selectedCells: [
        {
          ...meta,
        },
      ],
    });
    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      cellIds: [
        {
          ...meta,
        },
      ],
    });
  });

  test('should do nothing when state name is the same', () => {
    const { id, colIndex, rowIndex } = mockRowCell.getMeta();
    const meta = {
      id,
      colIndex,
      rowIndex,
      type: mockRowCell.cellType,
    };
    setState(mockInstance, {
      stateName: InteractionStateName.SELECTED,
      selectedCells: [],
    });

    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      selectedCells: [
        {
          ...meta,
        },
      ],
    });

    mockInstance.interaction.setState({
      stateName: InteractionStateName.SELECTED,
      selectedCells: [],
    });

    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      selectedCells: [
        {
          ...meta,
        },
      ],
    });
  });

  test('should clear existed state when call clearState function', () => {
    setState(mockInstance, {
      stateName: InteractionStateName.SELECTED,
      interactedCells: [mockRowCell],
    });

    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      interactedCells: [mockRowCell],
    });

    clearState(mockInstance);

    expect(mockInstance.interaction.getState()).toEqual({
      cells: [],
      force: false,
    });
  });
});
