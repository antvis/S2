import { getSubTotalNodeWidthOrHeightByLevel } from '@/utils/facet';

describe('getSubTotalNodeWidthOrHeightByLevel Test', () => {
  test('should get correct width of subTotal node', () => {
    const sampleNodesForAllLevels = [
      {
        id: 'root[&]测试',
        value: '测试',
        isSubTotals: true,
        width: 20,
        level: 0,
      },
    ];
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getSubTotalNodeWidthOrHeightByLevel(sampleNodesForAllLevels, -1, 'width'),
    ).toEqual(20);
    expect(getSubTotalNodeWidthOrHeightByLevel([], -1, 'width')).toEqual(0);
  });
});
