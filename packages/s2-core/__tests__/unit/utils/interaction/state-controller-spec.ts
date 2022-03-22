import { getCellMeta } from 'src/utils/interaction/select-event';
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

describe('State Controller Utils Tests', () => {
  const mockRowCell = {
    type: CellTypes.ROW_CELL,
    hideInteractionShape: jest.fn(),
    clearUnselectedState: jest.fn(),
    cellType: CellTypes.ROW_CELL,
    getMeta: () => {
      return {
        colIndex: 0,
        rowIndex: 0,
        id: `root[&]price`,
      };
    },
  } as unknown as RowCell;

  let mockInstance: SpreadSheet;

  beforeEach(() => {
    MockSpreadSheet.mockClear();

    mockInstance = new MockSpreadSheet();
    mockInstance.options = {
      interaction: { selectedCellsSpotlight: false },
    } as S2Options;
    mockInstance.store = new Store();
    mockInstance.isTableMode = jest.fn();
    mockInstance.interaction = new RootInteraction(mockInstance);
  });

  test('should set select status correctly', () => {
    setState(mockInstance, {
      stateName: InteractionStateName.SELECTED,
      cells: [getCellMeta(mockRowCell)],
    });
    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [getCellMeta(mockRowCell)],
    });
  });

  test('should do nothing when state name is the same', () => {
    setState(mockInstance, {
      stateName: InteractionStateName.SELECTED,
      cells: [getCellMeta(mockRowCell)],
    });

    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [getCellMeta(mockRowCell)],
    });

    mockInstance.interaction.setState({
      stateName: InteractionStateName.SELECTED,
      cells: [],
    });

    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      cells: [getCellMeta(mockRowCell)],
    });
  });

  test('should clear existed state when call clearState function', () => {
    setState(mockInstance, {
      stateName: InteractionStateName.SELECTED,
      interactedCells: [mockRowCell],
      cells: [getCellMeta(mockRowCell)],
    });

    expect(mockInstance.interaction.getState()).toEqual({
      stateName: InteractionStateName.SELECTED,
      interactedCells: [mockRowCell],
      cells: [getCellMeta(mockRowCell)],
    });

    clearState(mockInstance);

    expect(mockInstance.interaction.getState()).toEqual({
      cells: [],
      force: false,
    });
  });
});
