import {
  getIconPositionCfg,
  getIntervalScale,
} from '@/utils/condition/condition';

describe('getIconLayoutPosition Test', () => {
  test('should return right by default', () => {
    expect(
      getIconPositionCfg({
        field: 'value',
        mapping: () => ({ fill: 'red' }),
      }),
    ).toEqual('right');
  });

  test(`should return left when it's left`, () => {
    expect(
      getIconPositionCfg({
        field: 'value',
        position: 'left',
        mapping: () => ({ fill: 'red' }),
      }),
    ).toEqual('left');
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
