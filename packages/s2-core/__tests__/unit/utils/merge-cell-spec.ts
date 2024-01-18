import type { Group } from '@antv/g';
import type { DataCellCallback } from '@/common/interface/basic';
import { SpreadSheet } from '@/sheet-type';
import { Store } from '@/common/store';
import {
  getActiveCellsInfo,
  getRectangleEdges,
  unique,
  getNextEdge,
  getPolygonPoints,
  getInvisibleInfo,
  getVisibleInfo,
  getTempMergedCell,
  removeUnmergedCellsInfo,
  updateMergedCells,
  mergeTempMergedCell,
  MergedCellConvertTempMergedCells,
  differenceTempMergedCells,
} from '@/utils';
import type { RootInteraction } from '@/interaction/root';
import type {
  MergedCellInfo,
  TempMergedCell,
  ViewMeta,
} from '@/common/interface';
import type { BaseFacet } from '@/facet';
import type { DataCell, MergedCell } from '@/cell';

jest.mock('@/sheet-type');

describe('Merge Cells Test', () => {
  const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;
  let mockInstance: SpreadSheet;
  let mockOneCellEdges: [number, number][][] = [];
  let mockTwoCellEdges: [number, number][][] = [];
  let mockMergeCellInfo: MergedCellInfo[] = [];
  let mockAllVisibleCells: DataCell[] = [];

  beforeEach(() => {
    mockInstance = new MockSpreadSheet();
    mockInstance.store = new Store();
    mockInstance.interaction = {
      getPanelGroupAllDataCells() {
        return mockAllVisibleCells;
      },
    } as unknown as RootInteraction;
    mockInstance.facet = {
      cfg: {
        dataCell: jest.fn(),
      },
      getCellMeta: jest.fn(),
      getDataCells: jest.fn(() => mockAllVisibleCells),
    } as unknown as BaseFacet;

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
    mockMergeCellInfo = [
      {
        colIndex: 1,
        rowIndex: 0,
      },
      {
        colIndex: 3,
        rowIndex: 1,
      },
      {
        colIndex: 3,
        rowIndex: 2,
        showText: true,
      },
      {
        colIndex: 1,
        rowIndex: 3,
      },
    ];

    mockAllVisibleCells = [
      { getMeta: jest.fn().mockReturnValue(mockMergeCellInfo[2]) },
      { getMeta: jest.fn().mockReturnValue(mockMergeCellInfo[3]) },
    ] as unknown as DataCell[];
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
      getMeta: () => cellInfo,
    };

    mockInstance.interaction.getActiveCells = jest
      .fn()
      .mockReturnValue([mockActiveCells]);

    expect(getActiveCellsInfo(mockInstance)).toEqual([
      {
        ...cellInfo,
        showText: true,
      },
    ]);
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
    ] as [number, number][];

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
      {
        getMeta: () => {
          return { x: 1, y: 1, width: 2, height: 2 };
        },
      },
      {
        getMeta: () => {
          return { x: 3, y: 1, width: 2, height: 2 };
        },
      },
    ];

    expect(getPolygonPoints(mockCells as unknown as DataCell[])).toEqual(
      mockResult,
    );
  });

  test('should get cells in the outside of visible area through mergeCellInfo', () => {
    mockInstance.facet.getCellMeta = jest
      .fn()
      .mockImplementation((scalar) => mockMergeCellInfo[scalar]);

    mockInstance.options = {
      dataCell: ((meta: ViewMeta) => meta) as unknown as DataCellCallback,
    };

    const { cells, cellsMeta } = getInvisibleInfo(
      mockMergeCellInfo,
      mockInstance,
    );

    expect(cells).toEqual(mockMergeCellInfo);
    expect(cellsMeta).toEqual(mockMergeCellInfo[2]);
  });

  test('should get { cells, invisibleCellInfo, cellsMeta } in the inside of visible area through mergeCellInfo. (getVisibleInfo)', () => {
    const { cells, invisibleCellInfo, cellsMeta } = getVisibleInfo(
      mockMergeCellInfo,
      mockAllVisibleCells,
    );

    expect(cells[0].getMeta()).toEqual(mockMergeCellInfo[2]);
    expect(cells[1].getMeta()).toEqual(mockMergeCellInfo[3]);
    expect(invisibleCellInfo).toEqual([
      mockMergeCellInfo[0],
      mockMergeCellInfo[1],
    ]);
    expect(cellsMeta).toEqual(mockMergeCellInfo[2]);
  });

  test('should get the data cell and meta that make up the mergedCell. (getTempMergedCell)', () => {
    mockInstance.facet.getCellMeta = jest
      .fn()
      .mockImplementation((scalar) => mockMergeCellInfo[scalar]);

    const tempMergedCell = getTempMergedCell(
      mockAllVisibleCells,
      mockInstance,
      mockMergeCellInfo,
    );

    expect(tempMergedCell.cells).toHaveLength(4);
    expect(tempMergedCell.viewMeta).toEqual(mockMergeCellInfo[2]);
  });

  test('should get the active cells info as the default info of merged cells (getActiveCellsInfo)', () => {
    mockInstance.interaction.getActiveCells = jest
      .fn()
      .mockImplementation(() => mockAllVisibleCells);

    const result = getActiveCellsInfo(mockInstance);

    expect(result).toEqual([mockMergeCellInfo[2], mockMergeCellInfo[3]]);
  });

  test('should remove unmergedCells Info, return new mergedCell info (removeUnmergedCellsInfo).', () => {
    const mockMergedCell = {
      cells: mockAllVisibleCells,
    } as unknown as MergedCell;
    const mergedCellsInfo = [
      [mockMergeCellInfo[2], mockMergeCellInfo[3]],
      [mockMergeCellInfo[0], mockMergeCellInfo[1]],
    ];
    const result = removeUnmergedCellsInfo(mockMergedCell, mergedCellsInfo);

    expect(result).toEqual([[mockMergeCellInfo[0], mockMergeCellInfo[1]]]);
  });

  describe('Update mergedCells', () => {
    test('should not update mergedCells when mergedCellsInfo is empty', () => {
      mockInstance.options = {
        width: 100,
        height: 100,
        mergedCellsInfo: undefined,
      };

      const mergedCellsGroup = {
        getChildren: jest.fn().mockReturnValue([]),
        appendChild: jest.fn(),
      } as unknown as Group;

      updateMergedCells(mockInstance, mergedCellsGroup);

      expect(mergedCellsGroup.getChildren).not.toHaveBeenCalled();
      mockInstance.options = {
        ...mockInstance.options,
        mergedCellsInfo: [],
      };
      updateMergedCells(mockInstance, mergedCellsGroup);
      expect(mergedCellsGroup.getChildren).not.toHaveBeenCalled();
    });

    test('should not update mergedCells when visible area do not contain MergedCell', () => {
      mockInstance.options = {
        width: 100,
        height: 100,
        mergedCellsInfo: [mockMergeCellInfo],
      };

      const mergedCellsGroup = {
        getChildren: jest.fn().mockReturnValue([]),
        appendChild: jest.fn(),
      } as unknown as Group;

      updateMergedCells(mockInstance, mergedCellsGroup);

      expect(mergedCellsGroup.getChildren).not.toHaveBeenCalled();
    });

    test('should merge TempMergedCell when cell viewMeta id is equal. (mergeTempMergedCell)', () => {
      const mockTempMergedCell = [
        { viewMeta: { id: '1' } },
        { viewMeta: { id: '2' } },
      ] as TempMergedCell[];
      const mockOtherTempMergedCell = [
        { viewMeta: { id: '4' } },
        { viewMeta: { id: '2' } },
      ] as TempMergedCell[];

      const result = mergeTempMergedCell(
        mockTempMergedCell,
        mockOtherTempMergedCell,
      );

      expect(result).toEqual([
        { viewMeta: { id: '1' } },
        { viewMeta: { id: '2' } },
        { viewMeta: { id: '4' } },
      ]);
    });

    test('should convert TempMergedCell to MergedCell. (MergedCellConvertTempMergedCells)', () => {
      const mockMergedCell = {
        cells: mockAllVisibleCells,
        getMeta: jest.fn().mockReturnValue(mockMergeCellInfo[2]),
        isPartiallyVisible: true,
      } as unknown as MergedCell;
      const result = MergedCellConvertTempMergedCells([mockMergedCell]);

      expect(result).toEqual([
        {
          cells: mockAllVisibleCells,
          viewMeta: mockMergeCellInfo[2],
        },
      ]);
    });

    test('should get TempMergedCells exist in mainTempMergedCells but does not exist in compareTempMergedCells. (differenceTempMergedCells)', () => {
      const mainTempMergedCells = [
        { viewMeta: { id: '1' } },
        { viewMeta: { id: '2' } },
      ] as TempMergedCell[];
      const compareTempMergedCells = [
        { viewMeta: { id: '1' } },
        { viewMeta: { id: '3' } },
      ] as TempMergedCell[];

      const result = differenceTempMergedCells(
        mainTempMergedCells,
        compareTempMergedCells,
      );

      expect(result).toEqual([{ viewMeta: { id: '2' } }]);
    });
  });
});
