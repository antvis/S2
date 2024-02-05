// eslint-disable-next-line max-classes-per-file
import { Canvas, CanvasEvent } from '@antv/g';
import { cloneDeep, last } from 'lodash';
import dataCfg from 'tests/data/simple-data.json';
import { waitForRender } from 'tests/util';
import { createPivotSheet, getContainer, sleep } from 'tests/util/helpers';
import type {
  BaseEvent,
  BaseTooltipOperatorMenuOptions,
  HeaderCell,
  TooltipOptions,
} from '../../../src';
import { PivotDataSet } from '../../../src/data-set';
import { PivotFacet } from '../../../src/facet';
import { customMerge, getSafetyDataConfig } from '@/utils';
import { BaseTooltip } from '@/ui/tooltip';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { GEvent } from '@/index';
import { Node } from '@/facet/layout/node';
import {
  CellType,
  InterceptType,
  KEY_GROUP_PANEL_SCROLL,
  S2Event,
  TOOLTIP_CONTAINER_CLS,
  getIcon,
  setLang,
  type CustomSVGIcon,
  type HiddenColumnsInfo,
  type LangType,
  type RowCellCollapsedParams,
  type S2DataConfig,
  type S2Options,
  type TooltipShowOptions,
} from '@/common';

jest.mock('@/utils/hide-columns');

import { hideColumnsByThunkGroup } from '@/utils/hide-columns';

const mockHideColumnsByThunkGroup =
  hideColumnsByThunkGroup as unknown as jest.Mock<PivotSheet>;

const originalDataCfg = cloneDeep(dataCfg);

describe('PivotSheet Tests', () => {
  let s2: PivotSheet;

  const customSVGIcon: CustomSVGIcon = {
    name: 'test',
    svg: '===',
  };

  const s2Options: S2Options = {
    width: 200,
    height: 200,
    hierarchyType: 'grid',
    customSVGIcons: [customSVGIcon],
    tooltip: {
      enable: true,
    },
    interaction: {
      autoResetSheetStyle: false,
    },
  };

  let container: HTMLDivElement;

  beforeEach(async () => {
    setLang('zh_CN');

    container = getContainer();
    s2 = new PivotSheet(container, dataCfg, s2Options);
    await s2.render();
  });

  afterEach(() => {
    container?.remove();
    s2?.destroy();
  });

  describe('PivotSheet Tooltip Tests', () => {
    const getCellNameByType = (cellType: CellType) =>
      ({
        [CellType.ROW_CELL]: 'rowCell',
        [CellType.COL_CELL]: 'colCell',
        [CellType.DATA_CELL]: 'dataCell',
        [CellType.CORNER_CELL]: 'cornerCell',
        [CellType.MERGED_CELL]: 'merged',
        [CellType.SERIES_NUMBER_CELL]: 'seriesNumberCell',
      })[cellType];

    test('should support callback tooltip content for string', () => {
      s2.showTooltip({
        position: {
          x: 10,
          y: 10,
        },
        content: () => 'custom callback content',
      });

      expect(s2.tooltip.container!.innerHTML).toEqual(
        'custom callback content',
      );
    });

    test('should support callback tooltip content for element', () => {
      const content = document.createElement('div');

      s2.showTooltip({
        position: {
          x: 10,
          y: 10,
        },
        content: () => content,
      });

      expect(s2.tooltip.container!.contains(content)).toBeTruthy();
    });

    test('should init tooltip', () => {
      s2.showTooltip({ position: { x: 0, y: 0 } });

      expect(s2.tooltip.container!.className).toEqual(
        `${TOOLTIP_CONTAINER_CLS} ${TOOLTIP_CONTAINER_CLS}-show`,
      );
    });

    test('should destroy tooltip', () => {
      s2.tooltip.destroy();

      // remove container
      expect(s2.tooltip.container).toBeFalsy();
      // reset position
      expect(s2.tooltip.position).toEqual({
        x: 0,
        y: 0,
      });
    });

    test('should show tooltip when call showTooltip', () => {
      const showTooltipSpy = jest
        .spyOn(s2.tooltip, 'show')
        .mockImplementation(() => {});

      s2.showTooltip({ position: { x: 0, y: 0 } });

      expect(showTooltipSpy).toHaveBeenCalledTimes(1);
    });

    test("should don't show tooltip when call showTooltipWithInfo if disable tooltip", () => {
      Object.defineProperty(s2.options, 'tooltip', {
        value: {
          enable: false,
        },
        configurable: true,
      });
      const showTooltipSpy = jest
        .spyOn(s2.tooltip, 'show')
        .mockImplementation(() => {});

      s2.showTooltipWithInfo({} as GEvent, []);

      expect(showTooltipSpy).not.toHaveBeenCalled();
    });

    test('should show tooltip when call showTooltipWithInfo if enable tooltip', () => {
      Object.defineProperty(s2.options, 'tooltip', {
        value: {
          enable: true,
        },
        configurable: true,
      });
      const showTooltipSpy = jest
        .spyOn(s2.tooltip, 'show')
        .mockImplementation(() => {});

      s2.showTooltipWithInfo({} as GEvent, []);

      expect(showTooltipSpy).toHaveBeenCalledTimes(1);
    });

    test('should hide tooltip', () => {
      const hideTooltipSpy = jest
        .spyOn(s2.tooltip, 'hide')
        .mockImplementation(() => {});

      s2.hideTooltip();

      expect(hideTooltipSpy).toHaveBeenCalledTimes(1);
    });

    test('should use default tooltip content from tooltip config first', () => {
      const tooltipContent = 'tooltip content';

      const sheet = new PivotSheet(
        container,
        dataCfg,
        customMerge(s2Options, {
          tooltip: {
            content: tooltipContent,
            autoAdjustBoundary: null,
          } as S2Options['tooltip'],
        }),
      );

      sheet.showTooltipWithInfo({ clientX: 0, clientY: 0 } as MouseEvent, []);

      expect(sheet.tooltip.container!.innerHTML).toEqual(tooltipContent);

      sheet.destroy();
    });

    test.each([
      CellType.ROW_CELL,
      CellType.COL_CELL,
      CellType.DATA_CELL,
      CellType.CORNER_CELL,
    ])(
      'should use %o tooltip content from tooltip config first for string content',
      async (cellType) => {
        const tooltipContent = `${cellType} tooltip content`;
        const defaultTooltipContent = 'default tooltip content';

        jest
          .spyOn(SpreadSheet.prototype, 'getCellType')
          .mockImplementation(() => cellType);

        const sheet = new PivotSheet(
          container,
          dataCfg,
          customMerge(s2Options, {
            tooltip: {
              content: defaultTooltipContent,
              [getCellNameByType(cellType)]: {
                content: tooltipContent,
              },
            } as S2Options['tooltip'],
          }),
        );

        await sheet.render();
        sheet.showTooltipWithInfo({ clientX: 0, clientY: 0 } as MouseEvent, []);

        expect(sheet.tooltip.container!.innerHTML).toEqual(tooltipContent);

        sheet.destroy();
      },
    );

    test.each([CellType.ROW_CELL, CellType.COL_CELL, CellType.DATA_CELL])(
      'should replace %o tooltip content if call showTooltip method for string content',
      async (cellType) => {
        const tooltipContent = `${cellType} tooltip content`;
        const defaultTooltipContent = 'default tooltip content';
        const methodTooltipContent = 'method tooltip content';

        jest
          .spyOn(SpreadSheet.prototype, 'getCellType')
          .mockImplementation(() => cellType);

        const sheet = new PivotSheet(
          container,
          dataCfg,
          customMerge(s2Options, {
            tooltip: {
              content: defaultTooltipContent,
              [getCellNameByType(cellType)]: {
                content: tooltipContent,
              },
            } as S2Options['tooltip'],
          }),
        );

        await sheet.render();
        sheet.showTooltip({
          position: { x: 0, y: 0 },
          content: methodTooltipContent,
        });

        expect(sheet.tooltip.container!.innerHTML).toEqual(
          methodTooltipContent,
        );

        sheet.destroy();
      },
    );

    test.each([CellType.ROW_CELL, CellType.COL_CELL, CellType.DATA_CELL])(
      'should use %o tooltip content from tooltip config first for element content',
      async (cellType) => {
        const tooltipContent = document.createElement('span');
        const defaultTooltipContent = document.createElement('div');

        jest
          .spyOn(SpreadSheet.prototype, 'getCellType')
          .mockImplementation(() => cellType);

        const sheet = new PivotSheet(
          container,
          dataCfg,
          customMerge(s2Options, {
            tooltip: {
              content: defaultTooltipContent,
              [getCellNameByType(cellType)]: {
                content: tooltipContent,
              },
            } as S2Options['tooltip'],
          }),
        );

        await sheet.render();
        sheet.showTooltipWithInfo({ clientX: 0, clientY: 0 } as MouseEvent, []);

        expect(sheet.tooltip.container!.contains(tooltipContent)).toBeTruthy();
        expect(
          sheet.tooltip.container!.contains(defaultTooltipContent),
        ).toBeFalsy();

        sheet.destroy();
      },
    );

    test.each([CellType.ROW_CELL, CellType.COL_CELL, CellType.DATA_CELL])(
      'should replace %o tooltip content if call showTooltip method for element content',
      async (cellType) => {
        const tooltipContent = document.createElement('span');
        const defaultTooltipContent = document.createElement('div');
        const methodTooltipContent = document.createElement('a');

        jest
          .spyOn(SpreadSheet.prototype, 'getCellType')
          .mockImplementation(() => cellType);

        const sheet = new PivotSheet(
          container,
          dataCfg,
          customMerge(s2Options, {
            tooltip: {
              content: defaultTooltipContent,
              [getCellNameByType(cellType)]: {
                content: tooltipContent,
              },
            } as S2Options['tooltip'],
          }),
        );

        await sheet.render();
        sheet.showTooltip({
          position: { x: 0, y: 0 },
          content: methodTooltipContent,
        });

        expect(
          sheet.tooltip.container!.contains(methodTooltipContent),
        ).toBeTruthy();

        sheet.destroy();
      },
    );

    test('should render custom tooltip', () => {
      const customShow = jest.fn();
      const customHide = jest.fn();
      const customDestroy = jest.fn();

      class CustomTooltip extends BaseTooltip {
        constructor(spreadsheet: SpreadSheet) {
          super(spreadsheet);
        }

        public show<T = string | Element, M = BaseTooltipOperatorMenuOptions>(
          showOptions: TooltipShowOptions<T, M>,
        ): void {
          customShow(showOptions);
        }

        public hide(): void {
          customHide();
        }

        public destroy(): void {
          customDestroy();
        }
      }

      const sheet = new PivotSheet(
        container,
        dataCfg,
        customMerge(s2Options, {
          tooltip: {
            enable: true,
            render: (spreadsheet) => new CustomTooltip(spreadsheet),
            autoAdjustBoundary: null,
          } as S2Options['tooltip'],
        }),
      );

      sheet.showTooltipWithInfo({ clientX: 0, clientY: 0 } as MouseEvent, []);
      sheet.hideTooltip();
      sheet.destroyTooltip();

      expect(customShow).toHaveBeenCalled();
      expect(customHide).toHaveBeenCalled();
      expect(customDestroy).toHaveBeenCalled();

      sheet.destroy();
    });

    test('should show invalid custom tooltip warning', async () => {
      const warnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementationOnce(() => {});

      class CustomTooltip {}

      const sheet = new PivotSheet(
        container,
        dataCfg,
        customMerge(s2Options, {
          tooltip: {
            enable: true,
            render: () => new CustomTooltip(),
            autoAdjustBoundary: null,
          },
        }),
      );

      await sheet.render();

      expect(warnSpy).toHaveBeenCalledWith(
        `[Custom Tooltip]: ${(
          sheet.tooltip as unknown
        )?.constructor?.toString()} should be extends from BaseTooltip`,
      );

      sheet.destroy();
    });
  });

  test('should register icons', () => {
    s2.registerIcons();

    expect(getIcon(customSVGIcon.name)).toEqual(customSVGIcon.svg);
  });

  test('should set data config', () => {
    const newDataCfg: S2DataConfig = {
      fields: {
        rows: ['field'],
      },
      data: [],
    };

    s2.setDataCfg(newDataCfg);

    // save original data cfg
    expect(s2.store.get('originalDataCfg')).toEqual(newDataCfg);
    // update data cfg
    expect(s2.dataCfg).toEqual(
      getSafetyDataConfig(originalDataCfg, newDataCfg),
    );
  });

  test('should set options', () => {
    const hideTooltipSpy = jest
      .spyOn(s2.tooltip, 'hide')
      .mockImplementation(() => {});

    const options: Partial<S2Options> = {
      seriesNumber: {
        enable: true,
      },
    };

    s2.setOptions(options);

    // should hide tooltip if options updated
    expect(hideTooltipSpy).toHaveBeenCalledTimes(1);
    expect(s2.options.seriesNumber?.enable).toBeTruthy();
  });

  test('should init new tooltip', () => {
    const tooltipDestroySpy = jest
      .spyOn(s2.tooltip, 'destroy')
      .mockImplementationOnce(() => {});

    class CustomTooltip extends BaseTooltip {}

    s2.setOptions({
      tooltip: {
        render: (spreadsheet) => new CustomTooltip(spreadsheet),
      },
    });

    expect(tooltipDestroySpy).toHaveBeenCalled();
    expect(s2.tooltip).toBeInstanceOf(CustomTooltip);
  });

  test('should refresh brush selection info', () => {
    s2.setOptions({
      interaction: {
        brushSelection: true,
      },
    });

    expect(s2.interaction.getBrushSelection()).toStrictEqual({
      dataCell: true,
      rowCell: true,
      colCell: true,
    });

    s2.setOptions({
      interaction: {
        brushSelection: {
          dataCell: true,
          rowCell: false,
          colCell: false,
        },
      },
    });

    expect(s2.interaction.getBrushSelection()).toStrictEqual({
      dataCell: true,
      rowCell: false,
      colCell: false,
    });
  });

  test('should render sheet', async () => {
    const facetRenderSpy = jest
      .spyOn(s2, 'buildFacet' as any)
      .mockImplementation(() => {});

    const beforeRender = jest.fn();
    const afterRender = jest.fn();

    s2.on(S2Event.LAYOUT_BEFORE_RENDER, beforeRender);
    s2.on(S2Event.LAYOUT_AFTER_RENDER, afterRender);

    await s2.render(false);

    // build facet
    expect(facetRenderSpy).toHaveBeenCalledTimes(1);
    // emit hooks
    expect(beforeRender).toHaveBeenCalledTimes(1);
    expect(afterRender).toHaveBeenCalledTimes(1);
  });

  test('should emit after real dataCell render event', async () => {
    const afterRealDataCellRender = jest.fn();
    const sheet = new PivotSheet(container, dataCfg, s2Options);

    sheet.on(
      S2Event.LAYOUT_AFTER_REAL_DATA_CELL_RENDER,
      afterRealDataCellRender,
    );
    await sheet.render();

    expect(afterRealDataCellRender).toHaveBeenCalledTimes(1);
  });

  test('should emit data cell render event', async () => {
    const cornerCellRender = jest.fn();
    const rowCellRender = jest.fn();
    const colCellRender = jest.fn();
    const dataCellRender = jest.fn();
    const seriesNumberCellRender = jest.fn();
    const layoutCellRender = jest.fn();

    const sheet = createPivotSheet(
      {
        ...s2Options,
        seriesNumber: {
          enable: true,
        },
      },
      { useSimpleData: false },
    );

    sheet.on(S2Event.CORNER_CELL_RENDER, cornerCellRender);
    sheet.on(S2Event.ROW_CELL_RENDER, rowCellRender);
    sheet.on(S2Event.COL_CELL_RENDER, colCellRender);
    sheet.on(S2Event.DATA_CELL_RENDER, dataCellRender);
    sheet.on(S2Event.SERIES_NUMBER_CELL_RENDER, seriesNumberCellRender);
    sheet.on(S2Event.LAYOUT_CELL_RENDER, layoutCellRender);

    await sheet.render();
    await sleep(500);

    expect(dataCellRender).toHaveBeenCalledTimes(8);
    expect(layoutCellRender).toHaveBeenCalledTimes(20);
  });

  test('should updatePagination', () => {
    s2.updatePagination({
      current: 2,
      pageSize: 5,
    });

    expect(s2.options.pagination).toEqual({
      current: 2,
      pageSize: 5,
    });
    // reset scroll bar offset
    expect(s2.store.get('scrollX')).toEqual(0);
    expect(s2.store.get('scrollY')).toEqual(0);
  });

  test('should get content height', () => {
    expect(s2.getContentHeight()).toEqual(120);
  });

  test('should get layout width type', () => {
    expect(s2.getLayoutWidthType()).toEqual('adaptive');
  });

  test('should get row nodes', () => {
    expect(s2.facet.getRowNodes()).toHaveLength(3);
  });

  test('should get column nodes', () => {
    expect(s2.facet.getColNodes()).toHaveLength(3);
  });

  test('should change sheet container size', () => {
    s2.changeSheetSize(1000, 500);

    expect(s2.options.width).toStrictEqual(1000);
    expect(s2.options.height).toStrictEqual(500);

    const canvas = s2.getCanvasElement();

    expect(canvas.style.width).toStrictEqual(`1000px`);
    expect(canvas.style.height).toStrictEqual(`500px`);
  });

  test('should set display:block style with canvas', () => {
    const canvas = s2.getCanvasElement();

    expect(canvas.style.display).toEqual('block');
  });

  test('should update scroll offset', () => {
    const updateScrollOffsetSpy = jest
      .spyOn(s2.facet, 'updateScrollOffset')
      .mockImplementation(() => {});

    s2.updateScrollOffset({});

    expect(updateScrollOffsetSpy).toHaveReturnedTimes(1);
  });

  test('should init canvas groups', () => {
    expect(s2.container).toBeInstanceOf(Canvas);
    expect(s2.container.getConfig().width).toEqual(s2.options.width);
    expect(s2.container.getConfig().height).toEqual(s2.options.height);

    // sheet group
    expect(s2.facet.backgroundGroup.children).toHaveLength(1);
    expect(s2.facet.foregroundGroup.children).toHaveLength(9);

    // panel scroll group
    expect(s2.facet.panelGroup.children).toHaveLength(7);
    expect(
      s2.facet.panelGroup.getElementsByName(KEY_GROUP_PANEL_SCROLL),
    ).toHaveLength(1);
  });

  test.each([
    {
      width: s2Options.width! + 100,
      height: s2Options.height! + 100,
    },
    {
      width: s2Options.width! + 100,
      height: s2Options.height,
    },
    {
      width: s2Options.width,
      height: s2Options.height! + 100,
    },
    {
      width: s2Options.width,
      height: s2Options.height,
    },
  ])(
    'should skip change sheet container size if width and height not changed %o',
    ({ width, height }) => {
      s2.changeSheetSize(s2Options.width, s2Options.height);

      const isCalled = width !== s2Options.width || height !== s2Options.height;

      const changeSizeSpy = jest
        .spyOn(s2.container, 'resize')
        .mockImplementationOnce(() => {});

      s2.changeSheetSize(width, height);

      expect(s2.options.width).toStrictEqual(
        isCalled ? width : s2.options.width,
      );
      expect(s2.options.height).toStrictEqual(
        isCalled ? height : s2.options.height,
      );
      expect(changeSizeSpy).toHaveBeenCalledTimes(isCalled ? 1 : 0);
    },
  );

  test('should init column nodes', () => {
    // [type -> cost, type -> price] => [笔 -> cost, 笔 -> price]
    expect(s2.facet.getInitColLeafNodes()).toHaveLength(2);
  });

  test('should clear init column nodes', () => {
    s2.store.set('initColLeafNodes', [null, null] as unknown as Node[]);

    s2.facet.clearInitColLeafNodes();

    expect(s2.store.get('initColLeafNodes')).toBeFalsy();
  });

  test('should get pivot mode', () => {
    expect(s2.isPivotMode()).toBeTruthy();
    expect(s2.isTableMode()).toBeFalsy();
  });

  test('should get hierarchy type', () => {
    expect(s2.isHierarchyTreeType()).toBeFalsy();
  });

  test('should default frozen row header', () => {
    expect(s2.isFrozenRowHeader()).toBeTruthy();
  });

  test('should get value is in columns', () => {
    expect(s2.isValueInCols()).toBeTruthy();
  });

  test('should get normal header fields status', () => {
    expect(s2.isCustomHeaderFields()).toBeFalsy();
    expect(s2.isCustomRowFields()).toBeFalsy();
    expect(s2.isCustomColumnFields()).toBeFalsy();
  });

  test('should get data set', () => {
    expect(s2.getDataSet()).toBeInstanceOf(PivotDataSet);
  });

  test('should rebuild hidden columns detail by status', async () => {
    // 重新更新, 但是没有隐藏列信息
    await s2.render({ reloadData: false, reBuildHiddenColumnsDetail: true });

    expect(mockHideColumnsByThunkGroup).toHaveBeenCalledTimes(0);

    s2.store.set('hiddenColumnsDetail', [
      null,
    ] as unknown as HiddenColumnsInfo[]);

    // 重新更新, 有隐藏列信息, 但是 reBuildHiddenColumnsDetail 为 false
    await s2.render({
      reloadData: false,
      reBuildHiddenColumnsDetail: false,
    });

    expect(mockHideColumnsByThunkGroup).toHaveBeenCalledTimes(0);

    // 重新更新, 有隐藏列信息, 且 reBuildHiddenColumnsDetail 为 true
    await s2.render({ reloadData: false, reBuildHiddenColumnsDetail: true });

    expect(mockHideColumnsByThunkGroup).toHaveBeenCalledTimes(1);
  });

  test('should clear drill down data', () => {
    const renderSpy = jest
      .spyOn(s2, 'render')
      .mockImplementation(async () => {});

    s2.interaction.addIntercepts([InterceptType.DATA_CELL_BRUSH_SELECTION]);

    const clearDrillDownDataSpy = jest
      .spyOn(s2.dataSet, 'clearDrillDownData' as any)
      .mockImplementation(() => true);

    s2.clearDrillDownData();

    expect(clearDrillDownDataSpy).toHaveBeenCalledTimes(1);

    // rerender
    expect(renderSpy).toHaveBeenCalledTimes(1);
    // reset interaction
    expect(
      s2.interaction.hasIntercepts([InterceptType.DATA_CELL_BRUSH_SELECTION]),
    ).toBeFalsy();

    renderSpy.mockRestore();
  });

  test(`shouldn't rerender without drill down data`, () => {
    const renderSpy = jest
      .spyOn(s2, 'render')
      .mockImplementationOnce(() => Promise.resolve());

    const clearDrillDownDataSpy = jest
      .spyOn(s2.dataSet, 'clearDrillDownData' as any)
      .mockImplementation(() => false);

    s2.clearDrillDownData();

    expect(clearDrillDownDataSpy).toHaveBeenCalledTimes(1);
    // rerender
    expect(renderSpy).toHaveBeenCalledTimes(0);
  });

  test('should get extra field text', async () => {
    const pivotSheet = new PivotSheet(
      container,
      customMerge(originalDataCfg, {
        fields: {
          valueInCols: false,
        },
      }),
      s2Options,
    );

    await pivotSheet.render();
    const extraField = last(pivotSheet.facet.getCornerCells());

    expect(extraField?.getActualText()).toEqual('数值');
  });

  // https://github.com/antvis/S2/issues/1212
  test('should get custom extra field text', async () => {
    const cornerExtraFieldText = 'custom';

    const pivotSheet = new PivotSheet(
      container,
      customMerge(originalDataCfg, {
        fields: {
          valueInCols: false,
        },
      }),
      {
        ...s2Options,
        cornerExtraFieldText,
      },
    );

    await pivotSheet.render();

    const extraField = last(pivotSheet.facet.getCornerCells());

    expect(extraField?.getActualText()).toEqual(cornerExtraFieldText);
  });

  describe('Tree Collapse Tests', () => {
    test('should collapse rows with tree mode', () => {
      s2.setOptions({
        hierarchyType: 'tree',
      });
      const renderSpy = jest
        .spyOn(s2, 'render')
        .mockImplementation(async () => {});

      const collapseRows = jest.fn();

      s2.on(S2Event.ROW_CELL_COLLAPSED, collapseRows);

      const node = { id: 'testId' } as unknown as Node;
      const treeRowType: RowCellCollapsedParams = {
        isCollapsed: false,
        node,
      };

      const collapsedRowsType: RowCellCollapsedParams = {
        isCollapsed: false,
        collapseFields: {
          [node.id]: false,
        },
        node,
      };

      s2.emit(S2Event.ROW_CELL_COLLAPSED__PRIVATE, treeRowType);

      expect(collapseRows).toHaveBeenCalledWith(collapsedRowsType);
      expect(s2.options.style?.rowCell?.collapseFields).toEqual(
        collapsedRowsType.collapseFields,
      );
      expect(renderSpy).toHaveBeenCalledTimes(1);

      renderSpy.mockRestore();
    });

    test('should collapse all rows with tree mode', () => {
      s2.setOptions({
        hierarchyType: 'tree',
        style: { rowCell: { collapseFields: undefined } },
      });

      const renderSpy = jest
        .spyOn(s2, 'render')
        .mockImplementation(async () => {});

      const isCollapsed = true;

      s2.emit(S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE, isCollapsed);

      expect(s2.options.style!.rowCell!.collapseFields).toBeFalsy();
      expect(s2.options.style!.rowCell!.collapseAll).toBeFalsy();
      expect(renderSpy).toHaveBeenCalledTimes(1);

      s2.emit(S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE, !isCollapsed);
      expect(s2.options.style!.rowCell!.collapseFields).toBeFalsy();
      expect(s2.options.style!.rowCell!.collapseAll).toBeTruthy();
      expect(renderSpy).toHaveBeenCalledTimes(2);

      renderSpy.mockRestore();
    });

    test('should update row nodes when collapseAll options changed', async () => {
      const tree = new PivotSheet(getContainer(), dataCfg, {
        ...s2Options,
        hierarchyType: 'tree',
        style: {
          rowCell: {
            collapseAll: true,
          },
        },
      });

      await tree.render();

      expect(tree.facet.getRowNodes().map(({ field }) => field)).toEqual([
        'province',
      ]);

      tree.setOptions({
        style: {
          rowCell: {
            collapseAll: false,
          },
        },
      });
      await tree.render();

      expect(tree.facet.getRowNodes().map(({ field }) => field)).toEqual([
        'province',
        'city',
        'city',
      ]);
    });

    // https://github.com/antvis/S2/issues/1072

    test('should update row nodes when toggle collapse all rows with tree mode', async () => {
      const tree = new PivotSheet(getContainer(), dataCfg, {
        ...s2Options,
        hierarchyType: 'tree',
      });

      await tree.render();

      const isCollapsed = true;

      await waitForRender(tree, () => {
        tree.emit(S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE, isCollapsed);
      });

      expect(tree.facet.getRowNodes().map(({ field }) => field)).toEqual([
        'province',
        'city',
        'city',
      ]);

      await waitForRender(tree, () => {
        tree.emit(S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE, !isCollapsed);
      });
      expect(tree.facet.getRowNodes().map(({ field }) => field)).toEqual([
        'province',
      ]);
    });
  });

  // https://github.com/antvis/S2/issues/1421
  test.each(['zh_CN', 'en_US'] as LangType[])(
    'should render group sort menu',
    async (lang) => {
      setLang(lang);
      const sheet = new PivotSheet(container, dataCfg, s2Options);

      await sheet.render();

      const showTooltipWithInfoSpy = jest
        .spyOn(sheet, 'showTooltipWithInfo')
        .mockImplementation(() => {});

      const event = {
        stopPropagation() {},
      } as GEvent;

      sheet.handleGroupSort(event, null as unknown as Node);

      const isEnUS = lang === 'en_US';
      const groupAscText = isEnUS ? 'Group ASC' : '组内升序';
      const groupDescText = isEnUS ? 'Group DESC' : '组内降序';
      const groupNoneText = isEnUS ? 'No order' : '不排序';

      const options: TooltipOptions = {
        onlyShowOperator: true,
        forceRender: true,
        operator: {
          menu: {
            items: [
              { icon: 'groupAsc', key: 'asc', label: groupAscText },
              { icon: 'groupDesc', key: 'desc', label: groupDescText },
              { key: 'none', label: groupNoneText },
            ],
            onClick: expect.anything(),
            defaultSelectedKeys: [],
          },
        },
      };

      expect(showTooltipWithInfoSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.anything(),
        options,
      );
      sheet.destroy();
    },
  );

  test('should handle group sort', () => {
    const renderSpy = jest
      .spyOn(s2, 'render')
      .mockImplementation(async () => {});

    const showTooltipWithInfoSpy = jest
      .spyOn(s2, 'showTooltipWithInfo')
      .mockImplementation((_, __, options) => {
        return {
          forceRender: options?.forceRender,
        } as unknown as void;
      });

    const nodeMeta = new Node({ id: '1', field: '1', value: 'testValue' });

    s2.handleGroupSort(
      {
        stopPropagation() {},
      } as GEvent,
      nodeMeta,
    );

    expect(showTooltipWithInfoSpy).toHaveReturnedWith({ forceRender: true });

    s2.groupSortByMethod('asc', nodeMeta);

    expect(s2.dataCfg.sortParams).toEqual([
      {
        query: undefined,
        sortByMeasure: nodeMeta.value,
        sortFieldId: 'city',
        sortMethod: 'asc',
      },
    ]);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(s2.store.get('sortMethodMap')).toEqual({
      '1': 'asc',
    });
    expect(s2.getMenuDefaultSelectedKeys(nodeMeta.id)).toEqual(['asc']);

    s2.groupSortByMethod('desc', nodeMeta);

    expect(s2.dataCfg.sortParams).toEqual([
      {
        query: undefined,
        sortByMeasure: nodeMeta.value,
        sortFieldId: 'city',
        sortMethod: 'desc',
      },
    ]);

    expect(s2.store.get('sortMethodMap')).toEqual({
      '1': 'desc',
    });
    expect(s2.getMenuDefaultSelectedKeys(nodeMeta.id)).toEqual(['desc']);
    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
    expect(renderSpy).toHaveBeenCalledTimes(2);

    renderSpy.mockRestore();
  });

  test('should handle group sort when hideValue', () => {
    const nodeMeta = new Node({
      id: '1',
      field: '1',
      value: 'testValue',
      query: {
        type: '笔',
      },
    });

    s2.options.style!.colCell!.hideValue = true;
    s2.groupSortByMethod('asc', nodeMeta);

    expect(s2.dataCfg.sortParams).toEqual([
      {
        query: { $$extra$$: 'price', type: '笔' },
        sortByMeasure: 'price',
        sortFieldId: 'city',
        sortMethod: 'asc',
      },
    ]);
    expect(s2.getMenuDefaultSelectedKeys(nodeMeta.id)).toEqual(['asc']);
  });

  test('should destroy sheet', async () => {
    const facetDestroySpy = jest
      .spyOn(s2.facet, 'destroy')
      .mockImplementationOnce(() => {});

    const hdAdapterDestroySpy = jest
      .spyOn(s2.hdAdapter, 'destroy')
      .mockImplementationOnce(() => {});

    await s2.render(false);

    s2.store.set('test', 111);

    // restore mock...
    const tooltipShowSpy = jest
      .spyOn(s2.tooltip, 'show')
      .mockImplementationOnce(() => {});

    tooltipShowSpy.mockRestore();
    s2.showTooltip({
      position: {
        x: 10,
        y: 10,
      },
      content: () => 'custom callback content',
    });
    s2.hideTooltip();
    s2.tooltip.container!.classList.add('destroy-test');
    s2.interaction.addIntercepts([InterceptType.HOVER]);
    s2.interaction.interactions.set(
      'test-interaction',
      null as unknown as BaseEvent,
    );
    const destroyFn = jest.fn();

    s2.container.addEventListener(CanvasEvent.AFTER_DESTROY, destroyFn);
    s2.destroy();

    // clear store
    expect(s2.store.size()).toEqual(0);
    // clear interaction
    expect(s2.interaction.getState()).toEqual({
      cells: [],
      force: false,
    });
    expect(s2.interaction.getHoverTimer()).toBeNull();
    expect(s2.interaction.interactions.size).toEqual(0);
    expect(s2.interaction.intercepts.size).toEqual(0);
    expect(s2.interaction.eventController.canvasEventHandlers).toHaveLength(0);
    expect(s2.interaction.eventController.s2EventHandlers).toHaveLength(0);
    expect(s2.interaction.eventController.domEventListeners).toHaveLength(0);
    // destroy tooltip
    expect(document.querySelector('.destroy-test')).toBe(null);
    expect(s2.tooltip.container).toBe(null);
    // destroy facet
    expect(facetDestroySpy).toHaveBeenCalledTimes(1);
    // destroy hdAdapter
    expect(hdAdapterDestroySpy).toHaveBeenCalledTimes(1);
    // clear all sheet events
    expect(s2.getEvents()).toEqual({});
    // clear all canvas events

    // g5.0 destroy
    expect(destroyFn).toHaveBeenCalled();
    expect(document.body.contains(s2.getCanvasElement())).toBeFalse();
  });

  describe('Test Layout by dataCfg fields', () => {
    beforeEach(() => {
      s2.destroy();
    });

    it('should render column leaf nodes if column fields is empty but config values fields', async () => {
      const layoutDataCfg: S2DataConfig = customMerge(dataCfg, {
        fields: {
          columns: [],
        },
      } as unknown as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);

      await sheet.render();

      expect(sheet.facet.getColLeafNodes()).toHaveLength(
        originalDataCfg.fields.values.length,
      );
      expect(sheet.facet.getColNodes()).toHaveLength(
        originalDataCfg.fields.values.length,
      );
      expect(sheet.dataCfg.fields.valueInCols).toBeTruthy();
    });

    it('should render empty row nodes if rows fields is empty', async () => {
      const layoutDataCfg: S2DataConfig = customMerge(dataCfg, {
        fields: {
          rows: [],
        },
      } as unknown as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);

      await sheet.render();

      expect(sheet.facet.getRowLeafNodes()).toHaveLength(0);
      expect(sheet.facet.getRowNodes()).toHaveLength(0);
      expect(sheet.dataCfg.fields.valueInCols).toBeTruthy();
    });

    it('should render row nodes if rows fields contain empty string value', async () => {
      const layoutDataCfg: S2DataConfig = {
        fields: {
          rows: ['row'],
        },
        data: [
          {
            row: 'a',
          },
          {
            row: '',
          },
        ],
      } as S2DataConfig;
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);

      await sheet.render();

      expect(sheet.facet.getRowNodes()).toHaveLength(2);
    });

    it('should only render value nodes in column if rows & columns fields is empty', async () => {
      const layoutDataCfg: S2DataConfig = customMerge(dataCfg, {
        fields: {
          rows: [],
          columns: [],
        },
      } as unknown as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);

      await sheet.render();

      expect(sheet.facet.getColLeafNodes()).toHaveLength(
        originalDataCfg.fields.values.length,
      );
      expect(sheet.facet.getColNodes()).toHaveLength(
        originalDataCfg.fields.values.length,
      );
    });

    // https://github.com/antvis/S2/issues/777
    it('should cannot render row leaf nodes if values is empty', async () => {
      const layoutDataCfg: S2DataConfig = customMerge(originalDataCfg, {
        fields: {
          values: [],
          valueInCols: true,
        },
      } as unknown as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);

      await sheet.render();

      const layoutResult = sheet.facet.getLayoutResult();

      // if value empty, not render value cell in row leaf nodes
      expect(layoutResult.rowLeafNodes).toHaveLength(0);
      expect(layoutResult.colNodes).toHaveLength(
        originalDataCfg.fields.columns.length,
      );
      expect(layoutResult.colLeafNodes).toHaveLength(
        originalDataCfg.fields.columns.length,
      );
      expect(layoutResult.colNodes[0].field).toEqual(
        originalDataCfg.fields.columns[0],
      );
      // modify valueInCols config
      expect(sheet.dataCfg.fields.valueInCols).toBeFalsy();

      sheet.destroy();
    });

    // https://github.com/antvis/S2/issues/1514
    it('should not show default action icons if values is empty', async () => {
      const layoutDataCfg: S2DataConfig = customMerge(originalDataCfg, {
        fields: {
          values: [],
          valueInCols: true,
        },
      } as unknown as S2DataConfig);

      const sheet = new PivotSheet(getContainer(), layoutDataCfg, {
        width: 400,
        height: 200,
        showDefaultHeaderActionIcon: true,
        hierarchyType: 'tree',
      });

      await sheet.render();

      sheet.facet.getRowLeafNodes().forEach((node) => {
        const rowCell = node.belongsCell as HeaderCell;

        expect(rowCell.getActionIcons()).toBeEmpty();
      });

      sheet.destroy();
    });
  });

  test('should emit destroy event', async () => {
    const onDestroy = jest.fn();

    const sheet = new PivotSheet(container, dataCfg, s2Options);

    await sheet.render();
    sheet.on(S2Event.LAYOUT_DESTROY, onDestroy);

    sheet.destroy();

    expect(onDestroy).toHaveBeenCalledTimes(1);
  });

  test('should get custom header fields status', async () => {
    const newDataCfg: S2DataConfig = {
      fields: {
        rows: [{ field: '1', title: '1' }],
        columns: [{ field: '2', title: '2' }],
      },
      data: [],
    };

    s2.setDataCfg(newDataCfg);
    await s2.render();

    expect(s2.isCustomHeaderFields()).toBeTruthy();
    expect(s2.isCustomRowFields()).toBeTruthy();
    expect(s2.isCustomColumnFields()).toBeTruthy();
  });

  test('should render custom pivot facet', async () => {
    const mockRender = jest.fn();

    class CustomFacet extends PivotFacet {
      render() {
        super.render();
        mockRender();
      }
    }

    const sheet = new PivotSheet(getContainer(), originalDataCfg, {
      facet: (spreadsheet) => new CustomFacet(spreadsheet),
      tooltip: {
        enable: false,
      },
    });

    await sheet.render();

    expect(sheet.facet).toBeInstanceOf(PivotFacet);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
