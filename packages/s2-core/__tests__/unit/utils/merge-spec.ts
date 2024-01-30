import type { S2DataConfig } from '@/common';
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
    // 加这个测试可以防止 本地跑 demo 修改了默认配置 直接提交
    expect(getSafetyOptions(null)).toMatchSnapshot();
  });

  test('should get custom options', () => {
    const options = getSafetyOptions({
      tooltip: {
        enable: false,
        operation: {
          sort: false,
          menu: {
            items: [
              {
                key: 'custom',
                label: 'custom',
              },
            ],
          },
        },
      },
    });

    expect(options.tooltip).toMatchInlineSnapshot(`
      Object {
        "autoAdjustBoundary": "body",
        "enable": false,
        "operation": Object {
          "hiddenColumns": false,
          "menu": Object {
            "items": Array [
              Object {
                "key": "custom",
                "label": "custom",
              },
            ],
          },
          "sort": false,
        },
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
