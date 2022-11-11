import { DEFAULT_STYLE } from '@/common/constant/options';
import {
  customMerge,
  getSafetyDataConfig,
  getSafetyOptions,
} from '@/utils/merge';
import { HOVER_FOCUS_DURATION, type S2DataConfig } from '@/common';

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

  test('should return new object', () => {
    const obj = { name: 'name' };
    const result = customMerge(obj, { age: 100 });

    expect(obj).toEqual({ name: 'name' });
    expect(result).toEqual({ name: 'name', age: 100 });
  });

  test('should get safety data config', () => {
    expect(getSafetyDataConfig(null)).toStrictEqual({
      data: [],
      fields: {
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

  test('should unique dataConfig fields', () => {
    expect(
      getSafetyDataConfig({
        fields: {
          rows: ['province', 'city', 'city'],
          columns: ['type', 'type'],
          values: ['count', 'cost', 'cost'],
          valueInCols: false,
        },
      }),
    ).toStrictEqual({
      data: [],
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['count', 'cost'],
        valueInCols: false,
      },
      meta: [],
      sortParams: [],
      filterParams: [],
    });
  });

  test('should cancel valueInCols if custom rows is not empty by get safety data config', () => {
    const rows = [{ key: '1', title: 'test' }];
    const fields: Partial<S2DataConfig['fields']> = {
      rows,
      values: ['1'],
      valueInCols: true,
    };
    expect(
      getSafetyDataConfig({
        fields,
      }),
    ).toStrictEqual({
      data: [],
      fields: {
        ...fields,
        rows,
        columns: [],
        values: ['1'],
        valueInCols: false,
      },
      meta: [],
      sortParams: [],
      filterParams: [],
    });
  });

  test('should cancel valueInCols if value is empty by get safety data config', () => {
    const fields: Partial<S2DataConfig['fields']> = {
      values: [],
      valueInCols: true,
    };
    expect(
      getSafetyDataConfig({
        fields,
      }),
    ).toStrictEqual({
      data: [],
      fields: {
        ...fields,
        rows: [],
        columns: [],
        valueInCols: false,
      },
      meta: [],
      sortParams: [],
      filterParams: [],
    });
  });

  test('should merge old dataCfg', () => {
    const oldDataCfg: Partial<S2DataConfig> = {
      data: [{ value: 1 }, { value: 2 }],
    };
    const fields: Partial<S2DataConfig['fields']> = {
      values: [],
      valueInCols: true,
    };
    expect(
      getSafetyDataConfig(oldDataCfg, {
        fields,
      }),
    ).toStrictEqual({
      data: [{ value: 1 }, { value: 2 }],
      fields: {
        ...fields,
        rows: [],
        columns: [],
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
      cornerText: '',
      cornerExtraFieldText: '',
      totals: {},
      tooltip: {
        showTooltip: false,
        autoAdjustBoundary: 'body',
        operation: {
          hiddenColumns: false,
          trend: false,
          sort: false,
          menus: [],
        },
      },
      interaction: {
        linkFields: [],
        hiddenColumnFields: [],
        selectedCellHighlight: false,
        selectedCellsSpotlight: false,
        hoverHighlight: true,
        hoverFocus: { duration: HOVER_FOCUS_DURATION },
        scrollSpeedRatio: {
          horizontal: 1,
          vertical: 1,
        },
        autoResetSheetStyle: true,
        brushSelection: {
          data: true,
          row: false,
          col: false,
        },
        multiSelection: true,
        rangeSelection: true,
        resize: {
          colCellHorizontal: true,
          colCellVertical: true,
          cornerCellHorizontal: true,
          rowCellVertical: true,
          rowResizeType: 'all',
        },
        scrollbarPosition: 'content',
        eventListenerOptions: false,
        overscrollBehavior: 'auto',
      },
      frozenRowHeader: true,
      showSeriesNumber: false,
      customSVGIcons: [],
      showDefaultHeaderActionIcon: false,
      headerActionIcons: [],
      style: DEFAULT_STYLE,
      frozenRowCount: 0,
      frozenColCount: 0,
      frozenTrailingRowCount: 0,
      frozenTrailingColCount: 0,
      hdAdapter: true,
      placeholder: '-',
      supportCSSTransform: false,
      devicePixelRatio: window.devicePixelRatio,
    });
  });

  test('should get custom options', () => {
    const options = getSafetyOptions({
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
      autoAdjustBoundary: 'body',
      operation: {
        hiddenColumns: false,
        trend: false,
        sort: false,
        menus: [
          {
            key: 'custom',
            text: 'custom',
          },
        ],
      },
      showTooltip: false,
    });
  });

  test('should get custom data config', () => {
    const dataConfig = getSafetyDataConfig({
      fields: {
        rows: ['test'],
        values: ['value'],
      },
    });
    expect(dataConfig.fields).toStrictEqual({
      rows: ['test'],
      columns: [],
      values: ['value'],
      valueInCols: true,
    });
  });
});
