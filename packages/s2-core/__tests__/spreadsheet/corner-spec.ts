import * as simpleDataConfig from 'tests/data/simple-data.json';
import {
  CornerNodeType,
  DEFAULT_STYLE,
  EXTRA_FIELD,
  GEvent,
  S2Event,
  type S2CellType,
  type S2Options,
  type SpreadSheet,
} from '../../src';
import { createPivotSheet } from '../util/helpers';

describe('PivotSheet Corner Tests', () => {
  let s2: SpreadSheet;

  const cornerTypes: Array<{
    hierarchyType: S2Options['hierarchyType'];
    seriesNumber: S2Options['seriesNumber'];
    cornerNodeCount: number;
  }> = [
    {
      hierarchyType: 'tree',
      cornerNodeCount: 1,
      seriesNumber: {
        enable: false,
      },
    },
    {
      hierarchyType: 'grid',
      cornerNodeCount: 2,
      seriesNumber: {
        enable: false,
      },
    },
    {
      hierarchyType: 'tree',
      cornerNodeCount: 2,
      seriesNumber: {
        enable: true,
      },
    },
    {
      hierarchyType: 'grid',
      cornerNodeCount: 3,
      seriesNumber: {
        enable: true,
      },
    },
  ];

  beforeEach(async () => {
    s2 = createPivotSheet({
      width: 300,
      height: 300,
      tooltip: {
        enable: true,
      },
    });
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  // https://github.com/antvis/S2/issues/1929
  test.each(cornerTypes)(
    'should render row corner when columns is empty and measure hidden for %o',
    async ({ hierarchyType, cornerNodeCount, seriesNumber }) => {
      s2.setDataCfg({
        ...simpleDataConfig,
        fields: {
          ...simpleDataConfig.fields,
          columns: [],
          values: ['price'],
        },
      });
      s2.setOptions({
        hierarchyType,
        seriesNumber,
        style: {
          colCell: {
            hideValue: true,
          },
        },
      });
      await s2.render();

      const cornerNodes = s2.facet.getCornerNodes();
      const { colsHierarchy } = s2.facet.getLayoutResult();

      expect(colsHierarchy.width).toEqual(0);
      expect(colsHierarchy.height).toEqual(DEFAULT_STYLE.colCell!.height);
      expect(colsHierarchy.sampleNodeForLastLevel!.y).toEqual(0);
      expect(colsHierarchy.sampleNodeForLastLevel!.height).toEqual(
        DEFAULT_STYLE.colCell!.height,
      );
      expect(cornerNodes).toHaveLength(cornerNodeCount);
      expect(s2.facet.getCornerNodes()).toMatchSnapshot(
        Array.from({
          length: cornerNodeCount,
        }).map(() => {
          return {
            spreadsheet: expect.anything(),
          };
        }),
      );
    },
  );

  test.each(cornerTypes)(
    'should render row corner when measure hidden for %o',
    async ({ hierarchyType, cornerNodeCount, seriesNumber }) => {
      s2.setOptions({
        hierarchyType,
        seriesNumber,
        style: {
          colCell: {
            hideValue: true,
          },
        },
      });

      s2.setDataCfg({
        ...simpleDataConfig,
        fields: {
          ...simpleDataConfig.fields,
          values: ['price'],
        },
      });

      await s2.render();

      const cornerNodes = s2.facet.getCornerNodes();
      const { colsHierarchy } = s2.facet.getLayoutResult();

      expect(colsHierarchy.width).not.toBeLessThan(
        DEFAULT_STYLE.dataCell!.width as number,
      );
      expect(colsHierarchy.height).toEqual(DEFAULT_STYLE.colCell!.height);
      expect(colsHierarchy.sampleNodeForLastLevel!.y).toEqual(0);
      expect(colsHierarchy.sampleNodeForLastLevel!.height).toEqual(
        DEFAULT_STYLE.colCell!.height,
      );
      expect(cornerNodes).toHaveLength(cornerNodeCount);
      expect(s2.facet.getCornerNodes()).toMatchSnapshot(
        Array.from({
          length: cornerNodeCount,
        }).map(() => {
          return {
            spreadsheet: expect.anything(),
          };
        }),
      );
    },
  );

  test.each(cornerTypes)(
    'should render row corner when columns and values is empty for %o',
    async ({ hierarchyType, cornerNodeCount, seriesNumber }) => {
      s2.setDataCfg({
        ...simpleDataConfig,
        fields: {
          ...simpleDataConfig.fields,
          columns: [],
          values: [],
        },
      });
      s2.setOptions({
        hierarchyType,
        seriesNumber,
      });
      await s2.render();

      const cornerNodes = s2.facet.getCornerNodes();
      const { colsHierarchy } = s2.facet.getLayoutResult();

      expect(colsHierarchy.width).toEqual(0);
      expect(colsHierarchy.height).toEqual(0);
      expect(colsHierarchy.sampleNodeForLastLevel).toBeNull();
      expect(cornerNodes.length).toEqual(cornerNodeCount);
      expect(cornerNodes).toMatchSnapshot(
        Array.from({
          length: cornerNodeCount,
        }).map(() => {
          return {
            spreadsheet: expect.anything(),
          };
        }),
      );
    },
  );

  test('should not render row corner when fields is empty', async () => {
    s2.setDataCfg({
      ...simpleDataConfig,
      fields: {
        rows: [],
        columns: [],
        values: [],
      },
    });
    await s2.render();

    const cornerNodes = s2.facet.getCornerNodes();
    const { colsHierarchy } = s2.facet.getLayoutResult();

    expect(colsHierarchy.width).toEqual(0);
    expect(colsHierarchy.height).toEqual(0);
    expect(colsHierarchy.sampleNodeForLastLevel).toBeNull();
    expect(cornerNodes).toHaveLength(0);
  });

  test('should customize cornerBbox width and max width when freeze row header', async () => {
    // 默认占据一半宽度
    let cornerBBox = s2.facet.cornerBBox;

    expect(cornerBBox.originalWidth).toEqual(192);
    expect(cornerBBox.width).toEqual(150);

    // 自定义冻结宽度
    s2.setOptions({
      frozen: {
        rowHeader: 0.4,
      },
    });
    await s2.render();

    cornerBBox = s2.facet.cornerBBox;
    expect(cornerBBox.originalWidth).toEqual(192);
    expect(cornerBBox.width).toEqual(120);
  });

  // https://github.com/antvis/S2/issues/2073
  test.each([
    {
      field: 'province',
      selectedIds: ['root[&]浙江'],
    },
    {
      field: 'city',
      selectedIds: ['root[&]浙江[&]义乌', 'root[&]浙江[&]杭州'],
    },
  ])(
    'should selected/unselected current corner row cell when %s clicked',
    ({ field, selectedIds }) => {
      const node = s2.facet
        .getRowNodes()
        .find((rowNode) => rowNode.field === field);

      const getCellSpy = jest.spyOn(s2, 'getCell').mockImplementation(() => {
        return {
          getMeta: () => ({
            ...node,
            cornerType: CornerNodeType.Row,
          }),
        } as unknown as S2CellType;
      });
      const selected = jest.fn();

      s2.on(S2Event.GLOBAL_SELECTED, selected);

      // 选中
      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      expect(s2.tooltip.visible).toBeTruthy();
      expect(s2.interaction.getCells().map((meta) => meta.id)).toEqual(
        selectedIds,
      );
      expect(selected).toHaveBeenCalledWith(s2.interaction.getActiveCells());

      // 取消选中
      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      expect(s2.tooltip.visible).toBeFalsy();
      expect(s2.interaction.isSelectedState()).toBeFalsy();
      expect(s2.interaction.getCells()).toEqual([]);
      expect(selected).toHaveBeenCalledWith([]);

      getCellSpy.mockClear();
    },
  );

  test('should not selected current corner row cell when column corner cell clicked', () => {
    const node = s2.facet
      .getRowNodes()
      .find((rowNode) => rowNode.field === 'type');

    jest.spyOn(s2, 'getCell').mockImplementationOnce(() => {
      return {
        getMeta: () => ({
          ...node,
          cornerType: CornerNodeType.Row,
        }),
      } as unknown as S2CellType;
    });
    const selected = jest.fn();

    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    expect(s2.tooltip.visible).toBeFalsy();
    expect(s2.interaction.getCells()).toBeEmpty();
    expect(selected).not.toHaveBeenCalled();
  });

  test('should get corner row cell summaries', () => {
    const node = s2.facet
      .getRowNodes()
      .find((rowNode) => rowNode.field === 'province');

    jest.spyOn(s2, 'showTooltipWithInfo').mockImplementationOnce(() => {});
    jest.spyOn(s2, 'getCell').mockImplementationOnce(() => {
      return {
        getMeta: () => ({
          ...node,
          cornerType: CornerNodeType.Row,
        }),
      } as unknown as S2CellType;
    });

    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    expect(s2.showTooltipWithInfo).toHaveBeenCalledWith(expect.anything(), [], {
      data: {
        summaries: [
          {
            name: '',
            selectedData: s2.interaction.getActiveCells(),
            value: null,
          },
        ],
      },
    });
  });

  test('should get custom corner text when hierarchy type is tree', async () => {
    const cornerText = '自定义 cornerText';

    s2.setOptions({
      hierarchyType: 'tree',
      cornerText,
      frozen: {
        rowHeader: false,
      },
      style: {
        rowCell: { width: 300 },
      },
    });
    s2.changeSheetSize(600, 600);
    await s2.render();

    const cornerNode = s2.facet
      .getCornerNodes()
      .find((node) => node.cornerType === CornerNodeType.Row)!;

    expect(cornerNode.value).toEqual(cornerText);

    const cornerCell = s2.facet.getCornerCells()[0];

    expect(cornerCell.getActualText()).toEqual(cornerText);
  });

  test('should get custom corner extra text when hierarchy type is tree', async () => {
    const cornerExtraFieldText = '自定义';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    s2.setDataCfg({
      fields: {
        valueInCols: false,
      },
    });
    s2.setOptions({
      cornerExtraFieldText,
    });
    await s2.render();

    const cornerNode = s2.facet
      .getCornerNodes()
      .find((node) => node.field === EXTRA_FIELD)!;

    expect(cornerNode.value).toEqual(cornerExtraFieldText);

    const cornerCell = s2.facet.getCornerCells()[2];

    expect(cornerCell.getActualText()).toEqual(cornerExtraFieldText);
  });
});
