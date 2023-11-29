import { keys } from 'lodash';
import { EXTRA_FIELD, ORIGIN_FIELD, VALUE_FIELD } from '@/common';
import { DataHandler } from '@/utils/dataset/proxy-handler';

describe('proxy-handler test', () => {
  const data = {
    province: '四川省',
    type: '商品',
    cost: 899,
    price: 1000,
  };
  test('should get correct extra info', () => {
    const proxy1 = DataHandler.createProxyData(data, 'cost');
    expect(proxy1[EXTRA_FIELD]).toEqual('cost');
    expect(proxy1[VALUE_FIELD]).toEqual(899);

    const proxy2 = DataHandler.createProxyData(data, 'price');
    expect(proxy2[EXTRA_FIELD]).toEqual('price');
    expect(proxy2[VALUE_FIELD]).toEqual(1000);
  });

  test('should get correct proxy data list when pass multi extra fields', () => {
    const proxyList = DataHandler.createProxyDataList(data, ['cost', 'price']);
    expect(proxyList).toHaveLength(2);
  });

  test('should get correct origin info', () => {
    const proxy = DataHandler.createProxyData(data, 'cost');
    expect(proxy[ORIGIN_FIELD]).toEqual(data);
  });

  test('should get correct  destruct data', () => {
    const proxy = DataHandler.createProxyData(data, 'cost');
    expect({ ...proxy }).toEqual({
      ...data,
      [EXTRA_FIELD]: 'cost',
      [VALUE_FIELD]: 899,
    });

    expect(keys(proxy)).toEqual([
      'province',
      'type',
      'cost',
      'price',
      EXTRA_FIELD,
      VALUE_FIELD,
    ]);

    expect(EXTRA_FIELD in proxy).toBeTrue();
  });
});
