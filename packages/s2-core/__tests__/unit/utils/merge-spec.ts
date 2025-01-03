import { LayoutWidthType, type S2DataConfig } from '@/common';
import { customMerge, setupDataConfig, setupOptions } from '@/utils/merge';

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
    expect(setupDataConfig(null)).toMatchSnapshot();
  });

  test('should unique dataConfig fields', () => {
    expect(
      setupDataConfig({
        fields: {
          rows: ['province', 'city', 'city'],
          columns: ['type', 'type'],
          values: ['count', 'cost', 'cost'],
          valueInCols: false,
        },
      }),
    ).toMatchSnapshot();
  });

  test('should cancel valueInCols if custom rows is not empty by get safety data config', () => {
    const rows = [{ field: '1', title: 'test' }];
    const fields: Partial<S2DataConfig['fields']> = {
      rows,
      values: ['1'],
      valueInCols: true,
    };

    expect(
      setupDataConfig({
        fields,
      }),
    ).toMatchSnapshot();
  });

  test('should cancel valueInCols if value is empty by get safety data config', () => {
    const fields: Partial<S2DataConfig['fields']> = {
      values: [],
      valueInCols: true,
    };

    expect(
      setupDataConfig({
        fields,
      }),
    ).toMatchSnapshot();
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
      setupDataConfig(oldDataCfg, {
        fields,
      }),
    ).toMatchSnapshot();
  });

  test('should get safety options', () => {
    // 加这个测试可以防止 本地跑 demo 修改了默认配置 直接提交
    expect(setupOptions(null)).toMatchSnapshot();
  });

  test('should not setup correctly compact layout width type style', () => {
    expect(
      setupOptions({
        style: {
          layoutWidthType: LayoutWidthType.Compact,
        },
      }).style,
    ).toMatchSnapshot();
  });

  test('should get custom options', () => {
    const options = setupOptions({
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

    expect(options.tooltip).toMatchSnapshot();
  });

  test('should get custom data config', () => {
    const dataConfig = setupDataConfig({
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
