import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant/basic';
import {
  FilterDataItemCallback,
  MappingDataItemCallback,
} from '@/common/interface/basic';
import { Data, MultiData } from '@/common/interface/s2DataConfig';
import { handleDataItem } from '@/utils/cell/data-cell';

describe('Display Data Item Callback Test', () => {
  test('should return origin data value when there is no callback', () => {
    const data: Data = {
      city: '成都',
      price: 20,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 20,
    };
    expect(handleDataItem(data)).toEqual(20);
  });

  test('should return filter data value when there is filter callback with multiple data item', () => {
    const data: Data = {
      city: '成都',
      price: {
        values: [[12, 0.2, -0.3]],
      },
      [EXTRA_FIELD]: 'value',
      [VALUE_FIELD]: {
        values: [[12, 0.2, -0.3]],
      },
    };
    const callback: FilterDataItemCallback = (field, item) => {
      if (field === 'value') {
        return {
          values: [(item as MultiData).values[0].filter((_, idx) => idx < 2)],
        };
      }
      return item;
    };
    expect(handleDataItem(data, callback)).toEqual({
      values: [[12, 0.2]],
    });
  });

  test('should return mapped data item  when there is mapping callback with multiple data item', () => {
    const data: Data = {
      city: '成都',
      price: {
        values: [[12, 0.2, -0.3]],
      },
      [EXTRA_FIELD]: 'value',
      [VALUE_FIELD]: {
        values: [[12, 0.2, -0.3]],
      },
    };
    const callback: MappingDataItemCallback = (field, item) => {
      if (field === 'value') {
        return {
          price: 12,
          'price-ac': 0.2,
          'price-rc': -0.3,
        };
      }
      return item;
    };
    expect(handleDataItem(data, callback)).toEqual({
      price: 12,
      'price-ac': 0.2,
      'price-rc': -0.3,
    });
  });
});
