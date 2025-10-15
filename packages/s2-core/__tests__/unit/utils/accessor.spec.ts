import { getByPath, hasByPath } from '../../../src/utils/accessor';

describe('utils/accessor nested path', () => {
  const row = {
    name: '中国',
    user: { region: '华东', city: '上海' },
    metrics: { price: 100, city: { address: '测试名称' } },
  } as Record<string, any>;

  test('getByPath supports flat key', () => {
    expect(getByPath(row, 'name')).toBe('中国');
  });

  test('getByPath supports level-2 path', () => {
    expect(getByPath(row, 'user.region')).toBe('华东');
  });

  test('getByPath supports level-3 path', () => {
    expect(getByPath(row, 'metrics.city.address')).toBe('测试名称');
  });

  test('hasByPath works for existing and missing paths', () => {
    expect(hasByPath(row, 'metrics.price')).toBe(true);
    expect(hasByPath(row, 'metrics.missing')).toBe(false);
  });
});
