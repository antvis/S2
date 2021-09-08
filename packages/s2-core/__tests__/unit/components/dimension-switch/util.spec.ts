import { DimensionType } from '@/components/dimension-switch/dimension';
import { getDimensionsByPredicate } from '@/components/dimension-switch/util';

describe('Dimension Switch Util Test', () => {
  const mockData: DimensionType[] = [
    {
      type: 'measure',
      displayName: '维度',
      items: [
        {
          id: 'city',
          displayName: '城市',
          checked: true,
        },
        {
          id: 'count',
          displayName: '数量',
          checked: true,
        },
        {
          id: 'price',
          displayName: '价格',
          checked: false,
        },
      ],
    },
  ];

  test('should return all checked item ids', () => {
    expect(
      getDimensionsByPredicate(mockData, (value) => value.checked),
    ).toEqual({
      measure: ['city', 'count'],
    });
  });

  test('should return all unchecked item ids', () => {
    expect(
      getDimensionsByPredicate(mockData, (value) => !value.checked),
    ).toEqual({
      measure: ['price'],
    });
  });
});
