import { SpreadSheet } from '@/sheet-type';
import { Store } from '@/common/store';
import {
  getActiveCellsInfo,
  getRectangleEdges,
  unique,
  getNextEdge,
  getPolygonPoints,
} from '@/utils';
import { RootInteraction } from '@/interaction/root';
import { S2CellType } from '@/common/interface';

jest.mock('@/sheet-type');

describe('Merge Cells Test', () => {
  const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;
  let mockInstance: SpreadSheet;
  let mockOneCellEdges = [];
  let mockTwoCellEdges = [];
  beforeEach(() => {
    mockInstance = new MockSpreadSheet();
    mockInstance.store = new Store();
    mockInstance.interaction = {} as unknown as RootInteraction;
    mockOneCellEdges = [
      [
        [1, 1],
        [3, 1],
      ],
      [
        [3, 1],
        [3, 3],
      ],
      [
        [3, 3],
        [1, 3],
      ],
      [
        [1, 3],
        [1, 1],
      ],
    ];
    mockTwoCellEdges = [
      [
        [3, 1],
        [5, 1],
      ],
      [
        [5, 1],
        [5, 3],
      ],
      [
        [5, 3],
        [3, 3],
      ],
      [
        [3, 3],
        [3, 1],
      ],
    ];
  });

  test('should get none active cells info', () => {
    mockInstance.interaction.getActiveCells = jest.fn().mockReturnValue([]);
    expect(getActiveCellsInfo(mockInstance)).toEqual([]);
  });
  test('should get one active cells info', () => {
    const cellInfo = {
      colIndex: 1,
      rowIndex: 1,
    };
    const mockActiveCells = {
      getMeta: () => {
        return cellInfo;
      },
    };
    mockInstance.interaction.getActiveCells = jest
      .fn()
      .mockReturnValue([mockActiveCells]);
    expect(getActiveCellsInfo(mockInstance)).toEqual([cellInfo]);
  });
  test('should get rectangle edges', () => {
    const mockParams = {
      x: 1,
      y: 1,
      width: 2,
      height: 2,
    };
    const { x, y, width, height } = mockParams;
    expect(getRectangleEdges(x, y, width, height)).toEqual(mockOneCellEdges);
  });

  test('should get the edges without overlapping edges', () => {
    const allEdges = [...mockOneCellEdges, ...mockTwoCellEdges];
    const uniqueEdges = unique(allEdges);
    mockOneCellEdges.splice(1, 1);
    mockTwoCellEdges.pop();
    expect(JSON.stringify(uniqueEdges)).toEqual(
      JSON.stringify([...mockOneCellEdges, ...mockTwoCellEdges]),
    );
  });

  test('should get net edge', () => {
    const curEdge = [
      [3, 1],
      [3, 3],
    ];
    expect(getNextEdge(curEdge, mockOneCellEdges)).toEqual([
      [3, 3],
      [1, 3],
    ]);
  });
  test('should get all the points of the polygon', () => {
    const mockResult = [
      [1, 1],
      [3, 1],
      [3, 1],
      [5, 1],
      [5, 1],
      [5, 3],
      [5, 3],
      [3, 3],
      [3, 3],
      [1, 3],
      [1, 3],
      [1, 1],
    ];
    const mockCells = [
      { getMeta: () => ({ x: 1, y: 1, width: 2, height: 2 }) },
      { getMeta: () => ({ x: 3, y: 1, width: 2, height: 2 }) },
    ];

    expect(getPolygonPoints(mockCells as unknown as S2CellType[])).toEqual(
      mockResult,
    );
  });
});
