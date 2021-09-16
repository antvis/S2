import { getIconPositionCfg } from '@/utils/condition/condition';

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
