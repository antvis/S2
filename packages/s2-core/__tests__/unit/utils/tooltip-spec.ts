import {
  createFakeSpreadSheet,
  createMockCellInfo,
  createPivotSheet,
} from 'tests/util/helpers';
import type { BBox } from '@antv/g-canvas';
import { omit } from 'lodash';
import {
  getAutoAdjustPosition,
  setTooltipContainerStyle,
  getTooltipOptions,
  getTooltipData,
} from '@/utils/tooltip';
import {
  CellTypes,
  EXTRA_FIELD,
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
  VALUE_FIELD,
  TOOLTIP_CONTAINER_SHOW_CLS,
  TOOLTIP_CONTAINER_HIDE_CLS,
} from '@/index';
import type { BaseFacet } from '@/facet/base-facet';

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
    s2.container.get = () => ({
      getBoundingClientRect: () => ({
        ...containerSize,
      }),
    });
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
    const getCellNameByType = (cellType: CellTypes) => {
      return {
        [CellTypes.ROW_CELL]: 'row',
        [CellTypes.COL_CELL]: 'col',
        [CellTypes.DATA_CELL]: 'data',
        [CellTypes.CORNER_CELL]: 'corner',
      }[cellType];
    };

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
            trend: true,
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
            trend: true,
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
      const visibleSubMenus = operator.menus.find(
        ({ key }) => key === 'menu-7',
      );

      expect(operator.onClick).toEqual(onClick);
      expect(operator.menus.map(({ key }) => key)).toEqual([
        'default-menu',
        'menu-0',
        'menu-1',
        'menu-3',
        'menu-5',
        'menu-7',
      ]);
      expect(visibleSubMenus.children).toHaveLength(0);
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
      details: null,
      headInfo: null,
      infos: undefined,
      interpretation: undefined,
      name: undefined,
      summaries: [],
      tips: undefined,
    };

    const getCellData = (
      value: number,
      isTotalCell = false,
      extraField?: Record<string, unknown>,
    ) => {
      return {
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: value,
        number: value,
        province: '浙江省',
        ...(isTotalCell ? {} : { city: '杭州市' }),
        ...extraField,
      };
    };

    const createTotalsPivotSheet = (totals: Totals) =>
      createPivotSheet(
        {
          totals,
        },
        { useSimpleData: false },
      );

    let s2: SpreadSheet;

    const getMockTooltipData = (cell: S2CellType) => {
      jest.spyOn(s2.interaction, 'getState').mockImplementationOnce(() => ({
        cells: [getCellMeta(cell)],
        nodes: [cell.getMeta() as Node],
      }));

      jest
        .spyOn(s2.interaction, 'getActiveCells')
        .mockImplementationOnce(() => [cell]);

      return getTooltipData({
        cellInfos: [cell],
        options: {
          showSingleTips: true,
        },
        targetCell: cell,
        spreadsheet: s2,
      });
    };

    test('should get cell data info keys', () => {
      s2 = createFakeSpreadSheet();

      s2.facet = {
        layoutResult: {
          rowNodes: [],
          colNodes: [],
        },
      } as BaseFacet;

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

        const dataCells = s2.interaction.getPanelGroupAllDataCells();
        const selectedCells = isTotalCell
          ? [
              dataCells.find((cell) => {
                const meta = cell.getMeta();
                return meta.isTotals;
              }),
            ]
          : dataCells
              .filter((cell) => {
                const meta = cell.getMeta();
                return !meta.isTotals;
              })
              .slice(0, count);

        jest
          .spyOn(s2.interaction, 'getActiveCells')
          .mockImplementationOnce(() => selectedCells);

        const tooltipData = getTooltipData({
          cellInfos: [selectedCells],
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

        expect(tooltipData.summaries).toStrictEqual([
          {
            name: '数量',
            value,
            selectedData,
          },
        ]);

        s2.destroy();
      },
    );

    test.each([{ isTotalCell: true }, { isTotalCell: false }])(
      'should get %o row cell summary data info',
      ({ isTotalCell }) => {
        s2 = createTotalsPivotSheet({
          row: rowTotalOptions,
        });
        s2.render();

        const rowCell = s2.interaction.getAllRowHeaderCells().find((cell) => {
          const meta = cell.getMeta();
          return isTotalCell ? meta.isTotals : !meta.isTotals;
        });

        const tooltipData = getMockTooltipData(rowCell);

        expect(tooltipData).toStrictEqual({
          ...defaultTooltipData,
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
            },
          ],
        });

        s2.destroy();
      },
    );

    test('should get grand totals row cell summary data', () => {
      s2 = createTotalsPivotSheet({
        row: rowTotalOptions,
      });
      s2.render();

      const grandTotalRowCell = s2.interaction
        .getAllRowHeaderCells()
        .find((cell) => {
          const meta = cell.getMeta();
          return meta.isGrandTotals;
        });

      const tooltipData = getMockTooltipData(grandTotalRowCell);

      expect(tooltipData.summaries[0].value).toStrictEqual(78868);

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

        const colLeafCell = s2.interaction
          .getAllColHeaderCells()
          .find((cell) => {
            const meta = cell.getMeta();
            return (
              (isTotalCell ? meta.isTotals : !meta.isTotals) && meta.isLeaf
            );
          });

        const tooltipData = getMockTooltipData(colLeafCell);

        const value = isTotalCell ? 78868 : 26193;
        expect(tooltipData.summaries[0].value).toStrictEqual(value);

        s2.destroy();
      },
    );
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
      className: ['test', null, undefined, ''],
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
});
