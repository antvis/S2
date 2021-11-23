import { DEFAULT_STYLE } from '@antv/s2';
import { getSafetyOptions } from '@/utils/merge';
import { getTooltipComponent } from '@/utils/tooltip';

describe('merge test', () => {
  test('should get safety options', () => {
    expect(getSafetyOptions(null)).toStrictEqual({
      width: 600,
      height: 480,
      debug: false,
      hierarchyType: 'grid',
      conditions: {},
      totals: {},
      tooltip: {
        showTooltip: true,
        autoAdjustBoundary: 'body',
        operation: {
          hiddenColumns: true,
          trend: false,
          sort: true,
        },
        getTooltipComponent,
      },
      interaction: {
        linkFields: [],
        hiddenColumnFields: [],
        selectedCellsSpotlight: false,
        hoverHighlight: true,
        scrollSpeedRatio: {
          horizontal: 1,
          vertical: 1,
        },
        autoResetSheetStyle: true,
      },
      frozenRowHeader: true,
      showSeriesNumber: false,
      scrollReachNodeField: {},
      customSVGIcons: [],
      customHeaderCells: null,
      showDefaultHeaderActionIcon: true,
      headerActionIcons: [],
      style: DEFAULT_STYLE,
      frozenRowCount: 0,
      frozenColCount: 0,
      frozenTrailingRowCount: 0,
      frozenTrailingColCount: 0,
      hdAdapter: true,
    });
  });

  test('should get custom options', () => {
    const options = getSafetyOptions({
      tooltip: {
        showTooltip: false,
        operation: {
          sort: false,
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
      },
      getTooltipComponent,
    });
  });
});
