import { CellData } from '@/data-set/cell-data';

describe('CellData nested value access', () => {
  const row = {
    name: '中国',
    user: { region: '华东', city: '上海' },
    metrics: { price: 100, city: { address: '测试名称' } },
  } as Record<string, any>;

  test('VALUE_FIELD from nested extraField', () => {
    const cell = CellData.getCellData(row as any, 'metrics.city.address');

    expect((cell as any).$$value$$ ?? (cell as any).value).toBeUndefined();
    expect((cell as any).raw).toBeDefined();
    expect((cell as any).value).toBeUndefined();
    expect((cell as any).getValueByField('metrics.city.address')).toBe(
      '测试名称',
    );
  });
});
