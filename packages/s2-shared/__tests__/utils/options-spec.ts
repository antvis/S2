import { DEFAULT_STYLE, HOVER_FOCUS_DURATION } from '@antv/s2';
import { getBaseSheetComponentOptions } from '../../src';

describe('Options Tests', () => {
  test('should get safety options', () => {
    const options = getBaseSheetComponentOptions();

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
        operation: { hiddenColumns: true, trend: false, sort: true, menus: [] },
      },
      interaction: {
        linkFields: [],
        hiddenColumnFields: [],
        selectedCellsSpotlight: false,
        hoverHighlight: true,
        hoverFocus: { duration: HOVER_FOCUS_DURATION },
        brushSelection: true,
        multiSelection: true,
        rangeSelection: true,
        scrollSpeedRatio: {
          horizontal: 1,
          vertical: 1,
        },
        scrollbarPosition: 'content',
        autoResetSheetStyle: true,
        resize: {
          rowCellVertical: true,
          cornerCellHorizontal: true,
          colCellHorizontal: true,
          colCellVertical: true,
          rowResizeType: 'all',
        },
        eventListenerOptions: false,
        overscrollBehavior: 'auto',
      },
      showSeriesNumber: false,
      customSVGIcons: [],
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
      cornerExtraFieldText: '',
      placeholder: '-',
      supportCSSTransform: false,
      devicePixelRatio: window.devicePixelRatio,
    });
  });

  test('should get custom options', () => {
    const options = getBaseSheetComponentOptions({
      tooltip: {
        showTooltip: false,
        operation: {
          sort: false,
          menus: [
            {
              key: 'custom',
              text: 'custom',
            },
          ],
        },
      },
    });

    expect(options.tooltip).toStrictEqual({
      showTooltip: false,
      autoAdjustBoundary: 'body',
      operation: {
        hiddenColumns: true,
        trend: false,
        sort: false,
        menus: [
          {
            key: 'custom',
            text: 'custom',
          },
        ],
      },
    });
  });
});
