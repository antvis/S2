import { createFakeSpreadSheet } from 'tests/util/helpers';
import { BBox } from '@antv/g-canvas';
import { omit } from 'lodash';
import {
  getAutoAdjustPosition,
  setContainerStyle,
  getTooltipOptions,
} from '@/utils/tooltip';
import {
  CellTypes,
  getTooltipVisibleOperator,
  S2CellType,
  SpreadSheet,
  Tooltip,
  TOOLTIP_POSITION_OFFSET,
} from '@/index';
import { BaseFacet } from '@/facet/base-facet';

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
        panelBBox: panelBBox,
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

  describe('Get Tooltip Options Tests', () => {
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

  test('should set container style', () => {
    const container = document.createElement('div');

    setContainerStyle(container, {
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

    setContainerStyle(container, {
      className: 'test',
    });

    expect(container.className).toEqual('test');
  });
});
