import { DEFAULT_STYLE } from '@/common/constant/options';
import {
  customMerge,
  getSafetyDataConfig,
  getSafetyOptions,
} from '@/utils/merge';

describe('merge test', () => {
  test('should replace old array with new one', () => {
    expect(customMerge({ arr: [1, 2, 3] }, { arr: [4, 5, 6] })).toEqual({
      arr: [4, 5, 6],
    });
  });

  test('should force replace empty array', () => {
    expect(customMerge({ arr: [1, 2, 3] }, { arr: [] })).toEqual({
      arr: [],
    });
  });

  test('should get safety data config', () => {
    expect(getSafetyDataConfig(null)).toStrictEqual({
      data: [],
      totalData: [],
      fields: {
        rows: [],
        columns: [],
        values: [],
        customTreeItems: [],
        valueInCols: true,
      },
      meta: [],
      sortParams: [],
      filterParams: [],
    });
  });

  test('should cancel valueInCols if customTreeItems is not empty by get safety data config', () => {
    const fields = {
      customTreeItems: [{ key: '1', title: 'test' }],
    };
    expect(
      getSafetyDataConfig({
        fields: fields,
      }),
    ).toStrictEqual({
      data: [],
      totalData: [],
      fields: {
        ...fields,
        rows: [],
        columns: [],
        values: [],
        valueInCols: false,
      },
      meta: [],
      sortParams: [],
      filterParams: [],
    });
  });

  test('should get safety options', () => {
    // 加这个测试可以防止 本地跑demo 修改了默认配置 直接提交
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
      freezeRowHeader: true,
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
    });
  });

  test('should get custom data config', () => {
    const dataConfig = getSafetyDataConfig({
      fields: {
        rows: ['test'],
      },
    });
    expect(dataConfig.fields).toStrictEqual({
      rows: ['test'],
      columns: [],
      values: [],
      customTreeItems: [],
      valueInCols: true,
    });
  });
});
