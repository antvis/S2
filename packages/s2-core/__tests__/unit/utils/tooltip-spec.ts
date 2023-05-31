import {
  createFakeSpreadSheet,
  createMockCellInfo,
  createPivotSheet,
  getContainer,
} from 'tests/util/helpers';

import { omit } from 'lodash';
import * as dataConfig from 'tests/data/mock-dataset.json';
import { CellData } from '@/data-set/cell-data';
import type { CellMeta } from '@/common/interface/interaction';
import {
  getAutoAdjustPosition,
  setTooltipContainerStyle,
  getTooltipOptions,
  getTooltipData,
  getCustomFieldsSummaries,
} from '@/utils/tooltip';
import {
  CellTypes,
  getCellMeta,
  getTooltipVisibleOperator,
  Node,
  type S2CellType,
  SpreadSheet,
  type Tooltip,
  type TooltipData,
  TOOLTIP_POSITION_OFFSET,
  type Total,
  type Totals,
  TOOLTIP_CONTAINER_SHOW_CLS,
  TOOLTIP_CONTAINER_HIDE_CLS,
  type TooltipSummaryOptions,
  PivotSheet,
  type S2DataConfig,
} from '@/index';
import type { BaseFacet } from '@/facet/base-facet';
import type { BBox } from '@/engine';

jest.mock('@/interaction/event-controller');

describe('Tooltip Utils Tests', () => {
  let s2: SpreadSheet;
  let tooltipContainer: HTMLDivElement;

  const containerSize = {
    width: 200,
    height: 200,
    top: 20,
    left: 10,
  };

  const tooltipSize = {
    width: 100,
    height: 100,
  };

  const bodySize = {
    width: 1000,
    height: 1000,
  };

  beforeAll(() => {
    s2 = createFakeSpreadSheet();
    tooltipContainer = {
      getBoundingClientRect: () =>
        ({
          ...tooltipSize,
        } as DOMRect),
    } as HTMLDivElement;
    s2.getCanvasElement().getBoundingClientRect = () =>
      ({
        ...containerSize,
      } as DOMRect);
    s2.facet = {
      panelBBox: {
        maxX: containerSize.width,
        maxY: containerSize.height,
      } as BBox,
    } as BaseFacet;
    document.body.getBoundingClientRect = () =>
      ({
        ...bodySize,
      } as DOMRect);
  });

  describe('Tooltip Position Tests', () => {
    test('should get original position if not set autoAdjustBoundary', () => {
      expect(
        getAutoAdjustPosition({
          position: { x: 0, y: 0 },
          autoAdjustBoundary: null,
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: TOOLTIP_POSITION_OFFSET.x,
        y: TOOLTIP_POSITION_OFFSET.y,
      });
    });

    test('should get original position if tooltip width less than container boundary', () => {
      expect(
        getAutoAdjustPosition({
          position: { x: 20, y: 20 },
          autoAdjustBoundary: 'container',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: 20 + TOOLTIP_POSITION_OFFSET.x,
        y: 20 + TOOLTIP_POSITION_OFFSET.y,
      });
    });

    test('should get auto adjust position if tooltip width more than container boundary', () => {
      // x
      expect(
        getAutoAdjustPosition({
          position: { x: 200, y: 20 },
          autoAdjustBoundary: 'container',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: containerSize.width - tooltipSize.width + containerSize.left,
        y: 20 + TOOLTIP_POSITION_OFFSET.y,
      });

      // y
      expect(
        getAutoAdjustPosition({
          position: { x: 20, y: 200 },
          autoAdjustBoundary: 'container',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: 20 + TOOLTIP_POSITION_OFFSET.x,
        y: containerSize.height - tooltipSize.height + containerSize.top,
      });

      // x, y
      expect(
        getAutoAdjustPosition({
          position: { x: 200, y: 200 },
          autoAdjustBoundary: 'container',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: containerSize.width - tooltipSize.width + containerSize.left,
        y: containerSize.height - tooltipSize.height + containerSize.top,
      });
    });

    test('should get auto adjust position if tooltip width more than body boundary', () => {
      // x
      expect(
        getAutoAdjustPosition({
          position: { x: 900, y: 20 },
          autoAdjustBoundary: 'body',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: bodySize.width - tooltipSize.width,
        y: 20 + TOOLTIP_POSITION_OFFSET.y,
      });

      // y
      expect(
        getAutoAdjustPosition({
          position: { x: 20, y: 900 },
          autoAdjustBoundary: 'body',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: 20 + TOOLTIP_POSITION_OFFSET.x,
        y: bodySize.height - tooltipSize.height,
      });

      // x, y
      expect(
        getAutoAdjustPosition({
          position: { x: 900, y: 900 },
          autoAdjustBoundary: 'body',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: bodySize.width - tooltipSize.width,
        y: bodySize.height - tooltipSize.height,
      });
    });

    test('should get auto adjust position if tooltip width more than container boundary and real render width less container width', () => {
      const panelBBox = {
        maxX: 120,
        maxY: 120,
      };

      s2.facet = {
        panelBBox,
      } as BaseFacet;

      // x, y
      expect(
        getAutoAdjustPosition({
          position: { x: 100, y: 100 },
          autoAdjustBoundary: 'container',
          spreadsheet: s2,
          tooltipContainer,
        }),
      ).toEqual({
        x: panelBBox.maxX - tooltipSize.width + containerSize.left,
        y: panelBBox.maxY - tooltipSize.height + containerSize.top,
      });
    });
  });

  describe('Tooltip Get Options Tests', () => {
    const getCellNameByType = (cellType: CellTypes) =>
      ({
        [CellTypes.ROW_CELL]: 'rowCell',
        [CellTypes.COL_CELL]: 'colCell',
        [CellTypes.DATA_CELL]: 'dataCell',
        [CellTypes.CORNER_CELL]: 'cornerCell',
        [CellTypes.MERGED_CELL]: 'mergedCell',
        [CellTypes.SERIES_NUMBER_CELL]: 'seriesNumberCell',
      }[cellType] || '');

    test.each([
      CellTypes.ROW_CELL,
      CellTypes.COL_CELL,
      CellTypes.DATA_CELL,
      CellTypes.CORNER_CELL,
    ])(
      'should use %o tooltip content from tooltip config first for string content',
      (cellType) => {
        const tooltipContent = `${cellType} tooltip content`;
        const defaultTooltipContent = 'default tooltip content';
        const type = getCellNameByType(cellType);

        const tooltip: Tooltip = {
          content: defaultTooltipContent,
          [type]: {
            content: tooltipContent,
          },
        };

        const spreadsheet = {
          getCellType: () => cellType,
          options: {
            tooltip,
          },
        } as unknown as SpreadSheet;

        expect(getTooltipOptions(spreadsheet, {} as Event)).toEqual({
          content: tooltipContent,
          [type]: {
            content: tooltipContent,
          },
        });
      },
    );

    test.each([
      CellTypes.ROW_CELL,
      CellTypes.COL_CELL,
      CellTypes.DATA_CELL,
      CellTypes.CORNER_CELL,
    ])(
      'should use %o tooltip options and merge base tooltip config',
      (cellType) => {
        const type = getCellNameByType(cellType);

        const tooltip: Tooltip = {
          showTooltip: false,
          content: '',
          operation: {
            hiddenColumns: true,
            sort: true,
            tableSort: true,
            menus: [{ key: 'menu-a', text: 'menu-a' }],
          },
          [type]: {
            showTooltip: true,
            operation: {
              hiddenColumns: false,
              menus: [{ key: 'menu-b', text: 'menu-b' }],
            },
          },
        };

        const spreadsheet = {
          getCellType: () => cellType,
          options: {
            tooltip,
          },
        } as unknown as SpreadSheet;

        const tooltipOptions = omit(
          getTooltipOptions(spreadsheet, {} as Event),
          [type],
        );

        expect(tooltipOptions).toEqual({
          showTooltip: true,
          content: '',
          operation: {
            hiddenColumns: false,
            sort: true,
            tableSort: true,
            menus: [{ key: 'menu-b', text: 'menu-b' }],
          },
        });
      },
    );

    test('should filter not displayed tooltip operation menus', () => {
      const mockCell = {
        cellType: CellTypes.DATA_CELL,
      } as unknown as S2CellType;
      const onClick = jest.fn();

      const defaultMenus = [
        {
          key: 'default-menu',
          text: 'default-menu',
        },
      ];

      const operation: Tooltip['operation'] = {
        onClick,
        menus: [
          { key: 'menu-0', text: '默认显示(未声明visible属性)' },
          { key: 'menu-1', text: '默认显示', visible: true },
          { key: 'menu-2', text: '默认隐藏', visible: false },
          { key: 'menu-3', text: '动态始终显示', visible: () => true },
          { key: 'menu-4', text: '动态始终显示', visible: () => false },
          {
            key: 'menu-5',
            text: '动态显示',
            visible: (cell) => cell.cellType === CellTypes.DATA_CELL,
          },
          {
            key: 'menu-6',
            text: '动态隐藏',
            visible: (cell) => cell.cellType !== CellTypes.DATA_CELL,
          },
          {
            key: 'menu-7',
            text: '父节点显示, 子节点隐藏',
            visible: true,
            children: [
              {
                key: 'menu-7-1',
                text: '父节点显示, 子节点隐藏',
                visible: false,
              },
            ],
          },
          {
            key: 'menu-8',
            text: '父节点隐藏, 子节点显示 (应该父,子都不显示)',
            visible: false,
            children: [
              {
                key: 'menu-8-1',
                text: '父节点隐藏, 子节点显示',
                visible: true,
              },
            ],
          },
        ],
      };
      const operator = getTooltipVisibleOperator(operation, {
        cell: mockCell,
        defaultMenus,
      });
      const visibleSubMenus = operator.menus?.find(
        ({ key }) => key === 'menu-7',
      );

      expect(operator.onClick).toEqual(onClick);
      expect(operator.menus?.map(({ key }) => key)).toEqual([
        'default-menu',
        'menu-0',
        'menu-1',
        'menu-3',
        'menu-5',
        'menu-7',
      ]);
      expect(visibleSubMenus?.children).toHaveLength(0);
    });
  });

  describe('Tooltip Get Data Tests', () => {
    const rowTotalOptions: Total = {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: false,
      reverseSubLayout: false,
      subTotalsDimensions: ['province'],
    };

    const colTotalOptions: Total = {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['type'],
    };

    const defaultTooltipData: TooltipData = {
      name: null,
      details: null,
      headInfo: null,
      infos: undefined,
      interpretation: undefined,
      summaries: [],
      tips: undefined,
      description: undefined,
    };

    const getCellData = (
      value: number,
      isTotalCell = false,
      extraField?: Record<string, unknown>,
    ) =>
      new CellData(
        {
          number: value,
          province: '浙江省',
          ...(isTotalCell ? {} : { city: '杭州市' }),
          ...extraField,
        },
        'number',
      );

    const createTotalsPivotSheet = (totals: Totals | null) =>
      createPivotSheet(
        {
          totals,
        },
        { useSimpleData: false, useTotalData: true },
      );

    let s2: SpreadSheet;

    const getMockTooltipData = (cell: S2CellType) => {
      jest.spyOn(s2.interaction, 'getState').mockImplementationOnce(() => {
        return {
          cells: [getCellMeta(cell)],
          nodes: [cell.getMeta() as Node],
        };
      });

      jest
        .spyOn(s2.interaction, 'getActiveCells')
        .mockImplementationOnce(() => [cell]);

      return getTooltipData({
        cellInfos: [cell as TooltipData],
        options: {
          showSingleTips: true,
        },
        targetCell: cell,
        spreadsheet: s2,
      });
    };

    const getTotalInfo = (isTotalCell: boolean, count: number) => {
      const dataCells = s2.facet.getDataCells();
      const selectedCells = isTotalCell
        ? [
            dataCells.find((cell) => {
              const meta = cell.getMeta();

              return meta.isTotals;
            })!,
          ]
        : dataCells
            .filter((cell) => {
              const meta = cell.getMeta();

              return !meta.isTotals;
            })
            .slice(0, count);

      const selectedCellMetas = selectedCells.map((cell) =>
        cell.getMeta(),
      ) as unknown as CellMeta[];

      jest
        .spyOn(s2.interaction, 'getCells')
        .mockImplementationOnce(() => selectedCellMetas);

      const tooltipData = getTooltipData({
        cellInfos: [selectedCellMetas as TooltipData],
        options: {
          showSingleTips: false,
        },
        targetCell: null,
        spreadsheet: s2,
      });

      const baseCellInfo = {
        province: '浙江省',
        sub_type: '桌子',
        type: '家具',
      };
      const value = isTotalCell ? 15420 : 18375;
      const selectedData = isTotalCell
        ? [getCellData(15420)]
        : [
            getCellData(7789, false, {
              ...baseCellInfo,
              city: '杭州市',
            }),
            getCellData(2367, false, {
              ...baseCellInfo,
              city: '绍兴市',
            }),
            getCellData(3877, false, {
              ...baseCellInfo,
              city: '宁波市',
            }),
            getCellData(4342, false, {
              ...baseCellInfo,
              city: '舟山市',
            }),
          ];

      return { tooltipData, value, selectedData };
    };

    test('should get cell data info keys', () => {
      s2 = createFakeSpreadSheet();

      s2.facet = {
        layoutResult: {
          rowNodes: [],
          colNodes: [],
        },
      } as unknown as BaseFacet;

      const cell = createMockCellInfo('test-a');
      const tooltipData = getTooltipData({
        cellInfos: [],
        options: {
          enableFormat: true,
          showSingleTips: false,
        },
        targetCell: cell.mockCell,
        spreadsheet: s2,
      });

      expect(tooltipData).toEqual(defaultTooltipData);
    });

    test.each([
      { count: 1, isTotalCell: true, name: '单选' },
      { count: 4, isTotalCell: false, name: '多选' },
    ])(
      'should get data cell summary data info for %o',
      ({ count, isTotalCell }) => {
        s2 = createTotalsPivotSheet({
          row: rowTotalOptions,
          col: colTotalOptions,
        });
        s2.render();
        const { tooltipData, value, selectedData } = getTotalInfo(
          isTotalCell,
          count,
        );

        expect(tooltipData.summaries).toStrictEqual([
          {
            name: '数量',
            value,
            selectedData,
            originValue: value,
          },
        ]);

        s2.destroy();
      },
    );

    test.each([
      { count: 1, isTotalCell: true, name: '单选' },
      { count: 4, isTotalCell: false, name: '多选' },
    ])(
      `should get data cell summary data info for %o when the meta set formatted`,
      ({ count, isTotalCell }) => {
        const customMeta = dataConfig.meta.map((meta) => {
          if (meta.name === '数量') {
            return {
              ...meta,
              formatter: (value: number) => `${value}%`,
            };
          }

          return meta;
        });

        s2 = new PivotSheet(
          getContainer(),
          {
            ...dataConfig,
            data: dataConfig.data.concat(dataConfig.totalData as any),
            meta: customMeta as S2DataConfig['meta'],
          },
          {
            totals: {
              row: rowTotalOptions,
              col: colTotalOptions,
            },
          },
        );
        s2.render();

        const { tooltipData, value, selectedData } = getTotalInfo(
          isTotalCell,
          count,
        );

        expect(tooltipData.summaries).toStrictEqual([
          {
            name: '数量',
            value: `${value}%`,
            selectedData,
            originValue: value,
          },
        ]);
      },
    );

    test.each([{ isTotalCell: true }, { isTotalCell: false }])(
      'should get row cell summary data info for %o',
      ({ isTotalCell }) => {
        s2 = createTotalsPivotSheet({
          row: rowTotalOptions,
        });
        s2.render();

        const rowCell = s2.facet.getRowCells().find((cell) => {
          const meta = cell.getMeta();

          return isTotalCell ? meta.isTotals : !meta.isTotals;
        });

        const tooltipData = getMockTooltipData(rowCell!);

        expect(tooltipData).toStrictEqual({
          ...defaultTooltipData,
          description: isTotalCell ? undefined : '省份说明。。',
          summaries: [
            {
              name: '数量',
              value: isTotalCell ? 43098 : 15420,
              selectedData: [
                getCellData(isTotalCell ? 18375 : 7789, isTotalCell, {
                  sub_type: '桌子',
                  type: '家具',
                }),
                getCellData(isTotalCell ? 14043 : 5343, isTotalCell, {
                  sub_type: '沙发',
                  type: '家具',
                }),
                getCellData(isTotalCell ? 4826 : 945, isTotalCell, {
                  sub_type: '笔',
                  type: '办公用品',
                }),
                getCellData(isTotalCell ? 5854 : 1343, isTotalCell, {
                  sub_type: '纸张',
                  type: '办公用品',
                }),
              ],
              originValue: isTotalCell ? 43098 : 15420,
            },
          ],
        });

        s2.destroy();
      },
    );

    test.each([{ isTotalCell: true }, { isTotalCell: false }])(
      'should get col cell summary data info for %o',
      ({ isTotalCell }) => {
        s2 = createTotalsPivotSheet({
          col: colTotalOptions,
        });
        s2.render();

        const colCell = s2.facet.getColCells().find((cell) => {
          const meta = cell.getMeta();

          return isTotalCell ? meta.isTotals : !meta.isTotals;
        });

        const tooltipData = getMockTooltipData(colCell!);

        expect(tooltipData).toStrictEqual({
          ...defaultTooltipData,
          description: isTotalCell ? undefined : '类别说明。。',
          summaries: expect.anything(),
        });

        s2.destroy();
      },
    );

    test('should get grand totals row cell summary data', () => {
      s2 = createTotalsPivotSheet({
        row: rowTotalOptions,
      });
      s2.render();

      const grandTotalRowCell = s2.facet.getRowCells().find((cell) => {
        const meta = cell.getMeta();

        return meta.isGrandTotals;
      });

      const tooltipData = getMockTooltipData(grandTotalRowCell!);

      expect(tooltipData.summaries?.[0].value).toStrictEqual(78868);

      s2.destroy();
    });

    // https://github.com/antvis/S2/issues/1137
    test.each([{ isTotalCell: true }, { isTotalCell: false }])(
      'should get without row cell sub and grand totals %o col cell summary data',
      ({ isTotalCell }) => {
        s2 = createTotalsPivotSheet({
          col: colTotalOptions,
          row: rowTotalOptions,
        });
        s2.render();

        const colLeafCell = s2.facet.getColCells().find((cell) => {
          const meta = cell.getMeta();

          return (isTotalCell ? meta.isTotals : !meta.isTotals) && meta.isLeaf;
        });

        const tooltipData = getMockTooltipData(colLeafCell!);

        const value = isTotalCell ? 78868 : 26193;

        expect(tooltipData.summaries?.[0].value).toStrictEqual(value);

        s2.destroy();
      },
    );

    describe('Tooltip Description Tests', () => {
      afterEach(() => {
        s2.destroy();
      });

      test('should get row cell description', () => {
        s2 = createTotalsPivotSheet(null);
        s2.render();

        const rowCell = s2.facet.getRowCells()[0];

        const tooltipData = getMockTooltipData(rowCell);

        expect(tooltipData.description).toEqual('省份说明。。');
      });

      test('should get col cell descriptions', () => {
        s2 = createTotalsPivotSheet(null);
        s2.render();

        const colCell = s2.facet.getColCells()[0];

        const tooltipData = getMockTooltipData(colCell);

        expect(tooltipData.description).toEqual('类别说明。。');
      });

      test('should get data cell description', () => {
        s2 = createTotalsPivotSheet(null);
        s2.render();

        const dataCell = s2.facet.getDataCells()[0];

        const tooltipData = getMockTooltipData(dataCell);

        expect(tooltipData.description).toEqual('数量说明。。');
      });

      test.each(['isTotals', 'isSubTotals', 'isGrandTotals'])(
        'should not get total cell description with %s',
        (key) => {
          s2 = createTotalsPivotSheet({
            col: colTotalOptions,
            row: rowTotalOptions,
          });
          s2.render();

          const colTotalCell = s2.facet.getColCells().find((cell) => {
            const meta = cell.getMeta();

            return meta[key];
          });

          const rowTotalCell = s2.facet.getRowCells().find((cell) => {
            const meta = cell.getMeta();

            return meta[key];
          });

          expect(getMockTooltipData(colTotalCell!).description).toBeUndefined();
          expect(getMockTooltipData(rowTotalCell!).description).toBeUndefined();

          s2.destroy();
        },
      );
    });
  });

  test('should set container style', () => {
    const container = document.createElement('div');

    setTooltipContainerStyle(container, {
      style: {
        width: '100px',
        pointerEvents: 'none',
      },
    });

    expect(container.style.width).toEqual('100px');
    expect(container.style.pointerEvents).toEqual('none');
  });

  test('should set container class name', () => {
    const container = document.createElement('div');

    container.className = 'a';

    setTooltipContainerStyle(container, {
      className: ['test'],
    });

    expect(container.classList.contains('test')).toBeTruthy();

    setTooltipContainerStyle(container, {
      className: ['test', null, undefined, ''] as string[],
    });

    expect(container.classList.contains('null')).toBeFalsy();
    expect(container.classList.contains('undefined')).toBeFalsy();
  });

  test('should set container class name by visible', () => {
    const container = document.createElement('div');

    container.className = 'visible';

    setTooltipContainerStyle(container, {
      visible: true,
    });

    expect(container.className).toEqual(
      `visible ${TOOLTIP_CONTAINER_SHOW_CLS}`,
    );

    setTooltipContainerStyle(container, {
      visible: false,
    });

    expect(container.className).toEqual(
      `visible ${TOOLTIP_CONTAINER_HIDE_CLS}`,
    );
  });

  test('should get custom fields summaries of custom tree', () => {
    const mockData = [
      {
        selectedData: [
          {
            raw: {
              'measure-1': 13,
              'measure-2': 2,
              'measure-3': 3,
              'measure-4': 4,
              'measure-5': 5,
              'measure-6': 6,
              type: '家具',
              sub_type: '桌子',
            },
            extraField: 'measure-1',
          },
          {
            raw: {
              'measure-1': 11,
              'measure-2': 8,
              'measure-3': 32,
              'measure-4': 43,
              'measure-5': 45,
              'measure-6': 65,
              type: '家具',
              sub_type: '椅子',
            },
            extraField: 'measure-1',
          },
        ],
        name: '自定义节点 a-1-1',
        value: 24,
      },
      {
        selectedData: [
          {
            raw: {
              'measure-1': 13,
              'measure-2': 2,
              'measure-3': 3,
              'measure-4': 4,
              'measure-5': 5,
              'measure-6': 6,
              type: '家具',
              sub_type: '桌子',
            },
            extraField: 'a-1-1-1',
          },
          {
            raw: {
              'measure-1': 11,
              'measure-2': 8,
              'measure-3': 32,
              'measure-4': 43,
              'measure-5': 45,
              'measure-6': 65,
              type: '家具',
              sub_type: '椅子',
            },
            extraField: 'a-1-1-1',
          },
        ],
        name: '自定义节点 a-1-1',
        value: '-',
      },
      {
        selectedData: [
          {
            raw: {
              'measure-1': 13,
              'measure-2': 2,
              'measure-3': 3,
              'measure-4': 4,
              'measure-5': 5,
              'measure-6': 6,
              type: '家具',
              sub_type: '桌子',
            },
            extraField: 'measure-2',
          },
          {
            raw: {
              'measure-1': 11,
              'measure-2': 8,
              'measure-3': 32,
              'measure-4': 43,
              'measure-5': 45,
              'measure-6': 65,
              type: '家具',
              sub_type: '椅子',
            },
            extraField: 'measure-2',
          },
        ],
        name: '自定义节点 a-1-1',
        value: 10,
      },
    ];

    const summaries = getCustomFieldsSummaries(
      mockData as unknown as TooltipSummaryOptions[],
    );
    const summary = summaries[0];

    expect(summaries).toHaveLength(1);
    expect(summary.value).toEqual(34);
    expect(summary.name).toEqual('自定义节点 a-1-1');
  });
});
