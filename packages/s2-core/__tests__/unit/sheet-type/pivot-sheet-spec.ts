// eslint-disable-next-line max-classes-per-file
import { getContainer } from 'tests/util/helpers';
import * as dataCfg from 'tests/data/simple-data.json';
import { Canvas, Event as GEvent } from '@antv/g-canvas';
import { cloneDeep } from 'lodash';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import {
  CellTypes,
  CustomSVGIcon,
  getIcon,
  InterceptType,
  KEY_GROUP_PANEL_SCROLL,
  RowCellCollapseTreeRowsType,
  S2DataConfig,
  S2Event,
  S2Options,
  TooltipShowOptions,
  TOOLTIP_CONTAINER_CLS,
} from '@/common';
import { Node } from '@/facet/layout/node';
import { customMerge, getSafetyDataConfig } from '@/utils';
import { BaseTooltip } from '@/ui/tooltip';

const originalDataCfg = cloneDeep(dataCfg);

describe('PivotSheet Tests', () => {
  let s2: PivotSheet;

  const customSVGIcon: CustomSVGIcon = {
    name: 'test',
    svg: '===',
  };

  const s2Options: S2Options = {
    width: 100,
    height: 100,
    hierarchyType: 'grid',
    customSVGIcons: [customSVGIcon],
    tooltip: {
      showTooltip: true,
    },
    interaction: {
      autoResetSheetStyle: false,
    },
  };

  let container: HTMLDivElement;

  beforeAll(() => {
    container = getContainer();
    s2 = new PivotSheet(container, dataCfg, s2Options);
    s2.render();
  });

  afterAll(() => {
    container?.remove();
    s2?.destroy();
  });

  describe('PivotSheet Tooltip Tests', () => {
    const getCellNameByType = (cellType: CellTypes) => {
      return {
        [CellTypes.ROW_CELL]: 'row',
        [CellTypes.COL_CELL]: 'col',
        [CellTypes.DATA_CELL]: 'data',
        [CellTypes.CORNER_CELL]: 'corner',
      }[cellType];
    };

    test('should support callback tooltip content for string', () => {
      s2.showTooltip({
        position: {
          x: 10,
          y: 10,
        },
        content: () => 'custom callback content',
      });

      expect(s2.tooltip.container.innerHTML).toEqual('custom callback content');
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

      expect(s2.tooltip.container.contains(content)).toBeTruthy();
    });

    test('should init tooltip', () => {
      s2.showTooltip({ position: { x: 0, y: 0 } });

      expect(s2.tooltip.container.className).toEqual(
        `${TOOLTIP_CONTAINER_CLS} ${TOOLTIP_CONTAINER_CLS}-show`,
      );
    });

    test('should destroy tooltip', () => {
      s2.tooltip.destroy();

      // remove container
      expect(s2.tooltip.container.children).toHaveLength(0);
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

    test("should dont't show tooltip when call showTooltipWithInfo if disable tooltip", () => {
      Object.defineProperty(s2.options, 'tooltip', {
        value: {
          showTooltip: false,
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
          showTooltip: true,
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

      expect(sheet.tooltip.container.innerHTML).toEqual(tooltipContent);

      sheet.destroy();
    });

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
        sheet.render();
        sheet.showTooltipWithInfo({ clientX: 0, clientY: 0 } as MouseEvent, []);

        expect(sheet.tooltip.container.innerHTML).toEqual(tooltipContent);

        sheet.destroy();
      },
    );

    test.each([CellTypes.ROW_CELL, CellTypes.COL_CELL, CellTypes.DATA_CELL])(
      'should replace %o tooltip content if call showTooltip method for string content',
      (cellType) => {
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
        sheet.render();
        sheet.showTooltip({
          position: { x: 0, y: 0 },
          content: methodTooltipContent,
        });

        expect(sheet.tooltip.container.innerHTML).toEqual(methodTooltipContent);

        sheet.destroy();
      },
    );

    test.each([CellTypes.ROW_CELL, CellTypes.COL_CELL, CellTypes.DATA_CELL])(
      'should use %o tooltip content from tooltip config first for element content',
      (cellType) => {
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
        sheet.render();
        sheet.showTooltipWithInfo({ clientX: 0, clientY: 0 } as MouseEvent, []);

        expect(sheet.tooltip.container.contains(tooltipContent)).toBeTruthy();
        expect(
          sheet.tooltip.container.contains(defaultTooltipContent),
        ).toBeFalsy();

        sheet.destroy();
      },
    );

    test.each([CellTypes.ROW_CELL, CellTypes.COL_CELL, CellTypes.DATA_CELL])(
      'should replace %o tooltip content if call showTooltip method for element content',
      (cellType) => {
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
        sheet.render();
        sheet.showTooltip({
          position: { x: 0, y: 0 },
          content: methodTooltipContent,
        });

        expect(
          sheet.tooltip.container.contains(methodTooltipContent),
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

        public show<T = string | Element>(
          showOptions: TooltipShowOptions<T>,
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
            showTooltip: true,
            renderTooltip: (spreadsheet) => new CustomTooltip(spreadsheet),
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

    test('should show invalid custom tooltip warning', () => {
      const warnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementationOnce(() => {});
      class CustomTooltip {}

      const sheet = new PivotSheet(
        container,
        dataCfg,
        customMerge(s2Options, {
          tooltip: {
            showTooltip: true,
            renderTooltip: () => new CustomTooltip(),
            autoAdjustBoundary: null,
          },
        }),
      );

      sheet.render();

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
    expect(s2.dataCfg).toEqual(getSafetyDataConfig(newDataCfg));
  });

  test('should set options', () => {
    const hideTooltipSpy = jest
      .spyOn(s2.tooltip, 'hide')
      .mockImplementation(() => {});

    const options: Partial<S2Options> = {
      showSeriesNumber: true,
    };

    s2.setOptions(options);

    // should hide tooltip if options updated
    expect(hideTooltipSpy).toHaveBeenCalledTimes(1);
    expect(s2.options.showSeriesNumber).toBeTruthy();
  });

  test('should render sheet', () => {
    const facetRenderSpy = jest
      .spyOn(s2, 'buildFacet' as any)
      .mockImplementation(() => {});

    const beforeRender = jest.fn();
    const afterRender = jest.fn();

    s2.on(S2Event.LAYOUT_BEFORE_RENDER, beforeRender);
    s2.on(S2Event.LAYOUT_AFTER_RENDER, afterRender);

    s2.render(false);

    // build facet
    expect(facetRenderSpy).toHaveBeenCalledTimes(1);
    // emit hooks
    expect(beforeRender).toHaveBeenCalledTimes(1);
    expect(afterRender).toHaveBeenCalledTimes(1);
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
    expect(s2.getRowNodes()).toHaveLength(3);
  });

  test('should get column nodes', () => {
    expect(s2.getColumnNodes()).toHaveLength(3);
  });

  test('should change sheet container size', () => {
    s2.changeSheetSize(1000, 500);

    expect(s2.options.width).toStrictEqual(1000);
    expect(s2.options.height).toStrictEqual(500);

    const canvas = s2.container.get('el') as HTMLCanvasElement;

    expect(canvas.style.width).toStrictEqual(`1000px`);
    expect(canvas.style.height).toStrictEqual(`500px`);
  });

  test('should set display:block style with canvas', () => {
    const canvas = s2.container.get('el') as HTMLCanvasElement;

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
    expect(s2.container.get('width')).toEqual(s2.options.width);
    expect(s2.container.get('height')).toEqual(s2.options.height);

    // sheet group
    expect(s2.backgroundGroup.getChildren()).toHaveLength(1);
    expect(s2.foregroundGroup.getChildren()).toHaveLength(9);

    // panel scroll group
    expect(s2.panelGroup.getChildren()).toHaveLength(1);
    expect(s2.panelGroup.findAllByName(KEY_GROUP_PANEL_SCROLL)).toHaveLength(1);
  });

  test.each([
    {
      width: s2Options.width + 100,
      height: s2Options.height + 100,
    },
    {
      width: s2Options.width + 100,
      height: s2Options.height,
    },
    {
      width: s2Options.width,
      height: s2Options.height + 100,
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
        .spyOn(s2.container, 'changeSize')
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
    expect(s2.getInitColumnLeafNodes()).toHaveLength(2);
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
    expect(s2.isScrollContainsRowHeader()).toBeFalsy();
  });

  test('should get value is in columns', () => {
    expect(s2.isValueInCols()).toBeTruthy();
  });

  test('should clear drill down data', () => {
    const renderSpy = jest.spyOn(s2, 'render').mockImplementation(() => {});

    s2.interaction.addIntercepts([InterceptType.BRUSH_SELECTION]);

    const clearDrillDownDataSpy = jest
      .spyOn(s2.dataSet, 'clearDrillDownData' as any)
      .mockImplementation(() => {});

    s2.clearDrillDownData();

    expect(clearDrillDownDataSpy).toHaveBeenCalledTimes(1);

    // rerender
    expect(renderSpy).toHaveBeenCalledTimes(1);
    // reset interaction
    expect(
      s2.interaction.hasIntercepts([InterceptType.BRUSH_SELECTION]),
    ).toBeFalsy();

    renderSpy.mockRestore();
  });

  describe('Tree Collapse Tests', () => {
    test('should collapse rows with tree mode', () => {
      s2.setOptions({
        hierarchyType: 'tree',
      });
      const renderSpy = jest.spyOn(s2, 'render').mockImplementation(() => {});

      const collapseRows = jest.fn();
      const afterCollapseRows = jest.fn();

      s2.on(S2Event.LAYOUT_COLLAPSE_ROWS, collapseRows);
      s2.on(S2Event.LAYOUT_AFTER_COLLAPSE_ROWS, afterCollapseRows);

      const treeRowType: RowCellCollapseTreeRowsType = {
        id: 'testId',
        isCollapsed: false,
        node: null,
      };

      const collapsedRowsType = {
        collapsedRows: {
          [treeRowType.id]: treeRowType.isCollapsed,
        },
        meta: null,
      };

      s2.emit(S2Event.ROW_CELL_COLLAPSE_TREE_ROWS, treeRowType);

      expect(collapseRows).toHaveBeenCalledWith(collapsedRowsType);
      expect(afterCollapseRows).toHaveBeenCalledWith(collapsedRowsType);
      expect(s2.options.style.collapsedRows).toEqual(
        collapsedRowsType.collapsedRows,
      );
      expect(renderSpy).toHaveBeenCalledTimes(1);

      renderSpy.mockRestore();
    });

    test('should collapse all rows with tree mode', () => {
      s2.setOptions({ hierarchyType: 'tree', style: { collapsedRows: null } });

      const renderSpy = jest.spyOn(s2, 'render').mockImplementation(() => {});

      const isCollapsed = true;

      s2.emit(S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL, isCollapsed);

      expect(s2.options.style.collapsedRows).toEqual(null);
      expect(s2.options.hierarchyCollapse).toBeFalsy();
      expect(renderSpy).toHaveBeenCalledTimes(1);

      s2.emit(S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL, !isCollapsed);
      expect(s2.options.style.collapsedRows).toEqual(null);
      expect(s2.options.hierarchyCollapse).toBeTruthy();
      expect(renderSpy).toHaveBeenCalledTimes(2);

      renderSpy.mockRestore();
    });

    test('should update row nodes when hierarchyCollapse options changed', () => {
      const tree = new PivotSheet(getContainer(), dataCfg, {
        ...s2Options,
        hierarchyType: 'tree',
        hierarchyCollapse: true,
      });
      tree.render();

      expect(
        tree.facet.layoutResult.rowNodes.map(({ field }) => field),
      ).toEqual(['province']);

      tree.setOptions({
        hierarchyCollapse: false,
      });
      tree.render();

      expect(
        tree.facet.layoutResult.rowNodes.map(({ field }) => field),
      ).toEqual(['province', 'city', 'city']);
    });

    // https://github.com/antvis/S2/issues/1072

    test('should update row nodes when toggle collapse all rows with tree mode', () => {
      const tree = new PivotSheet(getContainer(), dataCfg, {
        ...s2Options,
        hierarchyType: 'tree',
      });
      tree.render();

      const isCollapsed = true;

      tree.emit(S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL, isCollapsed);

      expect(
        tree.facet.layoutResult.rowNodes.map(({ field }) => field),
      ).toEqual(['province', 'city', 'city']);

      tree.emit(S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL, !isCollapsed);
      expect(
        tree.facet.layoutResult.rowNodes.map(({ field }) => field),
      ).toEqual(['province']);
    });
  });

  test('should handle group sort', () => {
    const renderSpy = jest.spyOn(s2, 'render').mockImplementation(() => {});

    const showTooltipWithInfoSpy = jest
      .spyOn(s2, 'showTooltipWithInfo')
      .mockImplementation(() => {});

    const nodeMeta = new Node({ id: '1', key: '1', value: 'testValue' });

    s2.handleGroupSort(
      {
        stopPropagation() {},
      } as GEvent,
      nodeMeta,
    );

    expect(showTooltipWithInfoSpy).toHaveBeenCalledTimes(1);

    s2.groupSortByMethod('asc', nodeMeta);

    expect(s2.dataCfg.sortParams).toEqual([
      {
        query: undefined,
        sortByMeasure: nodeMeta.value,
        sortFieldId: 'field',
        sortMethod: 'asc',
      },
    ]);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    s2.groupSortByMethod('desc', nodeMeta);

    expect(s2.dataCfg.sortParams).toEqual([
      {
        query: undefined,
        sortByMeasure: nodeMeta.value,
        sortFieldId: 'field',
        sortMethod: 'desc',
      },
    ]);
    expect(renderSpy).toHaveBeenCalledTimes(2);

    renderSpy.mockRestore();
  });

  test('should handle group sort when hideMeasureColumn', () => {
    const nodeMeta = new Node({
      id: '1',
      key: '1',
      value: 'testValue',
      query: {
        type: '笔',
      },
    });
    s2.options.style.colCfg.hideMeasureColumn = true;
    s2.groupSortByMethod('asc', nodeMeta);
    expect(s2.dataCfg.sortParams).toEqual([
      {
        query: { $$extra$$: 'price', type: '笔' },
        sortByMeasure: 'price',
        sortFieldId: 'field',
        sortMethod: 'asc',
      },
    ]);
  });

  test('should destroy sheet', () => {
    const facetDestroySpy = jest
      .spyOn(s2.facet, 'destroy')
      .mockImplementationOnce(() => {});

    const hdAdapterDestroySpy = jest
      .spyOn(s2.hdAdapter, 'destroy')
      .mockImplementationOnce(() => {});

    s2.render(false);

    s2.store.set('test', 111);
    s2.tooltip.container.classList.add('destroy-test');
    s2.interaction.addIntercepts([InterceptType.HOVER]);
    s2.interaction.interactions.set('test-interaction', null);
    s2.container.on('test-event', () => {});
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
    expect(s2.tooltip.container.children).toHaveLength(0);
    // destroy facet
    expect(facetDestroySpy).toHaveBeenCalledTimes(1);
    // destroy hdAdapter
    expect(hdAdapterDestroySpy).toHaveBeenCalledTimes(1);
    // clear all sheet events
    expect(s2.getEvents()).toEqual({});
    // clear all canvas events
    expect(s2.container.getEvents()).toEqual({});
    // clear canvas group and shapes
    expect(s2.container.getChildren()).not.toBeDefined();
    // destroy canvas
    expect(s2.container.get('el')).not.toBeDefined();
  });

  describe('Test Layout by dataCfg fields', () => {
    beforeEach(() => {
      s2.destroy();
    });

    it('should render column leaf nodes if column fields is empty but config values fields', () => {
      const layoutDataCfg: S2DataConfig = customMerge(dataCfg, {
        fields: {
          columns: [],
        },
      } as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);
      sheet.render();

      const { layoutResult } = sheet.facet;

      expect(layoutResult.colLeafNodes).toHaveLength(
        originalDataCfg.fields.values.length,
      );
      expect(layoutResult.colNodes).toHaveLength(
        originalDataCfg.fields.values.length,
      );
      expect(sheet.dataCfg.fields.valueInCols).toBeTruthy();
    });

    it('should render empty row nodes if rows fields is empty', () => {
      const layoutDataCfg: S2DataConfig = customMerge(dataCfg, {
        fields: {
          rows: [],
        },
      } as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);
      sheet.render();

      const { layoutResult } = sheet.facet;

      expect(layoutResult.rowLeafNodes).toHaveLength(0);
      expect(layoutResult.rowNodes).toHaveLength(0);
      expect(sheet.dataCfg.fields.valueInCols).toBeTruthy();
    });

    it('should render row nodes if rows fields contain empty string value', () => {
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
      sheet.render();

      const { layoutResult } = sheet.facet;
      expect(layoutResult.rowNodes).toHaveLength(2);
    });

    it('should only render value nodes in column if rows & columns fields is empty', () => {
      const layoutDataCfg: S2DataConfig = customMerge(dataCfg, {
        fields: {
          rows: [],
          columns: [],
        },
      } as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);
      sheet.render();

      const { layoutResult } = sheet.facet;

      expect(layoutResult.colLeafNodes).toHaveLength(
        originalDataCfg.fields.values.length,
      );
      expect(layoutResult.colNodes).toHaveLength(
        originalDataCfg.fields.values.length,
      );
    });

    // https://github.com/antvis/S2/issues/777
    it('should cannot render row leaf nodes if values is empty', () => {
      const layoutDataCfg: S2DataConfig = customMerge(originalDataCfg, {
        fields: {
          values: [],
          valueInCols: true,
        },
      } as S2DataConfig);
      const sheet = new PivotSheet(getContainer(), layoutDataCfg, s2Options);
      sheet.render();

      const { layoutResult } = sheet.facet;
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
    });
  });
});
