import { DEFAULT_STYLE } from '@antv/s2';
import { getSheetComponentOptions } from '@/utils/options';

describe('Options Tests', () => {
  test('should get safety options', () => {
    const options = getSheetComponentOptions();

    expect(options.tooltip.renderTooltip).toBeFunction();

    Reflect.deleteProperty(options.tooltip, 'renderTooltip');
    expect(options).toStrictEqual({
      width: 600,
      height: 480,
      debug: false,
      hierarchyType: 'grid',
      conditions: {},
      totals: {},
      tooltip: {
        showTooltip: true,
        autoAdjustBoundary: 'body',
        operation: { hiddenColumns: true, trend: false, sort: true },
      },
      interaction: {
        linkFields: [],
        hiddenColumnFields: [],
        selectedCellsSpotlight: false,
        hoverHighlight: true,
        hoverFocus: true,
        scrollSpeedRatio: { horizontal: 1, vertical: 1 },
        autoResetSheetStyle: true,
        scrollbarPosition: 'content',
        resize: {
          rowCellVertical: true,
          cornerCellHorizontal: true,
          colCellHorizontal: true,
          colCellVertical: true,
          rowResizeType: 'all',
        },
      },
      showSeriesNumber: false,
      scrollReachNodeField: {},
      customSVGIcons: [],
      customHeaderCells: null,
      showDefaultHeaderActionIcon: true,
      headerActionIcons: [],
      style: DEFAULT_STYLE,
      frozenRowHeader: true,
      frozenRowCount: 0,
      frozenColCount: 0,
      frozenTrailingRowCount: 0,
      frozenTrailingColCount: 0,
      hdAdapter: true,
      cornerText: '',
      placeholder: '-',
      supportCSSTransform: false,
    });
  });

  test('should get custom options', () => {
    const options = getSheetComponentOptions({
      tooltip: {
        showTooltip: false,
        operation: {
          sort: false,
        },
      },
    });

    expect(options.tooltip.renderTooltip).toBeFunction();

    Reflect.deleteProperty(options.tooltip, 'renderTooltip');

    expect(options.tooltip).toStrictEqual({
      showTooltip: false,
      autoAdjustBoundary: 'body',
      operation: {
        hiddenColumns: true,
        trend: false,
        sort: false,
      },
    });
  });
});
