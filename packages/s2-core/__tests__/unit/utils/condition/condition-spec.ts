import {
  findFieldCondition,
  getIconPosition,
  getIntervalScale,
} from '@/utils/condition/condition';
import type { RawData, TextCondition } from '../../../../src/common/interface';

describe('getIconLayoutPosition Test', () => {
  test('should return right by default', () => {
    expect(
      getIconPosition({
        field: 'value',
        mapping: () => {
          return { icon: 'xxx', fill: 'red' };
        },
      }),
    ).toEqual('right');
  });

  test(`should return left when it's left`, () => {
    expect(
      getIconPosition({
        field: 'value',
        position: 'left',
        mapping: () => {
          return { icon: 'xxx', fill: 'red' };
        },
      }),
    ).toEqual('left');
  });
});

describe('getFieldCondition Test', () => {
  test('should find the condition where fill is green', () => {
    const conditions: TextCondition[] = [
      {
        field: 'value',
        mapping: () => ({ fill: 'red' }),
      },
      { field: 'price', mapping: () => ({ fill: 'blue' }) },
      { field: 'price', mapping: () => ({ fill: 'green' }) },
    ];

    expect(
      findFieldCondition(conditions, 'price')!.mapping('', {} as RawData)!.fill,
    ).toBe('green');
  });

  test('should not find the condition where fill is orange', () => {
    const conditions: TextCondition[] = [
      {
        field: 'value',
        mapping: () => ({ fill: 'red' }),
      },
      { field: 'price', mapping: () => ({ fill: 'blue' }) },
      { field: /price/, mapping: () => ({ fill: 'orange' }) },
      { field: 'p', mapping: () => ({ fill: 'pink' }) },
    ];

    expect(
      findFieldCondition(conditions, 'price')!.mapping('', {} as RawData)!.fill,
    ).toBe('orange');
  });
});

describe('getIntervalScale Test', () => {
  test('should get scale when both of minValue and maxValue are greater then 0', () => {
    const getScale = getIntervalScale(100, 200);

    expect(getScale(120)).toEqual({
      zeroScale: 0,
      scale: 0.2,
    });
  });
  test('should get scale when both of minValue and maxValue are less then 0', () => {
    const getScale = getIntervalScale(-200, -100);

    expect(getScale(-120)).toEqual({
      zeroScale: 1,
      scale: -0.2,
    });
  });

  test('should get scale when minValue is less then 0 and maxValue is greater than 0', () => {
    const getScale = getIntervalScale(-100, 100);

    expect(getScale(20)).toEqual({
      zeroScale: 0.5,
      scale: 0.1,
    });
    expect(getScale(-20)).toEqual({
      zeroScale: 0.5,
      scale: -0.1,
    });
  });
});
