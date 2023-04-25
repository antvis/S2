import type { S2DataConfig } from '@/common';
import {
  customMerge,
  getSafetyDataConfig,
  getSafetyOptions,
} from '@/utils/merge';

describe('merge test', () => {
  beforeEach(() => {
    window.devicePixelRatio = 2;
  });

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
    expect(getSafetyDataConfig(null)).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "fields": Object {
          "columns": Array [],
          "rows": Array [],
          "valueInCols": false,
          "values": Array [],
        },
        "filterParams": Array [],
        "meta": Array [],
        "sortParams": Array [],
      }
    `);
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
    ).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "fields": Object {
          "columns": Array [
            "type",
          ],
          "rows": Array [
            "province",
            "city",
          ],
          "valueInCols": false,
          "values": Array [
            "count",
            "cost",
          ],
        },
        "filterParams": Array [],
        "meta": Array [],
        "sortParams": Array [],
      }
    `);
  });

  test('should cancel valueInCols if custom rows is not empty by get safety data config', () => {
    const rows = [{ field: '1', title: 'test' }];
    const fields: Partial<S2DataConfig['fields']> = {
      rows,
      values: ['1'],
      valueInCols: true,
    };

    expect(
      getSafetyDataConfig({
        fields,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "fields": Object {
          "columns": Array [],
          "rows": Array [
            Object {
              "field": "1",
              "title": "test",
            },
          ],
          "valueInCols": false,
          "values": Array [
            "1",
          ],
        },
        "filterParams": Array [],
        "meta": Array [],
        "sortParams": Array [],
      }
    `);
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
    ).toMatchInlineSnapshot(`
      Object {
        "data": Array [],
        "fields": Object {
          "columns": Array [],
          "rows": Array [],
          "valueInCols": false,
          "values": Array [],
        },
        "filterParams": Array [],
        "meta": Array [],
        "sortParams": Array [],
      }
    `);
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
    ).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "value": 1,
          },
          Object {
            "value": 2,
          },
        ],
        "fields": Object {
          "columns": Array [],
          "rows": Array [],
          "valueInCols": false,
          "values": Array [],
        },
        "filterParams": Array [],
        "meta": Array [],
        "sortParams": Array [],
      }
    `);
  });

  test('should get safety options', () => {
    // 加这个测试可以防止 本地跑demo 修改了默认配置 直接提交
    expect(getSafetyOptions(null)).toMatchInlineSnapshot(`
      Object {
        "conditions": Object {},
        "cornerExtraFieldText": "",
        "cornerText": "",
        "customSVGIcons": Array [],
        "debug": false,
        "device": "pc",
        "devicePixelRatio": 2,
        "frozen": Object {
          "colCount": 0,
          "rowCount": 0,
          "rowHeader": true,
          "trailingColCount": 0,
          "trailingRowCount": 0,
        },
        "hdAdapter": true,
        "headerActionIcons": Array [],
        "height": 480,
        "hierarchyType": "grid",
        "interaction": Object {
          "autoResetSheetStyle": true,
          "brushSelection": Object {
            "colCell": false,
            "dataCell": true,
            "rowCell": false,
          },
          "eventListenerOptions": false,
          "hiddenColumnFields": Array [],
          "hoverFocus": Object {
            "duration": 800,
          },
          "hoverHighlight": true,
          "linkFields": Array [],
          "multiSelection": true,
          "overscrollBehavior": "auto",
          "rangeSelection": true,
          "resize": Object {
            "colCellHorizontal": true,
            "colCellVertical": true,
            "colResizeType": "current",
            "cornerCellHorizontal": true,
            "rowCellVertical": true,
            "rowResizeType": "current",
          },
          "scrollSpeedRatio": Object {
            "horizontal": 1,
            "vertical": 1,
          },
          "scrollbarPosition": "content",
          "selectedCellHighlight": false,
          "selectedCellsSpotlight": false,
        },
        "placeholder": "-",
        "showDefaultHeaderActionIcon": false,
        "showSeriesNumber": false,
        "style": Object {
          "colCell": Object {
            "height": 30,
            "heightByField": null,
            "widthByField": null,
          },
          "dataCell": Object {
            "height": 30,
            "width": 96,
          },
          "layoutWidthType": "adaptive",
          "rowCell": Object {
            "heightByField": null,
            "showTreeLeafNodeAlignDot": false,
            "widthByField": null,
          },
        },
        "supportCSSTransform": false,
        "tooltip": Object {
          "autoAdjustBoundary": "body",
          "operation": Object {
            "hiddenColumns": false,
            "menus": Array [],
            "sort": false,
          },
          "showTooltip": false,
        },
        "totals": Object {},
        "width": 600,
      }
    `);
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

    expect(options.tooltip).toMatchInlineSnapshot(`
      Object {
        "autoAdjustBoundary": "body",
        "operation": Object {
          "hiddenColumns": false,
          "menus": Array [
            Object {
              "key": "custom",
              "text": "custom",
            },
          ],
          "sort": false,
        },
        "showTooltip": false,
      }
    `);
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
