import {
  getExistValues,
  transformDimensionsValues,
} from '../../../src/utils/dataset/pivot-data-set';

describe('pivot dataset nested paths', () => {
  const row = {
    name: '中国',
    user: { region: '华东', city: '上海' },
    metrics: { price: 100, city: { address: '测试名称' } },
  } as Record<string, any>;

  test('transformDimensionsValues supports nested paths', () => {
    const dims = ['user.region', 'user.city', 'metrics.city.address'];
    const values = transformDimensionsValues(row, dims);

    expect(values).toEqual(['华东', '上海', '测试名称']);
  });

  test('getExistValues supports nested values', () => {
    const values = ['name', 'metrics.price', 'metrics.missing'];

    expect(getExistValues(row as any, values)).toEqual([
      'name',
      'metrics.price',
    ]);
  });
});
